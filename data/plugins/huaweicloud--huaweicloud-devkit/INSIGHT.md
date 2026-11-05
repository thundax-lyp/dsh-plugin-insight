# HuaweiCloud DevKit

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[4ed0780](https://github.com/huaweicloud/huaweicloud-devkit/tree/4ed07801cf62248049b62d4fd71f7bf347d57452)

<!-- BEGIN META -->
[![GitHub ★ 71](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=71&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/huaweicloud/huaweicloud-devkit) [![npm 30d 8,774](https://img.shields.io/static/v1?label=npm+30d&message=8%2C774&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/huaweicloud-devkit) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/huaweicloud-devkit)
<!-- END META -->

> **功能**：给Agent分发华为云知识Skill、KooCLI和计划执行保护

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 统一知识分发、计划与脱敏输出，不新增云权限系统。

> **主要限制**：[Q03](#research-q03) [Q03](#research-q03) 布尔批准、unknown_read、自动网络重试与默认安装/遥测需分清。

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
  - [Q01 · 根工具包在DSH交付什么？](#detail-section-11)
  - [Q02 · 计划、批准和命令如何真正执行？](#detail-section-12)
  - [Q03 · 安全宣传需哪些反证和隐私边界？](#detail-section-13)
  - [Q04 · 配置、成本、卸载与资源回收怎么办？](#detail-section-14)
  - [Q05 · 如何证伪准确/安全增量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Agent用户要查询或管理华为云资源而不想手工拼CLI。

官方文档和人工KooCLI配独立审批。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 知识与安装 | 分发云Skill和多宿主MCP配置 | 不代表所有Skill/服务运行验收 |
| 计划与CLI执行 | 分类、token、脱敏结果 | 批准布尔靠调用方，unknown_read不是严格白名单 |
| 预检与维护 | 安装CLI、遥测和卸载支持 | 默认副作用需禁用/审清理范围 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22、DSH MCP-client | 必需 | 本地stdio服务 | failOnStartupError=false可不阻Host但工具不可用 |
| KooCLI7.3.12与平台工具 | CLI需要 | 真实云执行 | 启动缺失默认预安装，禁开关可阻 |
| 最小IAM/region/profile及独立审批 | 云任务 | 限制资源与费用 | MCP token不替代人类批准/云权限 |
| 共享Skill/配置备份与环境开关 | 采用前置 | 禁遥测/预装并安全卸载 | 前缀删除及全局配置需单独范围 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 明确--target dsh，禁预装/遥测重启MCP，备份共享skills | 仅无云写测试账号 |
| 查询/计划 | 读classification/原始资源与外部批准，设置maxRetries0处理写 | 超时查云状态不自动重放 |
| 退出 | 停MCP及预装进程、撤凭据核云任务，再按范围卸载 | 本地删除不回滚云资源 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | CLI/依赖下载与本地文件资源未知 | 配置目标、IAM、region和备份耗时未知 | 首次金额/耗时未知 |
| 持续 | 云资源与API费用、MCP/遥测资源未知 | 复核参数、批准和幂等耗时未知 | 云账单独立预算，默认有网络重试 |
| 恢复 | 共享skills/审批/凭据和云资源未知 | 核前缀清理、撤AK/STS与人工恢复耗时未知 | 卸载不止云费，恢复耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| CLI保护 | plan token/规则/脱敏真实接线 | 授权真实性和规则覆盖未运行 |
| 输出记录 | 结构结果及本地大输出可查 | 最终资源正确/费用收益未验 |
| 分发维护 | DSH复制/patch与卸载有代码 | 所有宿主兼容和无损清理未验证 |

> **思考**：[Q03](#research-q03) [Q03](#research-q03) 布尔批准、unknown_read、自动网络重试与默认安装/遥测需分清。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 统一知识分发、计划与脱敏输出，不新增云权限系统。

聚焦根DSH安装与MCP云CLI主链，未执行目标/云服务。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) [Q03](#research-q03) 布尔批准、unknown_read、自动网络重试与默认安装/遥测需分清。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) [Q04](#research-q04) 先单目标隔离只读、禁预装和遥测、最小IAM；写操作须独立批准/幂等。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的核根云工具包在DSH中的真实安装、命令审批、遥测与退出边界。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、bin/dsh-postinstall.cjs、plugins/huaweicloud-core/src/setup-cli.mjs、plugins/huaweicloud-core/src/tools.mjs、plugins/huaweicloud-core/src/hcloud-cli.mjs、plugins/huaweicloud-core/src/safety-policy.mjs、integrations/dsh/hook-plugin.mjs、plugins/huaweicloud-core/src/preflight.mjs、plugins/huaweicloud-core/src/telemetry/telemetry.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的核根云工具包在DSH中的真实安装、命令审批、遥测与退出边界。未执行目标代码或实际宿主验证。
- 下一步：使用隔离项目和最小权限，保审批/请求幂等ID、外部资源记录与本地差异

**分析版本**

- **仓库**：[huaweicloud/huaweicloud-devkit](https://github.com/huaweicloud/huaweicloud-devkit)
- **版本号**：1.1.12（[固定提交 4ed0780](https://github.com/huaweicloud/huaweicloud-devkit/tree/4ed07801cf62248049b62d4fd71f7bf347d57452)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) [Q05](#research-q05) 可检验参数正确与操作完成，但无本轮安全/费用收益。

使用隔离项目和最小权限，保审批/请求幂等ID、外部资源记录与本地差异

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 144 | 20721 | — | — | 153151 |
| .cjs | source | 2 | 88 | 70 | 6 | — |
| .mjs | source | 47 | 19177 | 16653 | 1151 | — |
| .js | source | 9 | 1950 | 1591 | 98 | — |
| .md | test | 7 | 725 | — | — | 9585 |
| .mjs | test | 48 | 14515 | 12612 | 701 | — |
| .mjs | example | 2 | 48 | 39 | 7 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/huaweicloud/huaweicloud-devkit/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核根云工具包在DSH中的真实安装、命令审批、遥测与退出边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根工具包在DSH交付什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

root是tool：多宿主安装CLI、云知识Skill和MCP工具服务的组合，package1.1.12固定KooCLI7.3.12，DSH cordis patch接stdio MCP并容许启动失败；不是华为云本身或单一DSH安全插件。npx install --target dsh复制Skill/src/safety并写MCP配置，npm DSH postinstall另会把Skill复制到共享DSH skills且改绝对MCP路径；两路径副作用不同。与手查云文档/敲CLI相比增量是可发现知识与结构化plan/run/脱敏输出，实际云权限仍来自账号IAM。此研究聚焦根包DSH安装和云CLI主链，不将各云Skill清单扩成全部服务已验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-24](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/package.json#L1-L24)

根包和CLI身份

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "huaweicloud-devkit",
  "mcpName": "io.github.huaweicloud/huaweicloud-devkit",
  "version": "1.1.12",
  "kooCliVersion": "7.3.12",
  "description": "Agent toolkit that helps coding agents use Huawei Cloud Skills, KooCLI, APIs, SDKs, and future MCP capabilities safely and accurately.",
  "type": "module",
  "files": [
    "cordis.patch.yml",
    "bin",
    ".agents",
    "rules",
    "plugins/huaweicloud-core",
    "integrations/hermes",
    "integrations/opencode",
    "integrations/dsh",
    "integrations/workbuddy",
    "integrations/atomcode"
  ],
  "bin": {
    "huaweicloud-devkit": "./bin/setup.cjs",
    "huaweicloud-devkit-mcp": "./plugins/huaweicloud-core/src/mcp-server.mjs"
  },
  "repository": {
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-13](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/cordis.patch.yml#L1-L13)

实际DSH MCP接线

<details>
<summary>查看原文（13行）</summary>

```text
- insert:
    - id: huaweicloud-devkit
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: huaweicloud
        transport: stdio
        command: node
        args:
          - './node_modules/huaweicloud-devkit/plugins/huaweicloud-core/src/mcp-server.mjs'
        env:
          HUAWEICLOUD_AGENT_TOOLKIT_MODE: local
          HDKITSERVICE_ENDPOINT: ''
        failOnStartupError: false
```

</details>

**依据 3 · 源码核查**：[bin/dsh-postinstall.cjs:9-42](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/bin/dsh-postinstall.cjs#L9-L42)

npm DSH判定与绝对路径改写

<details>
<summary>查看原文（34行）</summary>

```text
const dshHome = process.env.DSH_HOME || path.join(os.homedir(), '.dsh');
const profilesRoot = path.join(dshHome, 'profiles');

if (!cwd.startsWith(profilesRoot)) {
  // Not inside a DSH profile — traditional install, just print message
  console.log('\nHuaweiCloud DevKit installed. Run: npx huaweicloud-devkit install\n');
  process.exit(0);
}

// ── Inside a DSH profile: copy skills to ~/.dsh/skills/ ──
const packageRoot = path.resolve(__dirname, '..');

// Rewrite the bundled patch's relative MCP server path to the absolute package
// path. Relative paths resolve against the DSH process cwd and break when DSH
// is started outside the profile directory. Idempotent: absolute paths are kept.
const bundledPatch = path.join(packageRoot, 'cordis.patch.yml');
if (fs.existsSync(bundledPatch)) {
  const relativeArg = './node_modules/huaweicloud-devkit/plugins/huaweicloud-core/src/mcp-server.mjs';
  const absoluteArg = path
    .join(packageRoot, 'plugins', 'huaweicloud-core', 'src', 'mcp-server.mjs')
    .replace(/\\/g, '/')
    .replace(/'/g, "''");
  const patch = fs.readFileSync(bundledPatch, 'utf8');
  const updated = patch.split(`'${relativeArg}'`).join(`'${absoluteArg}'`);
  if (updated !== patch) {
    fs.writeFileSync(bundledPatch, updated);
    console.log('HuaweiCloud DevKit: rewrote DSH patch MCP path to absolute package path');
  }
}

const skillsSrc = path.join(packageRoot, 'plugins', 'huaweicloud-core', 'skills');
const skillsDest = path.join(dshHome, 'skills');

if (!fs.existsSync(skillsSrc)) {
```

</details>

**依据 4 · 源码核查**：[plugins/huaweicloud-core/src/setup-cli.mjs:2387-2408](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/setup-cli.mjs#L2387-L2408)

DSH安装主体

<details>
<summary>查看原文（22行）</summary>

```text
async function installDsh() {
  const skillsSrc = join(PLUGIN_ROOT, 'skills');
  const srcDir = join(PLUGIN_ROOT, 'src');
  const safetyDir = join(PLUGIN_ROOT, 'safety');
  const pluginDest = dshPluginsDir();
  const hookSrc = join(PACKAGE_ROOT, 'integrations', 'dsh', 'hook-plugin.mjs');

  mkdirSync(pluginDest, { recursive: true });
  copyDir(skillsSrc, dshSkillsDir());
  console.log(`  Skills -> ${dshSkillsDir()}`);
  copyDir(srcDir, join(pluginDest, 'src'));
  console.log(`  MCP Server -> ${join(pluginDest, 'src')}`);
  copyDir(safetyDir, join(pluginDest, 'safety'));
  console.log(`  Safety Policy -> ${join(pluginDest, 'safety')}`);
  injectAgentRules(pluginDest);
  copyFileSync(hookSrc, join(pluginDest, 'hook-plugin.mjs'));
  console.log(`  Hook Plugin -> ${join(pluginDest, 'hook-plugin.mjs')}`);
  ensureDshMcpPatch();
  tryInstallDshMcpClient();
  installRuntimeDeps(pluginDest);
  writeFileSync(join(pluginDest, '.installed'), new Date().toISOString());
}
```

</details>

#### 缺口

- 所有宿主/服务的运行兼容与任务效果未测试
  **影响**：分发Skill不证明云API正确或权限适合用户
  **进一步探讨**：先固定DSH单目标和无写权限测试账号，核安装路径和只读查询

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 计划、批准和命令如何真正执行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

MCP dispatch到callTool，plan规范化argv后做安全分类、参数/安全组预检，返回脱敏命令与approvalToken。令牌UUID、5分钟TTL，JSON存参数hash及脱敏参数，600权限临时rename；run需approvedByUser=true，核生命周期、消费令牌，再比hash或脱敏参数相同。随后用allowWrites=true重新分类，spawn shell:false执行真实hcloud argv，继承环境/代理，stdin默认y换行；默认60秒超时、2秒后SIGKILL，另500ms后以TIMEOUT结束。只读工具也先分类，已知write/execution未allowWrites拒绝，但未命中规则可能unknown_read允许。输出脱敏，大输出可落本地文件；云结果需另查资源。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/huaweicloud-core/src/tools.mjs:1287-1311](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/tools.mjs#L1287-L1311)

MCP实际分派

<details>
<summary>查看原文（25行）</summary>

```text
export async function callTool(name, rawArgs = {}, opts = {}) {
  const args = normalizeNumericArgs(rawArgs);
  const toolValue = toolInvokeValue(name, args);
  trackToolInvoke(name, toolValue);

  switch (name) {
    case 'huaweicloud_check_cli':
      return runVersionCheck();
    case 'huaweicloud_plan_cli_command':
      return planHcloudCommand(args.args || [], { allowWrites: args.allowWrites === true });
    case 'huaweicloud_run_readonly_command':
      return runHcloud(args.args || [], {
        timeoutMs: args.timeoutMs,
        maxRetries: args.maxRetries,
        cwd: args.cwd,
        stdin: args.stdin,
      });
    case 'huaweicloud_list_operations':
      return listOperations(args.service, { timeoutMs: args.timeoutMs });
    case 'huaweicloud_run_approved_command':
      return runApprovedCommand(args);
    case 'huaweicloud_show_profile_redacted':
      return showProfileRedacted(args.profile);
    case 'huaweicloud_hook_check_command':
      return hookResult(evaluateCommandRisk(args.command || ''));
```

</details>

**依据 2 · 源码核查**：[plugins/huaweicloud-core/src/hcloud-cli.mjs:371-399](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/hcloud-cli.mjs#L371-L399)

plan和令牌产出

<details>
<summary>查看原文（29行）</summary>

```text
export function planHcloudCommand(args, options = {}) {
  const normalizedArgs = Array.isArray(args) ? args.map(String) : [];
  const classification = classifyHcloudArgs(normalizedArgs, options);
  const command = ['hcloud', ...normalizedArgs].map((arg) => quoteShellArg(arg)).join(' ');
  const warnings = planningWarnings(normalizedArgs);
  const obsHint = obsWriteHint(normalizedArgs);
  if (obsHint) warnings.push(obsHint);
  const sgFindings = preflightSecurityGroupCheck(normalizedArgs);
  if (sgFindings.length > 0) {
    for (const f of sgFindings) warnings.push(f);
  }
  const paramValidation = validateRequiredParams(normalizedArgs);
  if (paramValidation.missing.length > 0) {
    warnings.push('Missing required parameters: ' + paramValidation.missing.join(', '));
    if (paramValidation.hints && paramValidation.hints.length > 0) {
      warnings.push('Find valid values: ' + paramValidation.hints.join('; '));
    }
  }
  return {
    executable: 'hcloud',
    args: redactSecrets(normalizedArgs),
    command: redactOutput(command),
    executableBlock: redactOutput(command),
    warnings,
    classification: applyPreflightFindings(classification, sgFindings),
    sgFindings,
    approvalToken: createApprovalToken(normalizedArgs),
    safeToRun: classification.decision === 'allow',
  };
```

</details>

**依据 3 · 源码核查**：[plugins/huaweicloud-core/src/hcloud-cli.mjs:83-128](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/hcloud-cli.mjs#L83-L128)

持久token生命周期

<details>
<summary>查看原文（46行）</summary>

```text
export function createApprovalToken(rawArgs) {
  const token = randomUUID();
  const map = readApprovals();
  map[token] = {
    argsHash: hashArgs(rawArgs),
    argsRedacted: redactSecrets(rawArgs),
    createdAt: Date.now(),
  };
  pruneStale(map);
  writeApprovals(map);
  return token;
}

// Inspect a token's lifecycle state WITHOUT consuming it. Used by
// runApprovedCommand to decide between the 'expired' / 'already_consumed'
// / 'not_found' JSON shapes. A consumed token leaves a tombstone
// ({ consumedAt }) until it ages out past APPROVAL_TTL_MS.
export function inspectApprovalToken(token) {
  const map = readApprovals();
  const entry = map[token];
  if (!entry) return { state: TOKEN_STATE_NOT_FOUND };
  if (entry.consumedAt !== undefined) return { state: TOKEN_STATE_ALREADY_CONSUMED };
  if (Date.now() - entry.createdAt > APPROVAL_TTL_MS) return { state: TOKEN_STATE_EXPIRED };
  return { state: TOKEN_STATE_VALID, entry };
}

// Backward-compatible single-use consume. Returns the stored entry on first
// call, then null. After consumption a tombstone ({ consumedAt }) is written
// so a second call can be distinguished from an unknown token via
// inspectApprovalToken. Kept for existing tests that assert null on reuse.
export function consumeApprovalToken(token) {
  const map = readApprovals();
  const entry = map[token];
  if (!entry) return null;
  if (entry.consumedAt !== undefined) return null;
  if (Date.now() - entry.createdAt > APPROVAL_TTL_MS) {
    delete map[token];
    writeApprovals(map);
    return null;
  }
  // Mark as consumed (tombstone) instead of deleting outright, so a repeat
  // call can be classified as already_processed rather than not_found.
  map[token] = { consumedAt: Date.now(), createdAt: entry.createdAt };
  writeApprovals(map);
  return entry;
}
```

</details>

**依据 4 · 源码核查**：[plugins/huaweicloud-core/src/tools.mjs:2131-2186](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/tools.mjs#L2131-L2186)

run消费/参数核对与批准布尔

<details>
<summary>查看原文（56行）</summary>

```text
async function runApprovedCommand(args = {}) {
  if (args.approvedByUser !== true) {
    throw new Error('approvedByUser must be true after explicit user approval for this exact command.');
  }
  const token = String(args.approvalToken || '');

  // D4-24 precise JSON contract (#745): expired and already-consumed tokens
  // return a structured result instead of throwing a generic Error string, so
  // clients can machine-assert the two non-success states.
  const inspection = inspectApprovalToken(token);
  if (inspection.state === 'already_consumed') {
    return { status: 'ok', outcome: 'already_processed' };
  }
  if (inspection.state === 'expired') {
    return { status: 'rejected', code: 'CONFIRM_TOKEN_EXPIRED' };
  }
  if (inspection.state === 'not_found') {
    // A token that was never created (typo / unknown / pruned beyond the
    // tombstone window) is still a rejection, but carries no expired/already
    // semantics — surface a distinct code so clients can tell the cases apart.
    return { status: 'rejected', code: 'CONFIRM_TOKEN_NOT_FOUND' };
  }

  const stored = consumeApprovalToken(token);
  if (!stored) {
    // Defensive: inspectApprovalToken said 'valid' but consume returned null
    // (e.g. raced and pruned between the two reads). Re-classify so we never
    // return a misleading success.
    const recheck = inspectApprovalToken(token);
    if (recheck.state === 'expired') return { status: 'rejected', code: 'CONFIRM_TOKEN_EXPIRED' };
    if (recheck.state === 'already_consumed') return { status: 'ok', outcome: 'already_processed' };
    return { status: 'rejected', code: 'CONFIRM_TOKEN_NOT_FOUND' };
  }
  const providedArgs = Array.isArray(args.args) ? args.args.map(String) : [];
  if (hashArgs(providedArgs) !== stored.argsHash) {
    const redactedStored = JSON.stringify(stored.argsRedacted);
    const redactedProvided = JSON.stringify(redactSecrets(providedArgs));
    if (redactedStored !== redactedProvided) {
      throw new Error(
        'Provided args do not match the approved plan. Use the exact args from the plan. ' +
          'If the plan shows <redacted> for passwords or secrets, replace <redacted> with the actual values in approvedCommand.',
      );
    }
  }
  const strictPlan = planHcloudCommand(providedArgs, { allowWrites: false });
  const result = await runHcloud(providedArgs, {
    allowWrites: true,
    timeoutMs: args.timeoutMs,
    maxRetries: args.maxRetries,
    cwd: args.cwd,
    stdin: args.stdin,
  });
  result.approved = true;
  result.plan = strictPlan;
  return result;
}
```

</details>

**依据 5 · 源码核查**：[plugins/huaweicloud-core/src/hcloud-cli.mjs:529-616](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/hcloud-cli.mjs#L529-L616)

真实spawn及超时

<details>
<summary>查看原文（88行）</summary>

```text
function runHcloudOnce(plan, options) {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const forceKillAfterMs = options.forceKillAfterMs ?? DEFAULT_FORCE_KILL_AFTER_MS;
  const { executable: resolvedExec, argsPrefix } = resolveHcloudCommand({
    executable: options.executable || options.env?.HCLOUD_BIN,
    executableArgs: options.executableArgs,
  });
  const executable = resolvedExec || 'hcloud';
  const executableArgs = argsPrefix;
  const cwd = options.cwd || undefined;
  const stdin = options.stdin ?? 'y\n';
  const childOptions = { ...options };
  delete childOptions.metaDir;
  const childEnv = { ...process.env, ...childOptions.env };

  return new Promise((resolve) => {
    const proxySettings = getProxySettings();
    const proxyEnv = {};
    if (proxySettings) {
      if (proxySettings.https_proxy) proxyEnv.HTTPS_PROXY = proxySettings.https_proxy;
      if (proxySettings.http_proxy) proxyEnv.HTTP_PROXY = proxySettings.http_proxy;
      if (proxySettings.no_proxy) proxyEnv.NO_PROXY = proxySettings.no_proxy;
    }
    const child = spawn(executable, [...executableArgs, ...plan.rawArgs], {
      shell: false,
      windowsHide: true,
      cwd,
      env: {
        ...process.env,
        ...proxyEnv,
        ...childEnv,
      },
    });
    if (stdin) {
      if (typeof stdin === 'function') {
        stdin(child.stdin);
      } else {
        child.stdin.write(String(stdin));
        child.stdin.end();
      }
    }
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let settled = false;
    let forceTimer;
    let settleTimer;

    function finish(result) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(forceTimer);
      clearTimeout(settleTimer);
      if (result.stdout && String(result.stdout).length > LARGE_OUTPUT_THRESHOLD) {
        const outputFile = saveLargeOutput(stdout);
        if (outputFile) {
          result.outputFile = outputFile;
          result.stdout = String(result.stdout).slice(0, 2000) + `\n...(truncated, full output saved to ${outputFile})`;
        }
      }
      // Never surface raw args (may include the injected temporary STS) to MCP
      // clients / agent conversation — redact before resolve. The live `plan`
      // object itself is left untouched so retries keep executing the real args.
      if (result.plan && Array.isArray(result.plan.rawArgs)) {
        const redactedPlan = { ...result.plan, rawArgs: redactArgsWithObs(result.plan.rawArgs) };
        result.plan = redactedPlan;
      }
      resolve(result);
    }

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
      forceTimer = setTimeout(() => child.kill('SIGKILL'), forceKillAfterMs);
      settleTimer = setTimeout(() => {
        finish({
          ok: false,
          code: 'TIMEOUT',
          error: `hcloud command timed out after ${timeoutMs} ms.`,
          exitCode: null,
          signal: null,
          stdout: redactOutput(stdout),
          stderr: redactOutput(stderr),
          plan,
        });
      }, forceKillAfterMs + 500);
    }, timeoutMs);
```

</details>

**依据 6 · 源码核查**：[plugins/huaweicloud-core/src/safety-policy.mjs:350-399](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/safety-policy.mjs#L350-L399)

unknown_read与允许写的分类

<details>
<summary>查看原文（50行）</summary>

```text

  if (isExecution && options.allowWrites) {
    return applyCommandRiskRules(
      {
        decision: 'allow',
        risk: 'execution',
        reason: 'Huawei Cloud execution/trigger operation approved by user.',
        service,
        operation,
        args: normalizedArgs,
      },
      normalizedArgs,
      options,
    );
  }

  if (isWrite && options.allowWrites) {
    return applyCommandRiskRules(
      {
        decision: 'allow',
        risk: 'write',
        reason: 'Huawei Cloud write operation approved by user.',
        service,
        operation,
        args: normalizedArgs,
      },
      normalizedArgs,
      options,
    );
  }

  return applyCommandRiskRules(
    {
      decision: 'allow',
      risk: readOnly ? 'read_only' : 'unknown_read',
      reason: readOnly
        ? 'Command appears to be a read-only Huawei Cloud operation.'
        : 'Command does not match a known write or secret operation; treat output as untrusted and redact it.',
      service,
      operation,
      args: normalizedArgs,
    },
    normalizedArgs,
    options,
  );
}

function splitSimpleCommand(command) {
  return (
    String(command)
```

</details>

#### 缺口

- 实际云结果、命令规则覆盖和同token跨进程并发未运行
  **影响**：规则不是全API只读allowlist，文件令牌无跨进程锁不能宣称严格一次执行
  **进一步探讨**：用无真实云效果fixture核未知操作/双进程同token/超时，云端独立查询真实资源

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安全宣传需哪些反证和隐私边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

approvedByUser是模型调用可传的布尔，不是宿主独立人类批准回执；参数hash不同但脱敏数组相同仍允许，不能称逐原始参数不可变审批。令牌先消费再执行，失败不代表云动作没发生；默认网络错误可重试1次，写命令也经过同重试器，可能重放已完成云效果。DSH hook主要记录工具/CLI事件并next，不是阻断普通shell的云安全沙箱，绕MCP直接用凭据不受plan token保护。MCP启动缺KooCLI会默认detached预安装，官方HTTPS下载而无checksum验证，可用SKIP开关禁用。telemetry默认开，发installId/userHash、版本/宿主/OS及工具事件key/value，不应写成纯本地；off只在进程启动设置更可靠，flush自身无新开关检查。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/huaweicloud-core/src/tools.mjs:2131-2186](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/tools.mjs#L2131-L2186)

批准与脱敏参数放宽

<details>
<summary>查看原文（56行）</summary>

```text
async function runApprovedCommand(args = {}) {
  if (args.approvedByUser !== true) {
    throw new Error('approvedByUser must be true after explicit user approval for this exact command.');
  }
  const token = String(args.approvalToken || '');

  // D4-24 precise JSON contract (#745): expired and already-consumed tokens
  // return a structured result instead of throwing a generic Error string, so
  // clients can machine-assert the two non-success states.
  const inspection = inspectApprovalToken(token);
  if (inspection.state === 'already_consumed') {
    return { status: 'ok', outcome: 'already_processed' };
  }
  if (inspection.state === 'expired') {
    return { status: 'rejected', code: 'CONFIRM_TOKEN_EXPIRED' };
  }
  if (inspection.state === 'not_found') {
    // A token that was never created (typo / unknown / pruned beyond the
    // tombstone window) is still a rejection, but carries no expired/already
    // semantics — surface a distinct code so clients can tell the cases apart.
    return { status: 'rejected', code: 'CONFIRM_TOKEN_NOT_FOUND' };
  }

  const stored = consumeApprovalToken(token);
  if (!stored) {
    // Defensive: inspectApprovalToken said 'valid' but consume returned null
    // (e.g. raced and pruned between the two reads). Re-classify so we never
    // return a misleading success.
    const recheck = inspectApprovalToken(token);
    if (recheck.state === 'expired') return { status: 'rejected', code: 'CONFIRM_TOKEN_EXPIRED' };
    if (recheck.state === 'already_consumed') return { status: 'ok', outcome: 'already_processed' };
    return { status: 'rejected', code: 'CONFIRM_TOKEN_NOT_FOUND' };
  }
  const providedArgs = Array.isArray(args.args) ? args.args.map(String) : [];
  if (hashArgs(providedArgs) !== stored.argsHash) {
    const redactedStored = JSON.stringify(stored.argsRedacted);
    const redactedProvided = JSON.stringify(redactSecrets(providedArgs));
    if (redactedStored !== redactedProvided) {
      throw new Error(
        'Provided args do not match the approved plan. Use the exact args from the plan. ' +
          'If the plan shows <redacted> for passwords or secrets, replace <redacted> with the actual values in approvedCommand.',
      );
    }
  }
  const strictPlan = planHcloudCommand(providedArgs, { allowWrites: false });
  const result = await runHcloud(providedArgs, {
    allowWrites: true,
    timeoutMs: args.timeoutMs,
    maxRetries: args.maxRetries,
    cwd: args.cwd,
    stdin: args.stdin,
  });
  result.approved = true;
  result.plan = strictPlan;
  return result;
}
```

</details>

**依据 2 · 源码核查**：[plugins/huaweicloud-core/src/hcloud-cli.mjs:490-510](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/hcloud-cli.mjs#L490-L510)

所有命令共享网络重试

<details>
<summary>查看原文（21行）</summary>

```text
async function runHcloudOnceWithRetries(plan, options) {
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const result = await runHcloudOnce(plan, options);
    if (result.ok || attempt >= maxRetries || !isRetryableNetworkError(result)) {
      const merged = {
        ...result,
        ok: result.ok ?? false,
        exitCode: result.exitCode ?? null,
        retries: attempt,
        attempts: attempt + 1,
      };
      if (merged.ok) {
        const warning = await runtimeCurrentMismatchWarning();
        return warning ? { ...merged, authWarning: warning } : merged;
      }
      return merged;
    }
    await wait((options.retryBaseDelayMs ?? 500) * 2 ** attempt);
  }
  throw new Error('Unreachable retry state.');
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/hook-plugin.mjs:115-153](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/integrations/dsh/hook-plugin.mjs#L115-L153)

hook记录后放行

<details>
<summary>查看原文（39行）</summary>

```text
        const command = exec.arguments?.command || '';
        if (!command) return next();

        if (HCLOUD_RE.test(command)) {
          debugLog(`hcloud command: ${command.slice(0, 120)}`);

          // Classify and write event
          const classified = classifyHcloud(command);
          if (classified) {
            writeEvent(classified.key, classified.value, { capability: 'cli' });
            debugLog(`CLI TRACKED: ${classified.key} ${classified.value}`);
          }
        }
      }

      // ── Intercept 3: MCP Huawei Cloud tools (record only) ──
      if (exec.name.startsWith('mcp__huaweicloud__')) {
        writeEvent(`tool:${exec.name}`, '1', { capability: 'mcp' });
        debugLog(`MCP tool: ${exec.name}`);
      }
    } catch (error) {
      debugLog(`pre-execute ERROR: ${error?.message || error}`);
      ctx.logger.warn(`[hw-hook] pre-execute error: ${error.message}`);
    }
    return next();
  });

  // ── Layer 2: tools/result observe ─────────────────────────────
  ctx.on('tools/result', (exec, result) => {
    if (exec.name.startsWith('mcp__huaweicloud__') && result.isError) {
      const msg = result.error?.message || 'unknown error';
      debugLog(`tool error: ${exec.name}: ${msg}`);
      ctx.logger.info(`[hw-hook] tool error: ${exec.name}: ${msg}`);
    }
  });

  ctx.logger.info('[hw-hook] DSH Huawei Cloud hook plugin activated');
  debugLog('=== PLUGIN INIT DONE ===');
}
```

</details>

**依据 4 · 源码核查**：[plugins/huaweicloud-core/src/preflight.mjs:80-119](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/preflight.mjs#L80-L119)

默认安装及无checksum信任边界

<details>
<summary>查看原文（40行）</summary>

```text
// the session continues normally (the friendly not_found hint will point at the log).
//
// Trust boundary (P4): this runs `install-hcloud` unattended, i.e. it downloads and
// executes the official HTTPS installer without checksum verification. Only enable
// on trusted networks / over HTTPS; do not bypass with proxies you don't control.
export function maybePreinstallKooCli({ force = false } = {}) {
  if (installStarted && !force) return { launched: false, reason: 'already_launched' };
  if (process.env.HUAWEICLOUD_SKIP_HCLOUD_PREINSTALL === '1') {
    return { launched: false, reason: 'disabled_by_env' };
  }
  if (findHcloudBin()) {
    return { launched: false, reason: 'already installed' };
  }

  const lock = acquireInstallLock();
  if (!lock.acquired) {
    return { launched: false, reason: lock.reason };
  }

  installStarted = true;
  const entryPath = resolvePreinstallCliEntry();
  if (!existsSync(entryPath)) {
    releaseInstallLock();
    console.error(`[preflight] install entry missing: ${entryPath}`);
    return { launched: false, reason: `install entry missing: ${entryPath}` };
  }
  const entry = pathToFileURL(entryPath).href;
  const log = openKooCliInstallLog();
  log.on('error', () => {});
  const release = () => {
    log.end();
    releaseInstallLock();
  };
  const child = spawn(process.execPath, [entry, 'install-hcloud'], {
    stdio: ['ignore', log, log],
    detached: true,
    windowsHide: true,
  });
  child.unref();
  child.on('error', (err) => {
```

</details>

**依据 5 · 源码核查**：[plugins/huaweicloud-core/src/telemetry/telemetry.mjs:175-230](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/telemetry/telemetry.mjs#L175-L230)

默认开及精确事件字段

<details>
<summary>查看原文（56行）</summary>

```text
export function isTelemetryEnabled() {
  return process.env.HUAWEICLOUD_DEVKIT_TELEMETRY !== 'off';
}

function getEndpoint() {
  return process.env.HUAWEICLOUD_DEVKIT_TELEMETRY_ENDPOINT || DEFAULT_ENDPOINT;
}

function capabilityFromKey(key) {
  if (key.startsWith('tool:')) return 'mcp';
  if (key.startsWith('cli:')) return 'cli';
  return undefined;
}

export function sanitizeValue(value) {
  if (typeof value !== 'string') value = value == null ? '' : String(value);
  value = value.replace(/[\r\n\t]+/g, ' ').trim();
  if (value.length > MAX_VALUE_LENGTH) {
    value = value.slice(0, MAX_VALUE_LENGTH - 3) + '...';
  }
  return value;
}

function buildEvent(raw) {
  const event = {
    key: raw.key,
    value: sanitizeValue(raw.value),
    installId: installId,
    userHash: userHash,
    version: PLUGIN_VERSION,
    harness: agentHarness,
    agentVersion: agentVersion,
    os: osTypeStr,
    osVersion: osVersionStr,
  };
  const cap = raw.capability || capabilityFromKey(raw.key);
  if (cap) event.capability = cap;
  return event;
}

export function enqueueEvent(raw) {
  if (!isTelemetryEnabled()) return;
  if (!installId) return;

  ingestHookEvents();

  checkDauPing();

  const event = buildEvent(raw);
  eventQueue.push(event);

  if (eventQueue.length > MAX_QUEUE_SIZE) {
    eventQueue = eventQueue.slice(eventQueue.length - MAX_QUEUE_SIZE);
  }

  if (eventQueue.length >= BATCH_SIZE) setImmediate(() => flushEvents());
```

</details>

**依据 6 · 源码核查**：[plugins/huaweicloud-core/src/telemetry/telemetry.mjs:327-383](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/telemetry/telemetry.mjs#L327-L383)

发送/重试不再核开关

<details>
<summary>查看原文（57行）</summary>

```text
function flushEvents() {
  if (isFlushing) return;
  if (eventQueue.length === 0) return;
  isFlushing = true;

  const batch = eventQueue.splice(0, BATCH_SIZE);
  const keys = batch.map((e) => e.key).join(',');
  debugLog(
    `FLUSH start events=${batch.length} harness=${batch[0].harness} agentVersion=${batch[0].agentVersion} keys=[${keys}]`,
  );

  const endpoint = getEndpoint();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  fetchWithProxy(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(batch.map(({ _retries, ...rest }) => rest)),
    signal: controller.signal,
  })
    .then((resp) => {
      clearTimeout(timer);
      debugLog(`POST status=${resp.status} events=${batch.length}`);
      if (resp.ok) {
        for (const event of batch) {
          if (event.key === 'dau:active_today') touchFile(dauStampPath());
          if (event.key === 'plugin:install') touchFile(installStampPath());
          if (event.key === 'plugin:first_use') touchFile(firstUseStampPath());
        }
      } else if (resp.status >= 400 && resp.status < 500) {
        debugLog(`POST status=${resp.status} dropping ${batch.length} events (client error)`);
      } else {
        requeueEvents(batch);
      }
      isFlushing = false;
    })
    .catch((error) => {
      clearTimeout(timer);
      debugLog(`POST FAIL err=${error.message} events=${batch.length}`);
      requeueEvents(batch);
      isFlushing = false;
    });
}

function requeueEvents(batch) {
  const kept = [];
  for (const event of batch) {
    const retries = event._retries || 0;
    if (retries >= MAX_RETRIES) {
      debugLog(`DROP event key=${event.key} after ${MAX_RETRIES} retries`);
      continue;
    }
    event._retries = retries + 1;
    kept.push(event);
  }
  if (kept.length > 0) eventQueue = [...kept, ...eventQueue];
```

</details>

#### 缺口

- 云IAM限制、遥测服务保留及并发重复执行实效未测
  **影响**：不具独立审批或账号最小权限时可能产生未授权费用/资源变更，事件可外发
  **进一步探讨**：先禁预安装/遥测重启MCP，仅低权只读账号；写操作用Host独立审批和云幂等token，不据超时自动重放

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配置、成本、卸载与资源回收怎么办？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

Node>=22，KooCLI固定7.3.12及云region/profile/AK-SK或STS，需最小IAM和真实账单预算。DSH bundle连接本地MCP，通用install会复制文件/注规则/装runtime依赖，启动缺CLI还会后台下载执行；Linux/macOS安装curl归档、tar解压并mv到~/.local/bin或/usr/local/bin，后者可尝试sudo，不能称纯提示。首次应显式单目标安装并禁后台预装，再审下载安装。telemetry队列500、每60s/100批、5s超时，4xx丢弃，网络/5xx最多3次重排；本地telemetry文件和身份也需保留策略。uninstallDsh按huawei前缀删shared skills、插件目录与patch，可能涉及用户同名前缀资料，须先备份；KooCLI/OBS全局配置默认另保留、--clean-global另作破坏范围，云资源/任务不会卸载回滚。退出停MCP、核预装子进程、撤AK/STS与云任务，再按明确路径清配置/日志/审批文件。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/huaweicloud-core/src/setup-cli.mjs:2434-2462](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/setup-cli.mjs#L2434-L2462)

DSH前缀卸载范围

<details>
<summary>查看原文（29行）</summary>

```text
function uninstallDsh() {
  const skillsDir = dshSkillsDir();
  const oldHookFile = join(dshRoot(), 'plugins', 'skill-tracker.js');
  let removed = 0;
  if (existsSync(skillsDir)) {
    for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
      if (entry.name.startsWith('huawei')) {
        if (removeIfExists(join(skillsDir, entry.name))) removed++;
      }
    }
    if (removed > 0) console.log(`  Removed ${removed} skills`);
    try {
      if (readdirSync(skillsDir).length === 0) {
        rmSync(skillsDir, { recursive: true, force: true });
        console.log(`  Removed empty skills directory: ${skillsDir}`);
      }
    } catch {}
  }
  if (removeIfExists(dshPluginsDir())) {
    console.log('  Removed MCP server, safety policy, and hook plugin');
  }
  // Remove old-style hook file from pre-hook-plugin era
  if (removeIfExists(oldHookFile)) {
    console.log('  Removed legacy hook');
  }
  removeDshMcpPatch();
}

function dshStatus() {
```

</details>

**依据 2 · 源码核查**：[plugins/huaweicloud-core/src/setup-cli.mjs:4721-4747](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/setup-cli.mjs#L4721-L4747)

真实归档安装与sudo移动

<details>
<summary>查看原文（27行）</summary>

```text
      console.log(`[${label}] Auto-installing to ${binDir}...`);
      try {
        const tmpTar = join(tmpdir(), `huaweicloud-cli-${pkg}.tar.gz`);
        console.log(`  Downloading ${url}...`);
        const dl = spawnSync('curl', ['-fL', url, '-o', tmpTar], { stdio: 'inherit', timeout: 180000 });
        if (dl.status !== 0) throw new Error(`下载失败 (curl exit ${dl.status})`);

        console.log('  Extracting...');
        const ex = spawnSync('tar', ['-xzf', tmpTar, '-C', tmpdir()], { stdio: 'inherit', timeout: 60000 });
        if (ex.status !== 0) throw new Error(`解压失败 (tar exit ${ex.status})`);
        rmSync(tmpTar, { force: true });
        const extracted = join(tmpdir(), 'hcloud');
        if (!existsSync(extracted)) throw new Error('hcloud 二进制未生成，可能已被安全软件拦截');

        try {
          mkdirSync(binDir, { recursive: true });
        } catch {}
        console.log('  Installing...');
        let mv = spawnSync('mv', [extracted, binPath], { stdio: 'inherit', timeout: 30000 });
        if (mv.status !== 0) {
          console.log('  目标目录需要权限，尝试 sudo mv...');
          mv = spawnSync('sudo', ['mv', extracted, binPath], { stdio: 'inherit', timeout: 30000 });
          if (mv.status !== 0) throw new Error(`安装失败 (mv exit ${mv.status})`);
        }

        console.log(`\n\x1b[32mInstall complete.\x1b[0m`);
        console.log(`  Verify: ${binPath} version`);
```

</details>

**依据 3 · 源码核查**：[plugins/huaweicloud-core/src/setup-cli.mjs:3873-3898](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/setup-cli.mjs#L3873-L3898)

全局清理与默认保留

<details>
<summary>查看原文（26行）</summary>

```text
  const cleanKocli = hasFlag('--clean-kocli') || hasFlag('--clean-global');
  const cleanObs = hasFlag('--clean-obs') || hasFlag('--clean-global');

  // Interactive terminal: ask the user for each account-level tool.
  if (!cleanKocli && !cleanObs && process.stdin.isTTY && process.stdout.isTTY) {
    console.log('\n  —— 全局凭据库已清除，是否一并删除账号级工具？——');
    const kocliAnswer = await readLineQuestion('  是否一并删除 KooCLI (hcloud)？(y/N) ');
    const obsAnswer = await readLineQuestion('  是否一并删除 OBS 配置 (~/.obsutilconfig)？(y/N) ');
    if (/^\s*y\s*$/i.test(kocliAnswer)) removeKooCliWithMessage();
    else console.log('  KooCLI kept.');
    if (/^\s*y\s*$/i.test(obsAnswer)) removeObsConfigWithMessage();
    else console.log('  OBS config kept.');
    return;
  }

  // Explicit flags: delete deterministically, without prompting.
  if (cleanKocli) removeKooCliWithMessage();
  if (cleanObs) removeObsConfigWithMessage();

  // No flag and non-interactive: keep them and surface the option.
  if (!cleanKocli && !cleanObs) {
    console.log(
      `\n\x1b[33m已保留 KooCLI 与 OBS 配置（全局凭据库已删除）。如需一并清理，请使用 --clean-kocli / --clean-obs / --clean-global flag，或在交互终端重新执行全局卸载。\x1b[0m`,
    );
  }
}
```

</details>

**依据 4 · 源码核查**：[plugins/huaweicloud-core/src/telemetry/telemetry.mjs:59-67](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/telemetry/telemetry.mjs#L59-L67)

队列与发送限制

```text
const USER_HASH_PATH = join(GLOBAL_TELEMETRY_DIR, 'user-hash');

const MAX_QUEUE_SIZE = 500;
const FLUSH_INTERVAL_MS = 60_000;
const BATCH_SIZE = 100;
const FETCH_TIMEOUT_MS = 5000;
const MAX_VALUE_LENGTH = 255;
const MAX_RETRIES = 3;

```

**依据 5 · 源码核查**：[plugins/huaweicloud-core/src/preflight.mjs:112-125](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/preflight.mjs#L112-L125)

后台独立安装进程

<details>
<summary>查看原文（14行）</summary>

```text
  };
  const child = spawn(process.execPath, [entry, 'install-hcloud'], {
    stdio: ['ignore', log, log],
    detached: true,
    windowsHide: true,
  });
  child.unref();
  child.on('error', (err) => {
    log.write(`[preflight] spawn failed: ${err.message}\n`);
    release();
  });
  child.on('close', () => release());
  return { launched: true, reason: 'background install started' };
}
```

</details>

#### 缺口

- 本轮未安装/运行云命令/卸载，云费、安装耗时和恢复成本未知
  **影响**：本地卸包不删云资源或止费，通用前缀清理可能碰自定义Skill
  **进一步探讨**：在备份的隔离DSH先核增删路径、无云写账号与清理清单；云资源逐项外部确认

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何证伪准确/安全增量？

**研究主题**：新假设与验证

#### 完整回答

固定同一批云只读查询和隔离资源变更，比较人工KooCLI与Agent+工具包，核准确参数、IAM拒绝、外部审批和最终资源状态。加入unknown_read新操作、secret值变化、同token并发、网络响应丢失后重试、普通shell绕MCP及安装/卸载共享Skill冲突。若能绕人类审批、重复变更或错误删本地资料，应停写工具并回官方CLI+独立审批；知识便利只按可查来源和实际完成率评，不以护栏名称或遥测次数当成功。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/huaweicloud-core/src/safety-policy.mjs:380-399](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/safety-policy.mjs#L380-L399)

未知操作允许的反例

<details>
<summary>查看原文（20行）</summary>

```text

  return applyCommandRiskRules(
    {
      decision: 'allow',
      risk: readOnly ? 'read_only' : 'unknown_read',
      reason: readOnly
        ? 'Command appears to be a read-only Huawei Cloud operation.'
        : 'Command does not match a known write or secret operation; treat output as untrusted and redact it.',
      service,
      operation,
      args: normalizedArgs,
    },
    normalizedArgs,
    options,
  );
}

function splitSimpleCommand(command) {
  return (
    String(command)
```

</details>

**依据 2 · 源码核查**：[plugins/huaweicloud-core/src/tools.mjs:2164-2186](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/tools.mjs#L2164-L2186)

secret参数及真实执行

<details>
<summary>查看原文（23行）</summary>

```text
  const providedArgs = Array.isArray(args.args) ? args.args.map(String) : [];
  if (hashArgs(providedArgs) !== stored.argsHash) {
    const redactedStored = JSON.stringify(stored.argsRedacted);
    const redactedProvided = JSON.stringify(redactSecrets(providedArgs));
    if (redactedStored !== redactedProvided) {
      throw new Error(
        'Provided args do not match the approved plan. Use the exact args from the plan. ' +
          'If the plan shows <redacted> for passwords or secrets, replace <redacted> with the actual values in approvedCommand.',
      );
    }
  }
  const strictPlan = planHcloudCommand(providedArgs, { allowWrites: false });
  const result = await runHcloud(providedArgs, {
    allowWrites: true,
    timeoutMs: args.timeoutMs,
    maxRetries: args.maxRetries,
    cwd: args.cwd,
    stdin: args.stdin,
  });
  result.approved = true;
  result.plan = strictPlan;
  return result;
}
```

</details>

**依据 3 · 源码核查**：[plugins/huaweicloud-core/src/hcloud-cli.mjs:490-510](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/hcloud-cli.mjs#L490-L510)

网络重试可测

<details>
<summary>查看原文（21行）</summary>

```text
async function runHcloudOnceWithRetries(plan, options) {
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const result = await runHcloudOnce(plan, options);
    if (result.ok || attempt >= maxRetries || !isRetryableNetworkError(result)) {
      const merged = {
        ...result,
        ok: result.ok ?? false,
        exitCode: result.exitCode ?? null,
        retries: attempt,
        attempts: attempt + 1,
      };
      if (merged.ok) {
        const warning = await runtimeCurrentMismatchWarning();
        return warning ? { ...merged, authWarning: warning } : merged;
      }
      return merged;
    }
    await wait((options.retryBaseDelayMs ?? 500) * 2 ** attempt);
  }
  throw new Error('Unreachable retry state.');
```

</details>

**依据 4 · 源码核查**：[plugins/huaweicloud-core/src/setup-cli.mjs:2434-2462](https://github.com/huaweicloud/huaweicloud-devkit/blob/4ed07801cf62248049b62d4fd71f7bf347d57452/plugins/huaweicloud-core/src/setup-cli.mjs#L2434-L2462)

卸载前缀范围可测

<details>
<summary>查看原文（29行）</summary>

```text
function uninstallDsh() {
  const skillsDir = dshSkillsDir();
  const oldHookFile = join(dshRoot(), 'plugins', 'skill-tracker.js');
  let removed = 0;
  if (existsSync(skillsDir)) {
    for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
      if (entry.name.startsWith('huawei')) {
        if (removeIfExists(join(skillsDir, entry.name))) removed++;
      }
    }
    if (removed > 0) console.log(`  Removed ${removed} skills`);
    try {
      if (readdirSync(skillsDir).length === 0) {
        rmSync(skillsDir, { recursive: true, force: true });
        console.log(`  Removed empty skills directory: ${skillsDir}`);
      }
    } catch {}
  }
  if (removeIfExists(dshPluginsDir())) {
    console.log('  Removed MCP server, safety policy, and hook plugin');
  }
  // Remove old-style hook file from pre-hook-plugin era
  if (removeIfExists(oldHookFile)) {
    console.log('  Removed legacy hook');
  }
  removeDshMcpPatch();
}

function dshStatus() {
```

</details>

#### 缺口

- 无本轮真实云对照或费用/重复效果验证
  **影响**：不能宣称安全准确完成云任务或节省费用
  **进一步探讨**：使用隔离项目和最小权限，保审批/请求幂等ID、外部资源记录与本地差异

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
