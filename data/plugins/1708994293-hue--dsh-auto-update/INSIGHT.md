# @sueleven/dsh-auto-update

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[22f7d60](https://github.com/1708994293-hue/dsh-auto-update/tree/22f7d60a000a2c6ad608b25944932a752b690465)

<!-- BEGIN META -->
[![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@sueleven/dsh-auto-update)
<!-- END META -->

> **实现功能**：启动时检查已下载并启用的npm插件，展示新版并在确认后调用DSH官方通道更新。

> **核心亮点**：整合启动延迟检查和官方安装通道，减少逐包手工发现，默认确认前不安装。参见[Q01](#research-q01)。

> **风险与缺陷**：runApply未把提示targets传给脚本，实际重新查latest/候选；可能安装用户未看到的版本，且apply处理器未见局部确认围栏。参见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 谁需要启动检查，具体改变什么更新组织？](#detail-section-11)
  - [Q02 · 候选、确认和实际安装是否绑定同一集合？](#detail-section-12)
  - [Q03 · 授权、安全和失败恢复有哪些前提与负担？](#detail-section-13)
  - [Q04 · 当前何时采用，可证伪的改进是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多npm插件桌面用户集中发现更新；合格交付须是同意版本被安装并通过重启功能核查。

原生市场逐包检查/更新为参照；本项省发现接线，不能仅凭使用官方命令认定保配置或功能兼容已验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 新版检查 | 减少逐包查找 | registry启用候选，自身/本地包跳过 |
| 确认更新 | 调官方CLI | Windows内部路径，集合会重选 |
| 版本后验 | 查已安装版本 | 不证明功能兼容或回滚 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH0.2.1+ Web overlay | 提示必需 | 展示确认 | 无卡片，手工市场 |
| npm网络、可写profile | 检查/安装必需 | 查版本及改依赖 | 保留旧包，查日志 |
| Windows.exe及asar CLI | 固定更新器必需 | 官方安装入口 | 非Windows不满足 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户核profile/备份并启用 | 延迟出现候选或明确检查错误 |
| 2 | 用户审列表再确认 | 注意实际会重选，先隔离 |
| 3 | 插件安装、用户重启核功能 | 核实际版本和配置；部分失败逐包恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包/状态目录/备份 | 核profile、路径与路由 | 金额/时间未知 |
| 持续使用 | registry请求、日志、安装网络 | 审发布差异、确认与重启 | latest不等兼容 |
| 失败恢复 | 重装旧包/锁文件恢复 | 逐包核实际版本和功能 | 批量非事务，恢复工时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 发现 | 启用候选和latest比较 | patch子串启用准确性 |
| 安装 | 官方CLI和版本后验 | 确认集合一致/功能兼容 |
| 恢复 | 日志与超时 | 批量部分写入与回滚 |

> **思考**：runApply未把提示targets传给脚本，实际重新查latest/候选；可能安装用户未看到的版本，且apply处理器未见局部确认围栏。参见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：整合启动延迟检查和官方安装通道，减少逐包手工发现，默认确认前不安装。参见[Q01](#research-q01)。

整合启动延迟检查和官方安装通道，减少逐包手工发现，默认确认前不安装。参见[Q01](#research-q01)。

参数数组、进程超时、wx锁和版本后验可借鉴；迁移需避免内部asar路径和确认漂移，原子状态文件也不能替代安装事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

runApply未把提示targets传给脚本，实际重新查latest/候选；可能安装用户未看到的版本，且apply处理器未见局部确认围栏。参见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察作更新候选，核Windows环境与路由、备份后才隔离验批量；不在生产profile依旧提示直接全更。参见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

发现/提示/CLI接线有源码支持；确认与执行集合不绑定且更新器仅Windows路径，可信确认计划未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/update.mjs、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查候选、版本、Host状态/路由、安装与版本后验；不执行registry/安装，不全面核自写semver或全部CLI平台。
- 下一步：未执行。隔离测latest/profile漂移、重复apply和半途失败，核包版本/锁文件/功能与恢复。

**分析版本**

- **仓库**：[1708994293-hue/dsh-auto-update](https://github.com/1708994293-hue/dsh-auto-update)
- **版本号**：1.0.1（[固定提交 22f7d60](https://github.com/1708994293-hue/dsh-auto-update/tree/22f7d60a000a2c6ad608b25944932a752b690465)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是版本/候选/profile摘要绑定的确认计划，漂移后重新确认而非自动换集合；故障对照核计划外安装。参见[Q04](#research-q04)。

未执行。隔离测latest/profile漂移、重复apply和半途失败，核包版本/锁文件/功能与恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 153 | — | — | 1405 |
| .js | source | 2 | 621 | 544 | 37 | — |
| .mjs | source | 1 | 706 | 596 | 49 | — |
| .mjs | test | 1 | 85 | 79 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/1708994293-hue/dsh-auto-update/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：启动检查与用户确认是否约束实际更新，平台和恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要启动检查，具体改变什么更新组织？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护多个已启用npm插件的桌面用户可在启动后看到版本差异并集中确认更新。合格交付应是用户看到并同意的包/版本被官方安装通道写入，重启后核心功能仍可用；仅版本更高不证明兼容或业务收益。相对逐包查市场，插件减少发现和发起更新的重复步骤。

贡献是启动检查、提示卡和官方CLI的流程整合，不是新包管理器；确认前只查询有助保留用户控制。但README“任意平台”只对安装陈述不能外推实际更新，固定安装器只认.exe和resources/app.asar，非Windows找不到符合条件执行文件。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-8](https://github.com/1708994293-hue/dsh-auto-update/blob/22f7d60a000a2c6ad608b25944932a752b690465/README.md#L1-L8)

作者检查与确认流程。

```text
# dsh-auto-update

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）插件：**每次打开 DSH 时自动检查你已经下载并启用的插件有没有新版本，发现后主动列出并询问是否更新**——点确认才更新，更新走 DSH 官方通道，不会覆盖你的 profile 配置。

- 启动约 8 秒后后台检查，不阻塞界面；
- 有新版本时右下角出现提示卡，逐条列出 `插件  当前版本 → 最新版本`；
- 按钮：**全部更新 / 稍后提醒**；无更新时完全静默；
- 更新完成后提示「重启 DSH 后生效」，与插件市场的更新语义一致。
```

**依据 2 · 源码核查**：[lib/update.mjs:396-410](https://github.com/1708994293-hue/dsh-auto-update/blob/22f7d60a000a2c6ad608b25944932a752b690465/lib/update.mjs#L396-L410)

执行文件仅接受.exe。

<details>
<summary>查看原文（15行）</summary>

```text
/** DSH 桌面可执行文件的特征：同目录下存在 resources\app.asar。 */
function isDshExecutable(candidate) {
  if (!candidate || !/\.exe$/i.test(candidate) || !existingFile(candidate)) return false;
  try {
    return fs.existsSync(path.join(path.dirname(candidate), 'resources', 'app.asar'));
  } catch {
    return false;
  }
}

function resolveDshExe(opts) {
  for (const candidate of candidateExePaths(opts)) {
    if (isDshExecutable(candidate)) return candidate;
  }
  return null;
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 候选、确认和实际安装是否绑定同一集合？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

collectCandidates从profile dependencies取包，bundle精确包含或patch字符串包含视为启用，排除自身、market禁用和非registry。registry latest用自写semver比较，只前向升级；多查询并发，命令/安装有超时，更新锁用wx。官方CLI参数是包@latest固定值，安装后重新读取node_modules版本校验。

关键断点是Host runApply保存targets用于文案，却调用更新脚本时不传targets；脚本重新扫描profile并重新查latest，再安装新的updates。若提示后新发布或profile改变，用户确认的列表与实际安装可不同，完成提示仍显示旧targets。CLI内部固定版本不等确认绑定版本。patchText.includes也不是结构化启用解析，注释或相似名字可误判。参数数组、超时和版本后验值得借鉴，但尚无整体原子回滚。

#### 证据与依据

**依据 1 · 源码核查**：[lib/update.mjs:267-295](https://github.com/1708994293-hue/dsh-auto-update/blob/22f7d60a000a2c6ad608b25944932a752b690465/lib/update.mjs#L267-L295)

候选启用判断与排除。

<details>
<summary>查看原文（29行）</summary>

```text
function collectCandidates(data) {
  const candidates = [];
  const skipped = [];
  for (const [name, spec] of Object.entries(data.dependencies)) {
    if (SELF_NAMES.has(name)) {
      skipped.push({ name, reason: '插件自身（不做自我更新）' });
      continue;
    }
    const enabledByBundle = data.bundles.includes(name);
    const enabledByPatch = data.patchText.includes(name);
    if (!enabledByBundle && !enabledByPatch) {
      skipped.push({ name, reason: '未启用（不在 bundles / cordis.patch.yml）' });
      continue;
    }
    if (data.disabled.has(name)) {
      skipped.push({ name, reason: '已被插件市场禁用（.dsh-market/state.json）' });
      continue;
    }
    if (typeof spec !== 'string' || NON_REGISTRY_SPEC.test(spec)) {
      skipped.push({ name, reason: `非 registry 依赖（${String(spec)}）` });
      continue;
    }
    const installed = installedVersion(data.profileDir, name);
    if (!installed) {
      skipped.push({ name, reason: '未安装到 node_modules（无法确定当前版本）' });
      continue;
    }
    candidates.push({ name, spec, installed });
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:195-215](https://github.com/1708994293-hue/dsh-auto-update/blob/22f7d60a000a2c6ad608b25944932a752b690465/lib/index.js#L195-L215)

targets仅用于提示，未作为脚本参数。

<details>
<summary>查看原文（21行）</summary>

```text
async function runApply() {
  if (disposed) return;
  if (state.phase === 'updating') return;
  if (state.updates.length === 0) return;
  if (applyPromise) return applyPromise;
  const targets = state.updates.slice();
  state.phase = 'updating';
  state.message = `正在更新 ${targets.map((item) => item.name).join('、')}…`;
  state.error = null;
  log(`用户确认更新：${targets.map((item) => `${item.name} ${item.from}->${item.to}`).join('，')}`);
  writeJson(join(STATE_DIR, 'plugin-state.json'), snapshot());
  applyPromise = (async () => {
    const args = ['--profile', state.profile, '--launched-by', 'user-confirmed'];
    if (process.execPath) args.push('--dsh-exe', process.execPath);
    const result = await runUpdater(args, APPLY_TIMEOUT_MS);
    const lastRun = readJson(join(STATE_DIR, 'last-run.json'));
    const ok = Boolean(lastRun?.ok) && result.ok;
    if (ok) {
      state.updates = [];
      state.phase = 'done';
      state.message = `已更新 ${targets.map((item) => `${item.name} ${item.from} → ${item.to}`).join('，')}，重启 DSH 后生效。`;
```

</details>

**依据 3 · 源码核查**：[lib/update.mjs:584-599](https://github.com/1708994293-hue/dsh-auto-update/blob/22f7d60a000a2c6ad608b25944932a752b690465/lib/update.mjs#L584-L599)

执行时重新查候选/registry。

<details>
<summary>查看原文（16行）</summary>

```text
  const { candidates, skipped } = collectCandidates(data);
  result.skipped = skipped;
  log.info(`profile 目录：${data.profileDir}`);
  log.info(`已下载 ${Object.keys(data.dependencies).length} 个依赖，其中启用 ${candidates.length} 个参与检查；跳过 ${skipped.length} 个`);
  for (const item of skipped) log.info(`  跳过 ${item.name}：${item.reason}`);

  if (candidates.length === 0) {
    log.info('没有需要检查的插件，结束');
    writeJsonSafe(path.join(stateDir, 'last-run.json'), { ...result, durationMs: Date.now() - startedAt });
    return 0;
  }

  const checked = await checkCandidates(candidates, log);
  result.checked = checked.map((c) => ({ name: c.name, installed: c.installed, latest: c.latest, updateAvailable: c.updateAvailable }));
  const updates = checked.filter((c) => c.updateAvailable);
  result.updates = updates.map((c) => ({ name: c.name, from: c.installed, to: c.latest }));
```

</details>

**依据 4 · 源码核查**：[lib/update.mjs:462-467](https://github.com/1708994293-hue/dsh-auto-update/blob/22f7d60a000a2c6ad608b25944932a752b690465/lib/update.mjs#L462-L467)

最终安装参数固定但关闭发布年龄限制。

```text
function buildInstallArgs(profile, updates) {
  const pinned = updates.map((u) => `${u.name}@${u.latest}`);
  const allExactSpecs = updates.every((u) => !/^[\^~]/.test(String(u.spec || '')));
  const args = ['plugin', '--profile', profile, 'add', ...pinned, '--config.minimum-release-age=0'];
  if (allExactSpecs) args.push('--save-exact');
  return args;
```

**依据 5 · 源码核查**：[lib/update.mjs:663-682](https://github.com/1708994293-hue/dsh-auto-update/blob/22f7d60a000a2c6ad608b25944932a752b690465/lib/update.mjs#L663-L682)

后验已安装版本。

<details>
<summary>查看原文（20行）</summary>

```text
    const verification = updates.map((u) => ({
      name: u.name,
      expected: u.latest,
      actual: installedVersion(data.profileDir, u.name),
    }));
    result.verification = verification;

    if (!install.ok) {
      result.ok = false;
      result.error = install.timedOut ? '更新超时' : `更新命令退出码 ${install.code}`;
      log.info(`更新失败：${result.error}`);
      return 1;
    }

    const bad = verification.filter((v) => compareVersions(v.actual, v.expected) !== 0);
    if (bad.length > 0) {
      result.ok = false;
      result.error = `更新后版本校验不一致：${bad.map((b) => `${b.name} 期望 ${b.expected} 实际 ${b.actual}`).join('，')}`;
      log.info(`版本校验失败：${result.error}`);
      return 1;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 授权、安全和失败恢复有哪些前提与负担？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

更新依赖Windows桌面包内部CLI路径、可写profile/状态目录和npm网络。参数显式minimum-release-age=0放弃发布年龄等待，并不等于新包已安全/兼容。路由apply是POST但没有本地Origin/Connection/Content-Type或确认令牌检查；上层保护未核验，不能把注释same-origin当强制用户确认。

首次需核profile、包管理兼容与备份，持续为registry联网、日志及用户比较发布差异。更新可能改依赖/锁文件，成功仅版本一致还要重启验功能；批量超时/失败不证明所有包未写入，需逐包核实际版本再恢复。运行日志默认包内目录可能权限不足。现金和人工时间未测，无强制模型调用也不等无维护代价。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:263-290](https://github.com/1708994293-hue/dsh-auto-update/blob/22f7d60a000a2c6ad608b25944932a752b690465/lib/index.js#L263-L290)

处理器方法检查，无局部同源/令牌验证。

<details>
<summary>查看原文（28行）</summary>

```text
function createHandler() {
  return (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://dsh.internal');
      const path = url.pathname;
      if (!path.startsWith(ROUTE_PREFIX)) {
        sendJson(res, 404, { error: 'not found' });
        return;
      }
      const route = path.slice(ROUTE_PREFIX.length) || '/';
      const method = req.method ?? 'GET';
      if (method === 'GET' && route === '/status') {
        sendJson(res, 200, snapshot());
        return;
      }
      if (method === 'POST' && route === '/check') {
        runCheck().catch(() => {});
        sendJson(res, 202, snapshot());
        return;
      }
      if (method === 'POST' && route === '/apply') {
        if (state.updates.length === 0) {
          sendJson(res, 409, { ...snapshot(), error: '没有可更新的插件' });
          return;
        }
        runApply().catch(() => {});
        sendJson(res, 202, snapshot());
        return;
```

</details>

**依据 2 · 源码核查**：[lib/update.mjs:462-467](https://github.com/1708994293-hue/dsh-auto-update/blob/22f7d60a000a2c6ad608b25944932a752b690465/lib/update.mjs#L462-L467)

关闭release age。

```text
function buildInstallArgs(profile, updates) {
  const pinned = updates.map((u) => `${u.name}@${u.latest}`);
  const allExactSpecs = updates.every((u) => !/^[\^~]/.test(String(u.spec || '')));
  const args = ['plugin', '--profile', profile, 'add', ...pinned, '--config.minimum-release-age=0'];
  if (allExactSpecs) args.push('--save-exact');
  return args;
```

**依据 3 · 源码核查**：[lib/update.mjs:645-682](https://github.com/1708994293-hue/dsh-auto-update/blob/22f7d60a000a2c6ad608b25944932a752b690465/lib/update.mjs#L645-L682)

安装与部分状态后验。

<details>
<summary>查看原文（38行）</summary>

```text
    const install = await runInstaller(
      exe,
      cliEntryFor(exe),
      opts.profile,
      updates,
      { ...opts, profileDir: data.profileDir, dshHome },
      log,
    );
    if (install.stdout.trim()) log.raw(install.stdout.trimEnd());
    if (install.stderr.trim()) log.raw(install.stderr.trimEnd());

    result.install = {
      code: install.code,
      signal: install.signal,
      timedOut: install.timedOut,
      command: [exe, ...buildInstallArgs(opts.profile, updates)],
    };

    const verification = updates.map((u) => ({
      name: u.name,
      expected: u.latest,
      actual: installedVersion(data.profileDir, u.name),
    }));
    result.verification = verification;

    if (!install.ok) {
      result.ok = false;
      result.error = install.timedOut ? '更新超时' : `更新命令退出码 ${install.code}`;
      log.info(`更新失败：${result.error}`);
      return 1;
    }

    const bad = verification.filter((v) => compareVersions(v.actual, v.expected) !== 0);
    if (bad.length > 0) {
      result.ok = false;
      result.error = `更新后版本校验不一致：${bad.map((b) => `${b.name} 期望 ${b.expected} 实际 ${b.actual}`).join('，')}`;
      log.info(`版本校验失败：${result.error}`);
      return 1;
```

</details>

#### 缺口

- 目标宿主上层路由权限与批量故障未验
  **影响**：确认来源/部分更新可能影响安全和恢复
  **进一步探讨**：先读目标路由围栏契约，隔离测跨源POST和安装半途失败后各包/锁文件状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 当前何时采用，可证伪的改进是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议观察，先把它用作检查候选而不批量更新生产profile。采用前需确认Windows路径、路由权限、备份与逐包验收，尤其不能仅按提示旧列表假定实际更新对象。非Windows可用其检查逻辑，不应预期固定安装器可更新。

未验证假设是生成包含profile摘要、包/版本和发布时间的确认计划，apply只接受计划摘要并再次核依赖/权限；漂移则重新展示，不自动替换。由确认/执行漂移和关闭发布年龄推导，它可能同时保留少操作和审慎放行，但增加计划过期与交互成本。最小验证确认后latest变化、profile改动、重复apply与半途失败，比较未授权版本数、重复执行和恢复时间；若仍安装计划外包则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:195-215](https://github.com/1708994293-hue/dsh-auto-update/blob/22f7d60a000a2c6ad608b25944932a752b690465/lib/index.js#L195-L215)

确认未绑定集合的推导依据。

<details>
<summary>查看原文（21行）</summary>

```text
async function runApply() {
  if (disposed) return;
  if (state.phase === 'updating') return;
  if (state.updates.length === 0) return;
  if (applyPromise) return applyPromise;
  const targets = state.updates.slice();
  state.phase = 'updating';
  state.message = `正在更新 ${targets.map((item) => item.name).join('、')}…`;
  state.error = null;
  log(`用户确认更新：${targets.map((item) => `${item.name} ${item.from}->${item.to}`).join('，')}`);
  writeJson(join(STATE_DIR, 'plugin-state.json'), snapshot());
  applyPromise = (async () => {
    const args = ['--profile', state.profile, '--launched-by', 'user-confirmed'];
    if (process.execPath) args.push('--dsh-exe', process.execPath);
    const result = await runUpdater(args, APPLY_TIMEOUT_MS);
    const lastRun = readJson(join(STATE_DIR, 'last-run.json'));
    const ok = Boolean(lastRun?.ok) && result.ok;
    if (ok) {
      state.updates = [];
      state.phase = 'done';
      state.message = `已更新 ${targets.map((item) => `${item.name} ${item.from} → ${item.to}`).join('，')}，重启 DSH 后生效。`;
```

</details>

**依据 2 · 源码核查**：[lib/update.mjs:584-599](https://github.com/1708994293-hue/dsh-auto-update/blob/22f7d60a000a2c6ad608b25944932a752b690465/lib/update.mjs#L584-L599)

运行时重选集合。

<details>
<summary>查看原文（16行）</summary>

```text
  const { candidates, skipped } = collectCandidates(data);
  result.skipped = skipped;
  log.info(`profile 目录：${data.profileDir}`);
  log.info(`已下载 ${Object.keys(data.dependencies).length} 个依赖，其中启用 ${candidates.length} 个参与检查；跳过 ${skipped.length} 个`);
  for (const item of skipped) log.info(`  跳过 ${item.name}：${item.reason}`);

  if (candidates.length === 0) {
    log.info('没有需要检查的插件，结束');
    writeJsonSafe(path.join(stateDir, 'last-run.json'), { ...result, durationMs: Date.now() - startedAt });
    return 0;
  }

  const checked = await checkCandidates(candidates, log);
  result.checked = checked.map((c) => ({ name: c.name, installed: c.installed, latest: c.latest, updateAvailable: c.updateAvailable }));
  const updates = checked.filter((c) => c.updateAvailable);
  result.updates = updates.map((c) => ({ name: c.name, from: c.installed, to: c.latest }));
```

</details>

#### 缺口

- 确认计划与故障恢复未实现/实测
  **影响**：不能升级为可靠更新事务或值得安装
  **进一步探讨**：按四漂移/失败样例核实际对象和恢复

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
