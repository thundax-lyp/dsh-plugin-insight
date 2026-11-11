# dsh-plugin-rea

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e27a3e8](https://github.com/czcdr/dsh-plugin-rea/tree/e27a3e8ac43da973816c99c5939824a7300f75cf)

<!-- BEGIN META -->
[![GitHub ★ 82](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=82&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/czcdr/dsh-plugin-rea) [![npm 30d 8,519](https://img.shields.io/static/v1?label=npm+30d&message=8%2C519&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-rea) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-rea)
<!-- END META -->

> **功能**：通过本地供给脚本准备 REA 运行环境，并将 REA MCP 工具接入 DeepSeek Harness。

> **亮点**：[Q01](#research-q01) 把组件环境与标准 MCP 行连接，[Q02](#research-q02) 显式提供系统与 bundle 的选择和供给线索。

> **主要限制**：[Q02](#research-q02) auto 可能运行系统 REA，[Q03](#research-q03) 版本探针和 doctor JSON 可读都不足以验收指定分析引擎。

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
  - [Q01 · 插件把哪些工作接入 DSH，分析能力来自何处？](#detail-section-11)
  - [Q02 · 自动供给、市场更新和启动路径如何分开？](#detail-section-12)
  - [Q03 · setup 成功能否证明目标引擎可用，排查成本如何计？](#detail-section-13)
  - [Q04 · 怎样判断是否进入试用，任务级版本记录如何验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH 中查看已授权样本证据的工程师，可以研究 REA 工具接入及实际引擎选择。

独立 REA 环境已能进行分析。这里将组件供给、启动和 DSH 会话组织到一起，分析结果仍受真实引擎及样本限制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| REA MCP | 会话内调用授权样本分析工具 | 引擎实际就绪另验 |
| 运行栈供给 | 准备本机组件 | 市场替换包后需检查运行版本 |
| 状态指南 | 查看 bundle 与 pin 对应 | 不直接执行供给 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 官方 MCP 客户端和可用 Node | 接入必需 | 启动 stdio shim | 保留独立分析环境 |
| 实际 REA 及目标引擎 | 分析必需 | 返回可定位证据 | 只保留观察 |
| setup、缓存及可访问的可信发行来源 | 供给按需 | 配置或修复组件 | 先检查日志和锁 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 确认 | 工程师核对实际 launch 与引擎 | 版本及路径可对应 |
| 验证 | 隔离环境查一个已授权样本 | 结果定位到样本及目标工具 |
| 退出 | 不一致时回既有环境 | 保留版本及原件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 多组件与磁盘未知 | 核对授权和供给 | 平台能力各异 |
| 持续 | 进程与模型费用未知 | 核对升级与引擎 | 市场升级与 bundle 分开 |
| 失败恢复 | 重装与日志资源未知 | 诊断回滚和替代环境 | 回滚与耗时未验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话工具接入 | 标准 MCP 与 shim | 目标任务效果 |
| 运行供给 | manifest、系统选择、版本状态 | 平台覆盖和成功率 |
| 失败诊断 | 锁、日志、旧闭包恢复尝试 | 崩溃与重试结果 |

> **思考**：[Q02](#research-q02) auto 可能运行系统 REA，[Q03](#research-q03) 版本探针和 doctor JSON 可读都不足以验收指定分析引擎。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把组件环境与标准 MCP 行连接，[Q02](#research-q02) 显式提供系统与 bundle 的选择和供给线索。

镜像入口、系统委派和只读指南拆开，闭包替换有恢复尝试，但 JSON 和可启动状态均未验证引擎级结果。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) auto 可能运行系统 REA，[Q03](#research-q03) 版本探针和 doctor JSON 可读都不足以验收指定分析引擎。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先保留观察结论，按已授权样本验证实际运行栈和证据定位，有差异则回已验收环境。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定源码的 MCP、供给、状态与诊断边界，未执行任何安装或分析。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、bin/rea-shim.mjs、scripts/setup.mjs、manifest/bundle.manifest.json、index.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交核查适配、供给与诊断状态。未执行 setup、测试、MCP、上游引擎，也未独立复核依赖安全现状。
- 下一步：同一授权样本比较系统和 bundle 的真实工具结果，在隔离目录检查失败供给与恢复。

**分析版本**

- **仓库**：[czcdr/dsh-plugin-rea](https://github.com/czcdr/dsh-plugin-rea)
- **版本号**：2.0.17（[固定提交 e27a3e8](https://github.com/czcdr/dsh-plugin-rea/tree/e27a3e8ac43da973816c99c5939824a7300f75cf)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 随单项分析证据记录实际启动和引擎就绪范围，可能提高多机复现与故障归因。

同一授权样本比较系统和 bundle 的真实工具结果，在隔离目录检查失败供给与恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 9 | 6375 | 3918 | 2139 | — |
| .md | source | 8 | 3604 | — | — | 55800 |
| .js | source | 1 | 400 | 342 | 27 | — |
| .mjs | test | 4 | 3967 | 2997 | 671 | — |

</details>

**活跃度**

[![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/czcdr/dsh-plugin-rea/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：对有权分析的固定样本，DSH 用户如何确认插件实际启动的 REA 与分析引擎组合，并判断何时退回独立环境？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件把哪些工作接入 DSH，分析能力来自何处？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

已有授权样本、需要从 DSH 查询反编译证据的工程师，可以研究把原本在独立进程使用的 REA 接到同一会话。合格结果要给出目标函数或段落的可定位证据和局限，不能以工具出现或伪代码完整来判断正确性。Cordis patch 配置官方 MCP 客户端，以宿主 Node 执行镜像 shim，stdio 继承给实际 REA。bundle 模式的 shim 根据本地状态为子进程构造环境、选择实际 Node 和 REA 入口。增量来自运行路径、环境变量及工具接线集中，分析算法仍由 REA 和所选引擎提供。已有独立且可重复环境的团队获得的额外价值主要是会话内调用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:45-69](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/README.md#L45-L69)

作者说明官方 MCP 行及第三方接入边界。

<details>
<summary>查看原文（25行）</summary>

```text
Brings the upstream **[REA — Reverse Engineer Anything](https://github.com/morluto/rea)** MCP server into
**DeepSeek Harness** (dsh), so its tools show up in a session as `mcp__rea__*`.

![dsh-plugin-rea: the session calls the official MCP client row, which launches the bundle's shim; the shim starts the provisioned REA and the Evidence comes back](assets/screenshot-1.png)

## What this is

A **Cordis bundle with a provisioning layer**. `package.json` declares `dsh.bundle.patch`, and that patch
inserts one row of the official MCP client plugin (`@deepseek-ai/dsh-mcp-client`). The row launches
`bin/rea-shim.mjs` with the running Node executable; the shim reads the machine-local state that
`scripts/setup.mjs` wrote and starts the REA CLI it provisioned. There is no analysis code here, and the
published patch contains no machine path.

> **Third-party adapter.** This repository is not part of REA, ships none of REA's code, and is not
> maintained by REA's authors. It composes one configuration row and fetches upstream's own releases.
> Upstream: [github.com/morluto/rea](https://github.com/morluto/rea) (MIT) ·
> [docs](https://github.com/morluto/rea#what-you-can-analyze) ·
> [rea.tools](https://rea.tools/) · npm package `rea-agents`.
> REA's own problems go to its tracker; **this plugin's** problems go to
> [this repository's issues](https://github.com/czcdr/dsh-plugin-rea/issues).

**It adds exactly three things:** the tool registration under the `mcp__rea__*` names, the per-machine
engine environment (`GHIDRA_INSTALL_DIR`, `JAVA_HOME`, `REA_ADB_PATH`, `REA_APKTOOL_COMMAND`,
`REA_JADX_MCP_JAR`, `REA_BROWSER_EXECUTABLE`, …) scoped to that MCP child instead of the whole harness, and
the provisioning that puts those components on disk.
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:35-50](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/cordis.patch.yml#L35-L50)

stdio、运行 Node 与本机 shim 路径绑定。

<details>
<summary>查看原文（16行）</summary>

```text
- insert:
    - id: mcp-rea
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: rea
        transport: stdio
        command: !!js process.execPath
        args:
          # DOUBLE-QUOTED on purpose. A bare scalar containing "? " and ": " is not
          # one scalar at all: YAML reads `? a : b` as an explicit key/value pair,
          # so js-yaml hands the loader a mapping instead of an expression node and
          # args[0] becomes an object the launcher cannot use. Quoting makes the
          # scalar unambiguous; the JS string literals inside use single quotes so
          # they cannot collide with the YAML ones.
          - !!js "(process.env.DSH_HOME && process.env.DSH_HOME.trim() !== '' ? process.env.DSH_HOME : (process.env.USERPROFILE || ((process.env.HOMEDRIVE || '') + (process.env.HOMEPATH || '')) || process.env.HOME || '') + '/.dsh') + '/plugins/rea-bundle/bin/rea-shim.mjs'"
          - mcp
```

</details>

**依据 3 · 源码核查**：[bin/rea-shim.mjs:1373-1389](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/bin/rea-shim.mjs#L1373-L1389)

环境生成及实际子进程启动。

<details>
<summary>查看原文（17行）</summary>

```text
  const env = childEnvironment(loaded.config);
  if (argv.includes("--shim-print-env")) {
    const interesting = Object.fromEntries(
      Object.entries(env).filter(([key]) =>
        /^(GHIDRA_INSTALL_DIR|JAVA_HOME|REA_[A-Z0-9_]+|PATH)$/.test(key),
      ),
    );
    process.stdout.write(JSON.stringify(interesting, null, 2) + "\n");
    return 0;
  }

  // Pass through whatever the row supplied; 'mcp' in the normal case.
  const childArgs = [rea.reaEntry, ...argv];
  const child = spawn(rea.node, childArgs, {
    env,
    stdio: "inherit",
    windowsHide: true,
```

</details>

#### 缺口

- 没有同提交、同宿主的 MCP 握手及样本结果。
  **影响**：无法把接线推断为目标函数的分析结果。
  **进一步探讨**：在隔离环境用已知良性样本验证实际工具响应并与已有 REA 输出比对。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 自动供给、市场更新和启动路径如何分开？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

市场替换的是插件包，manifest 钉住预期 REA、Ghidra、JDK 等组件。Web guide 只计算并报告本机状态，它不启动供给。真正启动 MCP 的 shim 在缺失、损坏或无法启动的 bundle 分支会尝试自动供给，环境变量可禁用；是否能启动仍取决于找到 setup 和锁状态。若系统 REA 可用且 bundle 不可启动、显式选 system 或系统版本不旧，auto 也可委派系统 REA，运行时未必来自 manifest。实际升级需区分包、镜像 shim、bundle 和正在运行的系统程序，分别读状态和明确重新准备。

#### 证据与依据

**依据 1 · 源码核查**：[manifest/bundle.manifest.json:21-28](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/manifest/bundle.manifest.json#L21-L28)

固定组件版本约束来自 manifest。

```text
  "pins": {
    "reaAgents": "6.8.0",
    "ghidra": "12.1.4",
    "jdk": "21",
    "apktool": "3.0.3",
    "jadxHeadlessMcp": "0.7.1",
    "node": "24.22.1",
    "nodeEngines": "^22.23.4 || ^24.22.1 || >=26.12.1"
```

**依据 2 · 源码核查**：[index.mjs:63-85](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/index.mjs#L63-L85)

指南只允许 GET/HEAD，计算状态不写文件。

<details>
<summary>查看原文（23行）</summary>

```text
  host.effect(() =>
    server.register({
      kind: 'exact',
      path: GUIDE_ROUTE,
      handler: (req, res) => {
        try {
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            sendJson(res, 405, { error: 'GET only' })
            return
          }
          const facts = packageFacts()
          const state = computeGuideState({
            pluginVersion: facts.pluginVersion,
            pinnedRea: facts.pinnedRea,
          })
          sendJson(res, 200, state, req.method === 'HEAD')
        } catch (error) {
          sendJson(res, 500, {
            error: error && error.message ? error.message : String(error),
          })
        }
      },
    }),
```

</details>

**依据 3 · 源码核查**：[bin/rea-shim.mjs:899-933](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/bin/rea-shim.mjs#L899-L933)

显式 bundle 与系统候选的实际决策。

<details>
<summary>查看原文（35行）</summary>

```text
  if (preference.value === "bundle") {
    return { preference: preference.value, invalid: preference.invalid, mode: "bundle", reason: "pinned by REA_BUNDLE_LAUNCH=bundle" };
  }
  // A delegated child that ends up back in this shim (a wrapper script named
  // `rea` that calls us, a PATH that resolves to a launcher) would recurse
  // forever: the probe cannot break it, because the grandchild starts a fresh
  // one. One flag, written into the child's environment, ends the loop — the
  // nested run takes the bundle path, which either works or fails loudly.
  if ((env.REA_BUNDLE_DELEGATED ?? "") === "1") {
    return {
      preference: preference.value,
      invalid: preference.invalid,
      mode: "bundle",
      reason: "REA_BUNDLE_DELEGATED=1: already running under a delegated system REA, refusing to delegate again",
    };
  }
  const system = await detectSystemRea({ env, platform, root });
  if (system.found) {
    const order = bundleVersion === null ? null : compareDotted(system.version, bundleVersion);
    const pinned = preference.value === "system";
    // No provisioned build at all: there is nothing to compare against, and the
    // machine's own REA is exactly what this mode exists to use.
    if (!bundleRunnable || pinned || (order !== null && order >= 0)) {
      return {
        preference: preference.value,
        invalid: preference.invalid,
        mode: "system",
        reason: pinned
          ? `pinned by REA_BUNDLE_LAUNCH=system (system ${system.version}, bundle ${bundleVersion ?? "none"})`
          : !bundleRunnable
            ? bundleStateReason !== null
              ? `a working REA is on PATH (${system.version}) and ${bundleStateReason}; using the system install`
              : `a working REA is on PATH (${system.version}) and this machine has no provisioned bundle`
            : `the REA on PATH (${system.version}) is at least as new as the provisioned one (${bundleVersion})`,
        system,
```

</details>

**依据 4 · 源码核查**：[bin/rea-shim.mjs:251-256](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/bin/rea-shim.mjs#L251-L256)

自动供给开关、setup 和锁条件。

```text
function maybeAutoProvision(root) {
  if (process.env.REA_BUNDLE_AUTO_PROVISION === "0") return { started: false, reason: "disabled" };
  const setupScript = provisioningScript(root);
  if (!setupScript) return { started: false, reason: "no-setup" };
  const lock = path.join(root, "setup.lock");
  const logPath = path.join(root, "logs", "setup.log");
```

**依据 5 · 源码核查**：[bin/rea-shim.mjs:1326-1346](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/bin/rea-shim.mjs#L1326-L1346)

缺失或坏状态进入自动供给，反馈启动或已有任务。

<details>
<summary>查看原文（21行）</summary>

```text
      : `Bundle state at ${loaded.file} parsed, but it cannot launch REA: ${bundleRea.reason}`;
    // Both "missing"/"malformed" and "unusable" start a run. A malformed file used
    // to fail permanently: setup overwrites a bundle.json it cannot parse, but
    // nothing ever started setup, so every restart reported the same EX_CONFIG
    // until the operator deleted the file by hand. The lock stops a provisioning
    // loop when writing keeps failing.
    const provisioning = maybeAutoProvision(root);
    if (provisioning.started) {
      process.stderr.write(
        `\n  dsh-plugin-rea (bundle): first run — provisioning started in the background.\n  progress: ${provisioning.logPath}\n`,
      );
    } else if (provisioning.reason === "last-run-failed") {
      process.stderr.write(
        `\n  dsh-plugin-rea (bundle): the last provisioning attempt failed (exit ${provisioning.exit ?? "?"}).\n` +
          `  Nothing is running right now — read the log, then re-run setup.\n  log: ${provisioning.logPath}\n`,
      );
    } else if (provisioning.reason === "in-flight") {
      // A live run owns the lock. Saying nothing here is what made a wedged
      // provisioning attempt look like a machine that simply has no bundle.
      process.stderr.write(
        `\n  dsh-plugin-rea (bundle): provisioning is already running in the background.\n  progress: ${provisioning.logPath}\n`,
```

</details>

**依据 6 · 作者声明**：[README.md:29-43](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/README.md#L29-L43)

作者说明市场升级、镜像 shim 与运行时更新的区别。

<details>
<summary>查看原文（15行）</summary>

```text
> **You must run `node scripts/setup.mjs` yourself — once after installing, and once after every plugin
> upgrade.** Nothing runs it for you: a market install or update replaces the package and stops there.
> Since **2.0.8** a market upgrade keeps the *row* working (the mirrored launcher re-execs the new one), but it
> does **not** move the bundle to the new pins — REA and the engines stay at the versions recorded by the last
> setup run. Skip it on a first install and the row exits `MODULE_NOT_FOUND` with no tools and no message;
> skip it after an upgrade and you keep running the old REA silently (`check-updates.ps1` reports the drift).
> If you had enabled the Ghidra gate override (see §9 of the 2026-10-26 review), that setup run re-provisions the
> bundled REA and the patch goes with it — re-enable it afterwards, or accept the pinned Ghidra again.
> The full rule set is under [Updating](#updating--three-independent-things).

> **A first install and every plugin upgrade also show a one-time guide in the Web GUI.** It says whether the
> runtime is missing or behind this package's pin, shows the exact `node "<install path>/scripts/setup.mjs"`
> command for that install, and remembers the dismissal per plugin version. It is a notice only: it never runs
> setup for you and never edits the bundle. Run it once, restart dsh, and the guide stays away until the next
> plugin version.
```

</details>

#### 缺口

- 未运行缺状态、锁失败及市场升级场景。
  **影响**：不能确认真实部署会找到 setup 或选中预期的 bundle。
  **进一步探讨**：用隔离根目录对照版本、shim 状态、日志及实际进程路径。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · setup 成功能否证明目标引擎可用，排查成本如何计？

**研究主题**：缺陷与关键质疑、效果与总成本、工程质量与复用

#### 完整回答

安装流程把原依赖目录移走并切换到 staging 闭包，rename 失败尝试恢复；上线后运行版本探针和 doctor，若 doctor 无法输出可解析 JSON，尝试恢复旧闭包。此处成功条件只检查版本探针和 JSON 是否可解析，没有要求目标引擎工具通过一项真实分析。shim 状态退出码同样根据实际选择的 launch 是否可用，已输出的路径和版本不足以证明工具级就绪。README 还明确记录固定引擎及其版本门槛和作者认为仍需隔离的依赖风险，当前研究未独立核实漏洞状态。需要分别计供给下载与磁盘、诊断和手动升级时间、目标工具失败后的环境恢复。平台不明、引擎未核验或样本来源不明时，保留现有隔离环境。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/setup.mjs:2276-2291](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/scripts/setup.mjs#L2276-L2291)

切换失败后尝试恢复旧依赖。

<details>
<summary>查看原文（16行）</summary>

```text
    if (existsSync(live)) {
      renameSync(live, retired);
      parked = true;
    }
    renameSync(modules, live);
  } catch (error) {
    if (parked && !existsSync(live)) {
      try {
        renameSync(retired, live);
      } catch {
        /* the message below already says where the install did not land */
      }
    }
    rmSync(staging, { recursive: true, force: true });
    step("reaAgents", "FAIL", `could not move the new closure into ${live}: ${String(error?.message ?? error)}`);
    return null;
```

</details>

**依据 2 · 源码核查**：[scripts/setup.mjs:2309-2338](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/scripts/setup.mjs#L2309-L2338)

doctor 成功判据只要求可解析 JSON，与版本探针结合。

<details>
<summary>查看原文（30行）</summary>

```text
  const current = probe();
  const doctorRun = spawnSync(nodeRuntime, [path.join(vendor, "scripts", "rea.mjs"), "doctor", "--format", "json"], {
    encoding: "utf8",
    timeout: 300000,
    windowsHide: true,
  });
  const doctorOutput = `${doctorRun.stdout ?? ""}`.trim();
  const doctorAnswered = doctorOutput.startsWith("{") && (() => {
    try {
      JSON.parse(doctorOutput);
      return true;
    } catch {
      return false;
    }
  })();

  const restorePreviousClosure = () => {
    if (!parked) return false;
    try {
      rmSync(live, { recursive: true, force: true });
      renameSync(retired, live);
      return true;
    } catch {
      return false;
    }
  };

  if (!current.ok || !doctorAnswered) {
    const why = !current.ok ? current.detail : `doctor did not answer with JSON (exit ${doctorRun.status})`;
    const restored = restorePreviousClosure();
```

</details>

**依据 3 · 源码核查**：[bin/rea-shim.mjs:1276-1292](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/bin/rea-shim.mjs#L1276-L1292)

状态区分已解析配置与可启动。

<details>
<summary>查看原文（17行）</summary>

```text
    if (loaded.ok) {
      report.paths = loaded.config.paths ?? {};
      report.versions = loaded.config.versions ?? {};
      // `bundleUsable` is what makes the fields above trustworthy: paths and
      // versions can be reported for a bundle that cannot start, and a caller
      // reading only those would conclude the opposite of `rea.ok`.
      report.bundleUsable = bundleUsable;
      report.rea = bundleRea;
    }
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    // The row works either way round — a system launch needs no bundle, a bundle
    // launch needs a bundle that can actually start REA. Reporting 0 off
    // `loaded.ok` meant a parsed-but-broken bundle looked healthy until the row
    // started and exited non-zero, which is the one thing a status command exists
    // to prevent.
    const usable = launch.mode === "system" ? launch.unusable !== true : bundleUsable;
    return usable ? 0 : EX_CONFIG;
```

</details>

**依据 4 · 作者声明**：[README.md:13-27](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/README.md#L13-L27)

作者报告固定 REA 的引擎门槛及其环境风险。

<details>
<summary>查看原文（15行）</summary>

```text
> REA **6.8.0** — this package's pin — still accepts Ghidra **12.1.x** only (12.2 is `unsupported`, and the whole
> Ghidra decompile/analysis group disappears) and the jadx bridge **0.7.1** only (0.8.0 fails on its first call with
> `Expected engine 0.7.1`, before any APK is loaded). Both gates were re-checked against 6.8.0 on 2026-10-26 and
> neither one moved. JDK **21.0.13** is out upstream, but Adoptium publishes no Windows build of it, so there is
> nothing to point at here — and it drops only three of the four eMudhra anchors. The trade-off is therefore "all
> tools green, CVE still open": Ghidra 12.1.4's CVE-2026-100504 / 100505 / 100503 / 113604 stay in the chain — **do
> not analyse untrusted samples with this environment** — and the JDK still trusts the eMudhra anchors. Evidence,
> mitigations and revisit triggers: [docs/update-review-2026-10-24.md](docs/update-review-2026-10-24.md) and
> [docs/update-review-2026-10-26.md](docs/update-review-2026-10-26.md).
>
> **Ghidra 12.2 itself works** — measured 2026-10-26: same 9 segments, same 341 procedures, byte-identical `entry`
> pseudocode as 12.1.4, through REA's own bridge. What blocks it is REA's version-equality check, not the bridge.
> If you want the CVE-fixed engine anyway, `node scripts/ghidra-gate-override.mjs --enable --version 12.2` rewrites
> that one constant in the vendored copy, records what it changed in `<bundle>/ghidra-gate-override.json`, and
> `--disable` restores it; re-running setup reverts it too. It needs **JDK 25+** (`application.java.min=25`).
```

</details>

#### 缺口

- 未重现引擎初始化、平台差异、闭包回滚和安全问题。
  **影响**：不将 setup 成功或作者描述升格为运行栈安全和可用性结论。
  **进一步探讨**：在隔离环境逐项运行被选引擎的最小已授权任务，并核对实际版本与读回。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样判断是否进入试用，任务级版本记录如何验证？

**研究主题**：新假设与验证、采用判断

#### 完整回答

目前适合先观察运行栈和分析范围。已具备独立 REA 的人员，可在隔离 DSH profile 中记录实际 launch mode 和引擎版本，用一个已知样本核对函数证据；若系统与 bundle 选择不符、引擎不可用或证据无法回到样本，则回独立环境。假设是在任务输出旁保存实际启动方式、REA、引擎与 readiness 的只读清单，避免只记插件包版本。在配置一台系统 REA 比 bundle 更新、另一台 bundle 可用的条件下，对照现有 shim 状态和任务内清单，记录找出运行差异的时间与误判。若记录无法跟上实际进程，或不能改善归因，则保留外部验收单。

#### 证据与依据

**依据 1 · 源码核查**：[bin/rea-shim.mjs:1252-1284](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/bin/rea-shim.mjs#L1252-L1284)

现有状态提供实际选择与 bundle 状态，可作为对照。

<details>
<summary>查看原文（33行）</summary>

```text
  if (argv.includes("--shim-status")) {
    const report = {
      bundleRoot: root,
      bundleFile: loaded.file,
      provisioned: loaded.ok,
      reason: loaded.ok ? undefined : loaded.code,
      autoProvision: process.env.REA_BUNDLE_AUTO_PROVISION ?? "(default)",
      launch: {
        preference: launch.preference,
        mode: launch.mode,
        reason: launch.reason,
        // Reported, not implied: `mode: "system"` with `unusable: true` is a
        // request that cannot be met, and a caller reading only the mode would
        // draw the opposite conclusion.
        unusable: launch.unusable === true,
        systemRea: launch.system?.found ? { file: launch.system.file, version: launch.system.version } : null,
      },
    };
    if (launch.system?.rejected?.length) report.launch.rejected = launch.system.rejected;
    // A mirrored copy that lags the plugin keeps working, which is exactly why
    // nobody notices it: the row runs old code until the mirror is refreshed.
    // Reported here so `--shim-status` answers "am I running what I installed?".
    if (mirror !== null) report.mirror = mirror;
    if (duplicate) report.duplicateRegistration = duplicate;
    if (loaded.ok) {
      report.paths = loaded.config.paths ?? {};
      report.versions = loaded.config.versions ?? {};
      // `bundleUsable` is what makes the fields above trustworthy: paths and
      // versions can be reported for a bundle that cannot start, and a caller
      // reading only those would conclude the opposite of `rea.ok`.
      report.bundleUsable = bundleUsable;
      report.rea = bundleRea;
    }
```

</details>

**依据 2 · 源码核查**：[bin/rea-shim.mjs:1291-1292](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/bin/rea-shim.mjs#L1291-L1292)

退出码只对应选择路径能否启动。

```text
    const usable = launch.mode === "system" ? launch.unusable !== true : bundleUsable;
    return usable ? 0 : EX_CONFIG;
```

**依据 3 · 作者声明**：[README.md:71-83](https://github.com/czcdr/dsh-plugin-rea/blob/e27a3e8ac43da973816c99c5939824a7300f75cf/README.md#L71-L83)

作者界定伪代码和结果限制。

<details>
<summary>查看原文（13行）</summary>

```text
## What it can and cannot do

The analysis is upstream's; this section only restates upstream's own contract so expectations are right.

- **It cannot recover complete source code.** For native binaries upstream returns *pseudocode and
  assembly*, for Android APKs *decompiled methods*, for JEB units *pseudocode*, and for JavaScript/Electron
  *modules and their relations*. Upstream's tool contract states the pseudocode "is decompiler output, not
  original source and not text-equivalent" to another provider's output.
- Not recoverable in practice: original identifier names, types, comments, macros and template expansion,
  build scripts and assets. Optimisation (inlining, reordering), symbol stripping, obfuscation, packing and
  VM protection only make the output worse.
- Every result carries **confidence and limitations** (`observed` / `derived` / `inferred`, plus an explicit
  limitations list). Read them as evidence, never as recovered source.
```

</details>

#### 缺口

- 任务级版本清单未实现或验证。
  **影响**：不能断言能减少排障时间。
  **进一步探讨**：固定样本、两种安装状态和同一证据比对步骤。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
