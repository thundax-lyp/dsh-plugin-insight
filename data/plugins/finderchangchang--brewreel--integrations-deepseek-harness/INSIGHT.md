# dsh-brewreel

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[217eb1f](https://github.com/Finderchangchang/brewreel/tree/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness)

<!-- BEGIN META -->
[![GitHub ★ 179](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=179&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Finderchangchang/brewreel) [![npm 30d 1,432](https://img.shields.io/static/v1?label=npm+30d&message=1%2C432&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-brewreel) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-brewreel)
<!-- END META -->

> **功能**：让 DSH 模型生成分镜 JSON，通过模板渲染竖版宣传片并检查交付。

> **亮点**：[Q01](#research-q01) 把分镜、渲染和可交付文件回执连接为宿主工具路径。

> **主要限制**：[Q02](#research-q02) 路径、环境和哈希约束有各自范围，成片仍需人审核。[Q03](#research-q03) 渲染依赖较重且有明确宿主边界。

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
  - [Q01 · 插件如何把分镜变成可交付文件？](#detail-section-11)
  - [Q02 · 文件和子进程受什么限制？](#detail-section-12)
  - [Q03 · 如何控制安装和失败成本？](#detail-section-13)
  - [Q04 · 怎样减少错误交付预览？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要从固定模板制作短竖版宣传片的开发者和内容人员。

只装技能并让模型调用 shell，或手工编排模板及校验输出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 分镜工具 | 校验模板化输入 | 需按模板及人工复核 |
| 渲染 | 生成候选视频 | 依赖本地运行时及浏览器 |
| 交付回执 | 确认渲染文件与哈希 | 仍需发布审核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与 Node | 宿主接入需要 | 注册并运行工具 | 只保留分镜 |
| Remotion 与浏览器 | 出片需要 | 本地模板渲染 | 停止渲染并查 doctor |
| Python 音乐依赖 | 按需 | 配乐 | 作者说明可静音 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 检查 | 操作者核对固定包和 doctor | 未知时先停 |
| 写分镜 | 模型填模板，用户核对脚本 | 校验并复核标注 |
| 渲染 | 工具执行并检查回执 | 只有符合交付条件的视频进入审核 |
| 退出 | 用户检查运行目录及依赖 | 按作用域保留或清理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 依赖、浏览器与磁盘 | 核对版本并初始化 | 作者资源估计未复跑 |
| 持续 | 渲染 CPU 和磁盘 | 维护素材和人工审查 | 实际时长未知 |
| 失败恢复 | 重新渲染资源 | 查日志及 rejected 产物 | 失败率未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模板出片 | 工具调用和成片回执 | 品牌及画面质量 |
| 边界 | 工具路径和进程参数限制 | 完整隔离 |
| 诊断 | 初始化分段 | 真实本机成本 |

> **思考**：[Q02](#research-q02) 路径、环境和哈希约束有各自范围，成片仍需人审核。[Q03](#research-q03) 渲染依赖较重且有明确宿主边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把分镜、渲染和可交付文件回执连接为宿主工具路径。

[Q02](#research-q02) 路径归一、环境过滤和进程调用分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 路径、环境和哈希约束有各自范围，成片仍需人审核。[Q03](#research-q03) 渲染依赖较重且有明确宿主边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先核对兼容性并用无敏感样本验证。[Q01](#research-q01) 审核时只交付当前通过回执的成片。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包源码支持主要工具与交付判据。没有实际出片、宿主和质量验收。

- 已检查：作者 README、包清单、源码路径 integrations/deepseek-harness/README.md、integrations/deepseek-harness/lib/paths.js、integrations/deepseek-harness/lib/plugin.js、integrations/deepseek-harness/lib/render.js、integrations/deepseek-harness/lib/run.js、integrations/deepseek-harness/lib/tools.js、integrations/deepseek-harness/package.json 及固定范围 inventory；组件：integrations/deepseek-harness。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 integrations/deepseek-harness 子组件，核对工具与渲染代表路径，未执行初始化、宿主或模型。
- 下一步：对隔离分镜做正常、单帧、失败、取消及路径测试，人工确认成片。

**分析版本**

- **仓库**：[Finderchangchang/brewreel](https://github.com/Finderchangchang/brewreel)
- **版本号**：0.7.0（[固定提交 217eb1f](https://github.com/Finderchangchang/brewreel/tree/217eb1f9c6c047b908bfa95ec03f729bec1247ce)）
- **版本日期**：2026-10-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 标记最终产物来自当前渲染还是已有文件复核，检验能否减少错交。

对隔离分镜做正常、单帧、失败、取消及路径测试，人工确认成片。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 13 | 2352 | 1750 | 516 | — |
| .md | source | 2 | 464 | — | — | 6282 |
| .mjs | source | 2 | 136 | 110 | 16 | — |
| .mjs | test | 6 | 872 | 793 | 31 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Finderchangchang/brewreel/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：面向短宣传片制作，插件如何交付视频并约束渲染？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件如何把分镜变成可交付文件？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

有短竖版宣传片需求的开发者或内容人员，可在 DSH 让模型按固定模板写分镜，交给 Remotion 路径渲染。相对仅安装技能后由模型调用 shell，插件注册结构化工具，并在配置允许且材料存在时登记 Skill。渲染支持后台任务。render 返回成片对象的条件包括未取消、进程成功、非单帧、末行的交付路径与 delivered manifest 一致、文件存在且哈希匹配。这样可区别候选文件和合格输出，但检查通过仍不代表片子符合品牌或适合发布。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/README.md:5-15](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/README.md#L5-L15)

作者描述模板化场景与人工复核

<details>
<summary>查看原文（11行）</summary>

```text
用 DeepSeek 模型写一份分镜 JSON，一次工具调用出一支竖版宣传片（1080x1920，15–45 秒）。

作者：柳伟杰 / Liu Weijie（Finderchangchang）　·　许可证：Apache-2.0　·　主仓库：<https://github.com/Finderchangchang/brewreel>

插件包名 `dsh-brewreel`，0.2.0 起随项目改名（原名 `dsh-distill-video`，项目原名 promo-video-skill / 蒸馏视频）；从旧版升级见[「从 dsh-distill-video 升级」](#从-dsh-distill-video-升级)。

## 它做什么，不做什么

- **做**：模型只写 `storyboard.json`（挑镜头、填文字）；画面由现成的 Remotion 镜头组件渲染；校验脚本拦下违反规则和《广告法》/行业合规的写法；一次调用完成校验 → 自查 → 配乐 → 渲染 → 版式检查 → 交付清单。同一份 skill 还带两件：口播配画面（有 `talk.mp4` 时只写 `broll.json`，跑 `scripts/talk.mjs`）；风格工厂（一句话描述画面风格，读 `docs/style-factory.md`，跑 `scripts/broll/new-style.mjs`）。
- **不做**：生成任意视频；替用户判断合规灰区（「需人工复核」条目原样交给用户）。
- 这是「7 个工具 + 一份 skill 说明」的插件：skill 教模型怎么写分镜，工具负责校验、出片、核对，并管住输出路径、子进程和环境变量。
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/README.md:69-73](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/README.md#L69-L73)

只用技能的对照

```text
**D. 只装 skill、不装插件**

把仓库 clone 到 `~/.agents/skills/brewreel/`（或项目的 `.agents/skills/`），dsh 会自动发现这份 skill，模型用 shell 工具跑 `node scripts/…`。没有进度、路径保护和结构化报错，只适合临时试用。

卸载：`dsh plugin --profile web remove dsh-brewreel`，再删掉运行目录（默认 `~/.dsh/brewreel/`，从 0.1.x 升级上来的可能是 `~/.dsh/distill-video/`；A 方式不开 `stageCheckout` 时依赖在 clone 的 `template/node_modules/`）。
```

**依据 3 · 源码核查**：[integrations/deepseek-harness/lib/plugin.js:94-128](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/lib/plugin.js#L94-L128)

工具与可选 Skill 注册

<details>
<summary>查看原文（35行）</summary>

```text
  for (const spec of createToolSpecs(rt)) {
    ctx.tools.register(
      defineTool({
        name: spec.name,
        description: spec.description,
        parameters: spec.parameters,
        output: {schema: {type: 'json'}, render: spec.render},
        ...(spec.readOnly ? {isConcurrencySafe: () => true} : {}),
        execute: spec.execute,
      }),
    );
  }

  if (rt.cfg.registerSkill && rt.source.mode !== 'missing') {
    const registration = buildSkillRegistration({
      sourceRoot: rt.source.root,
      runtimeRoot: rt.plan.runtimeRoot,
      lang: rt.lang,
      pluginVersion: rt.pluginVersion,
      sourceInfo: rt.sourceInfo,
    });
    /** @param {any} c */
    const register = (c) => {
      const dispose = c.skills.register(registration);
      rt.skillRegistered = true;
      rt.skillName = registration.name;
      if (typeof c.effect === 'function') {
        c.effect(() => () => {
          rt.skillRegistered = false;
        });
      }
      return dispose;
    };
    if (typeof ctx.inject === 'function') ctx.inject(['skills'], register);
    else if (ctx.skills) register(ctx);
```

</details>

**依据 4 · 源码核查**：[integrations/deepseek-harness/lib/tools.js:195-223](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/lib/tools.js#L195-L223)

渲染工具及后台路径

<details>
<summary>查看原文（29行）</summary>

```text
      name: TOOL_NAMES.render,
      description: 'Render a BrewReel storyboard into video.mp4 (validate → machine checks → music → Remotion render → layout / blank-frame checks → manifest). Takes about 3–10 minutes; runs as a background job by default (follow with job_output). Deliver only result.video.path — it is present only when every check passed. stills renders single frames for a quick look and is never a deliverable. Replaces "node scripts/make.mjs".',
      parameters: {
        storyboard: {type: 'string', required: true, description: 'Path to storyboard.json (workspace-relative or absolute).'},
        brief: {type: 'string', description: 'Brief file; facts and quotes are checked against it.'},
        outDir: {type: 'string', description: 'Output folder, one per video. Default: the storyboard\'s folder. Must be inside the workspace and not the workspace or output root itself.'},
        stills: {type: 'array', items: {type: 'number'}, description: 'Only render frames at these seconds into check/ (preview, not a deliverable).'},
        bgm: {type: 'boolean', description: 'Generate background music (default from config).'},
        queueTimeoutMin: {type: 'integer', description: 'Minutes to wait for the render lock (1–120).'},
        run_in_background: {type: 'boolean', description: 'Run as a background job (default from config: true).'},
      },
      readOnly: false,
      /** @param {any} args @param {any} exec */
      async execute(args, exec) {
        requireSource();
        const plan = planRender(args, {runtimeRoot: rt.plan.runtimeRoot, roots: rootsOf(exec), cfg: rt.cfg});
        const setupFirst = needsSetup();
        if (setupFirst && !rt.cfg.autoSetup) {
          throw new Error(L(
            `渲染依赖还没装好：先调 ${TOOL_NAMES.doctor}，征得用户同意后调 ${TOOL_NAMES.setup}（会下载几百 MB），再出片`,
            `Render dependencies are not installed: call ${TOOL_NAMES.doctor}, then — after the user agrees — ${TOOL_NAMES.setup} (downloads several hundred MB), then render again`,
          ));
        }
        const bg = args.run_in_background ?? rt.cfg.renderInBackground;
        const r = await maybeBackground(
          exec,
          bg,
          `brewreel render ${plan.outDir}`,
          async ({signal, onLine, onProgress}) => {
```

</details>

**依据 5 · 源码核查**：[integrations/deepseek-harness/lib/render.js:137-151](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/lib/render.js#L137-L151)

成片对象的证据门

<details>
<summary>查看原文（15行）</summary>

```text
export function assembleRenderResult(run, plan, {lang, validation = null}) {
  const stills = !!plan.stills;
  const {status, exitMeaning, nextStep} = describeExit(run.code, {stills, lang, killed: run.killed});
  const manifestPath = path.join(plan.outDir, 'manifest.json');
  const manifest = readJsonSafe(manifestPath);
  const deliveryLine = lastLine(run.stdout);
  const mv = manifest?.video;
  /** @type {any} */
  let video = null;
  if (!run.killed && run.code === 0 && !stills && deliveryLine.startsWith('交付：') && manifest?.status === 'delivered' && mv?.path && fs.existsSync(mv.path)) {
    const actual = sha256File(mv.path);
    if (actual === mv.sha256 && path.resolve(deliveryLine.slice(3).trim()) === path.resolve(mv.path)) {
      video = {path: mv.path, sha256: mv.sha256, durationSec: mv.durationSec ?? null, bytes: mv.bytes ?? fs.statSync(mv.path).size};
    }
  }
```

</details>

#### 缺口

- 未实际从分镜渲染视频或比较人工制作
  **影响**：无法验证镜头效果、交付时间和品牌质量
  **进一步探讨**：使用同一简报对照模板工具与手工渲染，并人工复核

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件和子进程受什么限制？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

模型提供的路径相对工作区解析，利用已存在祖先的 realpath，输出需在允许根内且不能是工作区、输出根、附加根或 home 本身。进程调用用固定参数数组、shell false 和传入的清洗环境。环境规则过滤名称像秘密的变量，但语音开关有明确白名单例外，另有代码提供的 extra。这些约束减少工具传入路径和继承环境的暴露面，不能形成 OS 沙箱。还需核对最终 manifest 给出的路径，当前 render 回执比较末行和文件哈希，没有在此段再次约束路径归属。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/lib/paths.js:20-36](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/lib/paths.js#L20-L36)

realpath 既存祖先

<details>
<summary>查看原文（17行）</summary>

```text
 * realpath of the longest existing ancestor, with the missing tail appended. Works for outputs that do
 * not exist yet.
 * @param {string} p absolute path
 */
export function realpathLoose(p) {
  let cur = path.resolve(p);
  /** @type {string[]} */
  const tail = [];
  for (;;) {
    try {
      const real = fs.realpathSync.native(cur);
      return tail.length ? path.join(real, ...tail.reverse()) : real;
    } catch {
      const parent = path.dirname(cur);
      if (parent === cur) return path.resolve(p);
      tail.push(path.basename(cur));
      cur = parent;
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/lib/paths.js:62-105](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/lib/paths.js#L62-L105)

路径解析、允许根与输出约束

<details>
<summary>查看原文（44行）</summary>

```text
export function resolveUserPath(input, workspace, field) {
  if (typeof input !== 'string' || !input.trim()) throw new PathRuleError(`${field} must be a non-empty path (relative to the workspace, or absolute)`);
  if (input.includes('\0')) throw new PathRuleError(`${field} contains a NUL byte`);
  return realpathLoose(path.resolve(workspace, input.trim()));
}

/**
 * The directories the tools may read inputs from / write outputs into.
 * @param {{workspace: string, outputRoot: string, extraWriteRoots: string[]}} o
 */
export function allowedRoots({workspace, outputRoot, extraWriteRoots}) {
  const ws = realpathLoose(workspace);
  const out = realpathLoose(path.resolve(ws, outputRoot));
  const extra = (extraWriteRoots ?? []).filter((x) => typeof x === 'string' && path.isAbsolute(x)).map((x) => realpathLoose(x));
  return {workspace: ws, outputRoot: out, extra, all: [ws, out, ...extra]};
}

/**
 * Inputs (storyboard, brief) must live in the workspace, the output root, or an extra root.
 * @param {string} abs real path
 * @param {ReturnType<typeof allowedRoots>} roots
 * @param {string} field
 */
export function assertReadable(abs, roots, field) {
  if (!roots.all.some((r) => isInside(abs, r))) {
    throw new PathRuleError(`${field} ${abs} is outside the workspace (${roots.workspace}); move it into the workspace, or add its folder to the plugin's extraWriteRoots`);
  }
}

/**
 * Output folders: inside the workspace / an extra root, never the workspace itself, the output root
 * itself, the home folder or a drive root (make.mjs clears fixed product file names there).
 * @param {string} abs real path
 * @param {ReturnType<typeof allowedRoots>} roots
 */
export function assertOutDir(abs, roots) {
  if (!roots.all.some((r) => isInside(abs, r))) {
    throw new PathRuleError(`outDir ${abs} is outside the workspace (${roots.workspace}); use a folder such as ${path.join(roots.outputRoot, '<name>')}`);
  }
  const forbidden = [roots.workspace, roots.outputRoot, ...roots.extra, realpathLoose(os.homedir()), path.parse(abs).root];
  if (forbidden.some((f) => samePath(f, abs))) {
    throw new PathRuleError(`outDir ${abs} is a root folder; give each video its own sub-folder, e.g. ${path.join(roots.outputRoot, '<name>')}`);
  }
}
```

</details>

**依据 3 · 源码核查**：[integrations/deepseek-harness/lib/run.js:31-55](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/lib/run.js#L31-L55)

环境过滤、语音变量例外与 extra

<details>
<summary>查看原文（25行）</summary>

```text
 * Build the environment for a child process from a whitelist. Credentials never pass: anything whose
 * name looks like a key / token / secret is dropped even if a whitelist or passthrough names it —
 * except the fixed VOICE_ENV names when `voice` is true (render process only).
 * @param {{extra?: Record<string, string | undefined>, passthrough?: string[], proxy?: boolean, voice?: boolean, source?: NodeJS.ProcessEnv}} [o]
 */
export function cleanEnv({extra = {}, passthrough = [], proxy = false, voice = false, source = process.env} = {}) {
  /** @type {Record<string, string>} */
  const env = {};
  const want = new Set([...ENV_WHITELIST, ...passthrough.map((x) => x.toUpperCase()), ...(proxy ? PROXY_VARS.map((x) => x.toUpperCase()) : [])]);
  for (const [k, v] of Object.entries(source)) {
    if (v === undefined) continue;
    const K = k.toUpperCase();
    if (voice && VOICE_ENV.includes(K)) {
      env[K] = v;
      continue;
    }
    const ok = want.has(K) || K.startsWith('LC_');
    if (ok && !SECRET_ENV_RE.test(K)) env[k] = v;
  }
  for (const [k, v] of Object.entries(extra)) if (v !== undefined && v !== '') env[k] = v;
  env.PYTHONUTF8 = '1';
  env.PYTHONIOENCODING = 'utf-8';
  env.NO_COLOR = '1';
  env.FORCE_COLOR = '0';
  return env;
```

</details>

**依据 4 · 源码核查**：[integrations/deepseek-harness/lib/run.js:149-160](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/lib/run.js#L149-L160)

shell false 和显式环境

<details>
<summary>查看原文（12行）</summary>

```text
    let spawnError = null;
    /** @type {import('node:child_process').ChildProcess} */
    let child;
    try {
      child = spawn(o.cmd, o.args, {
        cwd: o.cwd,
        env: o.env,
        shell: false,
        windowsHide: true,
        detached: !WIN,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
```

</details>

**依据 5 · 源码核查**：[integrations/deepseek-harness/lib/render.js:140-151](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/lib/render.js#L140-L151)

回执路径及哈希检查范围

<details>
<summary>查看原文（12行）</summary>

```text
  const manifestPath = path.join(plan.outDir, 'manifest.json');
  const manifest = readJsonSafe(manifestPath);
  const deliveryLine = lastLine(run.stdout);
  const mv = manifest?.video;
  /** @type {any} */
  let video = null;
  if (!run.killed && run.code === 0 && !stills && deliveryLine.startsWith('交付：') && manifest?.status === 'delivered' && mv?.path && fs.existsSync(mv.path)) {
    const actual = sha256File(mv.path);
    if (actual === mv.sha256 && path.resolve(deliveryLine.slice(3).trim()) === path.resolve(mv.path)) {
      video = {path: mv.path, sha256: mv.sha256, durationSec: mv.durationSec ?? null, bytes: mv.bytes ?? fs.statSync(mv.path).size};
    }
  }
```

</details>

#### 缺口

- 未覆盖全部渲染依赖、符号链接竞争和进程树行为
  **影响**：无法保证恶意依赖或并发改路径仍受限制
  **进一步探讨**：隔离环境用虚拟资料核对链接替换、取消和外部文件访问

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何控制安装和失败成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

组件包名 dsh-brewreel，当前固定清单为 0.7.0，声明 tools peer 大于等于 0.1.7-rc.2 且小于 0.2.0。说明书中 npm 版本叙述与该清单不同，需以固定制品与宿主检查为准。首次 doctor 只诊断，准备阶段再装渲染依赖、浏览器及可选音乐引擎。作者给出约 1 GB 磁盘与联网前提，未实测。checkout 模式可能在仓库模板目录写依赖或临时文件，可以隔离运行目录。若宿主或资源不满足，先停在分镜检查，保留原有渲染流程。卸载后按实际来源检查运行目录和 checkout 依赖。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/package.json:1-27](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/package.json#L1-L27)

子包版本、入口和 Node 条件

<details>
<summary>查看原文（27行）</summary>

```text
{
  "name": "dsh-brewreel",
  "version": "0.7.0",
  "description": "BrewReel (精酿) for DeepSeek Harness: write a storyboard JSON, get a vertical promo video.",
  "type": "module",
  "main": "index.js",
  "exports": {
    ".": "./index.js",
    "./package.json": "./package.json"
  },
  "files": [
    "index.js",
    "lib/",
    "cordis.patch.yml",
    "skill/",
    "README.md",
    "README.en.md",
    "LICENSE",
    "NOTICE"
  ],
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/package.json:40-50](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/package.json#L40-L50)

组件路径与宿主工具约束

<details>
<summary>查看原文（11行）</summary>

```text
  "repository": {
    "type": "git",
    "url": "https://github.com/Finderchangchang/brewreel",
    "directory": "integrations/deepseek-harness"
  },
  "bugs": {
    "url": "https://github.com/Finderchangchang/brewreel/issues"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": ">=0.1.7-rc.2 <0.2.0",
    "@deepseek-ai/schemastery": "^3.18.4"
```

</details>

**依据 3 · 源码核查**：[integrations/deepseek-harness/README.md:21-30](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/README.md#L21-L30)

作者资源估计和首次下载

<details>
<summary>查看原文（10行）</summary>

```text
## 环境要求

| 项 | 要求 |
|---|---|
| Node.js | 22.19 及以上的 22.x，或 24 及以上（和 dsh 本身的要求一致） |
| DeepSeek Harness | `@deepseek-ai/dsh` 0.1.7-rc.2 及以上的 0.1.x（0.1.7-rc.2 实测通过） |
| pnpm | `dsh plugin` 靠 pnpm 装插件，pnpm 要在 PATH 上 |
| Python（可选） | 3.10+，带 numpy、scipy；缺了配乐静音，不影响出片 |
| 磁盘 | 约 1 GB（渲染依赖 + Chrome Headless Shell） |
| 网络 | 首次初始化要从 npm 和 Google 下载依赖 |
```

</details>

**依据 4 · 源码核查**：[integrations/deepseek-harness/README.md:44-73](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/README.md#L44-L73)

checkout 写入、发布叙述和退出

<details>
<summary>查看原文（30行）</summary>

````text
**A. 本地 clone 链接安装（最稳，国内网络友好）**

```sh
git clone https://github.com/Finderchangchang/brewreel.git
dsh plugin --profile web add ./brewreel/integrations/deepseek-harness
```

在 clone 的上一级目录执行第二条命令（相对路径按当前目录解析）。插件会直接使用这份 clone 里的 skill（`checkout` 模式）：渲染依赖装在 clone 的 `template/node_modules/`，出片时 `make.mjs` 会在 clone 的 `template/` 里写临时素材和渲染锁（都已被仓库 `.gitignore` 忽略）；不想碰 clone，就在配置里开 `stageCheckout: true`，改为复制到运行目录再跑。

**B. npm（当前可用）**

```sh
dsh plugin --profile web add dsh-brewreel
```

npm 上的 `dsh-brewreel@0.5.0` 对应仓库 v0.7.0。

**C. 本地 tgz**

已经下载了发布包时：

```sh
dsh plugin --profile web add ./dsh-brewreel-0.3.0.tgz
```

**D. 只装 skill、不装插件**

把仓库 clone 到 `~/.agents/skills/brewreel/`（或项目的 `.agents/skills/`），dsh 会自动发现这份 skill，模型用 shell 工具跑 `node scripts/…`。没有进度、路径保护和结构化报错，只适合临时试用。

卸载：`dsh plugin --profile web remove dsh-brewreel`，再删掉运行目录（默认 `~/.dsh/brewreel/`，从 0.1.x 升级上来的可能是 `~/.dsh/distill-video/`；A 方式不开 `stageCheckout` 时依赖在 clone 的 `template/node_modules/`）。
````

</details>

**依据 5 · 源码核查**：[integrations/deepseek-harness/README.md:75-85](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/README.md#L75-L85)

诊断与初始化的分离

<details>
<summary>查看原文（11行）</summary>

```text
## 首次初始化

对模型说「检查一下视频插件环境」，它会调 `brewreel_doctor`。环境没就绪时，模型会先问你，再调 `brewreel_setup`：

1. `stage`：把 skill 复制到运行目录（npm / tgz 安装时必做；不联网）；
2. `deps`：在 `template/` 里 `npm ci`（Remotion 等，约几百 MB）；
3. `browser`：下载 Chrome Headless Shell（约 110 MB）。

国内网络：在配置里设 `npmRegistry`（如 `https://registry.npmmirror.com`）。Chrome Headless Shell 下载失败时，按主仓库 README「常见问题」一节（Chrome Headless Shell 下载失败？）的手动办法处理，放到 doctor 结果里 `runtimeRoot` 下的 `template/node_modules/.remotion/chrome-headless-shell/`，再调一次 setup（已存在会跳过）。

Python 依赖插件**只检测、不安装**；需要配乐就自己执行 doctor 给出的 `python -m pip install numpy scipy`。
```

</details>

#### 缺口

- 未确认发布制品、宿主、实际磁盘或初始化耗时
  **影响**：无法给出本机安装可用性和总成本
  **进一步探讨**：先检查精确子包、工具与浏览器，获授权后才在临时目录初始化

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少错误交付预览？

**研究主题**：新假设与验证

#### 完整回答

当前 render 回执已经把成片与 rejectedPreview 分开，verify 路径另凭验证进程退出码和 manifest 存在返回视频路径。可让 Agent 的最终交付呈现附带明确来源，是当前渲染回执还是已有产物复核，并把预览和失败信息另列。以模型读取旧 manifest、单帧、失败预览及正常出片四类样本对照，测错交比例及人工复核时间。若没有减少错交或增加明显复核负担，就不采用。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/lib/render.js:137-152](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/lib/render.js#L137-L152)

当前渲染的成片条件

<details>
<summary>查看原文（16行）</summary>

```text
export function assembleRenderResult(run, plan, {lang, validation = null}) {
  const stills = !!plan.stills;
  const {status, exitMeaning, nextStep} = describeExit(run.code, {stills, lang, killed: run.killed});
  const manifestPath = path.join(plan.outDir, 'manifest.json');
  const manifest = readJsonSafe(manifestPath);
  const deliveryLine = lastLine(run.stdout);
  const mv = manifest?.video;
  /** @type {any} */
  let video = null;
  if (!run.killed && run.code === 0 && !stills && deliveryLine.startsWith('交付：') && manifest?.status === 'delivered' && mv?.path && fs.existsSync(mv.path)) {
    const actual = sha256File(mv.path);
    if (actual === mv.sha256 && path.resolve(deliveryLine.slice(3).trim()) === path.resolve(mv.path)) {
      video = {path: mv.path, sha256: mv.sha256, durationSec: mv.durationSec ?? null, bytes: mv.bytes ?? fs.statSync(mv.path).size};
    }
  }
  const rejected = path.join(plan.outDir, 'video.rejected.mp4');
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/lib/render.js:174-186](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/lib/render.js#L174-L186)

失败预览单列

<details>
<summary>查看原文（13行）</summary>

```text
    delivered: !!video,
    deliveryLine: deliveryLine.startsWith('交付：') ? deliveryLine : null,
    video,
    sheet: video ? sheet : null,
    outDir: plan.outDir,
    checkDir,
    checkFrames: checkFrames.slice(0, 40),
    report: fs.existsSync(path.join(plan.outDir, 'report.txt')) ? path.join(plan.outDir, 'report.txt') : null,
    manifest: manifest ? manifestPath : null,
    checks,
    failures: failures.slice(0, 40),
    rejectedPreview: fs.existsSync(rejected)
      ? {path: rejected, sheet: fs.existsSync(path.join(plan.outDir, 'sheet.rejected.png')) ? path.join(plan.outDir, 'sheet.rejected.png') : null, note: en ? 'only for a human to see what broke — never deliver it' : '只给人看哪里坏了，不能交付'}
```

</details>

**依据 3 · 源码核查**：[integrations/deepseek-harness/lib/render.js:269-283](https://github.com/Finderchangchang/brewreel/blob/217eb1f9c6c047b908bfa95ec03f729bec1247ce/integrations/deepseek-harness/lib/render.js#L269-L283)

复核入口的回执不同

<details>
<summary>查看原文（15行）</summary>

```text
export async function executeVerify(rt, plan) {
  const run = await runProcess({cmd: process.execPath, args: plan.argv, cwd: rootOf(rt), env: makeEnv(rt.cfg), timeoutMs: 60_000, signal: rt.signal});
  if (run.spawnError) throw new Error(`could not start make.mjs: ${run.spawnError}`);
  if (run.timedOut || run.aborted) throw new Error('verify did not finish (timeout or cancelled)');
  const ok = run.code === 0;
  const manifest = readJsonSafe(path.join(plan.outDir, 'manifest.json'));
  const video = ok && manifest?.video?.path && fs.existsSync(manifest.video.path) ? manifest.video.path : null;
  const en = rt.lang === 'en';
  return {
    ok,
    exitCode: run.code,
    lines: run.stdout.split(/\r?\n/).map((l) => l.trimEnd()).filter(Boolean).slice(0, 40),
    video,
    outDir: plan.outDir,
    nextStep: ok
```

</details>

#### 缺口

- 未检验模型如何引用实际工具输出
  **影响**：不知道提示区分是否改善交付
  **进一步探讨**：用四类虚拟回执和同一交付任务对照

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
