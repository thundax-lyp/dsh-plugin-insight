# DSH Crew

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[b0ddd92](https://github.com/ZSeven-W/dsh-crew/tree/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec)

<!-- BEGIN META -->
[![GitHub ★ 192](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=192&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZSeven-W/dsh-crew) [![npm 30d 2,150](https://img.shields.io/static/v1?label=npm+30d&message=2%2C150&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-crew) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-crew)
<!-- END META -->

> **功能**：把DSH Agent作为Claude Code、Codex等编排器可分派的子任务worker并展示进度。

> **亮点**：[Q01](#research-q01)MCP与Hub桥把已有DSH Agent接入外部编排器，并增加tier策略和job观测，不把模型/工具继承能力归Crew。

> **主要限制**：[Q02](#research-q02)Hub未消费origin/全局cwd锁，取消状态也可能被迟到完成覆盖，不能将局部守卫宣传为每次分派的安全保障。

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
  - [Q01 · 把DSH worker接入外部编排器增加什么，而非继承什么？](#detail-section-11)
  - [Q02 · 守卫、hub/standalone和结果取消能保证每次分派的安全归属吗？](#detail-section-12)
  - [Q03 · 权限、凭据与安装恢复支持什么采用边界？](#detail-section-13)
  - [Q04 · 怎样把分派声明变成可验证的结果和单写约束？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：这是原生DSH plugin，同时提供独立stdio MCP服务和外部编排器的角色/提示安装。任务是让已有Claude Code/Codex等编排器把自包含子任务交给DSH Agent并取回job结果，保留进度/令牌观测。参照是手工启动DSH会话、复制结果，或外部编排器原生子代理；本轮未比较任务质量、费用或吞吐。DSH提供模型、工具、preset和Session持久化，Crew新增跨入口分派、tier策略、job状态与安装桥，不能把DSH工具/模型能力算新发明。

package版本0.1.0-rc.14但README仍写rc.11及tested Host0.1.1-rc.1，package文档runtime pins又是rc.6；这些不是明确的当前兼容验收。Flash/Pro是可配路由角色而非固定质量保证。可选视觉/图像和外部CLI路径没有在本轮全审，不以截图、翻译并发展示或“cheap”作真实收益证据。

手工DSH会话复制结果或外部编排器原生子代理，未做真实质量/费用对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MCP worker | 自包含子任务 | 原Agent能力，结果需验 |
| Hub job | 原生Session与轮询 | 本机门控非用户认证 |
| tier策略 | 路由/失败一次升级 | CLI路径不同，非节费证明 |
| 局部守卫 | origin/cwd拒绝 | 不等全局单写或Hub继承 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node/MCP编排器 | 分派需 | stdio工具 | 无会话集成 |
| DSH Host/API/模型 | Hub需 | 原生Agent | 强制hub不可达报错 |
| SDK/runtime/key | standalone需 | 独立执行 | 缺失明确失败 |
| agy/grok CLI凭据 | 仅显式路径 | 外部CLI | 高权限参数另审 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份配置/固定一组合 | 不泛信README版本 |
| 评估 | 丢弃目录单进程只读 | 不用外部CLI/升级 |
| 分派 | 自包含任务/绝对cwd | spawn不等结果 |
| 收尾 | 取最终结果核工作树 | 不明则人工核进程 |
| 退出 | 停worker/核角色与prompt/凭据 | 关MCP不等全部停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Host/SDK/CLI/模型资源 | 集成与配置diff/备份 | 工时金额未知 |
| 持续 | API/并发/重试/存储 | 版本路由与结果验收 | 未测费用或节时 |
| 失败恢复 | partial写/重复升级/日志 | 进程与工作树核对 | cancel非停止保证 |
| 退出 | 会话/配置副本 | 人工恢复prompt/权限/凭据 | 非全事务卸载 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 分派 | MCP到Hub/standalone | 全Host兼容/质量 |
| 路由 | tier与一次失败升级 | 更便宜或更优结果 |
| 守卫 | 当前MCP局部检查 | 全局单写/Hub继承不成立 |
| 结果/取消 | job事件与结果轮询 | 实际停止与副作用一致 |

> **思考**：[Q02](#research-q02)Hub未消费origin/全局cwd锁，取消状态也可能被迟到完成覆盖，不能将局部守卫宣传为每次分派的安全保障。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)MCP与Hub桥把已有DSH Agent接入外部编排器，并增加tier策略和job观测，不把模型/工具继承能力归Crew。

[Q02](#research-q02)分片等待和明确running避免把超时当结果，但权威Hub未复用守卫且取消缺终态门闩，不能靠UI补齐。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)Hub未消费origin/全局cwd锁，取消状态也可能被迟到完成覆盖，不能将局部守卫宣传为每次分派的安全保障。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03)正式写任务observe；仅丢弃目录单进程只读评估，固定强制hub、禁CLI与升级，任何未知状态先人工核查。

package版本0.1.0-rc.14但README仍写rc.11及tested Host0.1.1-rc.1，package文档runtime pins又是rc.6；这些不是明确的当前兼容验收。Flash/Pro是可配路由角色而非固定质量保证。可选视觉/图像和外部CLI路径没有在本轮全审，不以截图、翻译并发展示或“cheap”作真实收益证据。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

partial

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/cli-workers.mjs、src/cwd-lock.mjs、src/hub-client.mjs、src/hub/index.mjs、src/install/install.mjs、src/jobs.mjs、src/origin-guard.mjs、src/server.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定plugin/MCP source定向server、Hub spawn/routes/result/cancel、standalone jobs、cwd/origin守卫、CLI权限和Codex安装。未全审视觉/图像、proc-kill、全部安装卸载及UI/status-shard，不执行模型或安装。
- 下一步：[Q04](#research-q04)Hub直调/两MCP/取消迟到/重启与工作树矩阵仍待执行，当前为源码反证。

**分析版本**

- **仓库**：[ZSeven-W/dsh-crew](https://github.com/ZSeven-W/dsh-crew)
- **版本号**：0.1.0-rc.14（[固定提交 b0ddd92](https://github.com/ZSeven-W/dsh-crew/tree/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec)）
- **版本日期**：2026-10-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)Hub权威侧的执行归属与确认取消或能减少未知状态下重派，尚未实现和验证。

[Q04](#research-q04)Hub直调/两MCP/取消迟到/重启与工作树矩阵仍待执行，当前为源码反证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 36 | 7767 | — | — | 72550 |
| .js | source | 1 | 2684 | 2584 | 281 | — |
| .mjs | source | 32 | 21444 | 19005 | 1961 | — |
| .tsx | source | 1 | 1133 | 1014 | 83 | — |
| .ts | source | 1 | 374 | 261 | 98 | — |
| .mjs | test | 10 | 619 | 487 | 73 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ZSeven-W/dsh-crew/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/ZSeven-W/dsh-crew/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/ZSeven-W/dsh-crew/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核跨编排器分派的真实执行/守卫/结果与失败边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 把DSH worker接入外部编排器增加什么，而非继承什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是原生DSH plugin，同时提供独立stdio MCP服务和外部编排器的角色/提示安装。任务是让已有Claude Code/Codex等编排器把自包含子任务交给DSH Agent并取回job结果，保留进度/令牌观测。参照是手工启动DSH会话、复制结果，或外部编排器原生子代理；本轮未比较任务质量、费用或吞吐。DSH提供模型、工具、preset和Session持久化，Crew新增跨入口分派、tier策略、job状态与安装桥，不能把DSH工具/模型能力算新发明。

package版本0.1.0-rc.14但README仍写rc.11及tested Host0.1.1-rc.1，package文档runtime pins又是rc.6；这些不是明确的当前兼容验收。Flash/Pro是可配路由角色而非固定质量保证。可选视觉/图像和外部CLI路径没有在本轮全审，不以截图、翻译并发展示或“cheap”作真实收益证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-14](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/README.md#L7-L14)

作者定位及旧版本兼容行。

```text
<p align="center">
  <strong>A <a href="https://github.com/deepseek-ai/deepseek-harness">DeepSeek Harness</a> plugin: dispatch work to DSH agents from Claude Code / Codex / Antigravity / Grok, without giving up the host's native subagent UI.</strong><br />
  <sub>Native Progress UI &bull; Tier Policy &amp; Escalation &bull; Dispatch Guardrails &bull; Jobs Board &bull; In-Host DSH Sessions &bull; Vision &amp; Image Gen (Native-First) &bull; One-Click Install</sub>
</p>

<p align="center">
  <sub>npm: <code>@zseven-w/dsh-crew</code> &middot; Current plugin release: <code>0.1.0-rc.11</code> &middot; Tested with DSH <code>0.1.1-rc.1</code></sub>
</p>
```

**依据 2 · 作者声明**：[README.md:31-35](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/README.md#L31-L35)

作者Agent/模型继承说明。

```text
## Why DSH Crew

DSH Crew is a plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) — an open-source agent harness. It makes DSH agents dispatchable from Claude Code, Codex, Antigravity and Grok: the orchestrator keeps its own model, the work runs on a real DSH agent with that harness's tools, sandbox, presets and session history, and the host still shows it as a native subagent with live progress.

What runs the work is a DSH agent, not a bare model call. Tiers (`flash` / `pro`) select how much capability that agent gets from the harness's configured roster — DeepSeek V4 Flash and V4 Pro today — so a change of model in DSH needs no change here.
```

**依据 3 · 源码核查**：[package.json:1-20](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/package.json#L1-L20)

真实DSH plugin/MCP入口及版本。

<details>
<summary>查看原文（20行）</summary>

```text
{
  "name": "@zseven-w/dsh-crew",
  "version": "0.1.0-rc.14",
  "type": "module",
  "main": "./src/hub/index.mjs",
  "description": "DeepSeek Harness plugin: dispatch work to DSH agents from Claude Code / Codex, as native subagents with live progress",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    }
  },
  "scripts": {
    "mcp": "node src/server.mjs",
```

</details>

**依据 4 · 源码核查**：[package.json:44-65](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/package.json#L44-L65)

仅文档的Host pins。

<details>
<summary>查看原文（22行）</summary>

```text
  "dshHostRuntime": {
    "_comment": "Documentation only - these @deepseek-ai/* packages are provided by the DSH HOST at runtime (worker.cordis.yml composition + host profile), never by this package. They were peerDependencies in <=0.1.0-rc.2, but npm 7+ auto-installs peers (optional ones included when placeable), and the pinned versions ERESOLVE against the host newer transitive tree (issue #3): a plain npm install of @zseven-w/dsh-crew failed. Keep these pins in sync with the DSH version this release is tested against (README badge).",
    "@deepseek-ai/dsh-agent": "0.1.0-rc.6",
    "@deepseek-ai/dsh-agent-presets": "0.1.0-rc.6",
    "@deepseek-ai/dsh-agent-spine-demo": "0.1.0-rc.6",
    "@deepseek-ai/dsh-bash-local": "0.1.0-rc.6",
    "@deepseek-ai/dsh-compaction-basic": "0.1.0-rc.6",
    "@deepseek-ai/dsh-fs-local": "0.1.0-rc.6",
    "@deepseek-ai/dsh-fs-observation-policy": "0.1.0-rc.6",
    "@deepseek-ai/dsh-llm": "0.1.0-rc.6",
    "@deepseek-ai/dsh-llm-deepseek": "0.1.0-rc.6",
    "@deepseek-ai/dsh-sandbox-local": "0.1.0-rc.6",
    "@deepseek-ai/dsh-sandbox-policy": "0.1.0-rc.6",
    "@deepseek-ai/dsh-sdk-client": "0.1.0-rc.6",
    "@deepseek-ai/dsh-sdk-jsonrpc-demo": "0.1.0-rc.6",
    "@deepseek-ai/dsh-sdk-jsonrpc-server": "0.1.0-rc.6",
    "@deepseek-ai/dsh-session": "0.1.0-rc.6",
    "@deepseek-ai/dsh-session-persistence-jsonl": "0.1.0-rc.6",
    "@deepseek-ai/dsh-subprocess-local": "0.1.0-rc.6",
    "@deepseek-ai/dsh-token-meter": "0.1.0-rc.6",
    "@deepseek-ai/dsh-tool-fs": "0.1.0-rc.6",
    "@deepseek-ai/dsh-tool-todo": "0.1.0-rc.6"
```

</details>

#### 缺口

- 固定包与当前Host/各编排器兼容及质量成本没有本轮验收。
  **影响**：不能以发行描述推荐直接替换原生子代理。
  **进一步探讨**：先核一套明确版本组合，只读小任务对照原生子代理与人工分派。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 守卫、hub/standalone和结果取消能保证每次分派的安全归属吗？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

MCP run工具先enabled、cwd、origin检查，再按模式选择hub或standalone；强制hub不可达报错，auto不可达转standalone。MCP tier policy约束DSH路径，blocking flash failed且启用升级时再跑一次pro，running只返回继续轮询，不当结果；外部worker=CLI走另一路，不受该tier/升级策略。Hub长轮询切为60秒请求，网络失败不证明任务停止。standalone需要SDK/runtime和独立key，运行事件只有completed记done，其他reason记failed。完成描述不是工作树或副作用验收；升级再次执行可能重复已有写入，未见统一业务幂等键。

守卫有明确范围缺口：cwd-lock为当前进程Map、按规范化精确cwd键，allowConcurrent可绕过，不覆盖另一MCP进程、父子目录重叠或任意文件写。MCP向hub传origin_chain/depth，但hub.spawn参数解构不接收它们，创建Agent也未透传；Hub的POST/jobs仅loopback/Host检查后直接spawn，不调用MCP origin或cwd锁。因而“每次分派都防递归/第二写者”在全入口不成立，origin展示由MCP附回不能当Hub强制继承。这是源码接线确认的防护范围缺口，非运行漏洞复现。

取消也不能当已终止证明：Hub/standalone先写cancelled再dispose/close且吞错误；Hub MCP收到view便释放本地cwd锁，Hub正常run尾却可不检查cancelled而覆盖done/failed，standalone then同样无取消门闩。若异步完成与取消交错，最终状态可覆盖；具体复现概率与底层任务是否仍跑未知。此时不应立即给同目录派新写任务，需查进程/Host会话和工作树；重启后job与Map不构成持久事务/fencing。

#### 证据与依据

**依据 1 · 源码核查**：[src/server.mjs:132-136](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/server.mjs#L132-L136)

模式回退与强制hub错误。

```text
async function resolveMode() {
  if (sessionConfig.mode === 'standalone') return 'standalone';
  const up = await hubAvailable();
  if (sessionConfig.mode === 'hub' && !up) throw new Error('session mode is "hub" but the DSH workers hub is not reachable');
  return up ? 'hub' : 'standalone';
```

**依据 2 · 源码核查**：[src/server.mjs:151-237](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/server.mjs#L151-L237)

真实MCP guard/锁/执行/升级链及发送origin字段。

<details>
<summary>查看原文（87行）</summary>

```text
}, async ({ task, tier, effort, worker, cwd, timeout_seconds, allow_concurrent_cwd }) => {
  if (!sessionConfig.enabled) return dispatchDisabled();
  const workDir = resolveWorkerCwd(cwd);
  const e = effort ?? sessionConfig.default_effort;
  const timeout = timeout_seconds ?? sessionConfig.default_timeout_seconds;
  const depthLimit = depthLimitNow();

  // CLI profile dispatch: worker= names a profile and bypasses the
  // hub/standalone tier logic entirely (no tier policy, no escalation — the
  // profile pins backend×model×effort). Calls without worker= are untouched.
  if (worker) {
    const profile = resolveProfile(worker); // throws listing the available profile names
    const origin = extendOrigin({ inherited: INHERITED_ORIGIN, backend: profile.backend, cwd: workDir, source: ORCHESTRATOR, depthLimit });
    if (!origin.ok) return originRefusal(origin);
    let job;
    try {
      job = await startCliJob({ worker, task, cwd: workDir, timeoutMs: timeout * 1000, source: ORCHESTRATOR, effort, origin: origin.origin, allowConcurrentCwd: !!allow_concurrent_cwd });
    } catch (err) {
      if (err instanceof CwdLockError) return text({ error: err.message, rejected_by: 'cwd-lock', holder: err.holder });
      throw err;
    }
    await waitJob(job.id, timeout * 1000);
    const view = jobView(job, { withResult: true });
    if (view.status === 'running') return text({ ...view, note: `still running after ${timeout}s; poll with dsh_worker_result` });
    return text(view);
  }

  const runOnce = async (t) => {
    if ((await resolveMode()) === 'hub') {
      const origin = extendOrigin({ inherited: INHERITED_ORIGIN, backend: 'hub', cwd: workDir, source: ORCHESTRATOR, depthLimit });
      if (!origin.ok) return { refusal: originRefusal(origin) };
      let lock;
      try {
        lock = await acquireDispatchLock({ cwd: workDir, backend: 'hub', mode: 'hub', allowConcurrent: !!allow_concurrent_cwd });
      } catch (err) {
        if (err instanceof CwdLockError) return { refusal: text({ error: err.message, rejected_by: 'cwd-lock', holder: err.holder }) };
        throw err;
      }
      let spawned;
      try {
        spawned = await hub.spawn({ task, tier: t, effort: e, cwd: workDir, source: ORCHESTRATOR, preset: presetForTier(t), ...bindingForTier(t), origin_chain: origin.origin.chain, origin_depth: origin.origin.depth });
        updateCwdLockHolder({ cwd: workDir, jobId: spawned.id });
        hubOrigins.set(spawned.id, origin.origin);
      } catch (err) {
        lock.release();
        throw err;
      }
      // The hub client slices this wait internally; a single request that
      // waits minutes would be cut by undici's 300 s header timeout and
      // reported as a bare "fetch failed" while the job kept running.
      const got = await hub.get(spawned.id, timeout);
      attachOrigin(got, spawned.id);
      if (got.status !== 'running') releaseCwdLockByJobId(spawned.id);
      return { view: got };
    }
    const origin = extendOrigin({ inherited: INHERITED_ORIGIN, backend: 'standalone', cwd: workDir, source: ORCHESTRATOR, depthLimit });
    if (!origin.ok) return { refusal: originRefusal(origin) };
    let job;
    try {
      job = await startJob({ task, tier: t, effort: e, cwd: workDir, timeoutMs: timeout * 1000, source: ORCHESTRATOR, origin: origin.origin, allowConcurrentCwd: !!allow_concurrent_cwd, ...bindingForTier(t) });
    } catch (err) {
      if (err instanceof CwdLockError) return { refusal: text({ error: err.message, rejected_by: 'cwd-lock', holder: err.holder }) };
      throw err;
    }
    await waitJob(job.id, timeout * 1000);
    return { view: jobView(job, { withResult: true }) };
  };

  const firstTier = applyTierPolicy(tier);
  let res = await runOnce(firstTier);
  if (res.refusal) return res.refusal;
  let job = res.view;
  if (job.status === 'running') return text({ ...job, note: `still running after ${timeout}s; poll with dsh_worker_result` });

  // Escalate on evidence, not prediction: a failed flash run retries once on
  // pro — unless the policy pins the tier to flash.
  if (job.status === 'failed' && sessionConfig.escalate_on_failure
      && firstTier === 'flash' && sessionConfig.tier_policy !== 'flash-only') {
    const firstError = job.error ?? job.stopReason ?? 'unknown failure';
    res = await runOnce('pro');
    if (res.refusal) return res.refusal;
    job = res.view;
    if (job.status === 'running') return text({ ...job, escalated: true, note: `escalated to pro, still running after ${timeout}s; poll with dsh_worker_result` });
    return text({ ...job, escalated: true, flash_failure: String(firstError).slice(0, 200) });
  }
  return text(job);
});
```

</details>

**依据 3 · 源码核查**：[src/cwd-lock.mjs:28-85](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/cwd-lock.mjs#L28-L85)

进程Map、精确cwd和可绕过锁。

<details>
<summary>查看原文（58行）</summary>

```text
import { resolve } from 'node:path';
import { realpathSync } from 'node:fs';

const locks = new Map(); // canonical cwd -> holder

/** Canonical absolute path of a workspace cwd (realpath when it exists). */
export function normalizeCwd(cwd) {
  try { return realpathSync.native(String(cwd)); } catch { return resolve(String(cwd)); }
}

/** Thrown by acquireCwdLock when another running job holds the cwd. */
export class CwdLockError extends Error {
  constructor(holder) {
    super(
      `workspace "${holder.cwd}" is already held by a running worker (job ${holder.jobId}, backend ${holder.backend}, mode ${holder.mode}, started at ${holder.startedAt}). ` +
      'Refusing this dispatch instead of queueing it: two workers writing the same repo concurrently corrupt files. ' +
      'Wait for that job to settle, cancel it, or pass allow_concurrent_cwd: true if this task is read-only.',
    );
    this.name = 'CwdLockError';
    this.holder = { ...holder };
  }
}

/**
 * Acquire the advisory lock for one cwd. Returns { holder, release } where
 * release() is idempotent and safe to call from any settle path. With
 * allowConcurrent: true this is a deliberate no-op (the lock stays advisory).
 */
export function acquireCwdLock({ cwd, jobId, backend, mode, startedAt, allowConcurrent = false }) {
  if (allowConcurrent) return { holder: null, release() {} };
  const key = normalizeCwd(cwd);
  const existing = locks.get(key);
  if (existing) throw new CwdLockError(existing);
  const holder = { jobId, backend, mode, startedAt, cwd: key };
  locks.set(key, holder);
  let released = false;
  return {
    holder,
    release() {
      if (released) return;
      released = true;
      if (locks.get(key) === holder) locks.delete(key);
    },
  };
}

/** Backfill the real job id after a spawn whose id was unknown at acquire time (hub path). */
export function updateCwdLockHolder({ cwd, jobId }) {
  const holder = locks.get(normalizeCwd(cwd));
  if (holder) holder.jobId = jobId;
}

/** Release whichever lock the given job holds (idempotent). */
export function releaseCwdLockByJobId(jobId) {
  for (const [key, holder] of locks) {
    if (holder.jobId === jobId) { locks.delete(key); return true; }
  }
  return false;
```

</details>

**依据 4 · 源码核查**：[src/origin-guard.mjs:84-132](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/origin-guard.mjs#L84-L132)

MCP origin检查算法。

<details>
<summary>查看原文（49行）</summary>

```text
export function extendOrigin({ inherited, backend, cwd, source = null, depthLimit = DEFAULT_ORIGIN_DEPTH_LIMIT }) {
  const hop = { backend, cwd: normalizeCwd(cwd), source };
  const chain = [...inherited.chain, hop];
  const depth = chain.length;

  // Loop: any (backend, cwd) pair seen twice along the chain (including the
  // hop about to be dispatched) is the worker-eats-itself signature.
  const seen = new Map();
  for (const h of chain) {
    const key = h.backend + '\u0000' + h.cwd;
    const first = seen.get(key);
    if (first) {
      return {
        ok: false,
        error: {
          code: 'origin-loop',
          reason: 'origin loop detected (duplicate backend+cwd)',
          message:
            `Worker self-dispatch loop detected — refusing to dispatch.\n` +
            `The hop ${backend} @ ${hop.cwd} repeats an earlier hop of the origin chain; ` +
            `dispatching it would close a worker→worker cycle, the classic recursive self-amplification ` +
            `(quota burns in minutes, invisible from any single vantage point).\n` +
            `Origin chain (source → backend @ cwd):\n${formatChain(chain)}`,
          chain, depth, limit: depthLimit, duplicate: hop,
        },
      };
    }
    seen.set(key, h);
  }

  // Depth: one more nesting level than allowed means "workers spawning workers".
  if (depth > depthLimit) {
    return {
      ok: false,
      error: {
        code: 'origin-depth-exceeded',
        reason: 'origin chain depth limit exceeded',
        message:
          `Origin chain depth ${depth} exceeds the configured limit of ${depthLimit} — refusing to dispatch.\n` +
          `This dispatch would nest workers ${depth} levels deep; beyond the limit, nesting is almost ` +
          `certainly workers spawning workers (recursive self-amplification).\n` +
          `Origin chain (source → backend @ cwd):\n${formatChain(chain)}\n` +
          `Raise the limit via dsh_worker_config origin_depth_limit only if this nesting is deliberate.`,
        chain, depth, limit: depthLimit,
      },
    };
  }

  return { ok: true, origin: { chain, depth, limit: depthLimit } };
```

</details>

**依据 5 · 源码核查**：[src/hub/index.mjs:125-159](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/hub/index.mjs#L125-L159)

Hub spawn不接收origin或锁。

<details>
<summary>查看原文（35行）</summary>

```text
  async spawn({ task, tier = 'flash', effort = 'max', cwd, source = 'api', provider, model, preset }) {
    if (!TIERS.includes(tier)) throw new Error(`unknown tier "${tier}"`);
    // An explicit {provider, model} from the caller wins (the MCP process owns
    // session-level overrides, exactly as it does for presets); otherwise the
    // hub's own stored config decides, and failing that the tier default.
    const bound = resolveTierBinding(tier, this.getConfig?.() ?? {});
    const resolvedProvider = typeof provider === 'string' && provider.trim() !== '' ? provider.trim() : bound.provider;
    const resolvedModel = typeof model === 'string' && model.trim() !== '' ? model.trim() : bound.model;
    if (!['off', 'high', 'max'].includes(effort)) throw new Error(`unknown effort "${effort}"`);
    // Accept POSIX, Windows drive (D:\x, C:/x) and UNC (\\srv\share) roots.
    if (!isAbsoluteCwd(cwd)) throw new Error('cwd must be an absolute path');
    // One canonical form for the job, the advisory lock and the workspace
    // lookup: D:/x and D:\x must map to the same workspace on Windows.
    const cwdPath = canonicalCwd(cwd);
    await this.ctx.get('loader')?.await();

    const id = `hub-${this.nextId++}-${Date.now().toString(36)}`;
    const sessionId = `session-${randomUUID()}`;
    const job = {
      id, sessionId, tier, model: resolvedModel, provider: resolvedProvider, effort, task, source, cwd: cwdPath,
      status: 'running', turn: 0, step: 0, currentTool: null, toolCalls: 0,
      tokens: { input: 0, output: 0, reasoning: 0 },
      startedAt: new Date().toISOString(), endedAt: null,
      result: null, error: null, stopReason: null, handle: null, waiters: [],
      texts: [],
    };
    this.jobs.set(id, job);

    const selection = { provider: resolvedProvider, model: resolvedModel, reasoningEffort: effort };
    const presets = this.ctx.get('agentPresets');
    const cfg = this.getConfig?.() ?? {};
    const wanted = preset ?? (tier === 'flash' ? cfg.preset_flash : cfg.preset_pro);
    const presetId = presets === undefined
      ? undefined
      : (await presets.resolve(!wanted || wanted === 'default' ? undefined : wanted)).id;
```

</details>

**依据 6 · 源码核查**：[src/hub/index.mjs:189-207](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/hub/index.mjs#L189-L207)

Agent创建未透传origin。

<details>
<summary>查看原文（19行）</summary>

```text
    const run = async () => {
      const handle = await this.ctx.agents.create({
        sessionId,
        meta: { cwd: cwdPath, ...(presetId === undefined ? {} : { agentPreset: presetId }) },
        agentOptions: { provider: selection.provider, model: selection.model },
        setup: async (agentCtx) => {
          installModelSelection(agentCtx, { current: selection, assembled: undefined });
          if (presets !== undefined) await presets.mount(agentCtx, presetId);
          // Nobody attends a worker session, so a question would wait forever
          // (#13). Claim this agent's requests ahead of the Web answerer.
          installWorkerQuestionHandoff(agentCtx, job, () => this.publish());
          agentCtx.on('session/event', onEvent);
          agentCtx.on('agent/error', (payload) => {
            const err = payload?.error;
            if (job.status !== 'needs_input') job.error = err?.message ?? String(err);
          });
        },
      });
      job.handle = handle;
```

</details>

**依据 7 · 源码核查**：[src/hub/index.mjs:221-268](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/hub/index.mjs#L221-L268)

状态结算和取消交错。

<details>
<summary>查看原文（48行）</summary>

```text
      await handle.agent.whenIdle();
      handle.agent.followup(userMessage(task));
      await handle.agent.whenIdle();
      if (job.status !== 'needs_input') {
        job.result = job.texts.at(-1) ?? '';
        job.status = job.stopReason === 'completed' ? 'done' : 'failed';
      }
      if (job.status === 'failed' && !job.error) job.error = `turn ended: ${job.stopReason ?? 'unknown'}`;
      await this.ctx.sessions.flush(handle.agent.session);
    };

    job.promise = run()
      .catch((err) => {
        if (job.status === 'running') job.status = 'failed';
        job.error = job.error ?? (err?.message ?? String(err));
      })
      .finally(() => {
        job.endedAt = new Date().toISOString();
        job.currentTool = null;
        this.publish();
        for (const w of job.waiters.splice(0)) w();
      });

    this.publish();
    return job;
  }

  async wait(id, timeoutMs) {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    if (job.status !== 'running') return job;
    await Promise.race([
      new Promise((res) => job.waiters.push(res)),
      timeoutMs > 0 ? new Promise((res) => setTimeout(res, timeoutMs)) : Promise.resolve(),
    ]);
    return job;
  }

  async cancel(id) {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    if (job.status === 'running') {
      job.status = 'cancelled';
      job.error = 'cancelled by request';
      try { await job.handle?.dispose(); } catch {}
      this.publish();
    }
    return job;
```

</details>

**依据 8 · 源码核查**：[src/hub/index.mjs:448-481](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/hub/index.mjs#L448-L481)

HTTP直达spawn和cancel。

<details>
<summary>查看原文（34行）</summary>

```text
    disposers.push(webServer.register({
      kind: 'prefix', path: `${ROUTE_BASE}/jobs`,
      handler: async (req, res) => {
        if (!isLoopbackRequest(req)) return sendJson(res, 403, { ok: false, error: 'loopback only' });
        try {
          const url = new URL(req.url, 'http://localhost');
          const parts = url.pathname.slice(`${ROUTE_BASE}/jobs`.length).split('/').filter(Boolean);
          if (req.method === 'GET' && parts.length === 0) {
            // Machine-wide view: this hub's live jobs plus fresh shards from
            // other writers (standalone MCP sessions, other hub instances).
            const own = [...hub.jobs.values()].map((j) => ({ ...hub.view(j), origin: hub.shard.writer }));
            const foreign = readMergedStatus({ excludeWriter: hub.shard.writer });
            return sendJson(res, 200, { ok: true, jobs: [...own, ...foreign] });
          }
          if (req.method === 'GET' && parts.length === 1) {
            const wait = parseWaitSeconds(url.searchParams.get('wait'));
            if (wait === null) return sendJson(res, 400, { ok: false, error: 'wait must be a non-negative integer number of seconds' });
            const job = await hub.wait(parts[0], Math.min(wait, 600) * 1000);
            if (!job) return sendJson(res, 404, { ok: false, error: 'no such job' });
            return sendJson(res, 200, { ok: true, job: hub.view(job, true) });
          }
          if (req.method === 'POST' && parts.length === 0) {
            const payload = await readBody(req);
            const job = await hub.spawn(payload);
            return sendJson(res, 200, { ok: true, job: hub.view(job) });
          }
          if (req.method === 'POST' && parts.length === 2 && parts[1] === 'cancel') {
            const job = await hub.cancel(parts[0]);
            if (!job) return sendJson(res, 404, { ok: false, error: 'no such job' });
            return sendJson(res, 200, { ok: true, job: hub.view(job, true) });
          }
          return sendJson(res, 404, { ok: false, error: 'unknown jobs endpoint' });
        } catch (err) {
          return sendJson(res, 400, { ok: false, error: err?.message ?? String(err) });
```

</details>

**依据 9 · 源码核查**：[src/hub-client.mjs:62-71](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/hub-client.mjs#L62-L71)

分片等待非取消。

<details>
<summary>查看原文（10行）</summary>

```text
  get: async (id, waitSeconds = 0) => {
    const deadline = Date.now() + waitSeconds * 1000;
    for (;;) {
      const remaining = Math.ceil((deadline - Date.now()) / 1000);
      const slice = waitSeconds <= 0 ? 0 : Math.max(1, Math.min(MAX_POLL_SLICE_SECONDS, remaining));
      const job = await call(`/jobs/${id}?wait=${slice}`).then((b) => b.job);
      if (job.status !== 'running' || waitSeconds <= 0 || Date.now() >= deadline) return job;
    }
  },
  cancel: (id) => call(`/jobs/${id}/cancel`, { method: 'POST' }).then((b) => b.job),
```

</details>

**依据 10 · 源码核查**：[src/jobs.mjs:225-288](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/jobs.mjs#L225-L288)

standalone结算、等待与取消。

<details>
<summary>查看原文（64行）</summary>

```text
    job.promise = harness
      .run(task, { sessionId, onNotification })
      .then((result) => {
        job.result = result.finalResponse ?? '';
        const lastEnd = [...(result.events ?? [])].reverse().find((ev) => ev?.type === 'turn/end');
        job.stopReason = lastEnd?.data?.reason?.kind ?? job.stopReason;
        job.status = job.stopReason === 'completed' ? 'done' : 'failed';
        if (job.status === 'failed' && !job.error) job.error = `turn ended with reason: ${job.stopReason ?? 'unknown'}`;
      })
      .catch((err) => {
        job.status = job.status === 'cancelled' ? 'cancelled' : 'failed';
        job.error = err?.message ?? String(err);
      })
      .finally(async () => {
        job.endedAt = new Date().toISOString();
        job.currentTool = null;
        try { await harness.close(); } catch {}
        // Release the cwd lock on EVERY terminal path: done, failed,
        // cancelled, request-timeout (harness rejects) all land here.
        job._releaseCwdLock?.();
        job._releaseCwdLock = null;
        publishStatus();
        for (const w of job.waiters.splice(0)) w();
      });
  } catch (err) {
    // Failed start (SDK missing, no API key, spawn error, ...): settle the
    // record and free the lock so the cwd never stays locked.
    job.status = 'failed';
    job.error = err?.message ?? String(err);
    job.endedAt = new Date().toISOString();
    job._releaseCwdLock?.();
    job._releaseCwdLock = null;
    publishStatus();
    throw err;
  }

  publishStatus();
  return job;
}

export async function waitJob(id, timeoutMs) {
  const job = jobs.get(id);
  if (!job) throw new Error(`no such job: ${id}`);
  if (job.status !== 'running') return job;
  let timer;
  await Promise.race([
    new Promise((res) => job.waiters.push(res)),
    timeoutMs ? new Promise((res) => { timer = setTimeout(res, timeoutMs); }) : new Promise(() => {}),
  ]);
  // The losing branch's timer would otherwise pin the event loop for its full
  // remaining duration and delay server exit after a job settles.
  if (timer) clearTimeout(timer);
  return job;
}

export async function cancelJob(id) {
  const job = jobs.get(id);
  if (!job) throw new Error(`no such job: ${id}`);
  if (job.status !== 'running') return job;
  job.status = 'cancelled';
  job.error = 'cancelled by request';
  try { await job.harness.close(); } catch {}
  publishStatus();
  return job;
```

</details>

**依据 11 · 源码核查**：[src/server.mjs:420-435](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/server.mjs#L420-L435)

Hub取消返回即释放MCP锁。

<details>
<summary>查看原文（16行）</summary>

```text
server.registerTool('dsh_worker_cancel', {
  title: 'Cancel DSH worker',
  description: 'Cancel a running worker job: terminates its runtime process and releases its cwd lock. Use it when a workspace lock is held by a job that is stuck or no longer needed, so a new dispatch to that cwd can proceed.',
  inputSchema: { job_id: z.string() },
}, async ({ job_id }) => {
  if (job_id.startsWith('hub-')) {
    if (!(await hubAvailable())) return text({ error: 'hub not reachable' });
    const view = await hub.cancel(job_id).catch((e) => ({ error: e.message }));
    if (view && view.id) {
      attachOrigin(view, view.id);
      releaseCwdLockByJobId(job_id); // cancelled = holder being disposed
    }
    return text(view);
  }
  if (!getJob(job_id)) return text({ error: `no such job: ${job_id}` });
  return text(jobView(await cancelJob(job_id), { withResult: true }));
```

</details>

#### 缺口

- 取消竞态、跨进程并写及Hub继承的真实副作用未运行。
  **影响**：不能保证取消后可重派或全局单写。
  **进一步探讨**：丢弃目录测两MCP与直Hub同cwd、嵌套链、dispose失败和迟到完成，记录副作用/锁/终态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限、凭据与安装恢复支持什么采用边界？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

Hub依DSH agents/sessions/presets/模型服务及webServer，继承Host凭据；standalone单独需要SDK、jsonrpc runtime与DEEPSEEK_API_KEY，传整个process.env和dotenv，不能理解为仅传一把专用key或最小权限隔离。Hub接口本机socket与Host门控不是用户登录：本地进程可调用，反向代理/多用户需另审。工作目录参数不是文件授权边界。

外部CLI worker是显式路径，agy使用dangerously-skip-permissions/accept-edits，grok用bypassPermissions；MCP描述“用户明确要求”是调用方遵守约定，代码只见worker参数分流，不能据此证明已取得人类批准。安装器会写全局或项目角色、提示、MCP/权限配置，部分文件先备份但不是全事务：Codex角色有backup，prompts直接覆盖无同样备份，因此“每个设置文件都先备份”不可泛化；CLI失败也可能保留已改配置。

当前observe正式写任务。若仅评估机制，应在隔离且可丢弃目录、固定单MCP进程/强制hub、无外部CLI、禁止同cwd并发和自动升级，先做只读任务并人工验最终结果；核心守卫/取消问题未修或未验前不把它作为生产写任务调度器。模型API及重试费用按真实配置未知，不因Flash标价印象或并发截图凑经济创新。退出要核实际worker进程、Host会话、配置备份、角色/提示残留和API凭据，而不是只关MCP窗口。

#### 证据与依据

**依据 1 · 源码核查**：[src/jobs.mjs:145-185](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/jobs.mjs#L145-L185)

SDK/runtime/key与全环境传入。

<details>
<summary>查看原文（41行）</summary>

```text
    // server keeps every @deepseek-ai/* package external (see scripts/build-mcp.mjs):
    // hub mode never touches the SDK, and an installed copy without the package
    // fails on this line - with a hint - instead of dying at module load.
    let DeepSeekHarness;
    try {
      ({ DeepSeekHarness } = await import('@deepseek-ai/dsh-sdk-client'));
    } catch (err) {
      if (err?.code === 'ERR_MODULE_NOT_FOUND') {
        const hint = new Error(`@deepseek-ai/dsh-sdk-client not installed; standalone dispatch requires it - run pnpm install in ${ROOT}, or use hub mode (dsh_worker_config mode=hub) so jobs run inside a DSH instance`);
        hint.code = 'ERR_MODULE_NOT_FOUND';
        throw hint;
      }
      throw err;
    }

    if (!existsSync(RUNTIME_BIN)) throw new Error(`dsh-jsonrpc-agent not installed at ${RUNTIME_BIN}; run pnpm install in ${ROOT}`);
    const dotEnv = loadDotEnv();
    if (!process.env.DEEPSEEK_API_KEY && !dotEnv.DEEPSEEK_API_KEY) {
      throw new Error(`DEEPSEEK_API_KEY not found in env or ${join(CONFIG_DIR, '.env')}`);
    }

    const harness = new DeepSeekHarness({
      launch: {
        command: RUNTIME_BIN,
        args: [CORDIS],
        cwd: workspace,
        env: {
          ...process.env,
          ...dotEnv,
          DSH_CWD: workspace,
          DSH_SESSION_ROOT: join(CONFIG_DIR, 'sessions'),
          DSH_REASONING_EFFORT: effort,
          // Origin guard: the worker runtime inherits the dispatch chain, so a
          // crew instance it starts itself continues the chain (WPC9).
          ...(origin ? { [ORIGIN_CHAIN_ENV]: JSON.stringify(origin.chain), [ORIGIN_DEPTH_ENV]: String(origin.depth) } : {}),
        },
        requestTimeoutMs: timeoutMs,
      },
      cwd: workspace,
      provider: dispatchProvider,
      model: dispatchModel,
```

</details>

**依据 2 · 源码核查**：[src/hub/index.mjs:278-292](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/hub/index.mjs#L278-L292)

loopback/Host检查，无用户身份。

<details>
<summary>查看原文（15行）</summary>

```text
// ---------- loopback route helpers (pattern from dsh-noema) ----------

function isIpv4Loopback(a) { return /^127(\.\d{1,3}){3}$/.test(a); }
function isLoopbackAddress(address) {
  if (!address) return false;
  const n = address.toLowerCase().split('%', 1)[0];
  if (n === '::1' || isIpv4Loopback(n)) return true;
  if (!n.startsWith('::ffff:')) return false;
  return isIpv4Loopback(n.slice(7));
}
function isLoopbackRequest(req) {
  if (!isLoopbackAddress(req.socket?.remoteAddress)) return false;
  const host = (req.headers.host ?? '').split(':')[0].toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || isIpv4Loopback(host);
}
```

</details>

**依据 3 · 源码核查**：[src/hub/index.mjs:448-481](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/hub/index.mjs#L448-L481)

真实敏感job接口。

<details>
<summary>查看原文（34行）</summary>

```text
    disposers.push(webServer.register({
      kind: 'prefix', path: `${ROUTE_BASE}/jobs`,
      handler: async (req, res) => {
        if (!isLoopbackRequest(req)) return sendJson(res, 403, { ok: false, error: 'loopback only' });
        try {
          const url = new URL(req.url, 'http://localhost');
          const parts = url.pathname.slice(`${ROUTE_BASE}/jobs`.length).split('/').filter(Boolean);
          if (req.method === 'GET' && parts.length === 0) {
            // Machine-wide view: this hub's live jobs plus fresh shards from
            // other writers (standalone MCP sessions, other hub instances).
            const own = [...hub.jobs.values()].map((j) => ({ ...hub.view(j), origin: hub.shard.writer }));
            const foreign = readMergedStatus({ excludeWriter: hub.shard.writer });
            return sendJson(res, 200, { ok: true, jobs: [...own, ...foreign] });
          }
          if (req.method === 'GET' && parts.length === 1) {
            const wait = parseWaitSeconds(url.searchParams.get('wait'));
            if (wait === null) return sendJson(res, 400, { ok: false, error: 'wait must be a non-negative integer number of seconds' });
            const job = await hub.wait(parts[0], Math.min(wait, 600) * 1000);
            if (!job) return sendJson(res, 404, { ok: false, error: 'no such job' });
            return sendJson(res, 200, { ok: true, job: hub.view(job, true) });
          }
          if (req.method === 'POST' && parts.length === 0) {
            const payload = await readBody(req);
            const job = await hub.spawn(payload);
            return sendJson(res, 200, { ok: true, job: hub.view(job) });
          }
          if (req.method === 'POST' && parts.length === 2 && parts[1] === 'cancel') {
            const job = await hub.cancel(parts[0]);
            if (!job) return sendJson(res, 404, { ok: false, error: 'no such job' });
            return sendJson(res, 200, { ok: true, job: hub.view(job, true) });
          }
          return sendJson(res, 404, { ok: false, error: 'unknown jobs endpoint' });
        } catch (err) {
          return sendJson(res, 400, { ok: false, error: err?.message ?? String(err) });
```

</details>

**依据 4 · 源码核查**：[src/cli-workers.mjs:77-103](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/cli-workers.mjs#L77-L103)

CLI权限绕过参数。

<details>
<summary>查看原文（27行）</summary>

```text
function buildArgs(profile, task, timeoutMs, effortOverride) {
  if (profile.backend === 'agy') {
    const timeoutSec = Math.ceil(timeoutMs / 1000);
    const args = [
      '--print', task,
      '--output-format', 'stream-json',
      '--dangerously-skip-permissions',
      '--mode', 'accept-edits',
      '--print-timeout', `${timeoutSec + 15}s`, // self-exit backstop above our deadline
    ];
    if (profile.model) args.push('--model', profile.model);
    if (effortOverride && profile.effortMap?.[effortOverride]) {
      args.push('--effort', profile.effortMap[effortOverride]);
    }
    return args;
  }
  if (profile.backend === 'grok') {
    const args = [
      '-p', task,
      '--output-format', 'streaming-messages-json',
      '--include-partial-messages',
      '--permission-mode', 'bypassPermissions',
    ];
    if (profile.model) args.push('--model', profile.model);
    // grok-4.5 is not a reasoning model; no --reasoning-effort even when the
    // caller passes effort (profile.effortMap === null).
    return args;
```

</details>

**依据 5 · 源码核查**：[src/install/install.mjs:261-282](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/install/install.mjs#L261-L282)

Codex角色备份与prompt直接覆盖。

<details>
<summary>查看原文（22行）</summary>

```text
export function installCodex({ home = homedir(), scope } = {}) {
  const actions = [];
  const agentsDir = scope === 'project' ? join(process.cwd(), '.codex', 'agents') : join(home, '.codex', 'agents');
  mkdirSync(agentsDir, { recursive: true });
  const srcDir = join(ROOT, 'codex', 'agents');
  for (const f of readdirSync(srcDir).filter((f) => f.endsWith('.toml'))) {
    const dest = join(agentsDir, f);
    const bak = backup(dest);
    if (bak) actions.push(`backup: ${bak}`);
    const rendered = readFileSync(join(srcDir, f), 'utf8')
      .replace(/args = \[.*server\.mjs"\]/, () => `args = [${tomlString(join(ROOT, 'src', 'server.mjs'))}]`);
    writeFileSync(dest, rendered);
    actions.push(`role: ${dest}`);
  }
  const promptsDir = scope === 'project' ? join(process.cwd(), '.codex', 'prompts') : join(home, '.codex', 'prompts');
  mkdirSync(promptsDir, { recursive: true });
  const promptsSrc = join(ROOT, 'codex', 'prompts');
  for (const f of readdirSync(promptsSrc).filter((f) => f.endsWith('.md'))) {
    writeFileSync(join(promptsDir, f), readFileSync(join(promptsSrc, f), 'utf8'));
    actions.push(`prompt: ${join(promptsDir, f)}`);
  }
  return { ok: true, actions };
```

</details>

**依据 6 · 源码核查**：[src/install/install.mjs:15-21](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/install/install.mjs#L15-L21)

backup只是文件副本。

```text
function backup(file) {
  if (existsSync(file)) {
    const bak = `${file}.dsh-crew-backup-${Date.now()}`;
    copyFileSync(file, bak);
    return bak;
  }
  return null;
```

#### 缺口

- Host兼容、安装卸载/跨平台CLI、凭据与完整供应链未全审或运行。
  **影响**：不可将设置成功或原生Agent当隔离验收。
  **进一步探讨**：先核配置diff与独立备份，再用无敏感数据的一套固定组合验证；退出核实际进程和凭据。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样把分派声明变成可验证的结果和单写约束？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是在Hub权威侧集中接收/验证origin、按实际工作区归属分配持久租约和执行generation，并让取消返回“请求中/已确认停止/未知”而非提前保证释放。它由当前MCP守卫局部、Map仅进程内及取消状态可覆盖推导；不是当前实现的贡献，也不要求无限扩大产品。最小验证可以先把Hub同cwd与origin检查移到真实spawn入口，取消结算加终态门闩，再做两客户端、网络丢答、Hub重启与迟到完成的故障矩阵。

验收必须核结果、工作树和实际进程：同一写域无双有效writer，重复分派不重复副作用，取消未确认时拒新写，重启能识别未知而非当done。若租约过期旧worker仍可写或任务结果无法关联原执行，则推翻安全重派假设，保留人工串行核查；性能、节时和token收益另做同任务对照，不预先计分。

#### 证据与依据

**依据 1 · 源码核查**：[src/cwd-lock.mjs:28-69](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/cwd-lock.mjs#L28-L69)

当前局部锁依据。

<details>
<summary>查看原文（42行）</summary>

```text
import { resolve } from 'node:path';
import { realpathSync } from 'node:fs';

const locks = new Map(); // canonical cwd -> holder

/** Canonical absolute path of a workspace cwd (realpath when it exists). */
export function normalizeCwd(cwd) {
  try { return realpathSync.native(String(cwd)); } catch { return resolve(String(cwd)); }
}

/** Thrown by acquireCwdLock when another running job holds the cwd. */
export class CwdLockError extends Error {
  constructor(holder) {
    super(
      `workspace "${holder.cwd}" is already held by a running worker (job ${holder.jobId}, backend ${holder.backend}, mode ${holder.mode}, started at ${holder.startedAt}). ` +
      'Refusing this dispatch instead of queueing it: two workers writing the same repo concurrently corrupt files. ' +
      'Wait for that job to settle, cancel it, or pass allow_concurrent_cwd: true if this task is read-only.',
    );
    this.name = 'CwdLockError';
    this.holder = { ...holder };
  }
}

/**
 * Acquire the advisory lock for one cwd. Returns { holder, release } where
 * release() is idempotent and safe to call from any settle path. With
 * allowConcurrent: true this is a deliberate no-op (the lock stays advisory).
 */
export function acquireCwdLock({ cwd, jobId, backend, mode, startedAt, allowConcurrent = false }) {
  if (allowConcurrent) return { holder: null, release() {} };
  const key = normalizeCwd(cwd);
  const existing = locks.get(key);
  if (existing) throw new CwdLockError(existing);
  const holder = { jobId, backend, mode, startedAt, cwd: key };
  locks.set(key, holder);
  let released = false;
  return {
    holder,
    release() {
      if (released) return;
      released = true;
      if (locks.get(key) === holder) locks.delete(key);
```

</details>

**依据 2 · 源码核查**：[src/hub/index.mjs:125-159](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/hub/index.mjs#L125-L159)

Hub缺少传入origin/锁的入口。

<details>
<summary>查看原文（35行）</summary>

```text
  async spawn({ task, tier = 'flash', effort = 'max', cwd, source = 'api', provider, model, preset }) {
    if (!TIERS.includes(tier)) throw new Error(`unknown tier "${tier}"`);
    // An explicit {provider, model} from the caller wins (the MCP process owns
    // session-level overrides, exactly as it does for presets); otherwise the
    // hub's own stored config decides, and failing that the tier default.
    const bound = resolveTierBinding(tier, this.getConfig?.() ?? {});
    const resolvedProvider = typeof provider === 'string' && provider.trim() !== '' ? provider.trim() : bound.provider;
    const resolvedModel = typeof model === 'string' && model.trim() !== '' ? model.trim() : bound.model;
    if (!['off', 'high', 'max'].includes(effort)) throw new Error(`unknown effort "${effort}"`);
    // Accept POSIX, Windows drive (D:\x, C:/x) and UNC (\\srv\share) roots.
    if (!isAbsoluteCwd(cwd)) throw new Error('cwd must be an absolute path');
    // One canonical form for the job, the advisory lock and the workspace
    // lookup: D:/x and D:\x must map to the same workspace on Windows.
    const cwdPath = canonicalCwd(cwd);
    await this.ctx.get('loader')?.await();

    const id = `hub-${this.nextId++}-${Date.now().toString(36)}`;
    const sessionId = `session-${randomUUID()}`;
    const job = {
      id, sessionId, tier, model: resolvedModel, provider: resolvedProvider, effort, task, source, cwd: cwdPath,
      status: 'running', turn: 0, step: 0, currentTool: null, toolCalls: 0,
      tokens: { input: 0, output: 0, reasoning: 0 },
      startedAt: new Date().toISOString(), endedAt: null,
      result: null, error: null, stopReason: null, handle: null, waiters: [],
      texts: [],
    };
    this.jobs.set(id, job);

    const selection = { provider: resolvedProvider, model: resolvedModel, reasoningEffort: effort };
    const presets = this.ctx.get('agentPresets');
    const cfg = this.getConfig?.() ?? {};
    const wanted = preset ?? (tier === 'flash' ? cfg.preset_flash : cfg.preset_pro);
    const presetId = presets === undefined
      ? undefined
      : (await presets.resolve(!wanted || wanted === 'default' ? undefined : wanted)).id;
```

</details>

**依据 3 · 源码核查**：[src/hub/index.mjs:221-268](https://github.com/ZSeven-W/dsh-crew/blob/b0ddd92eeccbd7623c5a5924f0eb61005a2038ec/src/hub/index.mjs#L221-L268)

取消与正常结算依据。

<details>
<summary>查看原文（48行）</summary>

```text
      await handle.agent.whenIdle();
      handle.agent.followup(userMessage(task));
      await handle.agent.whenIdle();
      if (job.status !== 'needs_input') {
        job.result = job.texts.at(-1) ?? '';
        job.status = job.stopReason === 'completed' ? 'done' : 'failed';
      }
      if (job.status === 'failed' && !job.error) job.error = `turn ended: ${job.stopReason ?? 'unknown'}`;
      await this.ctx.sessions.flush(handle.agent.session);
    };

    job.promise = run()
      .catch((err) => {
        if (job.status === 'running') job.status = 'failed';
        job.error = job.error ?? (err?.message ?? String(err));
      })
      .finally(() => {
        job.endedAt = new Date().toISOString();
        job.currentTool = null;
        this.publish();
        for (const w of job.waiters.splice(0)) w();
      });

    this.publish();
    return job;
  }

  async wait(id, timeoutMs) {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    if (job.status !== 'running') return job;
    await Promise.race([
      new Promise((res) => job.waiters.push(res)),
      timeoutMs > 0 ? new Promise((res) => setTimeout(res, timeoutMs)) : Promise.resolve(),
    ]);
    return job;
  }

  async cancel(id) {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    if (job.status === 'running') {
      job.status = 'cancelled';
      job.error = 'cancelled by request';
      try { await job.handle?.dispose(); } catch {}
      this.publish();
    }
    return job;
```

</details>

#### 缺口

- Hub权威租约/执行代际和确认取消尚未实现与验证。
  **影响**：不算现有安全保证或经济收益。
  **进一步探讨**：先最小入口/终态修正与故障矩阵，未达单写与可追溯即人工串行。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
