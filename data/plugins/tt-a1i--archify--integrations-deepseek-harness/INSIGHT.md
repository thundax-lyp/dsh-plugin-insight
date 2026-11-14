# Archify DSH

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e378488](https://github.com/tt-a1i/archify/tree/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness)

<!-- BEGIN META -->
[![GitHub ★ 96,236](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=96%2C236&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify) [![npm 30d 51,582](https://img.shields.io/static/v1?label=npm+30d&message=51%2C582&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh)
<!-- END META -->

> **功能**：通过 DeepSeek Harness 文件系统 Skill 提供器加载随包分发的 Archify 图表技能。

> **亮点**：[Q02](#research-q02) 将固定 Skill 交给现有的宿主提供器并保留默认根。[Q04](#research-q04) 的三份版本标识可分别定位发布包、内置 Skill 和验收宿主，团队能用它追踪分发与回退。

> **主要限制**：[Q03](#research-q03) 显示包升级和有效 Skill 来源可以不同。启用默认根保留共存和个人、项目覆盖，试用时要看加载的正文及路径。[Q04](#research-q04) 也表明上游主分支的回执修复须经更新 Skill pin 才能进入 bundle。

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
  - [Q01 · 用 DSH 插件分发和手放 Skill 相比，架构交接能得到什么？](#detail-section-11)
  - [Q02 · 从包声明到 Skill 文件实际走哪条路径，失败落在哪层？](#detail-section-12)
  - [Q03 · 宿主保留哪些根，已有同名副本和卸载如何影响生效状态？](#detail-section-13)
  - [Q04 · 主分支校验回执修复会随此包出现吗，怎样追到当前包内容？](#detail-section-14)
  - [Q05 · 哪类开发者值得试用，首次、持续和恢复的真实投入是什么？](#detail-section-15)
  - [Q06 · 怎样用可读的加载来源回执辨认升级实际生效的 Skill？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DSH CLI 的开发团队可按 profile 分发 Archify，用工作区里的规范 JSON 和 HTML 交接仓库架构图。[Q01](#research-q01)

个人或项目根可直接放置相同的 Skill，沿用同一绘制流程。包分发把选择的快照和退出命令纳入同一 profile，既有同名项目配置仍可优先生效。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 固定 Skill 载入 | 按 DSH profile 分发 Archify | 包可解析且实际加载来源可能受同名文件影响 |
| 默认根共存 | 保留个人及项目 Skill | 当前依据是补丁和精确 CLI 的验收设计 |
| 按 profile 退出 | 用宿主命令移除测试 bundle | 退出后回查基础配置与原有 Skill |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH CLI 0.2.1-rc.2 与 Node ^22.19.0 或 >=24.0.0 | 本次试用范围 | 解析补丁并提供 Skill 服务 | 保留旧流程，其他宿主单独核查 |
| 精确的 1.1.0 发布包、能解析它的隔离 profile | 是 | 加载包内的固定 Skill | 缺包或不具备 profile 访问权时停止试用 |
| 模型、Agent shell、可写工作区和渲染条件 | 实际制图必需 | 生成与打开 JSON 和 HTML | 用既有流程产出并核实图表 |
| 更新检查与远程品牌素材的网络访问 | 仅相应功能 | 提供通知或取得作者指定的资源 | 使用已有本地资源，按 Skill 当前行为另行核实 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者记录 CLI、Node、包与既有 Skill 来源 | 能对照前后相同项目和个人根 |
| 加载 | 宿主解析补丁并注册文件系统提供器 | 默认技能仍可发现且 Archify 来源符合预期 |
| 制作与验收 | Agent 生成规范和图，开发者核对真实请求链 | 文件可打开，路径可交接，主链可由代码复核 |
| 退出 | 开发者移除测试配置中的包并重新检查 | 基础配置能启动，保留原有 Skill |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 包下载与 Node 环境资源未计量 | 核对宿主、包与技能来源 | 使用隔离 profile |
| 持续 | 模型、渲染及存储用量未知 | 核对内容与路径，升级后复查覆盖 | 按每张合格交接图计量 |
| 恢复 | 失败重试与排障资源未计量 | 检查来源、必要时撤下测试 bundle | 退出后回读基础配置和原技能 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 固定分发 | 清单与脚本确认包内资源来源 | 实际环境是否会由同名副本覆盖 |
| 保留默认根 | 补丁和测试源码有专门验证分支 | 原生 Desktop 的覆盖与热更行为 |
| 交接图产出 | 已有 Skill 的目标是生成普通 JSON 和 HTML 文件 | 同条件任务正确率和净耗时 |

> **思考**：[Q03](#research-q03) 显示包升级和有效 Skill 来源可以不同。启用默认根保留共存和个人、项目覆盖，试用时要看加载的正文及路径。[Q04](#research-q04) 也表明上游主分支的回执修复须经更新 Skill pin 才能进入 bundle。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将固定 Skill 交给现有的宿主提供器并保留默认根。[Q04](#research-q04) 的三份版本标识可分别定位发布包、内置 Skill 和验收宿主，团队能用它追踪分发与回退。

[Q03](#research-q03) 的验收设计同时尝试禁用基础提供器、加入同名副本、回读正文摘要和退出后启动，能分辨包已装、根被发现和内容实际生效。复用时需要宿主可导出已加载定义和片段范围，同时维护不同宿主的断言。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示包升级和有效 Skill 来源可以不同。启用默认根保留共存和个人、项目覆盖，试用时要看加载的正文及路径。[Q04](#research-q04) 也表明上游主分支的回执修复须经更新 Skill pin 才能进入 bundle。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 在隔离 profile 先记录原有 Skill，再按精确版本试装，核对生效来源，画一条熟悉的请求链并回读文件。遇到来源不符、技能消失或文件不可交接时撤下测试包并复查原工作流。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码核实 Skill 的分发和接线机制。发布记录对应具体包及 CLI 宿主。实际交付收益、原生 Desktop 兼容和加载诊断假设待验证。

- 已检查：作者 README、包清单、源码路径 integrations/deepseek-harness/README.md、archify/SKILL.md、integrations/deepseek-harness/cordis.patch.yml、integrations/deepseek-harness/package.json、integrations/deepseek-harness/lib/index.js、integrations/deepseek-harness/scripts/pack.mjs、integrations/deepseek-harness/scripts/distribution-acceptance.mjs、integrations/deepseek-harness/release.json、integrations/deepseek-harness/scripts/release-source.mjs、archify/scripts/check-render-output.mjs、test/explainer-check.test.mjs 及固定范围 inventory；组件：integrations/deepseek-harness。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：统计仅覆盖固定子组件。为判断发布 pin 是否承接校验器变更，额外查阅主仓 Skill 说明、校验器和对应测试。沿用旧档案的精确包原件作为有日期的发布材料。本轮未执行目标代码、测试、安装、宿主或模型任务，也未重新取包。
- 下一步：[Q06](#research-q06) 在精确 CLI 和隔离 profile 用有无来源回执对照个人与项目副本，计正确判定、时间和额外维护。若结果无改善或宿主无法可靠提供来源，停止设计。

**分析版本**

- **仓库**：[tt-a1i/archify](https://github.com/tt-a1i/archify)
- **版本号**：1.1.0（[固定提交 e378488](https://github.com/tt-a1i/archify/tree/e37848822238e3a61b12739185cdadd49843a620)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提议提供只读的有效来源与包版本回执。项目、个人、包内三类来源可沿现有探针的路径与摘要分辨，收益以对照组的误判和排查时间检验。

[Q06](#research-q06) 在精确 CLI 和隔离 profile 用有无来源回执对照个人与项目副本，计正确判定、时间和额外维护。若结果无改善或宿主无法可靠提供来源，停止设计。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 256 | — | — | 4487 |
| .js | source | 1 | 21 | 19 | 0 | — |
| .mjs | source | 5 | 989 | 885 | 43 | — |
| .mjs | test | 10 | 1178 | 1083 | 18 | — |

</details>

**活跃度**

[![Issue 未关闭 155](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=155&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 103](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=103&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+created%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z) [![近30天关闭 77](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=77&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z)



统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定的 1.1.0 分发与宿主边界内，软件团队通过这个 bundle 交付架构图时得到什么额外管理能力，怎样辨认实际加载的 Skill，主仓库校验回执修复是否进入该包？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用 DSH 插件分发和手放 Skill 相比，架构交接能得到什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 DSH CLI 的维护者可让 Agent 用 Archify 画一条真实请求链，交接件是同一工作区里能打开的规范 JSON 和 HTML。作者建议输入系统组件、主路径、外部依赖和信任边界。合格结果还需要维护者拿图与已知的仓库路径或接口对照，检查主路径和关键边界能否从代码复核。网页内的 Produced Files 条带不会自动收到普通 shell 产物，作者建议在回复里给出确切工作区路径。

团队原来也能将同版 Skill 放进个人或项目根目录，再走相同的 Agent、shell、文件流程。适配器增加了按 profile 安装和移除一份发布时固定的资源，团队可据包版本定位分发物，但同名手工副本仍可参与加载。绘图格式、布局、校验和渲染属于内置 Archify。本轮看到的是分发和管理路径的差别，缺少同版本手工放置与包分发在实际交接任务中的对照结果。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:148-163](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/README.md#L148-L163)

作者描述一次架构任务的输入，及用普通工作区文件交付的边界。

<details>
<summary>查看原文（16行）</summary>

````text
## Invoke

Ask DSH to load Archify by name:

```text
Use the archify skill to map this repository's runtime architecture.
Show 8–12 core components, one primary path, external dependencies, and trust boundaries.
Put supporting detail in cards instead of adding more edges.
After delivery, return the exact workspace paths of the specification JSON and the HTML artifact.
```

Archify then runs through DSH's ordinary Skill, shell, and filesystem paths. Generated JSON and HTML are normal workspace files.

## Produced Files limitation

Files created by shell commands do **not** automatically appear in the Web Produced Files strip. Ask the agent to return the **exact workspace paths** of the specification JSON and the HTML artifact, then open those files from the workspace.
````

</details>

**依据 2 · 作者声明**：[archify/SKILL.md:12-16](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/archify/SKILL.md#L12-L16)

固定主仓版本的 Skill 指引给出候选规范与 HTML 的工作目录约定；本文件 Git blob 与包的 Skill pin 中该同名文件相同。

```text
Create checked standalone HTML as a native diagram or a one-page explainer that answers a question.

Run commands from your working directory. Unless the user names another location, give each new artifact request its own folder `.archify/<type>-<slug>-<YYYYMMDD-HHMMSS>/` there (local time, chosen once): keep the candidate and `<slug>.html` in it and reuse it for repairs. Native diagrams use `candidate.json` with `meta.output` relative to the working directory; explainers may use `candidate.archify.md` and a portable output filename. A later request gets a new folder. Replace `bin/archify.mjs` in every command with the installed package's absolute path, or its path relative to your working directory; CLI input and output paths resolve from that directory.

For a native diagram of a real codebase, read [Repository authoring](references/repository-authoring.md) while tracing the requested behavior. A system description uses the native steps below; a frozen candidate uses the handoff path.
```

**依据 3 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:4-10](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/cordis.patch.yml#L4-L10)

适配器用已有宿主提供器挂载额外根，默认根一起发现。

```text
- insert:
    - id: archify-skill-filesystem
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: archify-plugin
        includeDefaultRoots: true
        bundledSkillDir: !!js process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:path').dirname(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('@tt-a1i/archify-dsh/package.json')), 'skills')
```

#### 缺口

- 缺少团队重复使用和同条件比对记录。
  **影响**：可说明交付入口变化，无法估算合格率或节省的制图、交接时间。
  **进一步探讨**：在同一仓库、宿主和模型上，用手放与包分发两条路线交付同一条请求链，并记录人工验收与复查。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从包声明到 Skill 文件实际走哪条路径，失败落在哪层？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

启动入口是子包声明的补丁。补丁插入宿主的 @deepseek-ai/dsh-skill-filesystem，命名为 archify-plugin，加默认根；其 !!js 以 profile 的 baseUrl 为锚，用 createRequire 解析公开导出的 @tt-a1i/archify-dsh/package.json，再用 dirname 和 join 取得同包的 skills 目录。宿主在激活时求值，所以需要从 profile 能解析包、存在宿主提供器并能使用这些 Node 内建模块。表达式没有捕获解析错误，包路径断开会在解析阶段失败。lib/index.js 的导出是同式辅助解析器，有参数缺失与解析错误提示，而补丁并未引用它。

源树里没有已经生成的 skills/archify，pack 先准备固定 Skills 快照并调用标准 stager，再用 npm pack --ignore-scripts 生成包。打包输出缺文件列表、缺补丁或缺 SKILL.md 都会抛错。声明的 Skill 用途由文件系统挂载兑现，宿主加载完后才由 Agent 按 Skill 指引发起 shell 调用。补丁在宿主进程内运行，表达式当前只用内置包解析与路径方法。Skill 文件另有可选的更新提示和品牌资产网络路径，不能用补丁的窄权限推及后续 Agent 任务。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/package.json:7-19](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/package.json#L7-L19)

支持包身份和 manifest 导出，以及归档披露的文件集合。

<details>
<summary>查看原文（13行）</summary>

```text
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "skills",
    "README.md",
    "CHANGELOG.md",
    "LICENSE",
    "release.json"
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/package.json:40-45](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/package.json#L40-L45)

实际声明的入口是 bundle patch。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
}
```

**依据 3 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:4-10](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/cordis.patch.yml#L4-L10)

核实插入的组件名、提供器名称、默认根和以 profile 为锚的解析表达式。

```text
- insert:
    - id: archify-skill-filesystem
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: archify-plugin
        includeDefaultRoots: true
        bundledSkillDir: !!js process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:path').dirname(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('@tt-a1i/archify-dsh/package.json')), 'skills')
```

**依据 4 · 源码核查**：[integrations/deepseek-harness/lib/index.js:7-21](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/lib/index.js#L7-L21)

辅助解析器有明确的失败分支，供与实际 patch 接线对照。

<details>
<summary>查看原文（15行）</summary>

```text
export function resolveArchifySkillRoot(profileBaseUrl) {
  if (!profileBaseUrl) {
    throw new Error('archify-dsh: missing DSH profile baseUrl for package resolution');
  }
  let manifestPath;
  try {
    manifestPath = createRequire(profileBaseUrl).resolve(`${PACKAGE_NAME}/package.json`);
  } catch (error) {
    throw new Error(
      `archify-dsh: cannot resolve ${PACKAGE_NAME}/package.json from the DSH profile`,
      { cause: error },
    );
  }
  return join(dirname(manifestPath), 'skills');
}
```

</details>

**依据 5 · 源码核查**：[integrations/deepseek-harness/scripts/pack.mjs:21-33](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/scripts/pack.mjs#L21-L33)

生成 Skill 目录再执行禁用 scripts 的 npm pack。

<details>
<summary>查看原文（13行）</summary>

```text
try {
  stageAdapter(stage);
  releaseSnapshot(snapshot);
  stageCleanSkill({ repoRoot: snapshot, destination: path.join(stage, 'skills', 'archify') });


  const packed = spawnCliSync('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', stage], {
    cwd: stage,
    encoding: 'utf8',
  });
  if (packed.status !== 0) {
    throw new Error(`npm pack failed: ${packed.stderr || packed.stdout || packed.error?.message}`);
  }
```

</details>

**依据 6 · 源码核查**：[integrations/deepseek-harness/scripts/pack.mjs:57-64](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/scripts/pack.mjs#L57-L64)

构建失败门槛包含包内 Skill 入口文件。

```text
  if (!Array.isArray(packMeta.files)) {
    throw new Error(`npm pack metadata did not include a file list\n${packed.stdout}`);
  }
  const files = packMeta.files.map((file) => ({ path: file.path }));
  const packagedPaths = new Set(files.map(({ path: filePath }) => filePath.replace(/^package\//, '')));
  for (const required of ['package.json', 'release.json', 'cordis.patch.yml', 'README.md', 'CHANGELOG.md', 'LICENSE', 'lib/index.js', 'skills/archify/SKILL.md']) {
    if (!packagedPaths.has(required)) throw new Error(`DSH tarball is missing required file: ${required}`);
  }
```

**依据 7 · 作者声明**：[integrations/deepseek-harness/README.md:11-13](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/README.md#L11-L13)

作者区分适配器的可执行面与 Skill 内的可选联网。

```text
`release.json` records the released package's immutable Skill source commit, Skill version, and target DSH acceptance version; historical release pins remain in their tags. Packaging uses the canonical clean-Skill stager against that commit, preserving license notices and excluding development files. Adapter version 0.1.0 and its `archify-dsh-v0.1.0` tag remain unchanged; reproduce that old release by checking out its tag first.

The adapter registers no native render/validate/deliver tools, custom Web client, Produced Files chips, telemetry, credentials handling, background services, or install hooks. The bundled Skill includes an optional, notification-only stable Archify update checker; it never upgrades the plugin. Authored remote brand assets may also use the Skill's bounded network path. The adapter itself makes no network requests.
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 宿主保留哪些根，已有同名副本和卸载如何影响生效状态？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

应核对两种不同状态，原有默认根还是否可发现，以及按名称加载时真正取到了哪份内容。1.1.0 补丁显式启用默认根。验收源码构造禁用基础 provider 的分支，由新提供器单独证明可见性和 Archify 正文。对于历史 0.1.0、1.0.0 基线，同一隔离断言明确期望默认根缺席，避免把新行为回填到历史包。作者在 README 中把 DSH 和共享 Agent 的个人／项目根列入测试范围。

测试还分别放入旧的个人和项目副本，要求有效文件路径与期望路径一致且去 frontmatter 后的正文摘要一致，再同时放两份验证项目覆盖个人。脚本删除自己的临时副本后要求包内正文恢复。由此可见版本号一致只确认包层，用户原来的同名定义有实际覆盖路径。卸载检查包依赖和 bundle 层消失，且基础 profile 能再启动、配置没有 Archify provider。若使用者的同名定义本就是项目所需，应保留它并直接用原来的维护流程。作者的运行声明对应精确 CLI 和发行工件，Desktop 的根丢失报告仍缺目标产品上的复测。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:4-10](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/cordis.patch.yml#L4-L10)

当前补丁开启默认根。

```text
- insert:
    - id: archify-skill-filesystem
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: archify-plugin
        includeDefaultRoots: true
        bundledSkillDir: !!js process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:path').dirname(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('@tt-a1i/archify-dsh/package.json')), 'skills')
```

**依据 2 · 作者声明**：[integrations/deepseek-harness/README.md:15-27](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/README.md#L15-L27)

作者说明同名优先级与 CLI／Desktop 证据界线。

<details>
<summary>查看原文（13行）</summary>

```text
## Which Archify actually loads?

On a supported host, personal and project Skill sources outrank the bundled snapshot. An existing same-name `archify` can therefore shadow the bundle, even after the plugin has upgraded successfully. Upgrading the plugin does **not** necessarily upgrade the effective Skill. The acceptance matrix must check the actual loaded body and source path for older personal and project copies, then check that removing only the disposable test copy restores the bundled body. A version in the installed package alone is insufficient evidence.

When diagnosing a real installation, inspect the effective `archify` source path and version before changing anything. Updating or removing a personal/project copy is a separate user-controlled action; do not delete live Skills automatically to make the bundle win.

## Default Skill roots

Published **1.1.0** sets `includeDefaultRoots: true`, retaining the host's default personal and project roots alongside the packaged Archify root. The provider name and bundle directory are unchanged. Published **1.0.0** set `includeDefaultRoots: false`; when its `archify-plugin` provider was the profile's only live filesystem Skill source, personal and project Skills disappeared while Archify remained available. That was reported on macOS Desktop `0.2.0-rc.2` in [#906](https://github.com/tt-a1i/archify/issues/906) and is fixed by 1.1.0.

The acceptance script seeds distinct Skills in both DSH and shared-agent personal/project roots and checks their actual loaded bodies and paths after clean installation and same-profile upgrade. It repeats those checks with the base filesystem provider disabled, so the Archify provider must preserve the roots by itself. The immutable 0.1.0 and 1.0.0 upgrade baselines retain their original `false` expectation; 1.1.0 requires `true`.

The 1.1.0 automated checks target the exact npm CLI host in `release.json` (`0.2.1-rc.2`). They do not establish macOS Desktop `0.2.0-rc.2` acceptance or explain why the reporter's original provider was inactive. That native Desktop verification remains pending, and no support range is claimed for all `0.2.x` hosts.
```

</details>

**依据 3 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:408-428](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L408-L428)

单独装载适配器并区分默认根真／假的验证条件。

<details>
<summary>查看原文（21行）</summary>

```text
async function verifyIsolatedRoots(profile, stage, includeDefaultRoots) {
  const { probe } = await probeProfile(profile, stage, {
    isolated: true,
    expectedNames: includeDefaultRoots ? candidateSkills : ['archify'],
  });
  if (!probe.definitions.archify?.contentLength || probe.definitions.archify.provider !== 'archify-plugin') {
    fail(stage, 'isolated provider did not load Archify', { probe });
  }
  if (includeDefaultRoots) {
    verifyDefaultSkills(stage, probe, { isolated: true });
  } else {
    if (defaultSkills.some(({ name }) => probe.skills.some((skill) => skill.name === name))) {
      fail(stage, 'published isolated baseline unexpectedly exposed default roots', { probe });
    }
    pass(stage, { baseProviderDisabled: true, defaultRootsVisible: false });
  }
}

const { probe: probeReceipt, stdout: probeStdout, stderr: probeStderr } = await probeProfile(PROFILE, 'skill-discovery');
verifyDefaultSkills('default-skill-roots', probeReceipt);
await verifyIsolatedRoots(PROFILE, 'isolated-default-skill-roots', true);
```

</details>

**依据 4 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:510-544](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L510-L544)

真实历史正文 fixture、路径与摘要断言，以及临时覆盖移除后回到 bundle。

<details>
<summary>查看原文（35行）</summary>

```text
const oldSkillSource = run('git', ['show', '7158026e852f3aa6578c741e673b46d7878c92c1:archify/SKILL.md'], { cwd: repoRoot });
requireStatus('shadowing-source', oldSkillSource);
// The pinned CLI host loads the frontmatter-free, trimmed Markdown body.
// Hash that expected historical body independently of the host probe; hashing
// raw SKILL.md bytes would test frontmatter/outer whitespace instead of loading.
// A host parser change requires reviewing this exact-host contract, not weakening
// the loaded-body/path checks or copying the observed hash into the expectation.
const oldBody = oldSkillSource.stdout.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
const personalShadow = path.join(agentsHome, 'skills', 'archify');
const projectShadow = path.join(workspace, '.agents', 'skills', 'archify');
async function verifyShadow(stage, expectedFile, expectedHash) {
  const { probe } = await probeProfile(PROFILE, stage);
  const definition = probe.definitions.archify;
  if (!definition?.path || sameEntry(expectedFile, definition.path).status !== 'match'
    || definition.contentSha256 !== expectedHash) {
    fail(stage, 'effective Archify body/path does not match the expected precedence', { definition, expectedFile });
  }
  pass(stage, { effectivePath: definition.path, contentSha256: definition.contentSha256 });
}
const oldBodyHash = createHash('sha256').update(oldBody).digest('hex');
for (const [label, root] of [['personal', personalShadow], ['project', projectShadow]]) {
  fs.mkdirSync(root, { recursive: true });
  fs.writeFileSync(path.join(root, 'SKILL.md'), oldSkillSource.stdout);
  await verifyShadow(`shadowing-${label}`, path.join(root, 'SKILL.md'), oldBodyHash);
  fs.rmSync(root, { recursive: true });
}
fs.mkdirSync(personalShadow, { recursive: true });
fs.mkdirSync(projectShadow, { recursive: true });
fs.writeFileSync(path.join(personalShadow, 'SKILL.md'), oldSkillSource.stdout);
fs.writeFileSync(path.join(projectShadow, 'SKILL.md'), oldSkillSource.stdout);
await verifyShadow('shadowing-project-over-personal', path.join(projectShadow, 'SKILL.md'), oldBodyHash);
fs.rmSync(projectShadow, { recursive: true });
fs.rmSync(personalShadow, { recursive: true });
await verifyShadow('shadowing-removal-restores-bundle', probeReceipt.definitions.archify.path,
  probeReceipt.definitions.archify.contentSha256);
```

</details>

**依据 5 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:546-563](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L546-L563)

检查卸载后清单及二次宿主启动。

<details>
<summary>查看原文（18行）</summary>

```text
const remove = dsh(['plugin', '--profile', PROFILE, 'remove', PACKAGE_NAME], { timeout: PLUGIN_MUTATION_TIMEOUT });
requireStatus('uninstall', remove, { command: `dsh plugin --profile ${PROFILE} remove ${PACKAGE_NAME}` });
const removedManifest = JSON.parse(fs.readFileSync(path.join(profileDir, 'package.json'), 'utf8'));
if ((removedManifest.dsh?.profile?.bundles || []).includes(PACKAGE_NAME)
  || removedManifest.dependencies?.[PACKAGE_NAME]) {
  fail('uninstall', 'adapter dependency or bundle layer remained after plugin remove', { removedManifest });
}
pass('uninstall', { bundles: removedManifest.dsh?.profile?.bundles || [] });

const baseBootDump = dsh(['--profile', PROFILE, '--dump-config']);
requireStatus('base-profile', baseBootDump, { command: 'dsh --dump-config after uninstall' });
const leftover = parseDump(baseBootDump.stdout).rows.filter((row) => (
  row.id === 'archify-skill-filesystem' || row.config.providerName === 'archify-plugin'
));
if (leftover.length > 0) {
  fail('base-profile', 'uninstalled profile still contains the Archify provider', { leftover });
}
pass('base-profile', { bundles: removedManifest.dsh?.profile?.bundles || [] });
```

</details>

#### 缺口

- 原生 Desktop 0.2.0-rc.2 的报告未有此包对应的独立复测。
  **影响**：不能从 CLI 测试方案推出 Desktop 也能恢复默认根或安全热换。
  **进一步探讨**：在独立 Desktop profile 验证默认根、同名 Skill 和退出后状态，记录 Desktop binary 与实际命令归属。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 主分支校验回执修复会随此包出现吗，怎样追到当前包内容？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

固定包的构建仍以清单里的源提交取 Skill。适配器的外包版本 1.1.0、Skill 版本 3.2.0 和验收宿主 0.2.1-rc.2 是三个身份。比较研究基线 11b0d6031853bdae89eed57e7979aabbf0034097 与当前 e37848822238e3a61b12739185cdadd49843a620 的 integrations/deepseek-harness 对象，两者同为 e75b39ffa42014ba3d301533eabedbfcf249efe5。主仓 README 的赞助文案独立于包载入。固定主仓更新还调整单独 ZIP、explainer 校验器和回归测试。校验器在 explainer 分支将 JSON 写入管道，等 stdout 的回调再按校验结果退出，等待期间不会掉进普通图表分支。新测试读大于 65536 字节的 JSON 回执，覆盖通过和失败的退出码。此处描述的是源码行为及断言。

主分支的校验脚本 blob 是 60c2fb6ccc6bfe35c32f084e3b4f880123dafe90，release.json 锁定的 edf158c4e7a1d18d20cc329840f864289634c090 中同路径仍是旧 blob 74d9d68dd0ed15296616e0d11d627ce0ec74a29a。releaseSnapshot 分离 checkout 固定提交并核对版本，再从该工作目录生成包内 Skill。因此这次主分支提交与 ZIP 的变化不会自动带入 1.1.0 的固定 Skill 快照。原档案在 11 月 9 日只比对发布包的外层清单、补丁、release.json 原文和内层版本，摘要与作者发表的 tarball 对得上；三个外层文件也仍与当前子树一致。该历史原件没有对归档中校验脚本做逐字比对，本轮没有重下载、重打包或宣称重验已发布归档。外层 MIT 授权、内层 Apache-2.0 与历史／第三方声明也应按各自载体查阅。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/package.json:2-5](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/package.json#L2-L5)

适配器包版本和外层许可证。

```text
  "name": "@tt-a1i/archify-dsh",
  "version": "1.1.0",
  "description": "Opt-in DeepSeek Harness Skill-only bundle for the Archify architecture-diagram skill.",
  "license": "MIT",
```

**依据 2 · 源码核查**：[integrations/deepseek-harness/release.json:1-5](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/release.json#L1-L5)

独立的 Skill 版本、固定提交和 CLI 宿主。

```text
{
  "sourceCommit": "edf158c4e7a1d18d20cc329840f864289634c090",
  "skillVersion": "3.2.0",
  "dshVersion": "0.2.1-rc.2"
}
```

**依据 3 · 源码核查**：[integrations/deepseek-harness/scripts/release-source.mjs:20-28](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/scripts/release-source.mjs#L20-L28)

适配层输入用提交内列出的文件。

```text
export const adapterCommit = readGit(['rev-parse', '--verify', 'HEAD']).toString('utf8').trim();
const adapterEntries = new TextDecoder('utf-8', { fatal: true })
  .decode(readGit(['ls-tree', '-r', '-z', adapterCommit, '--', adapterPrefix]))
  .split('\0').filter(Boolean).map((record) => {
    const separator = record.indexOf('\t');
    const [mode, type, objectId] = record.slice(0, separator).split(' ');
    return { mode, type, objectId, relative: record.slice(separator + 1).slice(adapterPrefix.length) };
  // path-contract-allow: git-path -- ls-tree entries are repository-relative POSIX names.
  }).filter(({ relative }) => requiredAdapterFiles.includes(relative) || relative.startsWith('lib/'));
```

**依据 4 · 源码核查**：[integrations/deepseek-harness/scripts/release-source.mjs:78-93](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/scripts/release-source.mjs#L78-L93)

用不可变源提交生成独立 checkout，并检查 Skill 版本。

<details>
<summary>查看原文（16行）</summary>

```text
export function releaseSnapshot(destination) {
  // A separate checkout gives the canonical stager a real index, preserves Git
  // modes, and cannot include uncommitted or untracked files from the caller.
  for (const args of [
    ['clone', '--shared', '--no-checkout', '--', repoRoot, destination],
    ['-C', destination, '-c', 'core.autocrlf=false', 'checkout', '--detach', release.sourceCommit],
  ]) {
    const result = spawnCliSync('git', args, { cwd: repoRoot, encoding: 'utf8' });
    if (result.error || result.status !== 0) {
      throw new Error(`unable to read DSH source ${release.sourceCommit}: ${result.stderr || result.error?.message}`);
    }
  }
  const skill = JSON.parse(fs.readFileSync(path.join(destination, 'archify', 'package.json'), 'utf8'));
  if (skill.version !== release.skillVersion) {
    throw new Error(`DSH Skill version mismatch: ${skill.version} != ${release.skillVersion}`);
  }
```

</details>

**依据 5 · 源码核查**：[integrations/deepseek-harness/scripts/pack.mjs:21-27](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/scripts/pack.mjs#L21-L27)

统一打包过程将该 checkout 作为内置 Skill 的输入。

```text
try {
  stageAdapter(stage);
  releaseSnapshot(snapshot);
  stageCleanSkill({ repoRoot: snapshot, destination: path.join(stage, 'skills', 'archify') });


  const packed = spawnCliSync('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', stage], {
```

**依据 6 · 源码核查**：[archify/scripts/check-render-output.mjs:44-52](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/archify/scripts/check-render-output.mjs#L44-L52)

此处是适配器包锁定提交之外的主分支变动，用于检验版本传递。

```text
if (isExplainerHtml(html)) {
  const result = checkExplainerHtml(html, { file: htmlPath });
  // Piped stdout is asynchronous on macOS. Exit only after the full receipt
  // has flushed, and keep the diagram path below from emitting a second one.
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`, () => {
    process.exit(result.ok ? 0 : 1);
  });
  await new Promise(() => {});
}
```

**依据 7 · 源码核查**：[test/explainer-check.test.mjs:58-76](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/test/explainer-check.test.mjs#L58-L76)

测试源码检查大回执完整 JSON 与通过／失败退出码。

<details>
<summary>查看原文（19行）</summary>

```text
 test(`large explainer receipt flushes through a pipe (${valid ? 'success' : 'failure'})`,()=>{
  const native=fs.readFileSync(new URL('../archify/examples/erd-orders-rendered.html',import.meta.url),'utf8');
  const child={html:native,sha256:hash(native),bytes:Buffer.byteLength(native)};
  const children=Object.fromEntries(Array.from({length:20},(_,i)=>[`diagram-${i}`,child]));
  let html=fixture({children});
  if (!valid) html=html.replace('</main>','<a href="#missing">Missing</a></main>');
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'explainer-flush-'));
  try {
   const file=path.join(dir,'page.html');fs.writeFileSync(file,html);
   const run=spawnSync(process.execPath,['archify/scripts/check-render-output.mjs',file],{encoding:'utf8',maxBuffer:4*1024*1024,timeout:30000});
   assert.ifError(run.error);
   assert.equal(run.status,valid?0:1,run.stderr);
   const receipt=JSON.parse(run.stdout); // Reject truncated JSON or a second receipt.
   assert.ok(Buffer.byteLength(run.stdout)>65536,'exercise a receipt larger than a pipe buffer');
   assert.equal(receipt.ok,valid);
   assert.equal(receipt.family,'explainer');
   assert.equal(receipt.composition.nativeDiagrams.length,20);
   assert.ok(receipt.composition.nativeDiagrams.every(c=>c.receipt.ok&&c.receipt.artifact.sha256===child.sha256));
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
```

</details>

**依据 8 · 作者声明**：[integrations/deepseek-harness/README.md:5-11](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/README.md#L5-L11)

作者说明分别发版、许可证差异和固定源选择。

```text
The currently published npm package is **v1.1.0**. It bundles Archify Skill **3.2.0** and supports the exact developer-preview **`@deepseek-ai/dsh@0.2.1-rc.2`** on Node.js **`^22.19.0 || >=24.0.0`**. The 1.1 adapter contract covers this exact DSH host version; it does not make the host stable or guarantee compatibility with other DSH versions.

Version 1.1.0 was published on 2026-11-08: [npm package](https://www.npmjs.com/package/@tt-a1i/archify-dsh/v/1.1.0) · [release and verified tarball](https://github.com/tt-a1i/archify/releases/tag/archify-dsh-v1.1.0). It is a Skill-only bundle: it inserts one filesystem Skill provider named `archify-plugin` and exposes **Archify 3.2.0**, pinned to stable `main` commit `edf158c4e7a1d18d20cc329840f864289634c090`. This snapshot includes the Apache-2.0 transition (`9c306ee89`) and the standalone third-party notice fix (`edf158c4e`) that landed after the `v3.2.0` tag; it is not a byte-for-byte copy of that tag. Both bundled version manifests declare 3.2.0. It adds the ERD, Class, Tree, Timeline and Waterfall types from 3.1 and the one-page explainer from 3.2, and it is the first adapter release that sets `includeDefaultRoots: true`. The adapter remains MIT-licensed; the bundled Skill is Apache-2.0 and retains historical MIT grants and third-party notices. Inspect `LICENSE`, `LICENSE-MIT`, `NOTICE` and `THIRD_PARTY_NOTICES.md` in the actual bundled Skill, not just the outer package's license field.

Version 1.0.0 (2026-10-04) bundled **Archify 3.0.1**, pinned to `main` commit `7158026e852f3aa6578c741e673b46d7878c92c1`, and supported `@deepseek-ai/dsh@0.1.2-rc.1`. It included the Skill installation fix from [#704](https://github.com/tt-a1i/archify/pull/704) after the `v3.0.1` tag, and it set `includeDefaultRoots: false`, which 1.1.0 fixes. Its [release record](https://github.com/tt-a1i/archify/releases/tag/archify-dsh-v1.0.0) remains the reference for that host.

`release.json` records the released package's immutable Skill source commit, Skill version, and target DSH acceptance version; historical release pins remain in their tags. Packaging uses the canonical clean-Skill stager against that commit, preserving license notices and excluding development files. Adapter version 0.1.0 and its `archify-dsh-v0.1.0` tag remain unchanged; reproduce that old release by checking out its tag first.
```

**依据 9 · 作者声明**：[integrations/deepseek-harness/README.md:122-129](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/README.md#L122-L129)

作者发版记录限定具体 1.1.0 归档、宿主和发行验收环境。

```text
### Evidence matrix and outstanding work

The first row is the current **1.1.0** release. The remaining rows are historical 1.0.0 evidence for tarball SHA256 `d009c4709000915e254d709b8f023b20d2cced142cd086e56f03d96baf370b50`, adapter tag commit `594f6087358610bd16e64e5602976020871b6bff`; they are not re-certified by this documentation revision.

| Exact host / carrier | Environment and procedure | Evidence / status |
| --- | --- | --- |
| Published **1.1.0** tarball, SHA256 `e65d77e4d7ca34562d33f22480b0b4eae2b1e51ef13cd542c2618b228830b20d`, adapter tag commit `cfca6b601`, Archify 3.2.0 | Three-platform tag gate on `@deepseek-ai/dsh@0.2.1-rc.2`, Node 22: adapter staging regressions and the real tarball install, discovery/full load, `doctor`/`demo`, package smoke, uninstall, and same-profile upgrades from both 0.1.0 and 1.0.0. The same script also passed on macOS under official Node 22.23.2. No running Desktop updater. | Current support baseline: [three-platform tag gate](https://github.com/tt-a1i/archify/actions/runs/42499004935), [release record dated 2026-11-08](https://github.com/tt-a1i/archify/releases/tag/archify-dsh-v1.1.0). |
| Official npm CLI `0.1.2-rc.1` | Linux/macOS/Windows, Node 22, isolated profiles; clean install, load, installed CLI smoke, 0.1.0 → 1.0.0 upgrade, uninstall/base-profile preservation. No running Desktop updater. | Published support baseline: [three-platform tag gate](https://github.com/tt-a1i/archify/actions/runs/37219862967), [release record dated 2026-10-04](https://github.com/tt-a1i/archify/releases/tag/archify-dsh-v1.0.0). |
```

#### 缺口

- 旧归档原件只保存了四个成员原文。
  **影响**：可以追踪构建输入，但无法据此单独证明公开归档内校验脚本的对应字节。
  **进一步探讨**：核对精确 npm 归档摘要后只读同路径脚本，再分别与固定 Skill commit 和主分支的 Git blob 比较。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪类开发者值得试用，首次、持续和恢复的真实投入是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

团队已经在 CLI 0.2.1-rc.2 与支持的 Node 环境维护多个图表时，可以在临时 profile 按精确版本装一份包，省去从另一处分发副本并逐项目维护的工作。该收益以真正加载了预定 Skill 为前提。团队若已经有意维护一份带项目约定的同名副本，包可能没有增量。安装前记录个人和项目各一个已知的技能，安装后查这些技能仍可见，查 Archify 的有效路径，再用熟悉的代码做一条请求链。打开 JSON、HTML，确认与实际代码吻合并且他人可从明确路径复用。发现加载到旧副本、原有 Skill 消失或工作区文件不可交接时，先停止试用，移除测试 profile 的 bundle 后回查原有工作流。

资源开销含包联网、模型调用、渲染、存储与必要重跑，作者的 doctor/demo 与发布闸门没有给出一次合格真实任务的总量或费用。人工投入在初次核对宿主／Node 与副本，在每次升级复查路径和默认根，在每个任务验收内容。失败后用户可能还需解释来源和改错的 JSON 规范。计量时应使用一份符合仓库事实且可打开可交接的图，现金费用、机器资源及人工时间分别统计，并把失败重试计入。对未验收 Desktop 或其他 CLI 版本，旧实际使用路径提供更明确的回退。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:35-51](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/README.md#L35-L51)

精确安装、Node 条件、同 profile 升级与取件方式均是作者说明。

<details>
<summary>查看原文（17行）</summary>

````text
## Install

Use the prebuilt npm package with an exact version. Do not install from Git source.

```bash
dsh plugin --profile web add @tt-a1i/archify-dsh@1.1.0
```

## Upgrade

The 1.1.0 release gate covers a clean installation and upgrading the previous plugin releases 0.1.0 and 1.0.0 to 1.1.0 in the same isolated profile on `@deepseek-ai/dsh@0.2.1-rc.2`. Older hosts are not 1.1 targets: update the host separately before upgrading the plugin. The Node requirement remains `^22.19.0 || >=24.0.0`; the three-platform release gate runs on Node 22. See the [adapter changelog](CHANGELOG.md) for the bundled Archify change.

Run the same exact-version install command above in each profile that uses Archify. Updating DSH itself or the Archify repository does not update an already installed plugin.

For newer-host investigations, see the [host migration review and evidence matrix](#host-migration-review). The CLI checks recorded there do not extend the published support contract to Desktop or other DSH versions.

Do **not** use `dsh plugin add tt-a1i/archify`: the repository root is not a DSH package and has no bundle metadata (see [#341](https://github.com/tt-a1i/archify/issues/341)). For an npm download problem, a locally downloaded, integrity-verified `.tgz` can be passed to `dsh plugin --profile web add /absolute/path/to/package.tgz`.
````

</details>

**依据 2 · 作者声明**：[integrations/deepseek-harness/README.md:124-134](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/README.md#L124-L134)

发行测试的载体、Node、宿主及未覆盖范围。

<details>
<summary>查看原文（11行）</summary>

```text
The first row is the current **1.1.0** release. The remaining rows are historical 1.0.0 evidence for tarball SHA256 `d009c4709000915e254d709b8f023b20d2cced142cd086e56f03d96baf370b50`, adapter tag commit `594f6087358610bd16e64e5602976020871b6bff`; they are not re-certified by this documentation revision.

| Exact host / carrier | Environment and procedure | Evidence / status |
| --- | --- | --- |
| Published **1.1.0** tarball, SHA256 `e65d77e4d7ca34562d33f22480b0b4eae2b1e51ef13cd542c2618b228830b20d`, adapter tag commit `cfca6b601`, Archify 3.2.0 | Three-platform tag gate on `@deepseek-ai/dsh@0.2.1-rc.2`, Node 22: adapter staging regressions and the real tarball install, discovery/full load, `doctor`/`demo`, package smoke, uninstall, and same-profile upgrades from both 0.1.0 and 1.0.0. The same script also passed on macOS under official Node 22.23.2. No running Desktop updater. | Current support baseline: [three-platform tag gate](https://github.com/tt-a1i/archify/actions/runs/42499004935), [release record dated 2026-11-08](https://github.com/tt-a1i/archify/releases/tag/archify-dsh-v1.1.0). |
| Official npm CLI `0.1.2-rc.1` | Linux/macOS/Windows, Node 22, isolated profiles; clean install, load, installed CLI smoke, 0.1.0 → 1.0.0 upgrade, uninstall/base-profile preservation. No running Desktop updater. | Published support baseline: [three-platform tag gate](https://github.com/tt-a1i/archify/actions/runs/37219862967), [release record dated 2026-10-04](https://github.com/tt-a1i/archify/releases/tag/archify-dsh-v1.0.0). |
| Official npm CLI `0.2.0-rc.2` | macOS, Node 26.8.1, pnpm 11.5.2, isolated `web` profile; clean install, unique discovery/full load, `doctor`/`demo`, uninstall, same-profile 0.1.0 → 1.0.0 upgrade and repeat checks. CLI probes stop before package mutation. | Passed in the 2026-10-05 investigation; [maintainer evidence](https://github.com/tt-a1i/archify/issues/716#issuecomment-5991963398). Reused, not an expansion of support. |
| Official npm CLI `0.2.1-alpha.1` | Same isolated macOS procedure and Node/pnpm versions as the preceding row. | Passed in the same [2026-10-05 investigation](https://github.com/tt-a1i/archify/issues/716#issuecomment-5991963398); reused, not an expansion of support. |
| Other OS/Node combinations on these 0.2 hosts; packaged Electron Desktop | Not covered by the two macOS CLI experiments. Reporter: Windows 11 build 26200, Desktop `0.2.0-rc.2`, separate CLI `0.2.1-alpha.1`, updater `1.6.4`; new adapter not yet installed when reported. | Pending native acceptance and exact Desktop binary/command provenance in [#716](https://github.com/tt-a1i/archify/issues/716). No Windows/Desktop success claim. |

The 0.2 experiment installed official npm host dependencies with lifecycle scripts disabled; it tested Skill behavior, not all host native features. It did not rerun the full release gate or source-version package smoke. Its success cannot stand in for Electron packaging, Node 24, or a live third-party updater.
```

</details>

**依据 3 · 作者声明**：[integrations/deepseek-harness/README.md:148-171](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/README.md#L148-L171)

作者说明用户任务、工作区回执和卸载入口。

<details>
<summary>查看原文（24行）</summary>

````text
## Invoke

Ask DSH to load Archify by name:

```text
Use the archify skill to map this repository's runtime architecture.
Show 8–12 core components, one primary path, external dependencies, and trust boundaries.
Put supporting detail in cards instead of adding more edges.
After delivery, return the exact workspace paths of the specification JSON and the HTML artifact.
```

Archify then runs through DSH's ordinary Skill, shell, and filesystem paths. Generated JSON and HTML are normal workspace files.

## Produced Files limitation

Files created by shell commands do **not** automatically appear in the Web Produced Files strip. Ask the agent to return the **exact workspace paths** of the specification JSON and the HTML artifact, then open those files from the workspace.

## Uninstall

```bash
dsh plugin --profile web remove @tt-a1i/archify-dsh
```

The standard plugin command removes the adapter dependency and bundle layer. The base profile remains usable.
````

</details>

**依据 4 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:546-563](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L546-L563)

清单检查加重启，体现失败后检查范围。

<details>
<summary>查看原文（18行）</summary>

```text
const remove = dsh(['plugin', '--profile', PROFILE, 'remove', PACKAGE_NAME], { timeout: PLUGIN_MUTATION_TIMEOUT });
requireStatus('uninstall', remove, { command: `dsh plugin --profile ${PROFILE} remove ${PACKAGE_NAME}` });
const removedManifest = JSON.parse(fs.readFileSync(path.join(profileDir, 'package.json'), 'utf8'));
if ((removedManifest.dsh?.profile?.bundles || []).includes(PACKAGE_NAME)
  || removedManifest.dependencies?.[PACKAGE_NAME]) {
  fail('uninstall', 'adapter dependency or bundle layer remained after plugin remove', { removedManifest });
}
pass('uninstall', { bundles: removedManifest.dsh?.profile?.bundles || [] });

const baseBootDump = dsh(['--profile', PROFILE, '--dump-config']);
requireStatus('base-profile', baseBootDump, { command: 'dsh --dump-config after uninstall' });
const leftover = parseDump(baseBootDump.stdout).rows.filter((row) => (
  row.id === 'archify-skill-filesystem' || row.config.providerName === 'archify-plugin'
));
if (leftover.length > 0) {
  fail('base-profile', 'uninstalled profile still contains the Archify provider', { leftover });
}
pass('base-profile', { bundles: removedManifest.dsh?.profile?.bundles || [] });
```

</details>

#### 缺口

- 缺少同环境、同任务的多次运行样本及费用。
  **影响**：能识别首次、持续和恢复工作的来源，无法断言采用能够降低单位任务费用。
  **进一步探讨**：控制宿主和模型做成对任务，记录合格交付率、失败重试、人工时间和现金支出。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样用可读的加载来源回执辨认升级实际生效的 Skill？

**研究主题**：新假设与验证

#### 完整回答

可以做一个只读的 profile 诊断回执，用宿主已经解析的定义标出当前 Skill 来源类别、包内版本与正文摘要，并在发现同名候选时标出选择的来源。已装包版本只提示分发层，当前探针要求文件路径与正文摘要同时匹配，还要验证项目和个人根的优先级。这组依据支持诊断思路。宿主适配器会在启动时加载补丁，诊断应在 Skill 已解析后读取状态，不能自行修改优先级或删文件。对可共享的诊断报告只显示项目、个人或包内路径分类和摘要，绝对路径保留在本地。

对照同一 CLI、包与 profile 的无同名副本、个人覆盖、项目覆盖和去掉测试覆盖后的场景。让操作员分别用现有包版本输出与新增回执判定来源，记录误判率、诊断时间及额外维护负担。如果版本加现有配置已能同样准确且迅速判定，或宿主版本差异令实际来源输出不可靠，就放弃新增回执。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:520-544](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L520-L544)

现有探针读取有效路径和正文摘要，验证三类来源选择和回退。

<details>
<summary>查看原文（25行）</summary>

```text
async function verifyShadow(stage, expectedFile, expectedHash) {
  const { probe } = await probeProfile(PROFILE, stage);
  const definition = probe.definitions.archify;
  if (!definition?.path || sameEntry(expectedFile, definition.path).status !== 'match'
    || definition.contentSha256 !== expectedHash) {
    fail(stage, 'effective Archify body/path does not match the expected precedence', { definition, expectedFile });
  }
  pass(stage, { effectivePath: definition.path, contentSha256: definition.contentSha256 });
}
const oldBodyHash = createHash('sha256').update(oldBody).digest('hex');
for (const [label, root] of [['personal', personalShadow], ['project', projectShadow]]) {
  fs.mkdirSync(root, { recursive: true });
  fs.writeFileSync(path.join(root, 'SKILL.md'), oldSkillSource.stdout);
  await verifyShadow(`shadowing-${label}`, path.join(root, 'SKILL.md'), oldBodyHash);
  fs.rmSync(root, { recursive: true });
}
fs.mkdirSync(personalShadow, { recursive: true });
fs.mkdirSync(projectShadow, { recursive: true });
fs.writeFileSync(path.join(personalShadow, 'SKILL.md'), oldSkillSource.stdout);
fs.writeFileSync(path.join(projectShadow, 'SKILL.md'), oldSkillSource.stdout);
await verifyShadow('shadowing-project-over-personal', path.join(projectShadow, 'SKILL.md'), oldBodyHash);
fs.rmSync(projectShadow, { recursive: true });
fs.rmSync(personalShadow, { recursive: true });
await verifyShadow('shadowing-removal-restores-bundle', probeReceipt.definitions.archify.path,
  probeReceipt.definitions.archify.contentSha256);
```

</details>

**依据 2 · 作者声明**：[integrations/deepseek-harness/README.md:15-19](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/integrations/deepseek-harness/README.md#L15-L19)

维护者文档明确存在升级成功而仍加载同名副本的判断差异。

```text
## Which Archify actually loads?

On a supported host, personal and project Skill sources outrank the bundled snapshot. An existing same-name `archify` can therefore shadow the bundle, even after the plugin has upgraded successfully. Upgrading the plugin does **not** necessarily upgrade the effective Skill. The acceptance matrix must check the actual loaded body and source path for older personal and project copies, then check that removing only the disposable test copy restores the bundled body. A version in the installed package alone is insufficient evidence.

When diagnosing a real installation, inspect the effective `archify` source path and version before changing anything. Updating or removing a personal/project copy is a separate user-controlled action; do not delete live Skills automatically to make the bundle win.
```

#### 缺口

- 诊断回执尚为设计假设。
  **影响**：没有证据表明真实团队的辨认时间或误判会下降。
  **进一步探讨**：用两种诊断方式盲判含旧副本的隔离 profile，统计正确率、时间、误改和维护成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
