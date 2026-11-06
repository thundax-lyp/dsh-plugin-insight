# sofagent（根治理基础设施）

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[136a148](https://github.com/KongFangXun/sofagent/tree/136a148837a31dc2471d578e15a76afc3328b0f6)

<!-- BEGIN META -->
[![GitHub ★ 55](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=55&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/KongFangXun/sofagent)
<!-- END META -->

> **功能**：以本地约束文件、审计规则、可续跑任务流程和多宿主接入组成 FDE 治理层。

> **亮点**：统一治理资产与审计/反馈/恢复接线；模型、LangGraph、Git和CI能力继承已有技术。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：低可信FAIL可继续、自动确认只读reviewer文本，checkpoint重跑非副作用恰一次；签名链不抵御同身份改写，DSH工厂Promise调用另有降级缺口。见 [Q02](#research-q02)。

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
  - [Q01 · 根产品如何被使用，审计和自治任务分别走哪条真实链路？](#detail-section-11)
  - [Q02 · 审计、确认与 checkpoint 能保证什么，哪些失败仍可能流转？](#detail-section-12)
  - [Q03 · 比原 Agent 加脚本多提供什么，接入成本和经济结构改变在哪里？](#detail-section-13)
  - [Q04 · 现在应从哪种用法开始，怎样验证更值得生产化的方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有编码Agent的集成者，希望为项目保留本地规则与治理记录。见 [Q01](#research-q01)。

原Agent加手工读diff、测试/CI；单平台内置治理与简单脚本需作为直接替代。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| audit CLI | 规则检查diff | quick缺真实任务/日志输入 |
| loop | 工具执行与反馈修复 | 模型/运行时与降级限制 |
| checkpoint | 节点状态续跑 | 非副作用事务 |
| 确认 | 人工/异步或自动模式 | 节点名不保证真人批准 |
| 签名链 | 检测不一致/坏链 | 同身份仍可重算 |
| 宿主分发 | 接现有Agent治理资产 | 各平台强度不相同 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18及1.8.0实现包 | CLI必需 | 总包分派实际引擎 | 找不到实现127 |
| Git仓库/明确diff范围 | audit必需 | 提供实际变更 | 非仓库/解析失败不能审查 |
| LangGraph运行时、模型端点/凭据 | 自治loop所需 | 工具循环与判定 | 缺失报错或降级prompt |
| 独立CI身份/可信规则与密钥 | 强治理所需 | 防同身份篡改 | 本地hook/链不是独立边界 |
| 完整安装静态资产 | Dashboard所需 | 管理界面 | npm总包不包含 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 明确范围 | 集成者选audit-only与Git diff | 已知违规/正确样本对照 |
| 审计 | CLI解析diff并跑规则 | 查退出码、输入与跳过 |
| 可选loop | Agent工具执行→审计→审查/确认 | 低可信/自动确认分别核验 |
| 恢复 | 用户按checkpoint续跑 | 重复副作用须独立查 |
| 交付 | 原CI/人核真实需求 | 不由completed单独放行 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装/测试资源未知 | 定规则/安装形态/CI信任 | audit先对照 |
| 持续使用 | 模型/测试/磁盘费用未知 | 复核低可信、升级和密钥 | quota非实际账单 |
| 失败恢复 | 重跑模型/工具未知 | 查checkpoint与重复副作用 | 不保证恰一次 |
| 退出 | 历史日志/修改保留 | 各安装通道分别移除 | npm卸载不等于全回滚 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 审计入口 | diff规则/退出码接线 | 完整需求与漏检率 |
| 自治任务 | 工具型runner和反馈图 | 实际后端可用/任务成功 |
| 恢复 | 节点前后状态 | 副作用恰一次 |
| 留证 | HMAC/坏链可见性 | 同身份防篡改不成立 |
| 服务接续 | 本地文件驻留治理结构 | 独立离场维护与净收益 |

> **思考**：低可信FAIL可继续、自动确认只读reviewer文本，checkpoint重跑非副作用恰一次；签名链不抵御同身份改写，DSH工厂Promise调用另有降级缺口。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一治理资产与审计/反馈/恢复接线；模型、LangGraph、Git和CI能力继承已有技术。见 [Q01](#research-q01)、[Q03](#research-q03)。

集中链内核、节点checkpoint与降级标记可借鉴；不能把状态持久化等同外部事务或独立信任。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

低可信FAIL可继续、自动确认只读reviewer文本，checkpoint重跑非副作用恰一次；签名链不抵御同身份改写，DSH工厂Promise调用另有降级缺口。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先非敏感副本audit-only，与原CI核已知样本和退出码；loop/daemon/自动确认逐项另验，回执不完整则回原流程。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根CLI与可选loop主链已源码核查；不构成全产品、跨宿主运行或安全认证。

- 已检查：作者 README、包清单、源码路径 README.md、docs/LIMITATIONS.md、engine/audit/src/chain-kernel.ts、engine/audit/src/cli-quick.ts、engine/orchestrator/src/agent-factory.ts、engine/orchestrator/src/cli.ts、engine/orchestrator/src/durable/resume.ts、engine/orchestrator/src/launcher.ts、engine/orchestrator/src/loop/agent-runner.ts、engine/orchestrator/src/loop/deps-defaults.ts、engine/orchestrator/src/loop/graph.ts、engine/orchestrator/src/loop/nodes.ts、engine/umbrella/bin/sofagent.js、engine/umbrella/package.json、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：独立研究根private包、公开总包分派、quick审计、loop默认角色/降级/HITL/恢复与链内核；未全审1948文件、所有规则、MCP、快照、daemon和平台适配。未运行目标。
- 下一步：六故障矩阵与原CI比较误放行、人工定位和重复副作用，另核实际模型账单；均未执行。

**分析版本**

- **仓库**：[KongFangXun/sofagent](https://github.com/KongFangXun/sofagent)
- **版本号**：1.8.0（[固定提交 136a148](https://github.com/KongFangXun/sofagent/tree/136a148837a31dc2471d578e15a76afc3328b0f6)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

以统一能力/信任/副作用回执减少completed误判，不重造引擎；六类故障与原CI对照，无收益即退回简单组合。见 [Q04](#research-q04)。

六故障矩阵与原CI比较误放行、人工定位和重复副作用，另核实际模型账单；均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 434 | 88855 | — | — | 1667318 |
| .js | source | 6 | 2798 | 2198 | 494 | — |
| .mjs | source | 92 | 32088 | 20937 | 9277 | — |
| .md | example | 1 | 44 | — | — | 612 |
| .ts | test | 563 | 120445 | 93577 | 15689 | — |
| .ts | source | 833 | 197247 | 125783 | 59214 | — |
| .mts | source | 1 | 14 | 7 | 6 | — |
| .mjs | test | 14 | 5710 | 4248 | 860 | — |
| .ts | example | 1 | 77 | 57 | 18 | — |
| .mjs | example | 2 | 182 | 136 | 32 | — |
| .cjs | test | 1 | 37 | 26 | 6 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/KongFangXun/sofagent/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/KongFangXun/sofagent/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)

暂未获取：近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：根产品的审计与自治任务真实执行到哪里，状态与证据能支持什么保证？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根产品如何被使用，审计和自治任务分别走哪条真实链路？

**研究主题**：场景与需求、功能与机制

#### 完整回答

根包是 private 的 sofagent-monorepo，不能当单一 DSH 插件。它面向已有编码 Agent、希望把业务约束和本地审计资产留给项目的集成者；分发有独立 CLI、MCP、宿主适配和完整安装。这里以用户可直接触达的 audit CLI 与可选 loop 为主线，不把多种形态数量当成相同强度的治理。基线是原有 Agent 加人工读 diff、测试脚本和 CI。

公开 sofagent 总包的 bin 是转发器：裸命令或未识别域参数回 audit，定位实现包后 spawn Node 子进程并传递退出码，找不到实现返回127。默认 audit 到 cli-quick，--full 才切完整引擎。quick 检查 Git 仓库、解析所选 diff，默认最近一次提交，向 runRules 提供变更、提交消息、空日志与 quickMode，再返回规则结果退出码。它不因为装了包就审查所有工作区操作；真实任务/日志相关规则不能由空日志补出证据。

另有 CLI loop --task 入口，加载 StateGraph 后运行计划、工程执行、审计、checker、reviewer 和确认节点，审计反馈可回工程节点。defaultDeps 的工程/审查角色接 makeAgentRunner，解析模型，包装工具门，再调用 Agent 工厂和 invoke；因此源码存在真实工具型 Agent 执行路径，不只是静态流程图。但缺模型/工厂或调用错误会转 spawnSubAgent，后者编排不可用时只返回可手工执行的 prompt；这类字符串不是已完成任务。具体后端可用性未运行确认，不能把 README 的平台支持矩阵当所有路径都已跑通。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-14](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/package.json#L1-L14)

根包 private 和产品定位。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "sofagent-monorepo",
  "version": "1.8.0",
  "description": "sofagent 单仓根（monorepo，private 不发布）——开源 FDE Harness 层：嵌在 Agent 与模型层之间做治理，进场把业务判断写成文件（工作流 / 本体数据 / AI 节点），离场按文件审计每一次变更。各能力包在 engine/* 下独立发布（CLI 入口 @sofagent/audit，裸名总包 sofagent）。",
  "keywords": [
    "sofagent",
    "fde",
    "harness",
    "audit",
    "agent",
    "governance",
    "monorepo"
  ],
  "private": true,
```

</details>

**依据 2 · 源码核查**：[engine/umbrella/bin/sofagent.js:188-266](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/umbrella/bin/sofagent.js#L188-L266)

audit-first、完整引擎分派及实际子进程。

<details>
<summary>查看原文（79行）</summary>

```text
function resolveDomainCli(domain, rest) {
  const spec = DOMAINS[domain];
  const entry = require.resolve(spec.pkg); // main 入口（在 dist/ 内）
  const distDir = dirname(entry);
  // audit 域：--full 走完整引擎（audit 第二 bin），参数面其余原样
  if (domain === 'audit' && spec.fullFile) {
    const idx = rest.indexOf('--full');
    if (idx !== -1) {
      const cliPath = join(distDir, spec.fullFile);
      if (!existsSync(cliPath)) throw new Error(`完整引擎入口缺失：${cliPath}（请先 npm run build）`);
      return { cliPath, args: [...rest.slice(0, idx), ...rest.slice(idx + 1)] };
    }
  }
  const cliPath = join(distDir, spec.file);
  if (!existsSync(cliPath)) throw new Error(`域实现入口缺失：${cliPath}（请先 npm run build）`);
  // train/stats 域：实现 CLI 以 `<域词> <动作>` 形态分发（cli.ts `case 'train'/'stats'`），
  // 路由已把域名词剥掉，须补回前缀——否则 `sofagent train doctor` 会变成
  // `cli.js doctor`（不识别），而直调 `cli.js train doctor` 正常。行为与直调逐条一致。
  const args = domain === 'train' || domain === 'stats' ? [domain, ...rest] : rest;
  return { cliPath, args };
}

function main() {
  const argv = process.argv.slice(2);

  if (argv.length === 0) {
    // audit-first 保留：裸 `sofagent` 仍直通审计（旧行为不破——v1.5.6 前的默认入口）
    return spawnDomain('audit', []);
  }
  if (argv[0] === 'help' || argv[0] === '--help' || argv[0] === '-h') {
    printHelp();
    return 0;
  }
  if (argv[0] === '--version' || argv[0] === '-v') {
    console.log(readVersion());
    return 0;
  }

  const cmd = argv[0];
  const rest = argv.slice(1);

  if (RESERVED.has(cmd)) return handleReserved(cmd, rest);

  // audit-first 回退（v1.5.6 行为保真）：非保留字、非已知域的首参一律转 audit——
  // 保持旧 umbrella 的「裸 sofagent 即 audit」语义，覆盖 `--doctor` / `--diff X` /
  // `demo` / `HEAD~3..HEAD` 等 audit 参数面（收敛前它们全部直达 audit，不得回归）。
  if (!Object.prototype.hasOwnProperty.call(DOMAINS, cmd)) {
    return spawnDomain('audit', argv);
  }

  return spawnDomain(cmd, rest);
}

// 统一 spawn 出口（退出码原样回传；结果面注入单入口静默标记）
function spawnDomain(domain, args) {
  let target;
  try {
    target = resolveDomainCli(domain, args);
  } catch (err) {
    console.error(`[sofagent] 无法定位域「${domain}」的实现入口：${err && err.message ? err.message : err}`);
    const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
    const inRepo = existsSync(join(repoRoot, 'engine', 'audit', 'package.json'));
    console.error(inRepo
      ? '[sofagent] 检测到在仓库内运行且实现包尚未构建——请先在仓库根执行：npm install && npm run build'
      : '[sofagent] 请尝试重新安装：npm i -g sofagent');
    return 127;
  }
  const result = spawnSync(process.execPath, [target.cliPath, ...target.args], {
    stdio: 'inherit',
    env: { ...process.env, SOFAGENT_SINGLE_ENTRY: '1' }, // 保留作单入口标记（无读者——v1.6.0 BUG-56 同批口径）
  });
  if (result.error) {
    console.error(`[sofagent] 启动域「${domain}」失败：${result.error.message}`);
    return 127;
  }
  return result.status === null ? 130 : result.status;
}

process.exit(main());
```

</details>

**依据 3 · 源码核查**：[engine/audit/src/cli-quick.ts:666-705](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/audit/src/cli-quick.ts#L666-L705)

Git/diff 主入口及解析失败。

<details>
<summary>查看原文（40行）</summary>

```text
  const cwd = process.cwd();
  const isGitRepo = existsSync(join(cwd, '.git')) || isInGitRepo();

  if (!isGitRepo) {
    console.log('⚠️  当前目录不在 git 仓库内。');
    console.log('   npx sofagent audit 需要在 git 仓库内运行。');
    console.log('   请 cd 到你的项目目录后重试。');
    return 3;
  }

  // 2. 确定 diff 范围（默认 HEAD~1..HEAD）
  const diffRange = argv[2] && !argv[2].startsWith('-') && argv[2] !== 'quick'
    ? argv[2]
    : 'HEAD~1..HEAD';

  // 3. 取 commit SHA（v1.3.8 P1-B5：失败时已静默 raw stderr，此处输出产品化提示）
  const commitSha = getLatestCommitSha();

  // v1.3.4 P2-15: SHA 为 null 时输出显著警告（而非静默用 'unknown' 填充）
  // v1.3.8 P1-B5: 提示语产品化——不透传 git 原始报错（fatal: Needed a single revision）
  // 现行行为（v1.4.5 起根 commit 补审）：有 SHA 无父提交 → 对比空树 SHA 补审全部新增内容
  // （见下方 diffFiles.length === 0 分支）；无 SHA 时提示不审计，不静默填充。
  if (commitSha === null) {
    console.log('⚠️ [sofagent] 无法获取 commit SHA（仓库可能尚无提交记录），审计记录将不含 commit 关联。');
  }

  // 4. 解析 diff——parseDiff 接收 git refspec（如 HEAD~1..HEAD），内部执行 git diff
  let diffFiles: DiffFile[];
  try {
    diffFiles = parseDiff(diffRange);
  } catch {
    // finding-09 fail-closed 收口后，不可解析 ref 在此抛错——文案对齐 v1.5.1 F1 契约（回显范围可诊断）
    console.log('⚠️  diff 解析失败。');
    console.log(`   无法解析 diff 范围「${diffRange}」的 ref——请检查 ref 是否存在（如 HEAD~1..HEAD、origin/main..HEAD），或仓库是否尚无提交。`);
    return 3;
  }

  if (diffFiles.length === 0) {
    // v1.3.8 P1-B1：首次 commit 输出矛盾修复——此前三行并存：
    //   ①「首次提交，无需审计」（parseDiff 内打印）②「审计最近一次 commit（SHA）」
```

</details>

**依据 4 · 源码核查**：[engine/audit/src/cli-quick.ts:835-862](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/audit/src/cli-quick.ts#L835-L862)

quick 实际输入和输出。

<details>
<summary>查看原文（28行）</summary>

```text
  // v1.3.3 #8: quickMode=true 标记——A3（不改越界）见到跳过：quick 模式无真实任务描述，
  // task='quick-audit' 与任何文件都不匹配，必然 100% 误报越界 WARN。
  // v1.3.8 P1-B2: 传入真实 commitMsg（git log -1 取）——此前第 6 参恒 undefined，
  // A9（prompt 注入检测）在 quick 模式无输入假绿；commitMsg 取不到时 A9 按
  // 无输入处理（输出标「跳过」），不再假绿。
  // v1.3.8 P1-B4: 改用对象参数签名（十位置参数四布尔陷阱重构）。
  // v1.4.4 D-1: commitMsg 取被审计 range 终点（resolveDiffEndpoint）——
  // 与 diff 面（parseDiff(diffRange)）同源，range 模式下 A9 不再被字面 HEAD 污染。
  const commitMsg = getLatestCommitMsg(resolveDiffEndpoint(diffRange)) ?? undefined;
  const result = runRules({
    diffFiles,
    logEntries: [],
    task: 'quick-audit',
    silent: true,
    commitMsg,
    quickMode: true,
    diffRange,
  });

  // 7. 格式化输出（v1.3.5 #6: 传入 diffRange 供 range 模式标题感知）
  // v1.6.0 BUG-08：首提交补审场景标题已在 :731 打印（「审计首个 commit——首提交无父基线…」），
  //   此处若再打「审计最近一次 commit」即同屏双标题互相矛盾——无基线补审路径跳过通用标题。
  const isFirstCommitAudit = !hasParentCommit();
  const output = generateQuickOutput(result, isFirstCommitAudit ? null : commitSha, diffRange, { suppressTitle: isFirstCommitAudit });
  console.log(output);

  // 8. 返回退出码
  return result.exitCode;
```

</details>

**依据 5 · 源码核查**：[engine/orchestrator/src/cli.ts:233-262](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/cli.ts#L233-L262)

loop/resume 真实CLI接线。

<details>
<summary>查看原文（30行）</summary>

```text
      if (resumeMode) {
        const { resumeLoopGraph } = await loadLoopGraphOrExit();
        const result = await resumeLoopGraph({ dataDir: dataDirArg });
        if (!result) {
          console.log('ℹ️ 未找到可恢复的 checkpoint');
          process.exit(2);
        }
        console.log('');
        console.log(`终态: ${result.finalStatus}`);
        console.log(`重试次数: ${result.retryCount}`);
        process.exit(result.finalStatus === 'completed' ? 0 : result.finalStatus === 'awaiting_human' ? 3 : 1);
        break;
      }

      const taskIdx = args.indexOf('--task');
      const taskDesc = taskIdx !== -1 ? args[taskIdx + 1] : undefined;
      if (!taskDesc) {
        console.error('❌ loop 需要 --task <描述> 参数（追加 --resume 从 checkpoint 恢复）');
        process.exit(1);
      }
      const { runLoopGraph } = await loadLoopGraphOrExit();
      const result = await runLoopGraph(taskDesc, { dataDir: dataDirArg });
      console.log('');
      console.log(`终态: ${result.finalStatus}`);
      console.log(`重试次数: ${result.retryCount}`);
      console.log(`checkpointId: ${result.checkpointId}`);
      // v1.2.2 P3b：awaiting_human 挂起态用独立退出码 3 标识，便于 daemon/脚本区分
      process.exit(result.finalStatus === 'completed' ? 0 : result.finalStatus === 'blocked' ? 2 : result.finalStatus === 'awaiting_human' ? 3 : 1);
    }
    case 'compare': {
```

</details>

**依据 6 · 源码核查**：[engine/orchestrator/src/loop/deps-defaults.ts:275-321](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/loop/deps-defaults.ts#L275-L321)

角色执行接入runner。

<details>
<summary>查看原文（47行）</summary>

````text
export function defaultDeps(checkpointer: FileCheckpointer, silent = false): LoopGraphDeps {
  // v1.4.8 深模块条目 4：角色 runner 经 makeAgentRunner 装配（骨架收编——
  // LLM 解析/gate 三段/心跳/主权包裹/文本提取/降级路径单源；角色差异在 spec）
  const engineerRunner = makeAgentRunner(
    {
      role: 'engineer',
      tools: ENGINEER_TOOLS,
      agentDef: ENGINEER_AGENT,
      buildTask: () => '',
      endpoints: { endpoint: 'loop-engineer', purpose: 'engineer-loop' },
      progressTitle: 'engineer work',
      gateTaskDesc: 'engineer task',
    },
    { sovereigntyMw: getLoopSovereigntyMw(), progressMw: getLoopProgressMw(), mandateGate: getLoopMandateGateMw() },
  );
  const reviewerRunner = makeAgentRunner(
    {
      role: 'reviewer',
      tools: REVIEWER_TOOLS,
      agentDef: REVIEWER_AGENT,
      buildTask: () => '',
      endpoints: { endpoint: 'loop-reviewer', purpose: 'reviewer-loop' },
      progressTitle: 'code review',
      gateTaskDesc: 'code review',
    },
    { sovereigntyMw: getLoopSovereigntyMw(), progressMw: getLoopProgressMw(), mandateGate: getLoopMandateGateMw() },
  );
  return {
    runEngineer: (task: string, feedback: string) =>
      engineerRunner([
        '# LOOP 任务',
        task,
        '',
        '# 执行纪律',
        '1. 先读再改：修改前先 Read 目标文件',
        '2. 最小变更：只触碰任务要求的内容',
        '3. 验证再继续：完成后确认 build 通过',
        ...(feedback ? ['', '# 上一轮反馈（audit/review 未通过原因，只修复标记的问题）', feedback.slice(0, 2000)] : []),
      ].join('\n')),
    runAudit: defaultRunAudit,
    runReviewer: (artifacts: LoopArtifacts) =>
      reviewerRunner([
        '# 审查任务',
        '审查以下 Engineer 的产出：',
        '',
        '```',
        artifacts.engineerOutput.slice(0, 4000),
````

</details>

**依据 7 · 源码核查**：[engine/orchestrator/src/loop/agent-runner.ts:80-133](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/loop/agent-runner.ts#L80-L133)

模型、工具、invoke和降级。

<details>
<summary>查看原文（54行）</summary>

```text
    const nodeStartedAt = Date.now();
    progressMw.nodeStart(spec.role, spec.progressTitle.slice(0, 120));

    try {
      const resolved = await resolveLLMModelFor(spec.role);
      if (!resolved || !resolved.model) throw new Error('SOFAGENT_LLM 未设置，无法确定模型 provider');

      // v1.3.6 交付⑤：ExecutionBackend——resolveAgentFactory（LangGraph 直连优先）
      const { resolveAgentFactory } = await import('../agent-factory.js');
      const agentFactory = await resolveAgentFactory();
      if (!agentFactory.factory) throw new Error('agent 工厂不可用（LangGraph 与 DSH 均未就绪）');
      const constrainedPrompt = buildConstrainedSystemPrompt(process.cwd());
      const systemPrompt = `${constrainedPrompt}\n\n${spec.agentDef.systemPrompt}${extraSummary ? `\n\n${extraSummary}` : ''}`;
      // ToolGate 事前拦截（三段接线：create → wrap → convert）
      const gate = createToolGate({ agentName: spec.role, taskDesc: spec.gateTaskDesc.slice(0, 500) });
      // v1.5.2 章七：事前授权补环——注入 mandate gate（默认关；未注入时逐字一致）
      const gatedTools = wrapToolsWithGate(spec.tools, gate, undefined, deps.mandateGate);
      const langGraphTools = convertToLangGraphTools(gatedTools);
      const agent = (agentFactory.factory as unknown as (params: {
        llm: unknown;
        tools: unknown[];
        prompt: string;
      }) => { invoke: (input: unknown, config?: { recursionLimit?: number }) => Promise<unknown> })({
        llm: resolved.model,
        tools: langGraphTools,
        prompt: systemPrompt,
      });
      // 心跳（3s 节流）
      progressMw.heartbeat(spec.role);
      // 主权包裹（routeSummary 由角色 extraContext 或空串占位——路由评估在角色侧已做）
      const sensitivity = 'internal'; // 骨架缺省（角色侧 routeAndLog 有更细评估时经 extraContext 携带）
      const result = await sovereigntyMw.wrapModelCall(
        {
          provider: process.env.SOFAGENT_LLM?.split(':')[0] ?? 'unknown',
          model: process.env.SOFAGENT_LLM?.split(':')[1] ?? 'unknown',
          endpoint: spec.endpoints.endpoint,
          purpose: spec.endpoints.purpose,
        },
        () => agent.invoke(
          { messages: [{ role: 'user', content: task }] },
          { recursionLimit: resolveMaxTurns(spec.role) * 2 },
        ),
        { agentRole: spec.role, userIntent: task.slice(0, 200), sensitivity },
      );
      const output = extractAgentText(result);
      progressMw.nodeEnd(spec.role, { durationMs: Date.now() - nodeStartedAt, success: true });
      return output || '[降级运行] createReactAgent 未返回内容，已回退';
    } catch (err) {
      console.warn(`[sofagent] ${spec.role} createReactAgent 失败，降级到 spawnSubAgent:`, err instanceof Error ? err.message : String(err));
      progressMw.nodeEnd(spec.role, { durationMs: Date.now() - nodeStartedAt, success: false });
      const fallback = await spawnSubAgent(spec.agentDef, task);
      return `[降级运行] ${fallback}`;
    }
  };
```

</details>

**依据 8 · 源码核查**：[engine/orchestrator/src/launcher.ts:338-366](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/launcher.ts#L338-L366)

fallback可能只生成手工prompt。

<details>
<summary>查看原文（29行）</summary>

````text
    `名称: ${agent.name}`,
    `类型: ${agent.type}`,
    `模式: ${effectiveMode}`,
    systemPrompt ? `\n${systemPrompt}` : '',
    '# 指令',
    '请使用可用工具完成上述任务，完成后输出结果摘要。',
  ].filter(Boolean).join('\n');

  try {
    // 尝试通过 compose 编排执行（createReactAgent 内部分发到对应 agent）
    const { composeWithReactAgent } = await import('./composer');
    // composeTask 自带 agent 名称信息
    const result = await composeWithReactAgent(prompt);
    return result ?? `Agent "${agent.name}" 已接收任务，但编排模块未返回结果。`;
  } catch {
    // 编排模块不可用时返回提示
    return [
      `⚠️ sofagent 提示：编排模块未安装，Agent "${agent.name}" 的 prompt 已生成，可手动执行：`,
      '',
      '```yaml',
      `agent: ${agent.name}`,
      `type: ${agent.type}`,
      `task: ${task}`,
      `tools: [${agent.tools.join(', ')}]`,
      '```',
      '',
      agent.systemPrompt ? `\n${agent.systemPrompt}\n` : '',
    ].join('\n');
  }
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 审计、确认与 checkpoint 能保证什么，哪些失败仍可能流转？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能把规则通过、流程 completed、可信交付三者等同。quick 无日志且以 quick-audit 代替真实任务，完整审计要另给输入；空 diff 的消息规则模块加载异常仅告警后保留空态返回。主规则成功也只说明已覆盖输入满足规则，不证明需求完成、历史密钥安全或未扫描内容安全。

loop 默认开启降级链：audit FAIL 先重试、再缩小任务，达到 L2 时记录低可信并进入 checker/后续审查，而不是一律 blocked。同步确认在未开自动环境时等 stdin；SOFAGENT_LOOP_AUTO=1 则按 reviewer 文本 IS_PASS: YES 自动确认，无可解析标记默认驳回。异步 HITL 是文件请求/响应，不等于每次运行都有人在场。因此应把自动确认、低可信状态和人工授权分别记录，不能仅看节点名 human_confirm。

checkpoint 在节点执行前后写状态，before 恢复会重跑本节点，after 按路由进入后继。这恢复的是图状态，不是外部命令、网络请求和文件副作用的恰好一次提交；进程在副作用之后、after checkpoint 之前退出仍有重做窗口。daemon 恢复入口只尝试最近一个 pending，异常记录 skipped 后继续启动，不能承诺所有未完成任务都自动恢复。

留证源码确有 HMAC 签名链和验证，但共享内核在末行损坏时以 prevHash=unknown 告警续写，无密钥则不附 HMAC；文档也明确同用户进程可读密钥重算整链。它提高诊断可见性，不是抵御同身份恶意 Agent 的独立信任根。配置、hook、密钥和最终 CI 身份必须放在相应信任边界；根 README 已承认单机单用户、多租户写隔离未落地。

另一个具体兼容边界是 Agent runner 将工厂返回值直接当带 invoke 的对象；工厂解析器的 DSH 分支却显式返回 Promise.resolve。该分支在此调用点会落入异常/降级路径，源码不支持声称 DSH 适配与 LangGraph 直连等效。未执行该分支，不把它扩展成所有 DSH 插件均失效。

#### 证据与依据

**依据 1 · 源码核查**：[engine/audit/src/cli-quick.ts:767-780](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/audit/src/cli-quick.ts#L767-L780)

空diff消息检查失败告警放行。

<details>
<summary>查看原文（14行）</summary>

```text
            console.log(`   ${hit}`);
          }
          // A9（注入，critical）→ exit 2（违规）；仅 A19（msg 质量，warning）→ exit 1
          // （对齐退出码语义表：0 全过 / 1 警告 / 2 违规——与主链路 reporter 同口径）。
          return a9.status === 'FAIL' ? 2 : 1;
        }
        return null;
      } catch (err) {
        console.warn(`⚠️ [sofagent] 消息面检查未能执行（规则模块加载异常）：${(err as Error).message}`);
        return null;
      }
    };

    const hasBaseline = commitSha !== null && hasParentCommit();
```

</details>

**依据 2 · 源码核查**：[engine/orchestrator/src/loop/graph.ts:215-233](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/loop/graph.ts#L215-L233)

实际审计后路由。

<details>
<summary>查看原文（19行）</summary>

```text
export function routeAfterAudit(
  state: LoopGraphState
): 'engineer' | 'checker' | 'reviewer' | 'human_confirm' | typeof END {
  if (state.finalStatus === 'blocked') return END;
  if (state.auditResult === 'FAIL') {
    // 超限人工确认：重试与降级通道都已耗尽
    if (state.retryCount >= DEFAULT_MAX_RETRIES && state.degradationLevel >= 2) {
      return 'human_confirm';
    }
    // L2 低可信：标记后继续流转 checker→reviewer，不再回 engineer 烧重试
    if (state.degradationLevel >= 2) {
      return 'checker';
    }
    return 'engineer';
  }
  // PASS / WARN → checker（v1.2.4 P2b：先过 checker 质量门再进 reviewer）
  return 'checker';
}

```

</details>

**依据 3 · 源码核查**：[engine/orchestrator/src/loop/graph.ts:452-465](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/loop/graph.ts#L452-L465)

默认开启降级链。

<details>
<summary>查看原文（14行）</summary>

```text
  const checkpointer =
    options.deps?.checkpointer ?? new FileCheckpointer(resolveCheckpointDir(options.checkpointDir));
  const merged: LoopGraphDeps = {
    ...defaultDeps(checkpointer, options.silent ?? false),
    ...options.deps,
    checkpointer,
  };

  // v1.2.2 P3b：CLI --data-dir 显式覆盖优先于 env 解析（defaultDeps 注入的值）
  if (options.dataDir) merged.dataDir = options.dataDir;
  // v1.2.2 P4：runLoopGraph 默认开启降级链（测试可显式传 false 关闭）
  merged.degradationChainEnabled = options.deps?.degradationChainEnabled ?? true;
  return merged;
}
```

</details>

**依据 4 · 源码核查**：[engine/orchestrator/src/loop/nodes.ts:188-251](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/loop/nodes.ts#L188-L251)

FAIL降级到低可信与重试状态。

<details>
<summary>查看原文（64行）</summary>

```text
    const outcome = await deps.runAudit(state.artifacts);
    deps.log(`🛡️ audit 判定: ${outcome.verdict}`);

    // v1.1.4：WARN 标注透传——不阻断流转，但标记到 reviewer 输入
    let auditReport = outcome.verdict === 'WARN'
      ? `[审计告警] ${outcome.report}`
      : outcome.report;

    // P4 降级链：FAIL 时按当前 degradationLevel 推进 0→1→2 并注入降级提示
    let degradationLevel = state.degradationLevel;
    if (outcome.verdict === 'FAIL' && deps.degradationChainEnabled) {
      if (degradationLevel === 0 && state.retryCount > 0) {
        // 第 2 次 FAIL（已 retry 过一次仍 FAIL）→ L1 降级任务范围
        degradationLevel = 1;
        auditReport = `[降级 L1] 先做最小可行版本——只实现核心路径，砍掉边缘情况与优化项。\n${auditReport}`;
        deps.log('🔻 audit FAIL · 降级 L1：缩小任务范围（最小可行版本）');
      } else if (degradationLevel === 1) {
        // 第 3 次 FAIL（L1 降级后仍 FAIL）→ L2 低可信，不再烧 retryCount
        degradationLevel = 2;
        auditReport = `[降级 L2] 低可信模式——本产出未经审计背书，请人工重点复核。\n${auditReport}`;
        deps.log('🔻 audit FAIL · 降级 L2：标记低可信，继续流转（不 blocked）');
      }
    }

    // v1.2.3：audit 完成后写 graph-state（判定结果回写 Dashboard 控制图）
    const dashDir = deps.dashboardDir ?? deps.dataDir;
    if (dashDir) {
      writeGraphState(dashDir, {
        activeNode: 'audit',
        retryCount: state.retryCount,
        degradationLevel,
        subtasks: state.artifacts.subtasks,
        auditResult: outcome.verdict,
      });
    }

    const base: Record<string, unknown> = {
      currentNode: 'audit',
      auditResult: outcome.verdict,
      degradationLevel,
      artifacts: {
        auditReport,
        auditReports: [...state.artifacts.auditReports, auditReport],
      },
    };

    if (outcome.verdict !== 'FAIL') {
      return base; // PASS/WARN → 继续流转 reviewer
    }

    // P4：L2 低可信——不再烧 retryCount，路由权交给 routeAfterAudit（→ reviewer）
    if (deps.degradationChainEnabled && degradationLevel >= 2) {
      return base;
    }

    if (state.retryCount < deps.maxRetries) {
      deps.log(`🔄 audit FAIL · 回 engineer 重试（${state.retryCount + 1}/${deps.maxRetries}）`);
      return { ...base, retryCount: state.retryCount + 1 };
    }

    // 重试已达上限仍 FAIL（且未进 L2）→ blocked 终态
    deps.log(`⛔ audit FAIL 且重试已达上限（${deps.maxRetries}）→ blocked`);
    const blockedState: LoopGraphState = { ...state, ...base, finalStatus: 'blocked' } as LoopGraphState;
    await deps.recordBlocked(blockedState);
```

</details>

**依据 5 · 源码核查**：[engine/orchestrator/src/loop/deps-defaults.ts:157-193](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/loop/deps-defaults.ts#L157-L193)

自动确认按文本判定。

<details>
<summary>查看原文（37行）</summary>

```text
 * 从 reviewer 审查报告中提取 IS_PASS 判定。
 * reviewer 被要求在报告中输出 "IS_PASS: YES" 或 "IS_PASS: NO"。
 */
export function parseReviewerPass(reviewReport: string): boolean | null {
  const match = reviewReport.match(/\bIS_PASS\s*:\s*(YES|NO)\b/i);
  if (!match) return null;
  return match[1]!.toUpperCase() === 'YES';
}

/**
 * 自动确认——SOFAGENT_LOOP_AUTO=1 时根据 reviewer 的 IS_PASS 自动判定。
 * IS_PASS: YES → y（通过）
 * IS_PASS: NO  → n（驳回回 engineer）
 * 无法解析      → n（保守默认驳回）
 */
function autoConfirmHuman(reviewReport: string): HumanDecision {
  const isPass = parseReviewerPass(reviewReport);
  if (isPass === true) return 'y';
  if (isPass === false) return 'n';
  // 无法解析 IS_PASS——保守默认驳回
  console.log('[sofagent] 自动模式：无法从 review 报告中解析 IS_PASS，默认驳回');
  return 'n';
}

/**
 * 默认 HITL 实现。
 * SOFAGENT_LOOP_AUTO=1 时：自动根据 reviewer 的 IS_PASS 判定（不等待人工）。
 * 未设时：stdin readline 等待人工 y/n（不限时）。
 */
function defaultConfirmHuman(reviewReport: string): Promise<HumanDecision> {
  // v1.1.4：SOFAGENT_LOOP_AUTO=1 时自动判定，不走 stdin readline（旧名 LOOP_AUTO 兼容读取）
  if (isLoopAutoEnabled()) {
    const autoDecision = autoConfirmHuman(reviewReport);
    console.log(`\n🤖 自动模式判定: ${autoDecision === 'y' ? '✅ 通过 (IS_PASS: YES)' : '🔄 驳回 (IS_PASS: NO)'}`);
    return Promise.resolve(autoDecision);
  }

```

</details>

**依据 6 · 源码核查**：[engine/orchestrator/src/loop/nodes.ts:290-335](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/loop/nodes.ts#L290-L335)

异步挂起和同步确认。

<details>
<summary>查看原文（46行）</summary>

```text
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (state: LoopGraphState): Promise<any> => {
    // ── 异步模式：存储驱动挂起，不阻塞等待 stdin ──
    const dataDir = deps.dataDir;
    if (dataDir && shouldUseAsyncHITL(dataDir)) {
      writeHITLRequest(dataDir, {
        checkpointId: state.checkpointId,
        createdAt: new Date().toISOString(),
        task: state.artifacts.task,
        reviewReport: state.artifacts.reviewReport,
        auditResult: state.auditResult ?? '',
        retryCount: state.retryCount,
        options: [...HITL_OPTIONS],
      });
      deps.log(
        `⏸️ HITL 异步挂起 · checkpointId=${state.checkpointId}\n` +
          `   等待外部信号：Dashboard POST / daemon 轮询 /\n` +
          `   CLI: sofagent-orchestrator loop --resolve ${state.checkpointId} --decision approve|reject`
      );
      return {
        currentNode: 'human_confirm',
        finalStatus: 'awaiting_human',
      };
    }

    // ── CLI 同步降级模式：readline 阻塞等待（与 v1.2.1 一致）──
    const isAuto = isLoopAutoEnabled();
    deps.log(isAuto ? '🤖 自动审核判定中...' : '🙋 等待人工确认（不限时）...');
    const decision = await deps.confirmHuman(state.artifacts.reviewReport);

    if (decision === 'y') {
      deps.log('✅ 人工确认通过');
      return {
        currentNode: 'human_confirm',
        finalStatus: 'completed',
        artifacts: { humanFeedback: 'approved' },
      };
    }

    if (decision === 'abort') {
      deps.log('⏸️ 确认中断（stdin 关闭）——checkpoint 已保存，可 loop --resume 恢复');
      return {
        currentNode: 'human_confirm',
        finalStatus: 'aborted',
        artifacts: { humanFeedback: 'aborted' },
      };
```

</details>

**依据 7 · 源码核查**：[engine/orchestrator/src/loop/graph.ts:355-375](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/loop/graph.ts#L355-L375)

节点前后checkpoint。

<details>
<summary>查看原文（21行）</summary>

```text
/**
 * 节点包装：执行前后各 snapshot 一次 checkpoint（交付二核心）。
 * phase='before' 记录进入节点时的状态，phase='after' 记录节点产出
 * 合并后的状态——恢复时 before 重跑本节点、after 跳到下一节点。
 */
function withCheckpoint<S extends LoopGraphState>(
  node: LoopNodeName,
  checkpointer: FileCheckpointer,
  fn: (state: S) => Promise<Partial<LoopGraphState>>
) {
  return async (state: S) => {
    saveCheckpoint(checkpointer, state, node, 'before');
    const update = await fn(state);
    const merged: LoopGraphState = {
      ...state,
      ...update,
      artifacts: { ...state.artifacts, ...(update.artifacts ?? {}) },
    } as LoopGraphState;
    saveCheckpoint(checkpointer, merged, node, 'after');
    return update;
  };
```

</details>

**依据 8 · 源码核查**：[engine/orchestrator/src/loop/graph.ts:522-550](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/loop/graph.ts#L522-L550)

before恢复重跑。

<details>
<summary>查看原文（29行）</summary>

```text
 * 根据 checkpoint 计算恢复入口节点。
 *
 * - phase='before'：节点未执行完 → 从该节点重跑
 * - phase='after'：节点已执行完 → 按与图一致的路由规则算下一节点；
 *   路由到 END 说明流程已收尾 → 返回 null（无需恢复）
 */
export function resolveResumeNode(record: CheckpointRecord): LoopNodeName | null {
  const node = record.node as LoopNodeName;
  if (record.phase === 'before') return node;

  switch (node) {
    case 'plan':
      return 'engineer';
    case 'engineer':
      return 'audit';
    case 'audit': {
      const next = routeAfterAudit(restoreState(record));
      return next === END ? null : next;
    }
    case 'checker':
      return 'reviewer';
    case 'reviewer':
      return 'human_confirm';
    case 'human_confirm': {
      const next = routeAfterHuman(restoreState(record));
      return next === END ? null : next;
    }
    case 'goal_eval': {
      const next = routeAfterGoalEval(restoreState(record));
```

</details>

**依据 9 · 源码核查**：[engine/orchestrator/src/durable/resume.ts:139-174](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/durable/resume.ts#L139-L174)

只恢复最近pending且失败不阻daemon。

<details>
<summary>查看原文（36行）</summary>

```text
    const resumeFn = options.resumeFn ?? defaultResumeFn;
    try {
      const result = await resumeFn({
        checkpointDir,
        ...(options.dataDir ? { dataDir: options.dataDir } : {}),
        silent: options.silent ?? true,
      });
      if (result) {
        resumed.push(latest.record.checkpointId);
        results.push({ checkpointId: latest.record.checkpointId, finalStatus: result.finalStatus });
        log(`♻️ resume: ${latest.record.checkpointId} 续跑完成 → ${result.finalStatus}`);
      } else {
        skipped.push(latest.record.checkpointId);
        log(`ℹ️ resume: ${latest.record.checkpointId} 无可恢复路径（已收尾）`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      skipped.push(latest.record.checkpointId);
      log(`⚠️ resume: ${latest.record.checkpointId} 恢复失败（不阻断 daemon 启动）：${msg}`);
    }
  }

  return {
    scanned: mgr.listFiles().length,
    pending,
    resumed: resumed.length,
    skipped,
    results,
    cleaned: cleaned.length,
  };
}

/** 默认恢复函数——loop/graph.ts 的 resumeLoopGraph（从最近 checkpoint 续跑） */
const defaultResumeFn = async (options: LoopGraphOptions): Promise<LoopGraphResult | null> => {
  return resumeLoopGraph(options);
};
```

</details>

**依据 10 · 源码核查**：[engine/audit/src/chain-kernel.ts:273-318](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/audit/src/chain-kernel.ts#L273-L318)

坏链续写及有密钥才HMAC。

<details>
<summary>查看原文（46行）</summary>

```text

  // ── 1. prevHash（读末行——v1.5.2 finding-25：倒序按块读，不再全量 readFileSync）──
  let prevHash = 'genesis';
  if (existsSync(filePath)) {
    try {
      const lastLine = readLastCompleteLine(filePath);
      if (lastLine !== undefined) {
        const lastEntry = JSON.parse(lastLine) as Record<string, unknown>;
        prevHash = computePrevHash(lastEntry, fingerprint);
      }
    } catch {
      // 末行解析失败——无法建立链，保守置 'unknown'（与 appendHistory 同语义）。
      // v1.4.9 审（F05）：不再静默——验侧（no-prevhash 分支）会把该链段黄化，但用户
      // 需要在写入时就被告知链完整性从哪里开始存疑。仅加警告，不改变写入行为。
      prevHash = 'unknown';
      console.error('[sofagent] ⚠️ 审计链末行损坏，新条目 prevHash 已置 unknown——该链段将无法复验，建议运行 sofagent doctor 检查');
    }
  }

  // ── 2-3. 先脱敏再签名（脱敏已在调用方完成）+ 链字段装配 ──
  const base: Record<string, unknown> = {
    ...recordAsDict,
    prevHash,
    hashVersion: 2,
    envFingerprint: fingerprint,
    hmacAlgo: key ? 'stable' : undefined,
  };

  // ── 4. 签名输入排除链字段 + HMAC（slice(0,32)）──
  const hmacSig = key ? computeHmacSig(base, key, fingerprint) : undefined;

  const finalEntry = { ...base, hmacSig } as T & ChainFields;

  // ── 5. 原子追加 + 收紧权限 0o600 ──
  try {
    atomicAppendSync(filePath, JSON.stringify(finalEntry));
  } catch (err) {
    throw makeWriteError(`atomicAppendSync 失败 ${filePath}`, err);
  }
  try {
    chmodSync(filePath, 0o600);
  } catch (err) {
    // 权限设置失败不阻断写入（与 appendHistory 同语义，仅告警）
    console.error(`${logLabel} 审计文件权限设置失败: ${err instanceof Error ? err.message : String(err)}`);
  }

```

</details>

**依据 11 · 源码核查**：[docs/LIMITATIONS.md:355-370](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/docs/LIMITATIONS.md#L355-L370)

作者同用户信任边界。

<details>
<summary>查看原文（16行）</summary>

```text
> 🧯 **企业 CI 兜底结论**：本文件三处分散描述同一主题（`--no-verify` 绕过前两层、hook 被删/`core.hooksPath` 迁移后静默失效、config 被篡改），合并一句话——**本地 hook（pre-commit/commit-msg/post-commit）只是第一道门，凡不能被本地环境绕过的防线必须在 CI 重跑一次**：CI 以独立身份 checkout + `sofagent audit --diff HEAD~1..HEAD --ci`（exit 非零即 block merge）。
> 上方的 GitHub Actions YAML 即完整可抄模板；仓库自托管示例见 `.github/workflows/sofagent-audit.yml`，安全 SSOT 见 [SECURITY.md](../SECURITY.md)。

> **审计日志防篡改边界**：`history.jsonl` 完整性靠 hash chain（`audit-history.ts`），Agent 篡改后可重算整链——仅**事后可追溯，非强防篡改**。
>
> v1.1.8 起支持 HMAC-SHA256 签名（`~/.sofagent-key`，600）——有密钥时强校验，但只防**跨 OS 用户**；**同用户进程仍可读密钥重算整链**，对「Agent 本体」非强防篡改。无密钥时降级 SHA-256 hash chain（**弱校验**——重算即可把 FAIL 抹成 PASS）。v1.5.5 起写入侧默认生成密钥（0600 落盘，开箱即签名链），弱校验态只剩「密钥丢失且历史已有签名」与「legacy 未签名历史」两种；企业 SOP 应强制备份密钥 + 周期体检。
>
> **密钥生命周期边界**：① 弱密钥（<16 字节/低熵/常见弱模式）**拒签**（fail-closed）；② 泄露后有 `--revoke-key`（确认交互 → overwrite-then-delete → KEY_REVOKED 自证销毁时刻）；③ **轮换后旧链不可复验**仍待解（按「历史不可复验（黄）」处理，排期见 ROADMAP）。
>
> `--doctor`（v1.2.0 起）调 `checkHistoryChainDetailed()` 校验链；v1.4.5 起补**链头锚点**（`history-chain-head`，0600 原子写：总条数 + 末条哈希），据以检出**尾部截断**（砍尾后链自洽的逃逸路径）与锚位重写（判 tampered）；锚点不可读判 unverifiable（黄），无锚点（旧数据）跳过校验。
>
> **诚实边界**：能同时重写 `history.jsonl` 与锚点的攻击者仍可伪造——锚点是**证据强化**而非密码学保证（创世条目 HMAC 校验已对齐同款环境指纹比对）。当前仍依赖「Agent 自觉 + 定期 `--doctor`」的信任模型。

### 🔒 数据存储安全

> ℹ️ **审计历史全局共享是设计决策**：`history.jsonl` / `decision-log.jsonl` 写全局 `~/.sofagent/data/audit/`，不做项目级隔离（**有意为之**：① HMAC 签名链完整性要求全量连续历史，`--verify-chain` 需完整链；② 跨仓库查询是运维刚需）。
```

</details>

**依据 12 · 源码核查**：[engine/orchestrator/src/loop/agent-runner.ts:93-132](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/loop/agent-runner.ts#L93-L132)

工厂调用未await及catch。

<details>
<summary>查看原文（40行）</summary>

```text
      // ToolGate 事前拦截（三段接线：create → wrap → convert）
      const gate = createToolGate({ agentName: spec.role, taskDesc: spec.gateTaskDesc.slice(0, 500) });
      // v1.5.2 章七：事前授权补环——注入 mandate gate（默认关；未注入时逐字一致）
      const gatedTools = wrapToolsWithGate(spec.tools, gate, undefined, deps.mandateGate);
      const langGraphTools = convertToLangGraphTools(gatedTools);
      const agent = (agentFactory.factory as unknown as (params: {
        llm: unknown;
        tools: unknown[];
        prompt: string;
      }) => { invoke: (input: unknown, config?: { recursionLimit?: number }) => Promise<unknown> })({
        llm: resolved.model,
        tools: langGraphTools,
        prompt: systemPrompt,
      });
      // 心跳（3s 节流）
      progressMw.heartbeat(spec.role);
      // 主权包裹（routeSummary 由角色 extraContext 或空串占位——路由评估在角色侧已做）
      const sensitivity = 'internal'; // 骨架缺省（角色侧 routeAndLog 有更细评估时经 extraContext 携带）
      const result = await sovereigntyMw.wrapModelCall(
        {
          provider: process.env.SOFAGENT_LLM?.split(':')[0] ?? 'unknown',
          model: process.env.SOFAGENT_LLM?.split(':')[1] ?? 'unknown',
          endpoint: spec.endpoints.endpoint,
          purpose: spec.endpoints.purpose,
        },
        () => agent.invoke(
          { messages: [{ role: 'user', content: task }] },
          { recursionLimit: resolveMaxTurns(spec.role) * 2 },
        ),
        { agentRole: spec.role, userIntent: task.slice(0, 200), sensitivity },
      );
      const output = extractAgentText(result);
      progressMw.nodeEnd(spec.role, { durationMs: Date.now() - nodeStartedAt, success: true });
      return output || '[降级运行] createReactAgent 未返回内容，已回退';
    } catch (err) {
      console.warn(`[sofagent] ${spec.role} createReactAgent 失败，降级到 spawnSubAgent:`, err instanceof Error ? err.message : String(err));
      progressMw.nodeEnd(spec.role, { durationMs: Date.now() - nodeStartedAt, success: false });
      const fallback = await spawnSubAgent(spec.agentDef, task);
      return `[降级运行] ${fallback}`;
    }
```

</details>

**依据 13 · 源码核查**：[engine/orchestrator/src/agent-factory.ts:89-105](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/agent-factory.ts#L89-L105)

DSH工厂返回Promise。

<details>
<summary>查看原文（17行）</summary>

```text
    const backend = await createExecutionBackend();
    if (backend.name === 'dsh') {
      cached = {
        factory: (params) => Promise.resolve(createDshInvocableAgent(backend, params)),
        backend,
        source: 'dsh',
      };
      return cached;
    }
    // backend 是 langgraph（DSH 守卫拦截后 fallback）——但 LangGraph import
    // 已在上面失败才走到这里，说明 langgraph-backend 也不可用，返回 none
    await backend.close?.();
  } catch {
    /* DSH 也不可用——none */
  }

  cached = { factory: null, backend: null, source: 'none' };
```

</details>

#### 缺口

- 完整规则集、快照回滚、全部MCP/daemon/宿主适配未逐项审计。
  **影响**：根级可说明主链与边界，不可视为全产品安全认证。
  **进一步探讨**：按具体采用面补查规则输入、密钥管理和恢复清单，禁止用工具总数替代。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 比原 Agent 加脚本多提供什么，接入成本和经济结构改变在哪里？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

可归因增量是统一的本地约束/审计输入、CLI 路由、机器规则结果、流程反馈和可续跑状态，使多工具项目更容易保留一致的治理记录。LangGraph 提供工具循环和状态图底座，模型提供判断，Git/CI 提供版本与独立检查；这些不是 sofagent 自创能力。相对简单脚本，集成减少重复接线，但引入模型配置、多个包、日志密钥和状态恢复责任；单一平台且接受日志上云者，作者也承认平台自带治理可能更顺滑。

总包 Node>=18，固定依赖多个1.8.0实现包；根private包不可直接当发行物。npm总包没有dashboard静态资产，完整安装才提供该界面；默认不应把安装路径混为一谈。自治loop还需可用LangGraph运行时/模型provider凭据和可信执行工具，DSH后端另有Q02兼容缺口。完整挂载会涉及项目hook与用户数据，退出需要按采用的通道移除相应集成，不能把卸载npm包当清掉历史日志、项目规则和已执行修改。

首次成本是确定规则/任务范围、安装形态、模型端点和独立CI身份，再对已知正确/错误变更做校准；持续成本有模型工程/审查/重试、测试执行和日志存储，人工要复核低可信/跳过项、备份密钥和升级。成本quota只事前估算，不是厂商账单逐笔对账，无法以它推算已证实ROI。

经济创新需与可复用脚本/CI的基线比较，而不是仅与一次性人工审查比较。作者主张FDE进场交付文件后驻留治理继续执行，但本次已核audit/loop只证明规则消费、任务反馈和状态续跑；原Agent加规则脚本/CI也能复用常驻，未核到进场业务交付物被持续服务消费、责任独立交接或供给/计价/风险结构相对基线改变的实际机制。因此当前未识别已成立的经济结构增量，离场服务组织变化只保留为作者候选主张，不计已有创新。模型总费用与ROI是否改善仍未知，这是另一项效果问题，不是上述归因判断的依据。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:79-101](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/README.md#L79-L101)

受众、平台非开箱边界与基线。

<details>
<summary>查看原文（23行）</summary>

```text
**五分钟沙箱演示**（v1.5.1 已交付；沙箱隔离、真实文件零接触）：`npx -y -p sofagent sofagent audit demo`——一条命令跑完「沙箱构建 → 注入 → 故意违规 → 审计拦截 → 快照回滚 → HMAC 举证导出」五幕链路（`--speed fast` 为 60 秒版；产物落 `$SOFAGENT_DATA/demo`，不触碰被审仓库）。（demo 经 npm 通道提供；install.sh 安装态 CLI 暂无 demo 子命令）

> 版本说明：v1.8.0 已发版（2026-11-05）；npm 可安装最新版 `@sofagent/audit@1.8.0`。

## 该不该装？

| 如果你是… | 建议 |
|---|---|
| **给现有 Agent 加纪律**——已有 DSH / OpenClaw / WorkBuddy，想让 AI 干活时守规矩、留痕、出事能回溯 | ✅ **现在装**。核心价值就是约束层（注入 · 审计 · 回溯 · 沉淀 · 进化），装完即用 |
| **一人公司 / 小企业想落地 AI**——没有专职工程师，需要一个"不离职的 FDE"帮你梳理工作流、部署 AI 节点 | ✅ **现在装**。FDE Harness 层就是干这个的——进场把判断写成文件，离场按文件执行与审计，全链路 |
| **要开箱即用的企业级 Agent 平台**——期待完整商业产品（多租户、权限管理、计费、SLA） | ⏸️ **暂缓**。sofagent 是 FDE Harness 层，不是平台产品——平台级能力不在本开源仓库范围内。有集成能力的团队仍可把约束层接入自有平台，作为其中的治理模块；纯开箱需求建议另选平台产品 |
| **纯研究 / 想看看约束层怎么设计**——读代码、学架构、借鉴方法论 | ✅ **现在装**。文档齐全（[HANDBOOK](./docs/HANDBOOK.md) / [ARCHITECTURE](./docs/ARCHITECTURE.md) / [PHILOSOPHY](./docs/PHILOSOPHY.md)），MIT 协议 |

**和 gitleaks / pre-commit 这类工具什么关系？**（互补不互替）

| | gitleaks 等扫描器 | pre-commit 等钩子 | sofagent |
|---|---|---|---|
| 定位 | 密钥全量历史扫描 | 通用提交钩子框架 | Agent 行为审计约束层 |
| 证据面 | 仓库文本模式 | 自定义脚本 | git diff 硬证据 + Agent 日志 + 决策留痕 |
| 覆盖维度 | 密钥泄漏 | 任意（自己写） | 28 条规则（默认 17 · 完整 28 见下文）：密钥/越界/注入/权限/后门/数据产品 |
| 部署成本 | 低——单二进制，零运行时依赖 | 低——随语言生态装一个 CLI | 中——企业设备需一次 `install.sh` 装约束层（也可先用 npx 零配置试用） |
| 维护负担 | 低——规则随上游更新 | 中——自定义脚本需自己维护 | 中——规则与 hook 随本仓升级，但每版需重装 hook 并对齐配置 |
| 建议 | 强密钥合规必配 | 已有体系可保留 | 与前两者并用，专注 Agent 治理维度 |
```

</details>

**依据 2 · 源码核查**：[README.md:165-178](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/README.md#L165-L178)

不同宿主约束强度不同。

<details>
<summary>查看原文（14行）</summary>

```text
横跨你已有的 Agent、纵贯模型层，不替代模型，只补可靠执行——**FDE Harness 层平台无关**（插件 / Skill / MCP / CLI / Dashboard 五种形态按宿主能力分发），方法论跟着业务走，不跟着平台走：

| 档位 | 平台 | 约束注入 | 挂载方式 |
|---|---|---|---|
| **深度结合** | DeepSeek Harness | ✅ **逐工具调用可拦** | 7 款原子 `cordis-plugin-sofagent-*` 挂进运行时（另有 1 款聚合可选）——`tools/pre-execute` 等 7 个生命周期事件（词汇表见 `engine/dsh-plugins/SEAMS.md`） |
| **完整挂载** | OpenClaw | ✅ **每会话注入一次** | Hook 注入四层约束 + 断路器 + 4 款 OpenClaw 插件 |
| **标准挂载** | Claude Code / Cursor | ⚠️ Skill 自觉加载 | Skill 目录 symlink + 平台规则文件 + 拦截配置（Claude Code 档 PreToolUse 覆盖 Bash/Write/Edit 调用级；Cursor 提交级） |
| **薄挂载** | WorkBuddy / Codex / Gemini CLI / Hermes | ⚠️ Skill 自觉加载 | Skill 目录 symlink（Codex 走 `AGENTS.md` 挂载点）+ git hook 审计 |

- **档位差的是注入强度，不是「有没有」**：DSH 逐工具调用可拦，OpenClaw 每会话注入一遍，其余靠 Agent 自觉。「支持某平台」= 约束资产可用，**≠ 强度相同**；迁移前看目标宿主档位，矩阵见 [加载链 HOOK](./engine/hooks/sofagent-load-chain/HOOK.md)
- **审计兜底平台无关**——`sofagent audit --install-hook` 走 git hook，任何档位每次 commit 都自动审计（默认启用 17 条；完整 28 条需在 `.sofagent/config.yml` 显式开启 `extendedRulesEnabled: true`），违规硬拦截。
  约束是建议性的，审计是强制性的（边界：默认非 fail-closed，`--no-verify` 可跳过前两层防线、post-commit 只留痕不阻断，详见 [LIMITATIONS §三](./docs/LIMITATIONS.md#三安全与信任模型局限)）

一条命令选定挂载档位：`bash install.sh --platform <平台名>`（全部平台与差异见 [HANDBOOK](./docs/HANDBOOK.md)）
```

</details>

**依据 3 · 源码核查**：[README.md:286-290](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/README.md#L286-L290)

npm不含dashboard资产。

```text
> | **终端版** | `sofagent dashboard --full` | 终端 ASCII 三栏（零前端依赖） | 开发者 / FDE 快速看 |
> | **Web 版** | `sofagent web`（install.sh 安装态可用）· 仓库态 `node tools/dashboard/serve-dashboard.mjs` | 浏览器可视化（localhost:3780） | 老板 / IT 可视化看 |
> | **macOS 双击** | 双击 `start-dashboard.command` | Web 版的 macOS 快捷方式（仅 macOS 双击入口） | macOS 用户 |
>
> ⚠️ **Dashboard 可得性边界**：三入口均**随 `install.sh` 安装态提供**；`npm i sofagent` 直装的包**不含 dashboard 静态资产**（`tools/dashboard/` 未随包分发）——npm 直装用户得到 CLI + MCP 能力面，**要 Dashboard 请走完整安装**（bootstrap.sh / install.sh）。
```

**依据 4 · 源码核查**：[README.md:303-315](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/README.md#L303-L315)

CLI分发和依赖树取舍。

<details>
<summary>查看原文（13行）</summary>

```text
> 📌 **单入口 CLI（v1.5.6 起）**——CLI 收敛为 **`sofagent <域> <动作>`**：`sofagent audit`（审计）· `sofagent train doctor`（训练）、`sofagent team formation`（阵型）· `sofagent daemon`（守护）… 全部域见 `sofagent help`。
>
> | 用法 | 命令 |
> |---|---|
> | 零安装试用 | `npx -y -p sofagent sofagent audit` |
> | 全局安装 | `npm i -g sofagent` → `sofagent audit` |
> | 完整安装（含 daemon / dashboard） | `bootstrap.sh` / `install.sh`（见上） |
>
> - **旧命令已退役**：12 个旧 bin 兼容期已满**移除**，统一走单入口。
> - ⚠️ **`npm i -g sofagent` 带来完整依赖树**（含 orchestrator/mcp/train 等能力包；传递依赖 602 包（`npm ls --all --parseable` · @1.5.8 时点 2026-10-10 实测；^1.7.0 约含 672——以当轮实测为准），5 个含原生模块——新版 npm 不执行未审阅 install script，其编译**静默跳过**）。
>   **只要审计 CLI**（接受完整依赖树取舍）：`npm i -g sofagent` 后用 `sofagent audit`；不想常驻依赖树则用 `npx -y -p sofagent sofagent audit` 临时形态。
> - **已下架的旧代理包**：npm 上的 `sofagent-audit`（裸名、无 scope）是旧代理包，**已于 2026-09-26 下架**——不要安装。

```

</details>

**依据 5 · 源码核查**：[README.md:129-146](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/README.md#L129-L146)

进场/驻留治理的服务交付主张。

<details>
<summary>查看原文（18行）</summary>

```text
> 边界：当前判定层概率输出尚未完成校准接线（判据阈值仍挂零样本基线），规则判定由确定性判定器兜底——判定层接管为未来态（见 [ARCHITECTURE](./docs/ARCHITECTURE.md)）。

**治理层 · harness**（离场 · 驻留判断——「harness 治理」，按交付物 7×24 执行，进化时写回）：

- 🏠 **离场后常驻**——FDE 能力留下巡检、审计、优化（daemon 巡检需安装时显式确认，默认不装；QUICK_MODE / 非交互安装自动跳过），commit 时触发审计，人离场治理不离开
- 🔍 **零配置审计**——`npx -y -p sofagent sofagent audit`，任何 git 仓库秒级审计最近一次 commit（5 万行 diff 6.1s，见 [HANDBOOK](./docs/HANDBOOK.md)）

- 🧱 **规则与安全面：28 条审计规则**——密钥泄漏、越界编辑、注入防御、权限红线，违规当场拦截；fail-fast（critical 命中后其余跳过）、默认非 fail-closed（配置可被篡改、hook 可经 `--no-verify` 跳过——绕过面见 [LIMITATIONS §三](./docs/LIMITATIONS.md#三安全与信任模型局限)）
- 🔧 **工具与能力面：104 个 MCP tool + 证据分档**——28 条规则中 22 条基于 git diff（本地生效、零 token）、4 条 hybrid（diff + Agent 日志）、1 条 filesystem 扫描、1 条走 decision-log（清单见 [SECURITY](./SECURITY.md#28-条审计规则完整清单文档级-ssot)）。其中 commons_invoke 为 dry-run 预检语义（返回能力元数据与调用计划，真实执行由 Agent runtime 注入 executor；见 LIMITATIONS）
- 🛡️ **自动快照回溯**——每次审计后自动存档，出事一键回到任意快照
- 🛡️ **AgentShield 五类配置面静态扫描**——`@public` SDK 能力（经 `createAgentShield` 调用），**不在 commit hook 链路上**，按需接入

## 什么是 FDE Harness

**FDE = Forward Deployed Engineer（前线部署工程师）**——把模型塞进企业真实业务里的人。sofagent 把该角色做成开源 FDE Harness 层，嵌在你的 Agent（DSH / OpenClaw / WorkBuddy）与模型层之间。完整工作流分两阶段，**中间的交接物把它们缝成一件事**：

- **进场 · 生成判断**：四步——**梳理工作流 → 构建双图谱 → 判定 AI 节点 → 部署**。双图谱 = 业务图谱（边界、数据流向，人读）+ 本体图谱（共享语义底座，AI 读）；每个 AI 节点的「做好标准（merge_criteria）· 谁拍板（approver）· 何时跑（trigger）」在此判定并冻结进交付物（workflow.yml + 本体 + skills）。
- **离场 · 驻留判断**：FDE 走，判断留下——审计在 commit 等变更事件时按冻结的标准自动触发（证据分档见「核心特性」首条）；daemon 7×24 巡检、快照可回滚、经验持续沉淀。人离场，治理不离开。
```

</details>

**依据 6 · 源码核查**：[engine/umbrella/package.json:38-56](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/umbrella/package.json#L38-L56)

运行版本与具体依赖。

<details>
<summary>查看原文（19行）</summary>

```text
    "node": ">=18"
  },
  "files": [
    "bin/",
    "README.md"
  ],
  "dependencies": {
    "@sofagent/ab-test": "1.8.0",
    "@sofagent/audit": "1.8.0",
    "@sofagent/core": "1.8.0",
    "@sofagent/daemon": "1.8.0",
    "@sofagent/eval": "1.8.0",
    "@sofagent/evolve": "1.8.0",
    "@sofagent/mcp": "1.8.0",
    "@sofagent/ontology": "1.8.0",
    "@sofagent/orchestrator": "1.8.0",
    "@sofagent/think": "1.8.0"
  }
}
```

</details>

**依据 7 · 源码核查**：[docs/LIMITATIONS.md:213-215](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/docs/LIMITATIONS.md#L213-L215)

单平台原生治理替代。

```text

若你**只用一家 Agent 平台**（OpenAI / Anthropic / 豆包）且**接受审计日志上云**——平台内置治理可能更顺滑（零安装零学习曲线）。sofagent 的核心价值在多供应商混用 + 本地留证场景：当你同时用 OpenAI + Anthropic + 国内模型，需要一份统一的、跨平台的、留在本地的审计证据时——平台内置方案做不到这一点。

```

**依据 8 · 源码核查**：[docs/LIMITATIONS.md:233-238](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/docs/LIMITATIONS.md#L233-L238)

成本估算与账单不同。

```text
### 🧭 成本 quota 是事前估算，不是精确账

`cost_query` 与 quota 门禁给出的是**事前估算 + 用量台账**（余量/已用/周期三字段），不是与云厂商账单逐笔对账的结果。token 计价口径变化、缓存命中、并发重试都会让估算与实际账单产生偏差。
缓解：WARN/HARD 双模式——WARN 只提示，HARD 才阻断；关键预算以厂商账单为准。

### 🎛️ 多 Agent 协作阵型库是内置六阵型
```

#### 缺口

- 跨Agent集成维护和人工离场后的独立治理效果未测。
  **影响**：不能承诺普遍更便宜或已改变客户采购/服务责任。
  **进一步探讨**：同项目比较现有Agent+CI与本地驻留治理，记录误放行、人工返工、模型/测试费用和每周维护工时。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 现在应从哪种用法开始，怎样验证更值得生产化的方向？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前观察，先从非敏感单仓库副本做audit-only对照，保留原CI和人工最终放行，明确当前所选diff与跳过规则；先不启自治loop、daemon、自动确认和全平台挂载。只有已知违规/正确样本与退出码、实际日志能对齐，再单独验证loop的重试/低可信/确认/重启矩阵。若规则对真实任务无输入、降级prompt被当完成、恢复重做副作用或维护超过人工审查，回到原Agent+CI，不扩大生产权限来掩盖缺口。

可生产化的方向是给治理结果附能力和信任回执：本次审查了什么diff、缺哪些输入、何种身份可改配置/密钥、是否低可信/自动确认，以及恢复前后执行了哪些副作用。依据是现有规则输出、状态和签名分散存在，但单一completed不能承载这些不同保证。最小实验不造新执行引擎，只在audit与loop出口形成统一回执，并以错误范围、缺模块、坏链、L2继续、自动确认、节点副作用后崩溃六种故障比较误放行率、人工定位和重复操作。若现有CI回执已覆盖，或额外记录增加成本却不降低误判，就保留简单组合；要对抗同身份恶意Agent则先分离可信身份，不靠更长HMAC链。

#### 证据与依据

**依据 1 · 源码核查**：[engine/audit/src/cli-quick.ts:844-862](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/audit/src/cli-quick.ts#L844-L862)

可组合规则结果出口。

<details>
<summary>查看原文（19行）</summary>

```text
  const result = runRules({
    diffFiles,
    logEntries: [],
    task: 'quick-audit',
    silent: true,
    commitMsg,
    quickMode: true,
    diffRange,
  });

  // 7. 格式化输出（v1.3.5 #6: 传入 diffRange 供 range 模式标题感知）
  // v1.6.0 BUG-08：首提交补审场景标题已在 :731 打印（「审计首个 commit——首提交无父基线…」），
  //   此处若再打「审计最近一次 commit」即同屏双标题互相矛盾——无基线补审路径跳过通用标题。
  const isFirstCommitAudit = !hasParentCommit();
  const output = generateQuickOutput(result, isFirstCommitAudit ? null : commitSha, diffRange, { suppressTitle: isFirstCommitAudit });
  console.log(output);

  // 8. 返回退出码
  return result.exitCode;
```

</details>

**依据 2 · 源码核查**：[engine/orchestrator/src/loop/graph.ts:355-375](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/loop/graph.ts#L355-L375)

故障窗口。

<details>
<summary>查看原文（21行）</summary>

```text
/**
 * 节点包装：执行前后各 snapshot 一次 checkpoint（交付二核心）。
 * phase='before' 记录进入节点时的状态，phase='after' 记录节点产出
 * 合并后的状态——恢复时 before 重跑本节点、after 跳到下一节点。
 */
function withCheckpoint<S extends LoopGraphState>(
  node: LoopNodeName,
  checkpointer: FileCheckpointer,
  fn: (state: S) => Promise<Partial<LoopGraphState>>
) {
  return async (state: S) => {
    saveCheckpoint(checkpointer, state, node, 'before');
    const update = await fn(state);
    const merged: LoopGraphState = {
      ...state,
      ...update,
      artifacts: { ...state.artifacts, ...(update.artifacts ?? {}) },
    } as LoopGraphState;
    saveCheckpoint(checkpointer, merged, node, 'after');
    return update;
  };
```

</details>

**依据 3 · 源码核查**：[engine/orchestrator/src/loop/graph.ts:452-474](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/loop/graph.ts#L452-L474)

结果终态与默认降级。

<details>
<summary>查看原文（23行）</summary>

```text
  const checkpointer =
    options.deps?.checkpointer ?? new FileCheckpointer(resolveCheckpointDir(options.checkpointDir));
  const merged: LoopGraphDeps = {
    ...defaultDeps(checkpointer, options.silent ?? false),
    ...options.deps,
    checkpointer,
  };

  // v1.2.2 P3b：CLI --data-dir 显式覆盖优先于 env 解析（defaultDeps 注入的值）
  if (options.dataDir) merged.dataDir = options.dataDir;
  // v1.2.2 P4：runLoopGraph 默认开启降级链（测试可显式传 false 关闭）
  merged.degradationChainEnabled = options.deps?.degradationChainEnabled ?? true;
  return merged;
}

/** 把图输出收敛为 LoopGraphResult */
function toResult(finalState: LoopGraphState): LoopGraphResult {
  return {
    finalStatus: finalState.finalStatus === 'running' ? 'completed' : finalState.finalStatus,
    state: finalState,
    checkpointId: finalState.checkpointId,
    retryCount: finalState.retryCount,
  };
```

</details>

**依据 4 · 源码核查**：[engine/orchestrator/src/loop/deps-defaults.ts:157-193](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/loop/deps-defaults.ts#L157-L193)

自动确认差异。

<details>
<summary>查看原文（37行）</summary>

```text
 * 从 reviewer 审查报告中提取 IS_PASS 判定。
 * reviewer 被要求在报告中输出 "IS_PASS: YES" 或 "IS_PASS: NO"。
 */
export function parseReviewerPass(reviewReport: string): boolean | null {
  const match = reviewReport.match(/\bIS_PASS\s*:\s*(YES|NO)\b/i);
  if (!match) return null;
  return match[1]!.toUpperCase() === 'YES';
}

/**
 * 自动确认——SOFAGENT_LOOP_AUTO=1 时根据 reviewer 的 IS_PASS 自动判定。
 * IS_PASS: YES → y（通过）
 * IS_PASS: NO  → n（驳回回 engineer）
 * 无法解析      → n（保守默认驳回）
 */
function autoConfirmHuman(reviewReport: string): HumanDecision {
  const isPass = parseReviewerPass(reviewReport);
  if (isPass === true) return 'y';
  if (isPass === false) return 'n';
  // 无法解析 IS_PASS——保守默认驳回
  console.log('[sofagent] 自动模式：无法从 review 报告中解析 IS_PASS，默认驳回');
  return 'n';
}

/**
 * 默认 HITL 实现。
 * SOFAGENT_LOOP_AUTO=1 时：自动根据 reviewer 的 IS_PASS 判定（不等待人工）。
 * 未设时：stdin readline 等待人工 y/n（不限时）。
 */
function defaultConfirmHuman(reviewReport: string): Promise<HumanDecision> {
  // v1.1.4：SOFAGENT_LOOP_AUTO=1 时自动判定，不走 stdin readline（旧名 LOOP_AUTO 兼容读取）
  if (isLoopAutoEnabled()) {
    const autoDecision = autoConfirmHuman(reviewReport);
    console.log(`\n🤖 自动模式判定: ${autoDecision === 'y' ? '✅ 通过 (IS_PASS: YES)' : '🔄 驳回 (IS_PASS: NO)'}`);
    return Promise.resolve(autoDecision);
  }

```

</details>

**依据 5 · 源码核查**：[docs/LIMITATIONS.md:355-370](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/docs/LIMITATIONS.md#L355-L370)

独立身份与链信任边界。

<details>
<summary>查看原文（16行）</summary>

```text
> 🧯 **企业 CI 兜底结论**：本文件三处分散描述同一主题（`--no-verify` 绕过前两层、hook 被删/`core.hooksPath` 迁移后静默失效、config 被篡改），合并一句话——**本地 hook（pre-commit/commit-msg/post-commit）只是第一道门，凡不能被本地环境绕过的防线必须在 CI 重跑一次**：CI 以独立身份 checkout + `sofagent audit --diff HEAD~1..HEAD --ci`（exit 非零即 block merge）。
> 上方的 GitHub Actions YAML 即完整可抄模板；仓库自托管示例见 `.github/workflows/sofagent-audit.yml`，安全 SSOT 见 [SECURITY.md](../SECURITY.md)。

> **审计日志防篡改边界**：`history.jsonl` 完整性靠 hash chain（`audit-history.ts`），Agent 篡改后可重算整链——仅**事后可追溯，非强防篡改**。
>
> v1.1.8 起支持 HMAC-SHA256 签名（`~/.sofagent-key`，600）——有密钥时强校验，但只防**跨 OS 用户**；**同用户进程仍可读密钥重算整链**，对「Agent 本体」非强防篡改。无密钥时降级 SHA-256 hash chain（**弱校验**——重算即可把 FAIL 抹成 PASS）。v1.5.5 起写入侧默认生成密钥（0600 落盘，开箱即签名链），弱校验态只剩「密钥丢失且历史已有签名」与「legacy 未签名历史」两种；企业 SOP 应强制备份密钥 + 周期体检。
>
> **密钥生命周期边界**：① 弱密钥（<16 字节/低熵/常见弱模式）**拒签**（fail-closed）；② 泄露后有 `--revoke-key`（确认交互 → overwrite-then-delete → KEY_REVOKED 自证销毁时刻）；③ **轮换后旧链不可复验**仍待解（按「历史不可复验（黄）」处理，排期见 ROADMAP）。
>
> `--doctor`（v1.2.0 起）调 `checkHistoryChainDetailed()` 校验链；v1.4.5 起补**链头锚点**（`history-chain-head`，0600 原子写：总条数 + 末条哈希），据以检出**尾部截断**（砍尾后链自洽的逃逸路径）与锚位重写（判 tampered）；锚点不可读判 unverifiable（黄），无锚点（旧数据）跳过校验。
>
> **诚实边界**：能同时重写 `history.jsonl` 与锚点的攻击者仍可伪造——锚点是**证据强化**而非密码学保证（创世条目 HMAC 校验已对齐同款环境指纹比对）。当前仍依赖「Agent 自觉 + 定期 `--doctor`」的信任模型。

### 🔒 数据存储安全

> ℹ️ **审计历史全局共享是设计决策**：`history.jsonl` / `decision-log.jsonl` 写全局 `~/.sofagent/data/audit/`，不做项目级隔离（**有意为之**：① HMAC 签名链完整性要求全量连续历史，`--verify-chain` 需完整链；② 跨仓库查询是运维刚需）。
```

</details>

#### 缺口

- 统一回执及故障对照未实现/运行，需求频率未知。
  **影响**：是新方向而非插件已有贡献或生产承诺。
  **进一步探讨**：先让集成者复核一次真实失败的定位链，再按六故障与原CI做对照。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
