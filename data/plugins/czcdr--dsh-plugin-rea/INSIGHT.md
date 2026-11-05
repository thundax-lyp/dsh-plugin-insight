# dsh-plugin-rea

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[4d8a082](https://github.com/czcdr/dsh-plugin-rea/tree/4d8a08266d393712fcf3f1691a723f510f21e9bc)

<!-- BEGIN META -->
[![GitHub ★ 70](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=70&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/czcdr/dsh-plugin-rea) [![npm 30d 6,503](https://img.shields.io/static/v1?label=npm+30d&message=6%2C503&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-rea) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-rea)
<!-- END META -->

> **功能**：为 DSH 接入上游 REA 的 MCP 服务，集中准备运行时与逆向工具依赖，并提供供给状态指引。

> **亮点**：把REA及其依赖供给、路径记录、镜像启动和DSH行配置组织起来，使接入状态可检查；逆向核心能力归上游，并未因此获得新算法。[Q01](#research-q01)

> **主要限制**：auto可委派系统REA，doctor的probe ok仍可有unmet，Windows强杀又可能留下进程；包钉子不等于任务运行栈固定或所有工具可用。[Q03](#research-q03)

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
  - [Q01 · REA接入包相对手工MCP配置增加了什么？](#detail-section-11)
  - [Q02 · 从安装到真实REA进程经过哪些状态？](#detail-section-12)
  - [Q03 · 固定版本和探针能保证什么，升级与进程有什么风险？](#detail-section-13)
  - [Q04 · 供给复杂性值得承担吗，如何验证相对价值？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在DSH调用REA做授权分析的技术用户可研究集中供给与MCP启动，不把上游工具数量当正确性保证。[Q01](#research-q01)

手工部署REA和各引擎再写MCP配置更直接但路径分散；本包集中版本探针和诊断，同时增加镜像与选择状态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| REA MCP适配 | 把上游服务接到DSH | 工具与引擎归上游，未逐一验证 |
| 依赖供给与复用 | 记录Node/REA/引擎路径 | 网络/平台/探针条件；不是全闭包离线锁 |
| 启动选择与状态诊断 | 辨明system或bundle及重复注册 | auto可选择较新系统REA |
| 只读setup指引 | 显示供给状态 | 不自动替用户执行首次setup |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH MCP client与stdio服务 | 接入必需 | 启动mcp-rea | 无握手则无可用工具 |
| setup生成的镜像shim | bundle行必需 | HOME下真实入口 | 首次未供给时模块不存在 |
| 符合manifest的Node/REA | 必需 | 运行CLI和MCP | 显式system无可用REA则失败 |
| JDK/Ghidra等引擎 | 特定工具必需 | 上游分析 | doctor列unmet不等于整体不可启动 |
| 网络、磁盘与解压工具 | 供给时条件 | 取得组件 | offline缺REA则拒绝安装 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定包和目标模式，检查授权样本 | 先dry-run理解供给计划 |
| 供给 | 用户从安装包运行setup | 核对bundle路径/版本/日志与unmet |
| 加载 | 宿主启动镜像shim再启动实际REA | 保存实际mode/version并验证MCP握手 |
| 任务与退出 | 用户检验目标工具产物和进程 | 失败回独立REA，Windows核查残留进程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 多组件下载/磁盘和模型费用未知 | 探针、代理、解压和版本处理 | 复用是否可行取决于环境 |
| 持续使用 | REA进程与引擎资源未知 | 对齐包/镜像/bundle/system状态 | auto可能改变实际REA |
| 失败恢复 | 重新供给或独立环境资源未知 | 读锁/日志、重跑setup、查残留 | 后台开始不等于MCP就绪 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中供给 | manifest、setup和bundle状态写入 | 平台完整成功率与耗时 |
| MCP接入 | patch与shim真实spawn链 | 目标工具可用与结果正确 |
| 诊断 | mode/unmet/重复注册等信息 | 是否降低实际排障负担 |

> **思考**：auto可委派系统REA，doctor的probe ok仍可有unmet，Windows强杀又可能留下进程；包钉子不等于任务运行栈固定或所有工具可用。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把REA及其依赖供给、路径记录、镜像启动和DSH行配置组织起来，使接入状态可检查；逆向核心能力归上游，并未因此获得新算法。[Q01](#research-q01)

启动选择与镜像回退显式报告，ignore-scripts和offline拒绝路径说明供给边界；Windows进程树和多层状态仍是移植代价。[Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

auto可委派系统REA，doctor的probe ok仍可有unmet，Windows强杀又可能留下进程；包钉子不等于任务运行栈固定或所有工具可用。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先记录实际启动mode/version并核查授权样本的目标引擎，不能把probe ok或工具目录当全能力通过；不清楚就回已知独立环境。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

供给和MCP启动适配有固定源码依据，上游REA各工具及真实宿主未验证；任务清单为假设。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、manifest/bundle.manifest.json、index.mjs、bin/rea-shim.mjs、scripts/setup.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核查接入包供给、shim、manifest与guide；REA上游算法及各引擎不在固定研究范围，未执行任何目标或下载依赖。
- 下一步：固定实际launch模式、上游REA版本与宿主后，检查MCP初始化、一个目标工具的授权样本及取消/退出进程；再对照手工部署成本。

**分析版本**

- **仓库**：[czcdr/dsh-plugin-rea](https://github.com/czcdr/dsh-plugin-rea)
- **版本号**：2.0.13（[固定提交 4d8a082](https://github.com/czcdr/dsh-plugin-rea/tree/4d8a08266d393712fcf3f1691a723f510f21e9bc)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

任务级实际启动与引擎就绪清单可能提高环境漂移后的复现，需与现有status对比排障时间和维护负担；尚未实现。[Q04](#research-q04)

固定实际launch模式、上游REA版本与宿主后，检查MCP初始化、一个目标工具的授权样本及取消/退出进程；再对照手工部署成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 8 | 4735 | 2981 | 1499 | — |
| .md | source | 6 | 2492 | — | — | 37984 |
| .js | source | 1 | 400 | 342 | 27 | — |
| .mjs | test | 1 | 2241 | 1731 | 346 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/czcdr/dsh-plugin-rea/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/czcdr/dsh-plugin-rea/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/czcdr/dsh-plugin-rea/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：一体供给与shim能否使REA接入更可追溯，同时不把依赖探针当任务可用性？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · REA接入包相对手工MCP配置增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已获授权分析二进制或应用、希望把REA接入DSH的技术用户。它的独立贡献是供给运行环境、记录本机路径、通过stdio MCP启动上游REA并显示只读setup指引；REA自身的逆向工具、Ghidra能力不属于本包原创，也未在本次固定材料中逐一核查。相对手工安装Node/JDK/Ghidra、REA再写MCP配置，manifest与setup集中版本和探针，减少路径接线分散。合格结果是明确启动了哪个REA、必要引擎满足什么条件并能完成授权样本任务，不是看见工具目录就判定逆向结果正确。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:2-4](https://github.com/czcdr/dsh-plugin-rea/blob/4d8a08266d393712fcf3f1691a723f510f21e9bc/package.json#L2-L4)

作者一体供给定位。

```text
  "name": "dsh-plugin-rea",
  "version": "2.0.13",
  "description": "One-plugin bundle: provisions Node/REA/JDK/Ghidra for you, then registers the upstream REA MCP server as mcp__rea__* tools. · 一体包：自动准备 Node/REA/JDK/Ghidra，并把上游 REA 的 MCP 服务接入 DeepSeek Harness。",
```

**依据 2 · 源码核查**：[manifest/bundle.manifest.json:21-28](https://github.com/czcdr/dsh-plugin-rea/blob/4d8a08266d393712fcf3f1691a723f510f21e9bc/manifest/bundle.manifest.json#L21-L28)

固定供给版本。

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

**依据 3 · 源码核查**：[cordis.patch.yml:35-56](https://github.com/czcdr/dsh-plugin-rea/blob/4d8a08266d393712fcf3f1691a723f510f21e9bc/cordis.patch.yml#L35-L56)

stdio MCP启动镜像shim。

<details>
<summary>查看原文（22行）</summary>

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
        env:
          # Only meaningful when the harness itself runs on Electron; harmless
          # for a plain Node host. Explicit is better than relying on this
          # variable happening to survive the child-env scrub.
          ELECTRON_RUN_AS_NODE: '1'
        failOnStartupError: false
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从安装到真实REA进程经过哪些状态？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

bundle插入mcp-rea行，使用当前Node执行HOME下镜像shim，另插rea-guide读本机状态。setup才创建镜像和bundle.json；guide路由只GET/HEAD报告状态，不执行setup。shim先读状态并做启动选择：auto可使用探针可用且不旧于bundle的系统REA，无bundle时也可直接使用系统版；显式bundle保持bundle路径，显式system不可用则失败。bundle缺失/损坏可触发后台供给并立即返回失败等待后续启动；不应把“供给已开始”当MCP已就绪。bundle模式从记录导出环境并启动node+REA入口，继承stdio。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:58-85](https://github.com/czcdr/dsh-plugin-rea/blob/4d8a08266d393712fcf3f1691a723f510f21e9bc/index.mjs#L58-L85)

只读guide路由。

<details>
<summary>查看原文（28行）</summary>

```text
function mountGuideRoute(host) {
  const server = host && host.webServer
  if (!server || typeof server.register !== 'function') return
  if (typeof host.effect !== 'function') return

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

**依据 2 · 源码核查**：[bin/rea-shim.mjs:837-900](https://github.com/czcdr/dsh-plugin-rea/blob/4d8a08266d393712fcf3f1691a723f510f21e9bc/bin/rea-shim.mjs#L837-L900)

启动选择与系统版漂移边界。

<details>
<summary>查看原文（64行）</summary>

```text
async function resolveLaunch({ root, bundleVersion = null, bundleProvisioned = false, env = process.env, platform = process.platform } = {}) {
  const preference = launchPreference(env);
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
    if (!bundleProvisioned || pinned || (order !== null && order >= 0)) {
      return {
        preference: preference.value,
        invalid: preference.invalid,
        mode: "system",
        reason: pinned
          ? `pinned by REA_BUNDLE_LAUNCH=system (system ${system.version}, bundle ${bundleVersion ?? "none"})`
          : !bundleProvisioned
            ? `a working REA is on PATH (${system.version}) and this machine has no provisioned bundle`
            : `the REA on PATH (${system.version}) is at least as new as the provisioned one (${bundleVersion})`,
        system,
      };
    }
    return {
      preference: preference.value,
      invalid: preference.invalid,
      mode: "bundle",
      reason: order === null
        ? `the REA on PATH (${system.version}) cannot be compared with the provisioned one (${bundleVersion}); keeping the bundle — set REA_BUNDLE_LAUNCH=system to use the system install`
        : `the REA on PATH (${system.version}) is older than the provisioned one (${bundleVersion}); set REA_BUNDLE_LAUNCH=system to use it anyway`,
      system,
    };
  }
  if (preference.value === "system") {
    return {
      preference: preference.value,
      invalid: preference.invalid,
      mode: "system",
      reason: `REA_BUNDLE_LAUNCH=system, but no usable REA was found (${system.reason})`,
      system,
      unusable: true,
    };
  }
  return {
    preference: preference.value,
    invalid: preference.invalid,
    mode: "bundle",
    reason: `no usable system REA (${system.reason})`,
    system,
  };
```

</details>

**依据 3 · 源码核查**：[bin/rea-shim.mjs:1240-1272](https://github.com/czcdr/dsh-plugin-rea/blob/4d8a08266d393712fcf3f1691a723f510f21e9bc/bin/rea-shim.mjs#L1240-L1272)

缺状态自动供给而非立即就绪。

<details>
<summary>查看原文（33行）</summary>

```text
  if (!loaded.ok) {
    const message =
      loaded.code === "missing"
        ? `No bundle state at ${loaded.file}.`
        : `Bundle state at ${loaded.file} could not be parsed.`;
    // Both "missing" and "malformed" start a run. A malformed file used to fail
    // permanently: setup overwrites a bundle.json it cannot parse, but nothing
    // ever started setup, so every restart reported the same EX_CONFIG until the
    // operator deleted the file by hand. The lock stops a provisioning loop when
    // writing keeps failing.
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
      );
    } else if (provisioning.reason === "spawn-failed" || provisioning.reason === "unwritable") {
      process.stderr.write(
        `\n  dsh-plugin-rea (bundle): provisioning could not be started (${provisioning.reason}).\n` +
          `  Run it by hand:\n    node "${path.join(root, "scripts", "setup.mjs")}" --root "${root}"\n`,
      );
    }
    return fail(message, loaded.detail);
```

</details>

**依据 4 · 源码核查**：[bin/rea-shim.mjs:1275-1312](https://github.com/czcdr/dsh-plugin-rea/blob/4d8a08266d393712fcf3f1691a723f510f21e9bc/bin/rea-shim.mjs#L1275-L1312)

真实进程与退出。

<details>
<summary>查看原文（38行）</summary>

```text
  const rea = resolveRea(loaded.config, root);
  if (!rea.ok) return fail(rea.reason);

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
  });

  child.on("error", (error) => {
    process.stderr.write(
      `rea-shim: could not start ${rea.node}\n  ${String(error && error.message)}\n`,
    );
    process.exit(EX_CONFIG);
  });
  child.on("exit", (code, signal) => {
    if (signal) {
      // Re-raising the signal is not portable: process.kill(pid, "SIGTERM")
      // throws ERR_UNKNOWN_SIGNAL on Windows. Report the conventional 128+n
      // status instead, which the harness reads the same way.
      const signals = { SIGHUP: 1, SIGINT: 2, SIGQUIT: 3, SIGKILL: 9, SIGTERM: 15 };
      process.exit(128 + (signals[signal] ?? 0));
    }
    process.exit(code ?? 0);
  });
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 固定版本和探针能保证什么，升级与进程有什么风险？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

本包manifest钉REA6.8.0、Ghidra12.1.4、JDK21及Node下限，但auto模式可能委派较新系统REA，因此同一包版本不保证相同工具集合；应记录shim-status的实际mode/version。setup下载或复用依赖，并npm install rea-agents精确版本且ignore-scripts；这不等于完整依赖闭包已离线锁定，offline时vendored REA不可用会拒绝联网安装。doctor只要可解析JSON便报告probe ok，同时列unmet，并非所有工具健康。镜像陈旧时可跳到安装包的新shim，跳转失败回旧副本；Windows强杀委派shim不带走REA子进程，用户需核对残留。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/setup.mjs:1366-1439](https://github.com/czcdr/dsh-plugin-rea/blob/4d8a08266d393712fcf3f1691a723f510f21e9bc/scripts/setup.mjs#L1366-L1439)

offline与精确REA安装、跳过生命周期。

<details>
<summary>查看原文（74行）</summary>

```text
  // `--offline is a promise, not a hint` — and this is the one step that cannot be
  // served from the cache: it is an npm install, not a download. It used to run
  // anyway, so a machine with every archive pre-cached still went to the registry
  // (or failed there) after the flag had promised it would not.
  if (options.offline) {
    step("reaAgents", "FAIL", `--offline and the vendored REA at ${vendor} is not usable; npm install needs the registry (drop --offline or pre-install it)`);
    return null;
  }

  /*
   * A plain pack+unpack cannot work here: the published tarball carries no
   * node_modules, so the CLI would fail with ERR_MODULE_NOT_FOUND on its own
   * dependencies. A real install resolves the dependency closure.
   *
   * Lifecycle scripts are skipped on purpose. REA needs no build step, the
   * vendored copy must be byte-predictable, and pnpm/npm would otherwise be
   * free to run arbitrary package scripts during a provisioning step.
   */
  mkdirSync(installRoot, { recursive: true });

  /*
   * Resolve npm, do not assume it.
   *
   * On the machine this bundle exists for, `npm` is only on PATH because a
   * system Node happens to be installed; the bootstrap's whole job is the case
   * where it is not. A bare `spawnSync("npm", ...)` therefore dies with ENOENT
   * on exactly the target machine — and did, until this was fixed. The vendored
   * or discovered Node ships its own npm-cli.js, which is used instead.
   */
  const nodeRuntime = context.resolved.node?.path && existsSync(context.resolved.node.path)
    ? context.resolved.node.path
    : process.execPath;
  const npmCandidates = [
    // Portable Windows zip: <node>\node_modules\npm\bin\npm-cli.js
    path.join(path.dirname(nodeRuntime), "node_modules", "npm", "bin", "npm-cli.js"),
    // POSIX tarball: <node>/lib/node_modules/npm/bin/npm-cli.js
    path.join(path.dirname(nodeRuntime), "..", "lib", "node_modules", "npm", "bin", "npm-cli.js"),
    // An installed Node: <prefix>/lib/node_modules/..., also covered above.
    path.join(path.dirname(nodeRuntime), "..", "..", "lib", "node_modules", "npm", "bin", "npm-cli.js"),
  ];
  const npmCli = npmCandidates.find((candidate) => existsSync(candidate)) ?? null;

  const installArgs = [
    "install",
    `rea-agents@${version}`,
    "--prefix", installRoot,
    "--no-save",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    "--loglevel", "error",
  ];
  if (!npmCli) {
    step("reaAgents", "FAIL", `no npm-cli.js next to ${nodeRuntime}; cannot resolve the dependency closure without npm`);
    return null;
  }
  log(`       ${path.relative(installRoot, npmCli) || npmCli} (vendored npm, not PATH)`);
  const install = spawnSync(nodeRuntime, [npmCli, ...installArgs], {
    cwd: installRoot,
    encoding: "utf8",
    timeout: 1800000,
  });
  if (install.status !== 0) {
    step("reaAgents", "FAIL", `npm install failed (${install.status}): ${`${install.stderr ?? ""}${install.stdout ?? ""}`.trim().split("\n").slice(-3).join(" | ").slice(0, 300)}`);
    // Every other component can fall back to the proxy route this script resolves
    // itself; npm cannot, and this step is the one that fails most often on a
    // network where the registry needs a mirror.
    log("       npm reads HTTPS_PROXY/HTTP_PROXY and NPM_CONFIG_REGISTRY from the environment (this script's own proxy routing does not apply here)");
    return null;
  }

  const current = probe();
  step("reaAgents", current.ok ? "ok" : "FAIL", `${vendor}${current.ok ? "" : " — " + current.detail}`);
  return current.ok ? { path: vendor, version } : null;
```

</details>

**依据 2 · 源码核查**：[scripts/setup.mjs:1693-1733](https://github.com/czcdr/dsh-plugin-rea/blob/4d8a08266d393712fcf3f1691a723f510f21e9bc/scripts/setup.mjs#L1693-L1733)

probe ok不要求所有检查满足。

<details>
<summary>查看原文（41行）</summary>

```text
  // Readiness probe: REA's own verdict, run through the vendored CLI.
  //
  // `rea doctor` exits non-zero when any check is unmet, and on Windows some
  // checks are unmet by upstream design (Hopper is macOS-only; IDA needs a
  // user-owned IDA). A non-zero exit is therefore NOT a provisioning failure:
  // what matters is that the CLI runs, emits parseable JSON, and reports the
  // tool catalog. Unmet checks are reported, not treated as errors.
  const reaEntry = paths.reaEntry;
  // The same two variables the mirrored shim exports. Without them REA falls
  // back to probing the machine, so `doctor` here reported whichever Ghidra and
  // JDK happened to be installed globally — on a machine with an older global
  // Ghidra this run's own engine was never the thing being checked, and a broken
  // vendor copy could still come back healthy.
  const reaEnv = {
    ...process.env,
    ...(paths.ghidra ? { GHIDRA_INSTALL_DIR: paths.ghidra } : {}),
    ...(paths.jdk ? { JAVA_HOME: paths.jdk } : {}),
  };
  if (existsSync(reaEntry)) {
    const doctor = spawnSync(nodePath, [reaEntry, "doctor", "--json"], { encoding: "utf8", timeout: 300000, env: reaEnv });
    const stdout = doctor.stdout ?? "";
    let parsed = null;
    try {
      parsed = JSON.parse(stdout);
    } catch {
      parsed = null;
    }
    if (parsed) {
      const unmet = (parsed.checks ?? []).filter((check) => !check.ok);
      const tools = parsed.identity?.catalog?.counts?.mcp_tools ?? "?";
      step("probe", "ok", `cli=${parsed.identity?.cli_package_version ?? "?"} healthy=${parsed.healthy} tools=${tools} unmet=${unmet.length}`);
      for (const check of unmet) log(`       unmet: ${check.name} — ${check.remediation ?? check.detail ?? ""}`);
    } else {
      step(
        "probe",
        "FAIL",
        `rea doctor produced no JSON (exit ${doctor.status}): ${`${stdout}${doctor.stderr ?? ""}`.trim().slice(0, 200)}`,
      );
    }
  } else {
    step("probe", "FAIL", "vendored REA CLI is missing; the MCP row will report unprovisioned");
```

</details>

**依据 3 · 源码核查**：[bin/rea-shim.mjs:1143-1154](https://github.com/czcdr/dsh-plugin-rea/blob/4d8a08266d393712fcf3f1691a723f510f21e9bc/bin/rea-shim.mjs#L1143-L1154)

镜像跳转失败回旧副本。

<details>
<summary>查看原文（12行）</summary>

```text
  const isCheckout = existsSync(path.join(PLUGIN_ROOT, "cordis.patch.yml"));
  if (!isCheckout && mirror !== null && mirror.stale && process.env.REA_BUNDLE_SHIM_REEXEC !== "1" && !argv.includes("--shim-status")) {
    const source = pluginCheckout(root);
    if (source !== null) {
      // It resolves only when the re-exec did not take over; while the child
      // runs, this process is parked and the child's exit is the exit.
      await reexecFromCheckout(source, argv);
      // The re-exec did not take over: a spawn failure, a child that exited
      // before its spawn event, or one that started and found its own file gone
      // (see the exit handler). Say so and run this copy for real — the point of
      // the fallback.
      process.stderr.write(`rea-shim: could not run ${source}; running the mirrored copy instead.\n`);
```

</details>

**依据 4 · 源码核查**：[bin/rea-shim.mjs:904-935](https://github.com/czcdr/dsh-plugin-rea/blob/4d8a08266d393712fcf3f1691a723f510f21e9bc/bin/rea-shim.mjs#L904-L935)

系统委派与Windows硬杀边界。

<details>
<summary>查看原文（32行）</summary>

```text
function launchSystemRea(system, argv) {
  // No `["mcp"]` fallback: `main` already answers a zero-argument start, so this
  // helper only ever sees the arguments the row passed. Keeping a fallback here
  // made the two places disagree about what an empty argument list means, and the
  // fallback was unreachable anyway.
  const args = argv;
  const useShell = process.platform === "win32" && /\.(cmd|bat)$/i.test(system.file);
  // `REA_BUNDLE_DELEGATED` marks the child as "already the system REA". Without
  // it a wrapper on PATH that calls this shim would delegate to itself forever.
  const env = { ...process.env, REA_BUNDLE_DELEGATED: "1" };
  // Only the PATH is quoted. Quoting the arguments too would hand them to a
  // `.cmd`'s `%*` WITH their quotes (`"mcp"` instead of `mcp`) — measured — which
  // is a different command line than the 1.x row produced. The row passes `mcp`
  // and nothing else, so plain tokens are the contract here; an argument that
  // needs shell quoting is not something this path supports (cmd would also
  // expand `%NAME%` inside it).
  const child = useShell
    ? spawn(comspec(), ["/d", "/s", "/c", `"${[cmdQuote(system.file), ...args].join(" ")}"`], {
        env,
        stdio: "inherit",
        windowsHide: true,
        windowsVerbatimArguments: true,
      })
    : spawn(system.file, args, { env, stdio: "inherit", windowsHide: true });
  // No signal forwarding on Windows, deliberately. `child.kill()` there is
  // TerminateProcess on the cmd.exe WRAPPER — the REA inside it survives, still
  // holding the inherited pipes — and a console Ctrl+C is delivered to the whole
  // process group anyway, so the child already has it. A hard kill of this shim
  // (what a supervisor or Task Manager does) runs no JavaScript at all, so the
  // wrapper must not pretend otherwise: on Windows the delegated REA outlives a
  // forcibly killed shim. On POSIX the child is in this process's group and gets
  // the terminal's signal directly; `process.exit` below then ends the shim.
```

</details>

#### 缺口

- 上游REA固定源码、所有引擎和当前宿主MCP握手未独立核查。
  **影响**：不能确认具体逆向工具可用或分析结果正确，运行环境可能部分满足。
  **进一步探讨**：固定实际launch mode与REA版本，对授权小样本检查MCP握手、目标引擎、产物和退出进程树。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 供给复杂性值得承担吗，如何验证相对价值？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

首次下载与解包多个运行时/引擎或复用既有安装，需要网络、磁盘、解压工具和版本探针；具体平台资源与耗时未知。持续要对齐插件包、镜像、bundle和可选系统REA四层状态，失败需读供给日志、处理锁与残留进程；模型与逆向任务的费用另计。对于已会手工MCP接入的人，供给便利未必抵消维护层数，当前建议观察，先核查实际mode与授权小样本，而非安装后把数百工具全开放。可提出“每次任务保存实际启动与引擎就绪清单”的未验证假设，以同一环境漂移轨迹比较复现失败和排障时间；若现有status已足够或清单负担过高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[manifest/bundle.manifest.json:3-17](https://github.com/czcdr/dsh-plugin-rea/blob/4d8a08266d393712fcf3f1691a723f510f21e9bc/manifest/bundle.manifest.json#L3-L17)

供给而非包内再分发。

<details>
<summary>查看原文（15行）</summary>

```text
    "Component manifest for the one-plugin bundle. Every entry is fetched from an",
    "official vendor source and verified before use. Fields:",
    "  sha256   - REQUIRED for offline integrity. Vendor-published where one exists;",
    "             otherwise measured once and recorded here, and drift is reported",
    "             rather than silently accepted. 'unverified' means neither was done",
    "             yet, and setup then pins the hash it observes on first fetch.",
    "  size     - expected byte count, used for truncation checks and resume math.",
    "  license  - license of the upstream project, not a redistribution claim.",
    "  requires - components whose binaries this one needs to run.",
    "  binaries - workspace-relative entries inside the unpacked directory that are",
    "             directly spawnable; the first that exists becomes the component's",
    "             recorded path so another component can depend on it.",
    "  executable - a placed file that must carry the POSIX exec bit (a wrapper REA",
    "             spawns without a shell); setup chmods exactly these to 0755.",
    "Nothing here is redistributed inside the npm package; setup downloads it."
```

</details>

**依据 2 · 源码核查**：[bin/rea-shim.mjs:1157-1183](https://github.com/czcdr/dsh-plugin-rea/blob/4d8a08266d393712fcf3f1691a723f510f21e9bc/bin/rea-shim.mjs#L1157-L1183)

launch和重复注册诊断。

<details>
<summary>查看原文（27行）</summary>

```text
  const loaded = readBundleConfig(root);
  // Decide what to run before asking whether the bundle is provisioned: a
  // machine with its own working REA must not be sent into an ~800 MB
  // provisioning run just because this bundle has no state yet.
  const bundleVersion = loaded.ok ? (loaded.config.versions?.reaAgents ?? null) : null;
  const launch = await resolveLaunch({ root, bundleVersion, bundleProvisioned: loaded.ok });
  if (launch.invalid !== null) {
    process.stderr.write(
      `rea-shim: REA_BUNDLE_LAUNCH="${launch.invalid}" is not one of ${LAUNCH_MODES.join("/")}; using auto.\n`,
    );
  }
  // Upstream can add a second row for the same serverName; the shim cannot stop
  // DSH from loading both rows, but saying so is better than doubled tools with
  // no stated cause. The status report carries the same fact for diagnostics.
  const duplicate = foreignReaRegistration(root);
  if (duplicate && !argv.includes("--shim-status")) {
    process.stderr.write(
      `\n  dsh-plugin-rea (bundle): duplicate REA registration.\n` +
        `  ${duplicate.patch} also registers serverName "rea" (id "${duplicate.id}").\n` +
        `  This bundle's row is id "mcp-rea" with the same serverName; DSH rejects the later\n` +
        `  entry as a duplicate server name, so only one survives. Keep exactly one of them.\n`,
    );
  }

  if (argv.includes("--shim-status")) {
    const report = {
      bundleRoot: root,
```

</details>

**依据 3 · 源码核查**：[scripts/setup.mjs:1664-1686](https://github.com/czcdr/dsh-plugin-rea/blob/4d8a08266d393712fcf3f1691a723f510f21e9bc/scripts/setup.mjs#L1664-L1686)

本机版本、路径与unverified记录。

<details>
<summary>查看原文（23行）</summary>

```text
if (!options.dryRun) {
  const bundleConfig = {
    schema: 1,
    provisionedAt: new Date().toISOString(),
    host: { platform: process.platform, arch: process.arch, node: process.versions.node },
    plugin: { name: "dsh-plugin-rea", root: sourceRoot() },
    paths,
    versions: {
      reaAgents: merged.reaAgents?.version ?? null,
      ghidra: merged.ghidra?.version ?? null,
      jdk: merged.jdk?.version ?? null,
      apktool: merged.apktool?.version ?? null,
      jadxHeadlessMcp: merged.jadxHeadlessMcp?.version ?? null,
      node: merged.node?.version ?? process.versions.node,
    },
    components: Object.fromEntries(
      Object.entries(merged).map(([name, value]) => [name, value ?? { path: null, unavailable: true }]),
    ),
    unverifiedChecksums: Object.entries(merged)
      .filter(([, value]) => value?.tofu)
      .map(([name]) => name),
  };
  writeFileSync(path.join(options.root, "bundle.json"), JSON.stringify(bundleConfig, null, 2) + "\n");
```

</details>

#### 缺口

- 没有手工接入与bundle供给的同环境时间和恢复对照。
  **影响**：不能证明部署总负担更低。
  **进一步探讨**：在相同OS和现有依赖条件下比较首次、升级及失败恢复的人工时间和磁盘量。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
