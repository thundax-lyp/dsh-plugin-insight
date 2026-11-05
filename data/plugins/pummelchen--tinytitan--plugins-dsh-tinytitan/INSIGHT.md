# dsh-tinytitan

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[4793513](https://github.com/Pummelchen/TinyTitan/tree/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Pummelchen/TinyTitan)
<!-- END META -->

> **功能**：为本地 TinyTitan 配置 DSH 模型路由、低思考压缩与可选目标交接

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 支持目录驱动路由、默认模型引用修复和复用上游压缩引擎的局部thinking控制；不是新adapter，标题host-plane控制仍未实现。

> **主要限制**：[Q02](#research-q02) 同步catalog无timeout且route/default非原子更新；[Q04](#research-q04) 开启autoGoal默认99999轮，hop上限不等于资源总预算。当前主要风险在维护和恢复，不该把测试声明升级为当前可用性。

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
  - [Q01 · 谁需要这个bundle，与原生路由相比改变什么？](#detail-section-11)
  - [Q02 · 版本和catalog怎样决定配置，失败如何表现？](#detail-section-12)
  - [Q03 · 关闭thinking作用在哪里，是否改变普通聊天和标题？](#detail-section-13)
  - [Q04 · opt-in自主行为有哪些资源和权限边界？](#detail-section-14)
  - [Q05 · 怎样低成本试用和退出，哪些效果仍未知？](#detail-section-15)
  - [Q06 · 能提出什么可证伪改善？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有TinyTitan模型与指定版本DSH的用户，维护picker路由并降低压缩thinking开销，见 [Q01](#research-q01)。

原生llm-pi-ai adapter与手工路由、standard preset；本插件不提供新推理协议，也未比较同任务性能。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| catalog路由 | picker跟随安装模型 | 非HTTP健康检查；同步执行无timeout |
| quiet compaction | 辅助压缩设thinking off | 不解决host-plane标题 |
| 默认引用修复 | 删除模型后改失效默认 | 路由/默认分步写入 |
| watcher | 去抖更新 | 失败仅启动更新，平台事件未知 |
| autoGoal/autonomy/handoff | 可选持续任务 | 默认关闭；总资源未硬预算 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 不满足 |
|---|---|---|
| DSH0.2.2-alpha.3与Node≥24.9 | 精确宿主接缝 | 版本不符拒绝无写入 |
| TinyTitan/模型目录/本地算力 | 推理与catalog | bundle不安装模型或提供GPU |
| settings/agentPresets | 写profile与注册preset | 日志降级，非整体可用 |
| goal/subagents | 仅自主选项 | 缺失不启动相关功能 |

#### 启动步骤

| 步骤 | 动作 | 判据与恢复 |
|---|---|---|
| 准备 | 固定版本，备份profile/preset/default | 确认服务原本能推理 |
| 安装 | add bundle，保持三项自主false | 看拒绝/生成日志并核profile |
| 验证 | 一次调用、增删模型、压缩对照 | picker/default一致且摘要不漏关键事实 |
| 退出 | 先切其他preset并恢复设置 | 卸载停止刷新，已写配置需确认 |

**效果与成本**

#### 成本

| 阶段 | 资源与现金 | 人工时间与未知 |
|---|---|---|
| 首次 | 本地模型/GPU/磁盘，金额未知 | 精确版本与profile配置，工时未知 |
| 持续 | GPU电力/内存、压缩调用 | watching与升级维护，节时未测 |
| 失败 | 挂起catalog、部分设置与旧引用 | 查进程和配置后重试 |
| 自主选项 | 多轮和child模型计算 | 默认99999轮不是资源硬限 |
| 退出 | 保留模型和配置占用 | 切preset、还原profile与停服务 |

#### 效果

| 项目 | 当前支持 | 未知 |
|---|---|---|
| 路由维护 | catalog/目录与settings接线 | 实际服务健康及事件完整性 |
| 压缩 | purpose包装off | 模型是否遵守、延迟和摘要保真 |
| 标题 | 明确host-plane不可达 | 不应声称已解决 |
| 自主延续 | 计数/并发及子会话机制 | 任务完成质量与总资源收益 |

> **思考**：[Q02](#research-q02) 同步catalog无timeout且route/default非原子更新；[Q04](#research-q04) 开启autoGoal默认99999轮，hop上限不等于资源总预算。当前主要风险在维护和恢复，不该把测试声明升级为当前可用性。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 支持目录驱动路由、默认模型引用修复和复用上游压缩引擎的局部thinking控制；不是新adapter，标题host-plane控制仍未实现。

复用原生adapter和压缩基类减少协议分叉，严格版本门阻止未知宿主写入；另一方面同步catalog和分步settings更新留下有界性与恢复缺口。可选目标逻辑明显大于默认两项便利，应单独配置验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 同步catalog无timeout且route/default非原子更新；[Q04](#research-q04) 开启autoGoal默认99999轮，hop上限不等于资源总预算。当前主要风险在维护和恢复，不该把测试声明升级为当前可用性。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议精确版本且已有本地服务的用户有限试用默认路由/压缩，先备份profile并保持autoGoal/autonomy/handoff关闭。catalog挂起、picker与默认不一致或摘要漏事实就还原设置并回原生手工路由。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持默认路由和压缩接线，明确严格版本与标题边界；当前服务、延迟/质量与可选自主循环收益没有本次运行证据。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-tinytitan/src/index.js、plugins/dsh-tinytitan/cordis.patch.yml、plugins/dsh-tinytitan/src/generate.js、plugins/dsh-tinytitan/src/models-watch.js、plugins/dsh-tinytitan/src/compaction.js、plugins/dsh-tinytitan/src/preset.js、plugins/dsh-tinytitan/README.md、plugins/dsh-tinytitan/src/keep-going.js、plugins/dsh-tinytitan/src/handoff.js、plugins/dsh-tinytitan/package.json 及固定范围 inventory；组件：plugins/dsh-tinytitan。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向读取全部入口、quiet compaction、preset关键变换、catalog/settings生成、watcher、goal创建及handoff计数/启动/wall路径；未全审catalog模板解析、配置和每个子进程实现。
- 下一步：本轮未安装、测试、运行服务器或宿主。README作者旧版运行与stub测试只作作者记录，不作为本提交独立执行证据。

**分析版本**

- **仓库**：[Pummelchen/TinyTitan](https://github.com/Pummelchen/TinyTitan)
- **版本号**：0.2.2-alpha.3（[固定提交 4793513](https://github.com/Pummelchen/TinyTitan/tree/47935132898b544bbf7f0f058a1529482129e87f)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出异步有界catalog、刷新generation与跨settings事务/补偿；用挂起、乱序和部分失败反例验证，属于未实现方向。

本轮未安装、测试、运行服务器或宿主。README作者旧版运行与stub测试只作作者记录，不作为本提交独立执行证据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 13 | 3646 | 2122 | 1369 | — |
| .md | source | 1 | 455 | — | — | 4539 |
| .js | test | 10 | 3762 | 3205 | 312 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Pummelchen/TinyTitan/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Pummelchen/TinyTitan/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Pummelchen/TinyTitan/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查默认接线的可靠性与自主选项的成本边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这个bundle，与原生路由相比改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有TinyTitan本地模型和DSH的用户，需让model picker跟随安装目录并减少辅助压缩思考开销。它不注册新模型adapter；由原生llm-pi-ai执行协议，bundle补配置与压缩backend/preset。index实际导入并启动route、preset、watcher及可选goal/handoff，属于具体接线贡献，不是推理引擎。参照手工维护路由和standard preset，增量是catalog驱动、默认模型引用修复及局部thinking override。作者说“two jobs”不足涵盖可选自主任务逻辑，应把默认和opt-in分开。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-tinytitan/src/index.js:27-37](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/index.js#L27-L37)

实际模块依赖。

<details>
<summary>查看原文（11行）</summary>

```text
import { resolveConfig } from "./config.js";
import { applyRouteThroughSettings, findModelsDir } from "./generate.js";
import { registerRoute } from "./route.js";
import { ensureDefaultPreset, registerTinytitanPreset } from "./preset.js";
import { watchModels } from "./models-watch.js";
import { dshVersion, supportDecision } from "./support.js";
import { installAutoGoal } from "./keep-going.js";
import { installHandoff } from "./handoff.js";

/** Plugin name, as the harness registry shows it. */
export const name = "dsh-tinytitan";
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-tinytitan/src/index.js:183-218](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/index.js#L183-L218)

版本门后才解析配置并启动路由。

<details>
<summary>查看原文（36行）</summary>

```text
  // The gate runs first, and before `resolveConfig`, so a harness this plugin
  // does not support cannot reach a single write. A refusal is a return rather
  // than a throw: the harness must boot, every other plugin must load, and
  // removing this one must leave nothing to undo.
  const harness = dshVersion();
  const decision = supportDecision(harness);
  if (!decision.run) {
    refuse(ctx, config, decision.refusal);
    return { refused: true, version: harness };
  }
  const log =
    typeof config.log === "function"
      ? config.log
      : (message) => {
          if (typeof ctx?.logger?.info === "function") ctx.logger.info(message);
          else console.log(message);
        };
  const resolved = resolveConfig(config);
  const refreshRoute = routeRefresher({
    resolved,
    ctx,
    log,
    apply: applyRoute,
    legacy: legacyRoute,
  });
  // A read-only home, a missing checkout or a failed write must not take the
  // profile down: the harness still works, only this convenience does not.
  if (resolved.registerRoute) {
    try {
      if (typeof ctx?.inject === "function") ctx.inject(["settings"], refreshRoute);
      else refreshRoute();
    } catch (error) {
      log(
        `dsh-tinytitan: route registration threw: ${error instanceof Error ? error.message : error}`,
      );
    }
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-tinytitan/cordis.patch.yml:11-43](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/cordis.patch.yml#L11-L43)

bundle默认路由、preset与三项自主开关关闭。

<details>
<summary>查看原文（33行）</summary>

```text
- insert:
    - id: dsh-tinytitan
      name: dsh-tinytitan
      config:
        # No port is written here on purpose. The default (8080) is resolved in
        # config.js, and writing it out would *pin* it: a configured port beats
        # TINYTITAN_PORT, so a server started on another port would have its
        # route flipped back to 8080 at the next boot. Set `port` only to
        # override both.
        provider: tinytitan
        registerRoute: true
        # `context` and `maxTokens` (or TINYTITAN_CONTEXT / TINYTITAN_MAX_TOKENS)
        # declare the window and cap the route writes. Left unset, the writers keep
        # their own pin (262144 / 32768); set them when you narrowed a route by
        # hand, or the next refresh writes the pin back over it. Read the README's
        # compaction note before narrowing one.
        # Keep the route in step with models/ after boot, so an install or a
        # deletion reaches the picker without restarting the harness. The watcher
        # refreshes through the same path boot used.
        watchModels: true
        selfContained: false
        writeCompactionPreset: true
        # Select the `tinytitan` preset only while the profile names no preset of
        # its own; an explicit choice on the Agent presets page is never
        # overwritten.
        setDefaultWhenUnset: true
        # The three switches that start work nobody asked for — a goal from every
        # prompt, the fresh-agent ralph loop, and a child session when the window
        # fills — are written out as off. A profile opts in by listing the field
        # it wants with `true`; the shipped bundle never does it for them.
        autoGoal: false
        autonomy: false
        handoff: false
```

</details>

#### 缺口

- 本轮没有目标执行；当前版本真实服务、watch及压缩效果未验证。
  **影响**：不能据此扩大采用或效果保证。
  **进一步探讨**：在隔离profile固定版本执行所述反例和小任务。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 版本和catalog怎样决定配置，失败如何表现？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

apply最先核实DSH版本；仅0.2.2-alpha.3可运行，不可读或不匹配则stderr拒绝并返回，避免写入其他版本宿主。settings存在时collectRoute找到modelsDir，优先本地TinyTitanServer --catalog --models-dir同步子进程，失败/缺失才按目录扫描；这是目录元数据，不验证运行服务端或模型健康。execFileSync未设timeout，异常可以捕获但挂起仍能阻塞宿主线程，是确认的恢复边界。生成block后更新provider数组并修复失效默认模型，两个settings.update非同一原子事务，ensureDefaultModel自己catch返回failed，外层仍可返回applied并携带defaultModel.failed，所以新路由与旧默认可同时存在，applied不代表默认修复成功。watcher为非persistent去抖事件，失败回退启动刷新，不能保证任意平台/子目录更改总能被看见。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-tinytitan/src/index.js:183-218](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/index.js#L183-L218)

先版本拒绝。

<details>
<summary>查看原文（36行）</summary>

```text
  // The gate runs first, and before `resolveConfig`, so a harness this plugin
  // does not support cannot reach a single write. A refusal is a return rather
  // than a throw: the harness must boot, every other plugin must load, and
  // removing this one must leave nothing to undo.
  const harness = dshVersion();
  const decision = supportDecision(harness);
  if (!decision.run) {
    refuse(ctx, config, decision.refusal);
    return { refused: true, version: harness };
  }
  const log =
    typeof config.log === "function"
      ? config.log
      : (message) => {
          if (typeof ctx?.logger?.info === "function") ctx.logger.info(message);
          else console.log(message);
        };
  const resolved = resolveConfig(config);
  const refreshRoute = routeRefresher({
    resolved,
    ctx,
    log,
    apply: applyRoute,
    legacy: legacyRoute,
  });
  // A read-only home, a missing checkout or a failed write must not take the
  // profile down: the harness still works, only this convenience does not.
  if (resolved.registerRoute) {
    try {
      if (typeof ctx?.inject === "function") ctx.inject(["settings"], refreshRoute);
      else refreshRoute();
    } catch (error) {
      log(
        `dsh-tinytitan: route registration threw: ${error instanceof Error ? error.message : error}`,
      );
    }
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-tinytitan/src/generate.js:597-673](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/generate.js#L597-L673)

同步catalog无timeout，fallback目录扫描。

<details>
<summary>查看原文（77行）</summary>

```text
export function collectRoute({
  port,
  provider,
  context,
  maxTokens,
  reasoning,
  repoRoot,
  serverBinary,
  modelsDir,
  env = process.env,
  run = execFileSync,
  log = () => {},
  isExecutable = defaultIsExecutable,
  isDirectory = defaultIsDirectory,
} = {}) {
  const directory = findModelsDir({ explicit: modelsDir, env, repoRoot, isDirectory });
  if (directory === null) {
    const detail = "no models directory (set modelsDir or TINYTITAN_MODELS_DIR)";
    log(`dsh-tinytitan: ${detail}; leaving the llm-pi-ai route as it is`);
    return { status: "missing", detail, serverBinary: null, modelsDir: null };
  }
  const binary = findServerBinary({ explicit: serverBinary, env, repoRoot, isExecutable });

  // The server is the authority on the catalog while it can answer. A profile
  // that installed models but has not built the server yet has nothing to ask,
  // so the folder is read directly -- the same rules, mirrored in
  // `catalog-scan.js` and pinned against the binary's own output by the tests.
  // A binary that exists but fails is treated the same way: a working picker
  // beats a stale route, and the reason goes to the log.
  let catalog = null;
  let source = "folder";
  if (binary !== null) {
    try {
      const stdout = run(binary, ["--catalog", "--models-dir", directory], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      const parsed = JSON.parse(String(stdout));
      if (parsed !== null && typeof parsed === "object" && Array.isArray(parsed.models)) {
        catalog = parsed;
        source = "server";
      } else {
        log('dsh-tinytitan: the server catalog carried no "models" list; reading models/ directly');
      }
    } catch (error) {
      const detail =
        String(error?.stderr ?? error?.message ?? error)
          .trim()
          .split("\n")[0] || "the server catalog could not be read";
      log(`dsh-tinytitan: the server catalog failed (${detail}); reading models/ directly`);
    }
  } else {
    log(
      "dsh-tinytitan: no TinyTitan server binary (set serverBinary or TINYTITAN_SERVER); " +
        "reading models/ directly",
    );
  }
  if (catalog === null) {
    const scanned = scanModelsFolder(directory, { env });
    for (const skip of scanned.skipped) {
      log(`dsh-tinytitan: skipping ${skip.path}: ${skip.reason}`);
    }
    catalog = { models: scanned.models };
  }
  const rows = catalogRows(catalog.models);
  if (rows.length === 0) {
    const detail = `the catalog describes no servable install under ${directory}`;
    log(`dsh-tinytitan: ${detail}; leaving the llm-pi-ai route as it is`);
    return { status: "failed", detail, serverBinary: binary, modelsDir: directory };
  }
  const block = buildBlock(rows, { port, provider, context, maxTokens, reasoning });
  return { status: null, block, rows, source, serverBinary: binary, modelsDir: directory };
}

/**
 * Refresh the route **file** with the built-in generator.
 *
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-tinytitan/src/generate.js:751-782](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/generate.js#L751-L782)

route与default先后更新，失败返回状态。

<details>
<summary>查看原文（32行）</summary>

```text
export async function applyRouteThroughSettings({ settings, ...options } = {}) {
  const collected = collectRoute(options);
  if (collected.status) return collected;
  const { block, rows, source } = collected;
  try {
    if (!settings || typeof settings.update !== "function") {
      throw new Error("no settings service");
    }
    const [{ default: yaml }] = await Promise.all([import("js-yaml")]);
    const parsed = yaml.load(block);
    const namespace = parsed !== null && typeof parsed === "object" ? Object.keys(parsed)[0] : null;
    if (namespace === null || typeof parsed[namespace] !== "object") {
      throw new Error("the generated block is not a single settings section");
    }
    await settings.update(namespace, parsed[namespace]);
    const defaultModel = await ensureDefaultModel({
      settings,
      ids: rows.map((row) => row.id),
      provider: options.provider ?? ROUTE_DEFAULTS.provider,
      log: options.log,
    });
    options.log?.(
      `dsh-tinytitan: route applied through the settings service ` +
        `(${rows.length} model(s) from the ${source})`,
    );
    return { status: "applied", models: rows.length, source, defaultModel };
  } catch (error) {
    const detail = String(error?.message ?? error)
      .trim()
      .split("\n")[0];
    options.log?.(`dsh-tinytitan: route refresh failed: ${detail}`);
    return { status: "failed", detail };
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-tinytitan/src/generate.js:810-844](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/generate.js#L810-L844)

只修复当前provider失效默认。

<details>
<summary>查看原文（35行）</summary>

```text
export async function ensureDefaultModel({
  settings,
  ids = [],
  provider = ROUTE_DEFAULTS.provider,
  log = () => {},
} = {}) {
  if (settings === undefined || settings === null || typeof settings.update !== "function") {
    return { status: "skipped", reason: "no settings service" };
  }
  if (ids.length === 0) return { status: "skipped", reason: "the route serves no models" };
  let current;
  try {
    const forms = typeof settings.describe === "function" ? settings.describe() : [];
    const row = Array.isArray(forms)
      ? forms.find((form) => form?.ns === DEFAULT_MODEL_SETTINGS_NS)
      : null;
    current = row?.user;
  } catch (error) {
    const detail = String(error?.message ?? error)
      .trim()
      .split("\n")[0];
    return { status: "skipped", reason: detail };
  }
  const chosen = typeof current?.model === "string" ? current.model : "";
  if (chosen === "") return { status: "skipped", reason: "no default model is set" };
  if (chosen !== "" && ids.includes(chosen)) return { status: "kept", model: chosen };
  const chosenProvider = typeof current?.provider === "string" ? current.provider : "";
  if (chosenProvider !== "" && chosenProvider !== provider) {
    return { status: "kept", provider: chosenProvider, model: chosen };
  }
  const model = ids[0];
  try {
    await settings.update(DEFAULT_MODEL_SETTINGS_NS, { provider, model });
  } catch (error) {
    const detail = String(error?.message ?? error)
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-tinytitan/src/models-watch.js:36-102](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/models-watch.js#L36-L102)

去抖、关闭及失败仅启动刷新。

<details>
<summary>查看原文（67行）</summary>

```text
 */
export function watchModels({
  modelsDir,
  refresh,
  log = () => {},
  debounceMs = DEFAULT_DEBOUNCE_MS,
  watch = watchFileSystem,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
} = {}) {
  if (typeof modelsDir !== "string" || modelsDir === "") {
    return { watching: false, close() {} };
  }
  if (typeof refresh !== "function") {
    throw new Error("dsh-tinytitan: watchModels needs a refresh callback");
  }

  let timer = null;
  let closed = false;

  const fire = () => {
    timer = null;
    if (closed) return;
    try {
      refresh();
    } catch (error) {
      log(`dsh-tinytitan: refresh after a models/ change failed: ${describe(error)}`);
    }
  };

  const schedule = () => {
    if (closed) return;
    // Restart the quiet period: an install emits events for minutes.
    if (timer !== null) clearTimer(timer);
    timer = setTimer(fire, debounceMs);
    if (typeof timer?.unref === "function") timer.unref();
  };

  let watcher;
  try {
    watcher = watch(modelsDir, { persistent: false }, schedule);
  } catch (error) {
    log(
      `dsh-tinytitan: cannot watch ${modelsDir}: ${describe(error)}; ` +
        "the route will only refresh at boot",
    );
    return { watching: false, close() {} };
  }
  if (typeof watcher?.unref === "function") watcher.unref();
  log(`dsh-tinytitan: watching ${modelsDir} so installs and removals reach the picker`);

  return {
    watching: true,
    close() {
      closed = true;
      if (timer !== null) {
        clearTimer(timer);
        timer = null;
      }
      try {
        watcher.close();
      } catch {
        // Already closed, or the platform closed it for us.
      }
    },
  };
}
```

</details>

**依据 6 · 源码核查**：[plugins/dsh-tinytitan/src/generate.js:838-854](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/generate.js#L838-L854)

默认更新失败被返回failed；外层仍applied并携带该子结果。

<details>
<summary>查看原文（17行）</summary>

```text
    return { status: "kept", provider: chosenProvider, model: chosen };
  }
  const model = ids[0];
  try {
    await settings.update(DEFAULT_MODEL_SETTINGS_NS, { provider, model });
  } catch (error) {
    const detail = String(error?.message ?? error)
      .trim()
      .split("\n")[0];
    log(`dsh-tinytitan: could not repoint the default model: ${detail}`);
    return { status: "failed", reason: detail };
  }
  log(
    `dsh-tinytitan: default model ${provider}/${model} replaces ${chosen}, which no longer serves`,
  );
  return { status: "repaired", model, replaced: chosen };
}
```

</details>

#### 缺口

- 本轮没有目标执行；当前版本真实服务、watch及压缩效果未验证。
  **影响**：不能据此扩大采用或效果保证。
  **进一步探讨**：在隔离profile固定版本执行所述反例和小任务。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 关闭thinking作用在哪里，是否改变普通聊天和标题？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

compaction工厂继承上游引擎，summarize临时以delegating context包装llm.stream，只对purpose compaction/session-title设reasoningEffort off，finally恢复原ctx；保留上游checkpoint和重试，不另写协议。preset把standard中的compaction-basic换backend，同时可过滤CHAT_NOISE_ROWS，autonomy可加persona与ralph，不能概括为只有单一参数。虽然helper包含session-title，但标题来自host-plane不经过此backend，作者明确承认尚未解决；默认route reasoning off会连普通聊天一起变更，不能把它当独立标题开关。当前未验并发summarize临时this.ctx替换的宿主串行保证，也未实测压缩质量/延迟。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-tinytitan/src/compaction.js:21-70](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/compaction.js#L21-L70)

purpose过滤、临时ctx与finally。

<details>
<summary>查看原文（50行）</summary>

```text
/** Purposes whose calls exist to produce bounded visible text. */
export const AUXILIARY_PURPOSES = new Set(["compaction", "session-title"]);

/**
 * The same options, with thinking off when the call is an auxiliary one.
 * @param options - the harness's `llm.stream` options.
 * @returns the options to stream, possibly with `reasoningEffort: "off"`.
 */
export function auxiliaryThinkingOff(options) {
  if (!AUXILIARY_PURPOSES.has(options?.purpose)) return options;
  if (options.reasoningEffort === "off") return options;
  return { ...options, reasoningEffort: "off" };
}

/**
 * Build the compaction backend class on top of a base engine.
 *
 * A factory rather than a subclass literal so the behaviour can be tested
 * against a stub base, without the harness's packages installed.
 *
 * @param Base - the engine to extend (`dsh-compaction-basic`'s default export).
 * @returns a class whose summarisation never thinks.
 */
export function createAuxiliaryQuietCompaction(Base) {
  return class extends Base {
    /**
     * Summarise with the auxiliary call's thinking forced off.
     *
     * `this.ctx` is swapped for a delegate for the duration of the call: the
     * engine reads `ctx.llm.stream` through it, and the real context is restored
     * in `finally` so a failure cannot leave it replaced.
     *
     * @param input - the replayed conversation prefix to condense.
     * @param agent - supplies routed-model history and the session id.
     * @param signal - optional cancellation forwarded to the adapter.
     * @returns the base engine's summary result.
     */
    async summarize(input, agent, signal) {
      const ctx = this.ctx;
      const llm = Object.create(ctx.llm);
      llm.stream = (options, ...rest) => ctx.llm.stream(auxiliaryThinkingOff(options), ...rest);
      const quiet = Object.create(ctx);
      quiet.llm = llm;
      this.ctx = quiet;
      try {
        return await super.summarize(input, agent, signal);
      } finally {
        this.ctx = ctx;
      }
    }
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-tinytitan/src/preset.js:140-198](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/preset.js#L140-L198)

backend替换、过滤与可选ralph。

<details>
<summary>查看原文（59行）</summary>

```text
  plugins,
  maxTokens = 32768,
  headroomTokens = null,
  backend = COMPACTION_BACKEND,
  autonomy = false,
  autonomyRounds = AUTONOMY_DEFAULT_ROUNDS,
  autonomySuppressQuestions = false,
} = {}) {
  if (!Array.isArray(plugins)) {
    throw new TypeError("dsh-tinytitan: buildTinytitanPlugins needs a plugins array");
  }
  const drop = new Set(CHAT_NOISE_ROWS);
  // Autonomy instructs the model not to ask; removing the tool makes it
  // impossible instead of discouraged. That is a bigger hammer than it looks:
  // the shipped plan-mode instructions tell the model to use
  // `ask_user_question` for user-owned choices, so a session that needs plan
  // mode should keep the row and rely on the policy text alone.
  if (autonomy && autonomySuppressQuestions) drop.add("tool-ask-user");
  const walk = (rows) =>
    rows.flatMap((row) => {
      if (row === null || typeof row !== "object") return [row];
      if (drop.has(row.id)) return [];
      if (row.id === "compaction-basic") {
        const config = { ...(row.config ?? {}), maxTokens };
        if (headroomTokens !== null) config.headroomTokens = headroomTokens;
        return [{ ...row, name: backend, config }];
      }
      if (autonomy && row.id === "persona") {
        const config = { ...(row.config ?? {}) };
        config.suffix = [config.suffix, AUTONOMY_INSTRUCTIONS].filter(Boolean).join("\n\n");
        return [{ ...row, config }];
      }
      // `ralph` ships disabled in 0.2.0's standard: a fresh-agent loop is not
      // what most sessions want. Autonomy is the profile saying that this one
      // does. (0.2.1 dropped the row from the standard; the append below
      // covers that shape, and this branch keeps older profiles working.)
      if (autonomy && row.id === "tool-ralph") {
        return [
          { ...row, disabled: false, config: { ...(row.config ?? {}), maxRounds: autonomyRounds } },
        ];
      }
      if (row.group === true && Array.isArray(row.config)) {
        return [{ ...row, config: walk(row.config) }];
      }
      return [row];
    });
  // Ralph's fresh-agent loop is what autonomy is for, and 0.2.1-alpha.2 dropped
  // the disabled `tool-ralph` row from the shipped standard: the loop now ships
  // only in `@deepseek-ai/dsh-experimental-ralph-bundle`, whose cordis patch
  // mounts the workflow engine and the tool as one isolated group. A
  // composition that still carries a row (0.2.0 profiles, or one that installed
  // the bundle itself) is enabled in place by the walk; one that does not gets
  // the bundle's own declaration appended, carrying this profile's round
  // budget. Without this, autonomy's policy text would name a tool the session
  // does not have.
  const built = walk(plugins);
  if (autonomy && !compositionHasRow(built, "tool-ralph")) {
    return [...built, ralphBundleGroup(autonomyRounds)];
  }
```

</details>

**依据 3 · 作者声明**：[plugins/dsh-tinytitan/README.md:400-412](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/README.md#L400-L412)

作者限制：无adapter、无budget/vision与host-plane标题边界。

<details>
<summary>查看原文（13行）</summary>

```text
## What it does not do

- **No adapter.** It registers no LLM provider: the harness's `llm-pi-ai` route
  does the work, so a harness upgrade cannot leave a copied protocol
  implementation behind.
- **No budgets, no vision, no dialects.** TinyTitan accepts `reasoning_budget_tokens`
  and does not enforce it; the models are text-only; llama.cpp/TabbyAPI are other
  servers with their own routes. None of that is here.
- **No session-title override.** Titles are issued by a host-plane plugin with
  its own context, which a bundle cannot wrap; that half is upstream ask 1 in
  `docs/dsh-upstream-asks.md`. Until it lands, the route's `reasoning: off` is
  the only way to keep titles unthinking — at the cost of chat starting
  unthinking too.
```

</details>

#### 缺口

- 本轮没有目标执行；当前版本真实服务、watch及压缩效果未验证。
  **影响**：不能据此扩大采用或效果保证。
  **进一步探讨**：在隔离profile固定版本执行所述反例和小任务。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · opt-in自主行为有哪些资源和权限边界？

**研究主题**：效果与总成本、缺陷与关键质疑、工程质量与复用

#### 完整回答

默认autoGoal、autonomy、handoff均false。开启autoGoal会把每个直接用户prompt转为目标，含本来只想问一句的问题；非子agent且没有未完成目标才创建，默认99999轮并非实用的小预算。handoff在token阈值、active+armed目标条件下fork child session，先claim hop和in-flight，拒绝/异常退还计数，进程child cap和每目标hop限制，wall重臂最多两次。child是子会话而非可直接继续聊天的新root；完成判断仍靠模型与宿主goal服务。即便hop有限，每个child仍可多轮调用，不能当总token、GPU时长或现金硬预算。autonomySuppressQuestions还会删除提问工具，复杂用户选择不宜开启。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-tinytitan/src/keep-going.js:38-47](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/keep-going.js#L38-L47)

默认99999轮。

<details>
<summary>查看原文（10行）</summary>

```text

/**
 * Rounds an auto-created goal may run before the harness blocks it.
 *
 * Effectively unbounded, so an unattended goal keeps working through the night
 * instead of stopping at a small round budget. A profile that turns `autoGoal`
 * on can lower it with `autoGoalRounds` when it wants prompts a person did not
 * mark as long-running work to stay bounded.
 */
export const DEFAULT_AUTO_GOAL_ROUNDS = 99999;
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-tinytitan/src/keep-going.js:99-148](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/keep-going.js#L99-L148)

仅直接用户/非子agent且无未完成目标创建。

<details>
<summary>查看原文（50行）</summary>

```text
 * resolves immediately instead.
 *
 * @param options - the harness context, the resolved plugin config, and a logger.
 * @returns a status object; `installed: false` carries the reason.
 */
export function installAutoGoal({ ctx, resolved, log = () => {} } = {}) {
  if (resolved?.autoGoal !== true) return { installed: false, reason: "disabled" };
  if (typeof ctx?.on !== "function") return { installed: false, reason: "no-context" };
  const rounds = resolved.autoGoalRounds ?? DEFAULT_AUTO_GOAL_ROUNDS;

  const attach = (scoped = ctx) => {
    const goals = scoped?.get?.(GOALS_SERVICE);
    if (!goals || typeof goals.create !== "function" || typeof goals.get !== "function") {
      log(
        "dsh-tinytitan: autoGoal is on but the harness has no goal service; " +
          "mount @deepseek-ai/dsh-goal (the standard composition does)",
      );
      return { installed: false, reason: "no-goals-service" };
    }

    /** Create and arm the goal this prompt implies, if it implies one. */
    const onInserted = ({ agent, message } = {}) => {
      try {
        // Subagents carry a live parent; only a session a person is driving
        // should turn a prompt into a persistent objective.
        if (!agent || agent.parentAgent !== undefined) return;
        if (!isDirectHuman(message)) return;
        const current = goals.get(agent);
        if (current !== undefined && current.phase !== "complete") return;
        const objective = messageText(message.content);
        if (objective.length === 0) return;
        const view = goals.create(agent, { objective, maxGoalRounds: rounds });
        log(
          `dsh-tinytitan: armed ${view?.id ?? "a goal"} from a manual prompt ` +
            `(${objective.length} chars, cap ${view?.maxGoalRounds ?? rounds})`,
        );
      } catch (error) {
        // A stale view, a race with another creator, or a service that refuses
        // this agent must never take the turn down with it.
        log(
          `dsh-tinytitan: autoGoal could not arm a goal: ` +
            `${error instanceof Error ? error.message : error}`,
        );
      }
    };

    ctx.on("agent/inbox/inserted", onInserted);
    return { installed: true, rounds };
  };

```

</details>

**依据 3 · 源码核查**：[plugins/dsh-tinytitan/src/handoff.js:234-274](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/handoff.js#L234-L274)

fork子会话与signal。

<details>
<summary>查看原文（41行）</summary>

```text
export async function startHandoff({
  ctx,
  objective,
  parent,
  log = () => {},
  controller = new AbortController(),
} = {}) {
  const agents = ctx?.get?.("agents");
  const subagents = ctx?.get?.("subagents");
  if (!agents || typeof agents.withInitiator !== "function") {
    return { started: false, reason: "no-agents-service" };
  }
  if (!subagents || typeof subagents.start !== "function") {
    return { started: false, reason: "no-subagents-service" };
  }
  if (!objective || !parent) return { started: false, reason: "no-objective" };

  // `start` runs under an initiating Agent, and its provider requires the
  // agent's loop to be active — which it is while a turn is running.
  return agents.withInitiator(parent, async () => {
    const run = await subagents.start(HANDOFF_PROVIDER, {
      parent,
      prompt: [{ type: "text", text: handoffPrompt(objective) }],
      label: `handoff: ${objective.slice(0, 60)}`,
      signal: controller.signal,
    });
    // `SubagentRun.localAgent` is the published in-process Agent itself, not a
    // wrapper: the first live run logged "(no live child agent reported)" under
    // the old shape while the child was right there.
    const child = run?.localAgent;
    const childSession = run?.id ?? child?.id ?? child?.session?.id;
    log(
      `dsh-tinytitan: handed the objective to child session ${childSession ?? "(unknown)"}` +
        `${child ? "" : " (remote run: no in-process child to arm)"}`,
    );
    return { started: true, child, childSession, run };
  });
}

/**
 * Install the handoff driver, when the profile asks for it.
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-tinytitan/src/handoff.js:490-561](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/handoff.js#L490-L561)

hop、inflight、childcap与失败退款。

<details>
<summary>查看原文（72行）</summary>

```text
    /** Why this goal cannot hand on right now, or `null` when it can. */
    const blockReason = (key) => {
      if ((hops.get(key) ?? 0) >= hopBudget) return "hops";
      if (inFlight.has(key)) return "in-flight";
      if (runs.size >= childCap) return "cap";
      return null;
    };

    /**
     * Move an unfinished objective on, if its budget is spent and hops remain.
     *
     * @param sessionId - the session whose turn just opened.
     * @param inputTokens - the prompt tokens its previous step reported.
     */
    const handoff = (sessionId, inputTokens) => {
      if (retired.has(sessionId)) return;
      const agent = agents.get(sessionId);
      if (!agent) return;
      if (!(inputTokens >= budgetFor(agent))) return;
      const goal = goals.get(agent);
      // Only an actively continuing goal moves: a complete, paused, blocked or
      // disarmed one is a decision someone already made.
      if (!goal || goal.phase !== "active" || goal.activation !== "armed") return;
      const key = goal.id;
      const claimed = hops.get(key) ?? 0;
      const blocked = blockReason(key);
      if (blocked === "hops") {
        log(
          `dsh-tinytitan: handoff chain for "${goal.objective.slice(0, 60)}" reached ` +
            `${hopBudget} hops; leaving it to a person`,
        );
        return;
      }
      if (blocked === "in-flight") return;
      if (blocked === "cap") {
        log(
          `dsh-tinytitan: ${runs.size} handoff children are already live (cap ${childCap}); ` +
            `not handing on "${goal.objective.slice(0, 60)}"`,
        );
        return;
      }
      // Claim before awaiting: a child's opening turn can run before the start
      // promise settles, and this is the guard that has to hold then.
      const hop = claimed + 1;
      hops.set(key, hop);
      inFlight.add(key);
      const controller = new AbortController();
      controllers.add(controller);
      void startHandoff({ ctx: scoped, objective: goal.objective, parent: agent, log, controller })
        .then((result) => {
          if (!result?.started) {
            // A refused start must not spend the objective's budget.
            if (hops.get(key) === hop) hops.set(key, claimed);
            log(`dsh-tinytitan: handoff skipped (${result?.reason ?? "unknown"})`);
            return;
          }
          log(
            `dsh-tinytitan: handoff hop ${hop}/${hopBudget} at ${inputTokens} tokens for ` +
              `"${goal.objective.slice(0, 60)}"`,
          );
          stopParent(agent);
          startChild(result.child);
          if (result.run) track(result.run, result.child, agent.id);
        })
        .catch((error) => {
          if (hops.get(key) === hop) hops.set(key, claimed);
          log(`dsh-tinytitan: handoff failed: ${describe(error)}`);
        })
        .finally(() => {
          inFlight.delete(key);
          controllers.delete(controller);
        });
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-tinytitan/src/handoff.js:579-607](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/handoff.js#L579-L607)

wall重臂有限。

<details>
<summary>查看原文（29行）</summary>

```text
      if (!agent || retired.has(agent.id)) return;
      const tokens = usage.get(session.id) ?? 0;
      if (!(tokens >= budgetFor(agent))) return;
      const goal = goals.get(agent);
      if (!goal || goal.phase !== "active" || goal.activation === "armed") return;
      const blocked = blockReason(goal.id);
      if (blocked !== null) {
        log(
          `dsh-tinytitan: "${goal.objective.slice(0, 60)}" hit its wall at ${tokens} tokens, ` +
            `but no hop is available (${blocked}); leaving it to a person`,
        );
        return;
      }
      const attempts = recoveries.get(goal.id) ?? 0;
      if (attempts >= 2) {
        log(
          `dsh-tinytitan: "${goal.objective.slice(0, 60)}" hit its wall again after ` +
            `${attempts} attempts; leaving it to a person`,
        );
        return;
      }
      recoveries.set(goal.id, attempts + 1);
      try {
        goals.resume(agent, { id: goal.id, revision: goal.revision });
        log(
          `dsh-tinytitan: the session hit its token wall at ${tokens} tokens; re-armed the goal ` +
            `so the next turn hands the objective on`,
        );
      } catch (error) {
```

</details>

**依据 6 · 源码核查**：[plugins/dsh-tinytitan/src/preset.js:152-158](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/preset.js#L152-L158)

可选择移除ask-user工具。

```text
  // Autonomy instructs the model not to ask; removing the tool makes it
  // impossible instead of discouraged. That is a bigger hammer than it looks:
  // the shipped plan-mode instructions tell the model to use
  // `ask_user_question` for user-owned choices, so a session that needs plan
  // mode should keep the row and rely on the policy text alone.
  if (autonomy && autonomySuppressQuestions) drop.add("tool-ask-user");
  const walk = (rows) =>
```

#### 缺口

- 本轮没有目标执行；当前版本真实服务、watch及压缩效果未验证。
  **影响**：不能据此扩大采用或效果保证。
  **进一步探讨**：在隔离profile固定版本执行所述反例和小任务。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样低成本试用和退出，哪些效果仍未知？

**研究主题**：采用判断、效果与总成本、依赖、兼容与流程

#### 完整回答

建议固定0.2.2-alpha.3、已有可运行TinyTitan且理解profile配置的用户有限试用，三项自主行为先保持关闭。备份profile并记录原preset/default-model；先检查启动生成路由和实际一次模型调用，再装/删模型检查picker与默认修复，最后比较压缩前后summary保留关键信息和耗时。Node>=24.9与精确宿主peer、modelsDir、server binary或目录扫描、settings及preset服务都是效果条件，装bundle本身不提供模型/GPU和可用服务。首次有模型下载与硬件资源、配置工时；持续有GPU电力/内存和维护精确版本；失败要查部分settings写、挂起catalog与旧模型引用。退出前换回其他preset并还原需保留路由；卸载停止刷新不等于删除已写profile和选择。作者写有stub测试与旧0.2.0运行记录，不能当固定0.2.2-alpha.3独立通过；本轮未执行。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-tinytitan/package.json:1-47](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/package.json#L1-L47)

版本、Node和精确peer。

<details>
<summary>查看原文（47行）</summary>

```text
{
  "name": "dsh-tinytitan",
  "version": "0.2.2-alpha.3",
  "description": "DeepSeek Harness route and quiet compaction for a local TinyTitan server",
  "type": "module",
  "license": "MIT",
  "main": "src/index.js",
  "exports": {
    ".": "./src/index.js",
    "./backend": "./src/backend.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "src",
    "cordis.patch.yml",
    "README.md"
  ],
  "engines": {
    "node": ">=24.9"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Pummelchen/TinyTitan.git",
    "directory": "plugins/dsh-tinytitan"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "scripts": {
    "test": "node --test 'test/*.test.js'",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.6-alpha.2",
    "@deepseek-ai/cordis-plugin-include": "~1.0.11-alpha.2",
    "@deepseek-ai/dsh-agent-preset": "0.2.2-alpha.3",
    "@deepseek-ai/dsh-compaction-basic": "0.2.2-alpha.3",
    "@deepseek-ai/dsh-web-app": "0.2.2-alpha.3",
    "js-yaml": "^4.3.2"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis-plugin-include": {
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-tinytitan/src/index.js:240-305](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/index.js#L240-L305)

preset仅注册成功且unset才默认，dispose watcher。

<details>
<summary>查看原文（66行）</summary>

```text
          // new session, and this order is what makes that impossible.
          if (registered === null || registered === undefined) return null;
          if (!resolved.setDefaultWhenUnset) return null;
          return ensureDefaultPreset({
            settings: scoped?.get?.("settings"),
            presetId: resolved.presetId,
            log,
          });
        })
        .catch((error) => {
          log(
            `dsh-tinytitan: preset registration threw: ${error instanceof Error ? error.message : error}`,
          );
        });
    };
    try {
      if (typeof ctx?.inject === "function") ctx.inject(["agentPresets"], register);
      else register();
    } catch (error) {
      log(
        `dsh-tinytitan: preset registration threw: ${error instanceof Error ? error.message : error}`,
      );
    }
  }
  // The keep-going switch: a manual prompt becomes a goal so the harness's own
  // round driver continues it, exactly as `/goal <prompt>` would. Off unless the
  // profile asks; a harness with no goal service logs why and boots unchanged.
  try {
    installAutoGoal({ ctx, resolved, log });
  } catch (error) {
    log(`dsh-tinytitan: autoGoal setup threw: ${error instanceof Error ? error.message : error}`);
  }
  // The handoff driver: when a session approaches its token budget with the
  // objective unfinished, the work continues in a fresh forked context rather
  // than stopping. Off unless the profile asks; a missing service logs a no-op.
  try {
    installHandoff({ ctx, resolved, log });
  } catch (error) {
    log(`dsh-tinytitan: handoff setup threw: ${error instanceof Error ? error.message : error}`);
  }
  // Boot writes the route once; a folder that changes during the session has to
  // reach the picker too, because installing a model and using it are the same
  // sitting. The watcher is closed on disposal so it cannot outlive the plugin.
  if (resolved.registerRoute && resolved.watchModels) {
    try {
      const modelsDir = findModelsDir({
        explicit: resolved.modelsDir,
        env,
        repoRoot: resolved.repoRoot,
      });
      const handle = watch({
        modelsDir,
        debounceMs: resolved.watchDebounceMs,
        log,
        // The same refresher boot used: on 0.2.0 that is the settings service,
        // not the shell tool, which needs a settings file that no longer exists.
        refresh: () => refreshRoute(ctx),
      });
      if (handle.watching && typeof ctx?.on === "function") {
        ctx.on("dispose", () => handle.close());
      }
    } catch (error) {
      log(`dsh-tinytitan: models watch threw: ${error instanceof Error ? error.message : error}`);
    }
  }
}
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-tinytitan/src/generate.js:751-782](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/generate.js#L751-L782)

部分settings写可能。

<details>
<summary>查看原文（32行）</summary>

```text
export async function applyRouteThroughSettings({ settings, ...options } = {}) {
  const collected = collectRoute(options);
  if (collected.status) return collected;
  const { block, rows, source } = collected;
  try {
    if (!settings || typeof settings.update !== "function") {
      throw new Error("no settings service");
    }
    const [{ default: yaml }] = await Promise.all([import("js-yaml")]);
    const parsed = yaml.load(block);
    const namespace = parsed !== null && typeof parsed === "object" ? Object.keys(parsed)[0] : null;
    if (namespace === null || typeof parsed[namespace] !== "object") {
      throw new Error("the generated block is not a single settings section");
    }
    await settings.update(namespace, parsed[namespace]);
    const defaultModel = await ensureDefaultModel({
      settings,
      ids: rows.map((row) => row.id),
      provider: options.provider ?? ROUTE_DEFAULTS.provider,
      log: options.log,
    });
    options.log?.(
      `dsh-tinytitan: route applied through the settings service ` +
        `(${rows.length} model(s) from the ${source})`,
    );
    return { status: "applied", models: rows.length, source, defaultModel };
  } catch (error) {
    const detail = String(error?.message ?? error)
      .trim()
      .split("\n")[0];
    options.log?.(`dsh-tinytitan: route refresh failed: ${detail}`);
    return { status: "failed", detail };
```

</details>

**依据 4 · 作者声明**：[plugins/dsh-tinytitan/README.md:414-441](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/README.md#L414-L441)

卸载与作者测试描述。

<details>
<summary>查看原文（28行）</summary>

````text
## Uninstall

```sh
dsh plugin --profile web remove dsh-tinytitan
```

Nothing is left on disk to clean up: the route and the preset are profile
configuration, and removing the row stops both being refreshed. One thing to
undo by hand — if this plugin selected the `tinytitan` preset for you, pick
another preset on the Agent presets page before you remove it, because the
selection outlives the plugin that made it.

## Test

```sh
cd plugins/dsh-tinytitan && node --test test/
```

Seventy-nine tests, no harness packages required: the compaction seam is
exercised against a stub base, the preset builder, the default-preset rule and
the route preferences against stubs and temporary homes, and the route call
against a stubbed runner. The built-in generator's block is compared
byte-for-byte with `tools/dsh_route.sh --print` — on the real catalog when the
checkout's server binary is built, and on a synthetic catalog (mixed backends,
re-sorted thinking levels) whenever the shell tool is present; both comparisons
skip with a clear message when the pieces are absent, so the suite stays
runnable elsewhere. The `dsh-tinytitan/backend` import itself is resolved from
the profile's own `node_modules` once installed.
````

</details>

#### 缺口

- 本轮没有目标执行；当前版本真实服务、watch及压缩效果未验证。
  **影响**：不能据此扩大采用或效果保证。
  **进一步探讨**：在隔离profile固定版本执行所述反例和小任务。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能提出什么可证伪改善？

**研究主题**：新假设与验证、采用判断

#### 完整回答

从catalog阻塞与两次settings更新推导未验证的有界刷新事务假设：catalog改异步且deadline/取消，给每次刷新generation，只允许最新完成写入；将路由与默认引用一次原子应用或带前置版本检查补偿。先以永不返回catalog、较慢旧扫描和快速新扫描、route成功default失败、卸载期间返回为反例。成功需宿主仍响应、旧扫描不能回写、默认总指向当前served模型，卸载后无晚到写；任一反例出现即推翻充分性。此改进相对现有去抖/try-catch增加过程有界性和跨设置一致性，不代表当前已实现，也不自动证明推理更快。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-tinytitan/src/generate.js:623-638](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/generate.js#L623-L638)

同步执行无timeout提供改进依据。

<details>
<summary>查看原文（16行）</summary>

```text
  // `catalog-scan.js` and pinned against the binary's own output by the tests.
  // A binary that exists but fails is treated the same way: a working picker
  // beats a stale route, and the reason goes to the log.
  let catalog = null;
  let source = "folder";
  if (binary !== null) {
    try {
      const stdout = run(binary, ["--catalog", "--models-dir", directory], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      const parsed = JSON.parse(String(stdout));
      if (parsed !== null && typeof parsed === "object" && Array.isArray(parsed.models)) {
        catalog = parsed;
        source = "server";
      } else {
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-tinytitan/src/generate.js:765-772](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/generate.js#L765-L772)

先路由后默认提供一致性反例。

```text
    await settings.update(namespace, parsed[namespace]);
    const defaultModel = await ensureDefaultModel({
      settings,
      ids: rows.map((row) => row.id),
      provider: options.provider ?? ROUTE_DEFAULTS.provider,
      log: options.log,
    });
    options.log?.(
```

**依据 3 · 源码核查**：[plugins/dsh-tinytitan/src/index.js:128-144](https://github.com/Pummelchen/TinyTitan/blob/47935132898b544bbf7f0f058a1529482129e87f/plugins/dsh-tinytitan/src/index.js#L128-L144)

刷新异步发起无generation。

<details>
<summary>查看原文（17行）</summary>

```text
        void Promise.resolve(apply({ ...resolved, settings, log })).catch((error) => {
          log(
            `dsh-tinytitan: route refresh threw: ${error instanceof Error ? error.message : error}`,
          );
        });
      } else {
        legacy({ ...resolved, log });
      }
    } catch (error) {
      log(
        `dsh-tinytitan: route registration threw: ${error instanceof Error ? error.message : error}`,
      );
    }
  };
}
/**
 * Report a refusal where an operator will actually see it.
```

</details>

#### 缺口

- 本轮没有目标执行；当前版本真实服务、watch及压缩效果未验证。
  **影响**：不能据此扩大采用或效果保证。
  **进一步探讨**：在隔离profile固定版本执行所述反例和小任务。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
