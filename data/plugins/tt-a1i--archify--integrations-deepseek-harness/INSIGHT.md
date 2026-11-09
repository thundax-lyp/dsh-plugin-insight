# Archify DSH

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[11b0d60](https://github.com/tt-a1i/archify/tree/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness)

<!-- BEGIN META -->
[![GitHub ★ 94,540](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=94%2C540&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify) [![npm 30d 45,115](https://img.shields.io/static/v1?label=npm+30d&message=45%2C115&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh) [![最新发布 2026-10-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh)
<!-- END META -->

> **功能**：通过 DeepSeek Harness 的文件系统 Skill 提供器加载随包分发的 Archify 图表技能。

> **亮点**：[Q02](#research-q02) 将固定 Skill 通过已有提供器接入 profile。[Q04](#research-q04) 把适配器、内置 Skill 与接受宿主分开，给版本排查和退出提供可核对的对象。

> **主要限制**：[Q03](#research-q03) 显示保留默认根也保留同名覆盖。包安装或升级完成后，仍要回读生效路径和原有技能。

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
  - [Q01 · 为什么使用这个 DSH 包，交付物与手工安装有什么差别？](#detail-section-11)
  - [Q02 · 安装包如何接到 DSH 的 Skill 加载，执行边界在哪里？](#detail-section-12)
  - [Q03 · 为什么升级包和实际加载 Skill 可能不一致，默认根目录会怎样？](#detail-section-13)
  - [Q04 · 如何区分 adapter、内置 Skill 与宿主版本，源码如何对应已发布包？](#detail-section-14)
  - [Q05 · 隔离试用、更新和退出的投入是什么，何时应该停止？](#detail-section-15)
  - [Q06 · 是否值得显示有效 Skill 来源及包版本差异？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DSH CLI 的开发者可把 Archify 纳入 profile 管理，再从工作区交付图表。[Q01](#research-q01)

使用者也可把 Archify 放在个人或项目 Skill 目录。包管理提供固定分发与移除入口，同名副本仍需辨认。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 固定 Skill 载入 | 通过 DSH profile 分发 Archify | 包要可解析，同名副本存在时核对生效路径 |
| 默认根共存 | 保留个人与项目 Skill | 作者发行结果对应特定 CLI，Desktop 待验收 |
| 按 profile 移除 | 退出试用并回查原配置 | 适配层与用户自己的 Skill 分开管理 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH CLI 0.2.1-rc.2 与 Node ^22.19.0 或 >=24.0.0 | 属本次采用范围 | 解析 bundle 并提供 Skill 服务 | 其他宿主独立验收 |
| 可核实的 1.1.0 包与可写隔离 profile | 安装和退出需要 | 分发固定 Skill，独立管理适配层 | 无法确认时保留原流程 |
| Agent 的工作区和 Shell 能力 | 图表交付需要 | 写候选 JSON 和生成 HTML | 回到现有 Skill 路径或手工绘图 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者核实宿主、Node、包版本与已有技能 | 能比较安装前后的 Skill 来源 |
| 加载 | 宿主解析补丁并注册包内提供器 | 原有技能仍可发现 |
| 验收 | 核对有效路径，请 Agent 做一张小图 | JSON 和 HTML 真实存在且可从工作区打开 |
| 退出 | 在测试 profile 移除包并回读 | 适配层移除，原有 Skill 仍可加载 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 包下载、Node 与 DSH 资源，未计量 | 核验包、CLI 和配置 | 保留原技能基线 |
| 持续 | 模型、渲染和存储用量未知 | 查真实加载与产物，更新后复查共存 | 支持范围有限 |
| 恢复 | 失败重跑的资源未知 | 查同名路径，移除测试适配层并回读 | 用户自己的 Skill 独立管理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 适配层分发 | 实物的关键成员与固定源码吻合 | Desktop、其他宿主或在线更新情况 |
| 默认技能共存 | 新 patch 纳入默认根，作者探针覆盖同名顺序 | 用户环境实际有效来源 |
| 交接图产出 | 作者描述使用普通 Shell 与工作区路径 | 真实任务准确率和净节时 |

> **思考**：[Q03](#research-q03) 显示保留默认根也保留同名覆盖。包安装或升级完成后，仍要回读生效路径和原有技能。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将固定 Skill 通过已有提供器接入 profile。[Q04](#research-q04) 把适配器、内置 Skill 与接受宿主分开，给版本排查和退出提供可核对的对象。

[Q03](#research-q03) 的关键工程做法是禁用原生 provider 再验默认根，避免正常配置掩盖缺陷。路径和正文摘要可区分安装、注册和实际加载。测试移植需要相同的宿主服务与断言。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示保留默认根也保留同名覆盖。包安装或升级完成后，仍要回读生效路径和原有技能。

<a id="detail-section-6"></a>

### 1.5 使用建议

按 [Q05](#research-q05) 在隔离 profile 记录现有个人和项目 Skill，核对 Archify 实际来源后试画一条请求链，并从工作区打开。若原有技能消失或加载版本意外，先识别同名来源，移除测试适配层并复核原状态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码与精确发布包的关键成员可互相印证。宿主验收来自作者的特定 CLI 版本矩阵，简化来源排查仍待对照验证。

- 已检查：作者 README、包清单、源码路径 integrations/deepseek-harness/package.json、integrations/deepseek-harness/cordis.patch.yml、integrations/deepseek-harness/README.md、integrations/deepseek-harness/lib/index.js、integrations/deepseek-harness/scripts/distribution-acceptance.mjs、integrations/deepseek-harness/release.json、integrations/deepseek-harness/scripts/release-source.mjs、integrations/deepseek-harness/scripts/pack.mjs、integrations/deepseek-harness/test/probe-skills.mjs 及固定范围 inventory；组件：integrations/deepseek-harness。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：统计覆盖子目录中的指定 Markdown 和 JS/TS 文件。源码核查集中在清单、补丁、打包和测试接线；发布补充核对包身份与四个关键成员。未运行目标代码、插件、Skill、测试、宿主或 Desktop。
- 下一步：在目标 CLI 的隔离 profile 验证默认根、包内来源、个人和项目覆盖、工作区交付及退出，再按同一小图任务比较总资源和审阅时间。来源提示的单独验证见 [Q06](#research-q06)。

**分析版本**

- **仓库**：[tt-a1i/archify](https://github.com/tt-a1i/archify)
- **版本号**：1.1.0（[固定提交 11b0d60](https://github.com/tt-a1i/archify/tree/11b0d6031853bdae89eed57e7979aabbf0034097)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提议复用装载探针，给操作员显示有效 Skill 来源和包版本差异。收益要以根缺失和同名覆盖的诊断对照验证。

在目标 CLI 的隔离 profile 验证默认根、包内来源、个人和项目覆盖、工作区交付及退出，再按同一小图任务比较总资源和审阅时间。来源提示的单独验证见 [Q06](#research-q06)。

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

[![Issue 未关闭 147](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=147&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 118](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=118&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 93](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=93&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：采用者如何确认 DSH 在升级 Archify 插件后既保留原有技能，又实际加载所期待的 Archify？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 为什么使用这个 DSH 包，交付物与手工安装有什么差别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对经常换项目或更新 Skill 的 DSH 开发者，手工复制 Archify 也能让 Agent 按说明绘图。这个包增加通过 profile 分发和移除一份固定 Skill 的办法。清单声明 DSH bundle，补丁挂载文件系统 Skill 提供器。实际制图仍由包内 Archify 借助宿主 Shell 执行。一次合格试用应确认所需 Skill 来源、个人与项目技能仍在、JSON 和 HTML 可从工作区打开。作者说明 Shell 文件要按工作区路径查看，Web 的 Produced Files 区域不能用来判断是否生成了文件。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/package.json:1-20](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/package.json#L1-L20)

外层包身份和随包文件范围。

<details>
<summary>查看原文（20行）</summary>

```text
{
  "name": "@tt-a1i/archify-dsh",
  "version": "1.1.0",
  "description": "Opt-in DeepSeek Harness Skill-only bundle for the Archify architecture-diagram skill.",
  "license": "MIT",
  "type": "module",
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
  ],
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/package.json:40-44](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/package.json#L40-L44)

DSH 读取 bundle 的 patch 字段。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
```

**依据 3 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:4-10](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/cordis.patch.yml#L4-L10)

只插入文件系统 Skill 提供器。

```text
- insert:
    - id: archify-skill-filesystem
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: archify-plugin
        includeDefaultRoots: true
        bundledSkillDir: !!js process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:path').dirname(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('@tt-a1i/archify-dsh/package.json')), 'skills')
```

**依据 4 · 作者声明**：[integrations/deepseek-harness/README.md:148-163](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/README.md#L148-L163)

作者给出调用、交付路径和 Web 文件区域边界。

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

#### 缺口

- 不清楚用户实际更新频率
  **影响**：无法判断统一分发的需求强度
  **进一步探讨**：比较同一开发者跨项目更新时的手工步骤与遗留副本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装包如何接到 DSH 的 Skill 加载，执行边界在哪里？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主消费 dsh.bundle.patch，新增名称为 archify-plugin 的文件系统 Skill 提供器。bundledSkillDir 的 !!js 在宿主求值，用 profile 的 baseUrl 创建 Node require，解析安装包的 package.json，再拼接同目录下的 skills。表达式使用路径与模块解析能力，源码未调用网络或子进程。lib/index.js 导出另一个 resolver，含缺 baseUrl 和解析失败时的错误包装，但 patch 没有调用它，不能用该包装推断真实宿主回执。包无法从 profile 解析时，包内 Skill 根无法得出。该表达式以宿主权限执行，因此仍需审阅 patch 代码。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/package.json:7-10](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/package.json#L7-L10)

清单允许按包名子路径解析 package.json。

```text
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
```

**依据 2 · 源码核查**：[integrations/deepseek-harness/package.json:40-44](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/package.json#L40-L44)

实际激活入口是补丁文件。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
```

**依据 3 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:4-10](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/cordis.patch.yml#L4-L10)

真实插入和基于 baseUrl 的路径求值。

```text
- insert:
    - id: archify-skill-filesystem
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: archify-plugin
        includeDefaultRoots: true
        bundledSkillDir: !!js process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:path').dirname(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('@tt-a1i/archify-dsh/package.json')), 'skills')
```

**依据 4 · 源码核查**：[integrations/deepseek-harness/lib/index.js:7-21](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/lib/index.js#L7-L21)

普通模块的辅助函数与其自有错误。

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

**依据 5 · 作者声明**：[integrations/deepseek-harness/README.md:29-33](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/README.md#L29-L33)

作者说明宿主权限和普通模块未接入激活。

```text
## Patch execution boundary

The `cordis.patch.yml` file is configuration consumed by the DSH host. Its `bundledSkillDir` value uses the host loader's `!!js` expression to resolve the installed package's `skills` directory when the entry is activated. This expression runs in the DSH host process, outside the agent sandbox; it is not an inert YAML value and should be treated as host-loaded code.

The current expression is intentionally limited to Node's built-in `path` and `module` helpers for package resolution. It does not fetch data, read credentials, spawn processes, or register another permission path. The normal `lib/index.js` resolver documents the same package-root logic, but the filesystem provider is mounted directly by the patch, so that module is not the activation hook for this bundle. Keep the published install exact-pinned and review any patch change as host-process code.
```

#### 缺口

- 未运行包根解析失败的宿主分支
  **影响**：无法确认错误是否仅影响该提供器
  **进一步探讨**：在获授权的隔离环境构造不可解析包并记录启动结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为什么升级包和实际加载 Skill 可能不一致，默认根目录会怎样？

**研究主题**：缺陷与关键质疑

#### 完整回答

includeDefaultRoots: true 是新增提供器保留宿主默认根的设置。旧包在只剩自身提供器时隐藏个人和项目 Skill 的问题由作者记录。验收脚本先要求原生行仍在，再用隔离探针主动禁用原生行，按实际名称、提供器、路径和正文摘要判断默认根是否生效。默认根保留也让同名 Skill 可以覆盖包内副本。测试分别放入旧个人和项目副本，同时存在时断言项目优先，再删除测试副本并确认恢复包内 Skill。因此安装版本和实际加载来源须分别验收。作者发行结果针对 DSH 0.2.1-rc.2 CLI，尚无对应 Desktop 原生验收。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:4-10](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/cordis.patch.yml#L4-L10)

提供器声明纳入默认根。

```text
- insert:
    - id: archify-skill-filesystem
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: archify-plugin
        includeDefaultRoots: true
        bundledSkillDir: !!js process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:path').dirname(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('@tt-a1i/archify-dsh/package.json')), 'skills')
```

**依据 2 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:328-346](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L328-L346)

要求原生行保留且恰有一个新增提供器。

<details>
<summary>查看原文（19行）</summary>

```text
const archifyLayer = composed.layers.find((layer) => layer.name === PACKAGE_NAME);
const originalFilesystem = composed.rows.find((row) => row.id === 'skill-filesystem');
const archifyProvider = composed.rows.find((row) => row.id === 'archify-skill-filesystem');
const extraProviders = composed.rows.filter((row) => row.config.providerName === 'archify-plugin');
if (!dump.stdout.includes(`# == ${PACKAGE_NAME}`) || !archifyLayer) {
  fail('compose', 'composed dump does not include the Archify bundle layer', { layers: composed.layers.map((layer) => layer.name) });
}
if (!originalFilesystem || originalFilesystem.config.providerName === 'archify-plugin') {
  fail('compose', 'original DSH skill-filesystem row was replaced', { originalFilesystem });
}
if (!archifyProvider || extraProviders.length !== 1 || archifyLayer.rows.length !== 1) {
  fail('compose', 'composed config did not insert exactly one Archify Skill provider', {
    extra: extraProviders.map((row) => row.id),
    layerRows: archifyLayer.rows.map((row) => row.id),
  });
}
if (archifyProvider.config.includeDefaultRoots !== true || archifyProvider.config.providerName !== 'archify-plugin') {
  fail('compose', 'Archify provider does not preserve default Skill roots', { archifyProvider });
}
```

</details>

**依据 3 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:360-367](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L360-L367)

隔离探针主动禁用原生行。

```text
const isolatedProbePatch = path.join(scratch, 'isolated-probe.patch.yml');
// Reproduce #906 without relying on why Desktop made its base provider inactive.
fs.writeFileSync(isolatedProbePatch, `- id: skill-filesystem
  disabled: true
${fs.readFileSync(probePatch, 'utf8')}`);
async function probeProfile(profile, stage, { isolated = false, expectedNames = candidateSkills } = {}) {
  const probeOut = path.join(scratch, `${stage}-probe.json`);
  const child = spawnCli(process.execPath, [dshBin, '--profile', profile, '--patch', isolated ? isolatedProbePatch : probePatch], {
```

**依据 4 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:393-423](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L393-L423)

独立检查默认 Skill 路径、正文和提供器。

<details>
<summary>查看原文（31行）</summary>

```text
function verifyDefaultSkills(stage, probe, { isolated = false } = {}) {
  for (const fixture of defaultSkills) {
    const hits = probe.skills.filter((skill) => skill.name === fixture.name);
    const definition = probe.definitions[fixture.name];
    if (hits.length !== 1 || !definition || definition.contentSha256 !== fixture.contentSha256
      || !definition.path || sameEntry(fixture.file, definition.path).status !== 'match'
      || (isolated && (hits[0].provider !== 'archify-plugin' || definition.provider !== 'archify-plugin'))) {
      fail(stage, 'personal/project Skill was not uniquely discovered and loaded from its original root', {
        skill: fixture.name, hits, definition, isolated,
      });
    }
  }
  pass(stage, { skills: defaultSkills.map(({ name }) => name), baseProviderDisabled: isolated });
}

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
```

</details>

**依据 5 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:518-544](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L518-L544)

实际加载测试覆盖单个和共同存在的旧副本。

<details>
<summary>查看原文（27行）</summary>

```text
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

**依据 6 · 作者声明**：[integrations/deepseek-harness/README.md:21-27](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/README.md#L21-L27)

作者记录影响条件和 Desktop 范围。

```text
## Default Skill roots

Published **1.1.0** sets `includeDefaultRoots: true`, retaining the host's default personal and project roots alongside the packaged Archify root. The provider name and bundle directory are unchanged. Published **1.0.0** set `includeDefaultRoots: false`; when its `archify-plugin` provider was the profile's only live filesystem Skill source, personal and project Skills disappeared while Archify remained available. That was reported on macOS Desktop `0.2.0-rc.2` in [#906](https://github.com/tt-a1i/archify/issues/906) and is fixed by 1.1.0.

The acceptance script seeds distinct Skills in both DSH and shared-agent personal/project roots and checks their actual loaded bodies and paths after clean installation and same-profile upgrade. It repeats those checks with the base filesystem provider disabled, so the Archify provider must preserve the roots by itself. The immutable 0.1.0 and 1.0.0 upgrade baselines retain their original `false` expectation; 1.1.0 requires `true`.

The 1.1.0 automated checks target the exact npm CLI host in `release.json` (`0.2.1-rc.2`). They do not establish macOS Desktop `0.2.0-rc.2` acceptance or explain why the reporter's original provider was inactive. That native Desktop verification remains pending, and no support range is claimed for all `0.2.x` hosts.
```

#### 缺口

- 未独立运行目标宿主或 Desktop 探针
  **影响**：不能把脚本断言和作者发行结果外推到其他环境
  **进一步探讨**：在目标 CLI 隔离配置核对安装前后装载正文与路径，另做 Desktop 验收。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何区分 adapter、内置 Skill 与宿主版本，源码如何对应已发布包？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

外层适配器是 1.1.0，其 Node 要求由外层清单声明。release.json 另锁定 Archify 3.2.0 及完整提交 edf158c4e7a1d18d20cc329840f864289634c090，指定 0.2.1-rc.2 作为验收宿主。打包器读取适配器提交内白名单的常规 Git blob，单独检出 Skill 的固定提交并核对内层版本，再打包检查必要路径。宿主版本是发行验证输入，清单未通过 DSH peer 声明强制它。只读查询核实了精确版本 1.1.0 的实际 npm tarball，下载摘要与注册表完整性值和作者发行 SHA256 一致，外层清单、补丁和 release.json 与固定 Git blob 逐字相同，内层清单声明 3.2.0。这个检查只覆盖指定文件。作者的跨平台发行报告限定到该 tarball 与指定 CLI，没有本轮独立运行结果。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/package.json:1-10](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/package.json#L1-L10)

外包版本和 Node 模块入口。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "@tt-a1i/archify-dsh",
  "version": "1.1.0",
  "description": "Opt-in DeepSeek Harness Skill-only bundle for the Archify architecture-diagram skill.",
  "license": "MIT",
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/package.json:27-45](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/package.json#L27-L45)

Node 范围、仓库和 bundle 声明。

<details>
<summary>查看原文（19行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/tt-a1i/archify.git",
    "directory": "integrations/deepseek-harness"
  },
  "homepage": "https://github.com/tt-a1i/archify/tree/main/integrations/deepseek-harness",
  "bugs": "https://github.com/tt-a1i/archify/issues",
  "publishConfig": {
    "access": "public"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
}
```

</details>

**依据 3 · 源码核查**：[integrations/deepseek-harness/release.json:1-5](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/release.json#L1-L5)

固定 Skill 版本、完整提交和宿主验收版本。

```text
{
  "sourceCommit": "edf158c4e7a1d18d20cc329840f864289634c090",
  "skillVersion": "3.2.0",
  "dshVersion": "0.2.1-rc.2"
}
```

**依据 4 · 源码核查**：[integrations/deepseek-harness/scripts/release-source.mjs:37-51](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/scripts/release-source.mjs#L37-L51)

适配器字节读取自常规 Git blob。

<details>
<summary>查看原文（15行）</summary>

```text
// Capture Git blobs, not working-tree paths: local edits and symlink swaps cannot
// change the package identified by adapterCommit.
validatePortablePathSet(adapterEntries.map((entry) => entry.relative), { profile: 'archive' });
const adapterFiles = new Map(adapterEntries.map((entry) => {
  if (entry.mode === '120000') {
    throw new Error(`refusing to package committed DSH adapter symlink: ${entry.relative}`);
  }
  if (entry.type !== 'blob' || !['100644', '100755'].includes(entry.mode)) {
    throw new Error(`DSH adapter input must be a regular Git file: ${entry.relative} (${entry.mode})`);
  }
  return [entry.relative, { ...entry, content: readGit(['cat-file', 'blob', entry.objectId]) }];
}));

export const manifest = JSON.parse(adapterFiles.get('package.json').content.toString('utf8'));
export const release = JSON.parse(adapterFiles.get('release.json').content.toString('utf8'));
```

</details>

**依据 5 · 源码核查**：[integrations/deepseek-harness/scripts/release-source.mjs:78-94](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/scripts/release-source.mjs#L78-L94)

单独检出固定 Skill 并核对内包版本。

<details>
<summary>查看原文（17行）</summary>

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
}
```

</details>

**依据 6 · 源码核查**：[integrations/deepseek-harness/scripts/pack.mjs:18-30](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/scripts/pack.mjs#L18-L30)

拼合适配器与固定 Skill，npm pack 禁用 scripts。

<details>
<summary>查看原文（13行）</summary>

```text
const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'archify-dsh-pack-'));
const snapshot = fs.mkdtempSync(path.join(os.tmpdir(), 'archify-dsh-source-'));

try {
  stageAdapter(stage);
  releaseSnapshot(snapshot);
  stageCleanSkill({ repoRoot: snapshot, destination: path.join(stage, 'skills', 'archify') });


  const packed = spawnCliSync('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', stage], {
    cwd: stage,
    encoding: 'utf8',
  });
```

</details>

**依据 7 · 源码核查**：[integrations/deepseek-harness/scripts/pack.mjs:60-73](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/scripts/pack.mjs#L60-L73)

检查必要路径并报告两份来源身份。

<details>
<summary>查看原文（14行）</summary>

```text
  const files = packMeta.files.map((file) => ({ path: file.path }));
  const packagedPaths = new Set(files.map(({ path: filePath }) => filePath.replace(/^package\//, '')));
  for (const required of ['package.json', 'release.json', 'cordis.patch.yml', 'README.md', 'CHANGELOG.md', 'LICENSE', 'lib/index.js', 'skills/archify/SKILL.md']) {
    if (!packagedPaths.has(required)) throw new Error(`DSH tarball is missing required file: ${required}`);
  }
  const destination = path.resolve(out || path.join(process.cwd(), produced));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(stage, produced), destination);
  const result = {
    name: packMeta.name || '@tt-a1i/archify-dsh',
    version: packMeta.version || manifest.version,
    adapterCommit,
    sourceCommit: release.sourceCommit,
    skillVersion: release.skillVersion,
```

</details>

**依据 8 · 作者声明**：[integrations/deepseek-harness/README.md:124-132](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/README.md#L124-L132)

作者报告的包体与宿主验收范围。

```text
The first row is the current **1.1.0** release. The remaining rows are historical 1.0.0 evidence for tarball SHA256 `d009c4709000915e254d709b8f023b20d2cced142cd086e56f03d96baf370b50`, adapter tag commit `594f6087358610bd16e64e5602976020871b6bff`; they are not re-certified by this documentation revision.

| Exact host / carrier | Environment and procedure | Evidence / status |
| --- | --- | --- |
| Published **1.1.0** tarball, SHA256 `e65d77e4d7ca34562d33f22480b0b4eae2b1e51ef13cd542c2618b228830b20d`, adapter tag commit `cfca6b601`, Archify 3.2.0 | Three-platform tag gate on `@deepseek-ai/dsh@0.2.1-rc.2`, Node 22: adapter staging regressions and the real tarball install, discovery/full load, `doctor`/`demo`, package smoke, uninstall, and same-profile upgrades from both 0.1.0 and 1.0.0. The same script also passed on macOS under official Node 22.23.2. No running Desktop updater. | Current support baseline: [three-platform tag gate](https://github.com/tt-a1i/archify/actions/runs/42499004935), [release record dated 2026-11-08](https://github.com/tt-a1i/archify/releases/tag/archify-dsh-v1.1.0). |
| Official npm CLI `0.1.2-rc.1` | Linux/macOS/Windows, Node 22, isolated profiles; clean install, load, installed CLI smoke, 0.1.0 → 1.0.0 upgrade, uninstall/base-profile preservation. No running Desktop updater. | Published support baseline: [three-platform tag gate](https://github.com/tt-a1i/archify/actions/runs/37219862967), [release record dated 2026-10-04](https://github.com/tt-a1i/archify/releases/tag/archify-dsh-v1.0.0). |
| Official npm CLI `0.2.0-rc.2` | macOS, Node 26.8.1, pnpm 11.5.2, isolated `web` profile; clean install, unique discovery/full load, `doctor`/`demo`, uninstall, same-profile 0.1.0 → 1.0.0 upgrade and repeat checks. CLI probes stop before package mutation. | Passed in the 2026-10-05 investigation; [maintainer evidence](https://github.com/tt-a1i/archify/issues/716#issuecomment-5991963398). Reused, not an expansion of support. |
| Official npm CLI `0.2.1-alpha.1` | Same isolated macOS procedure and Node/pnpm versions as the preceding row. | Passed in the same [2026-10-05 investigation](https://github.com/tt-a1i/archify/issues/716#issuecomment-5991963398); reused, not an expansion of support. |
| Other OS/Node combinations on these 0.2 hosts; packaged Electron Desktop | Not covered by the two macOS CLI experiments. Reporter: Windows 11 build 26200, Desktop `0.2.0-rc.2`, separate CLI `0.2.1-alpha.1`, updater `1.6.4`; new adapter not yet installed when reported. | Pending native acceptance and exact Desktop binary/command provenance in [#716](https://github.com/tt-a1i/archify/issues/716). No Windows/Desktop success claim. |
```

#### 缺口

- 没有重建全 tarball 或执行安装
  **影响**：核对过的成员相符不能代替整包可复现和效果验收
  **进一步探讨**：从发布 tag 和固定 Skill 提交重建，再在目标 CLI 核查实际加载。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 隔离试用、更新和退出的投入是什么，何时应该停止？

**研究主题**：效果与总成本、采用判断

#### 完整回答

按一次合格交接计量。首次需要相符的 DSH CLI 与 Node、可写隔离 profile、可核实的包和可用工作区。人要记录原有技能、验证实际加载路径和打开一张小图。持续使用需为图承担模型、本机渲染和存储，版本更新后要重查共存及覆盖。时间、资源用量和金额均未知。若默认技能消失、意外副本获胜、产物打不开或宿主版本未核清，应停在隔离环境，按 profile 移除适配层并回查原状态，保留用户 Skill 和工作区文件。发行脚本运行 doctor/demo 并检查移除前后配置，但示例可执行仍不足以判断真实架构图准确。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:35-51](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/README.md#L35-L51)

作者给出精确包的安装、更新与宿主范围。

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

**依据 2 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:475-483](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L475-L483)

脚本执行已安装 Skill 的诊断和示例。

```text
const installedCli = path.join(skillRoot, 'bin', 'archify.mjs');
for (const args of [['doctor'], ['demo', path.join(workspace, 'installed-smoke')]]) {
  const installedSmoke = run(process.execPath, [installedCli, ...args], {
    cwd: workspace,
    timeout: 120_000,
  });
  requireStatus('installed-skill-smoke', installedSmoke, { command: `installed archify ${args[0]}` });
}
pass('installed-skill-smoke', { skillRoot, commands: ['doctor', 'demo'] });
```

**依据 3 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:546-563](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L546-L563)

移除后回读依赖、bundle 和提供器。

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

**依据 4 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:624-653](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L624-L653)

同 profile 升级、运行样例和回退验收。

<details>
<summary>查看原文（30行）</summary>

```text
  requireStatus(`upgrade-baseline-install-${PREVIOUS_RELEASE.version}`, dsh(['plugin', '--profile', UPGRADE_PROFILE, 'add', previousTarball], {
    timeout: PLUGIN_MUTATION_TIMEOUT,
  }));
  await verifyUpgradeProfile(`upgrade-baseline-load-${PREVIOUS_RELEASE.version}`, PREVIOUS_RELEASE.version, PREVIOUS_RELEASE.skillVersion,
    path.join(previousRoot, 'package'), PREVIOUS_RELEASE.includeDefaultRoots);
  requireStatus(`plugin-upgrade-${PREVIOUS_RELEASE.version}`, dsh(['plugin', '--profile', UPGRADE_PROFILE, 'add', tarball], {
    timeout: PLUGIN_MUTATION_TIMEOUT,
  }));
  const upgradedSkill = await verifyUpgradeProfile(`plugin-upgrade-load-${PREVIOUS_RELEASE.version}`, PACKAGE_VERSION, release.skillVersion,
    path.join(inspectRoot, 'package'), true);
  for (const args of [['doctor'], ['demo', path.join(workspace, 'upgraded-smoke')]]) {
    requireStatus(`upgraded-skill-smoke-${PREVIOUS_RELEASE.version}`, run(process.execPath, [path.join(upgradedSkill, 'bin', 'archify.mjs'), ...args], {
      cwd: workspace,
      timeout: 120_000,
    }));
  }
  pass(`upgraded-skill-smoke-${PREVIOUS_RELEASE.version}`, { from: PREVIOUS_RELEASE.version, to: PACKAGE_VERSION, commands: ['doctor', 'demo'] });
  requireStatus(`upgrade-uninstall-${PREVIOUS_RELEASE.version}`, dsh(['plugin', '--profile', UPGRADE_PROFILE, 'remove', PACKAGE_NAME], {
    timeout: PLUGIN_MUTATION_TIMEOUT,
  }));
  const afterUpgrade = JSON.parse(fs.readFileSync(path.join(dshHome, 'profiles', UPGRADE_PROFILE, 'package.json'), 'utf8'));
  const afterUpgradeDump = dsh(['--profile', UPGRADE_PROFILE, '--dump-config']);
  requireStatus(`upgrade-uninstall-${PREVIOUS_RELEASE.version}`, afterUpgradeDump);
  const afterRows = parseDump(afterUpgradeDump.stdout).rows;
  if (afterUpgrade.dependencies?.[PACKAGE_NAME] || (afterUpgrade.dsh?.profile?.bundles || []).includes(PACKAGE_NAME)
    || afterRows.some((row) => row.id === 'archify-skill-filesystem' || row.config.providerName === 'archify-plugin')
    || !afterRows.some((row) => row.id === 'skill-filesystem')) {
    fail(`upgrade-uninstall-${PREVIOUS_RELEASE.version}`, 'upgraded plugin did not uninstall cleanly while preserving the base profile');
  }
  pass(`upgrade-uninstall-${PREVIOUS_RELEASE.version}`, { profile: UPGRADE_PROFILE, bundles: afterUpgrade.dsh?.profile?.bundles || [] });
```

</details>

**依据 5 · 作者声明**：[integrations/deepseek-harness/README.md:155-171](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/README.md#L155-L171)

工作区文件定位和标准移除路径。

<details>
<summary>查看原文（17行）</summary>

````text
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

#### 缺口

- 没有同任务的人工耗时、用量和净成本
  **影响**：不能断言包式部署更省时
  **进一步探讨**：对照手工安装，记录生成一张可交接图的总资源、合格数与失败恢复人时。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 是否值得显示有效 Skill 来源及包版本差异？

**研究主题**：新假设与验证

#### 完整回答

可从发行探针已有的来源与摘要，推导面向操作员的只读检查。显示安装包版本、当前项目有效 Skill 路径和提供器，再标出默认根不可见或同名副本获胜。增量在于操作员能直接看出包已升级而加载内容未更新，免于手工对应清单和探针结果。检查必须使用当前项目的宿主视角，权限不足时保留无法判定，不修改已有副本。对照当前文档和手工核查，在隔离环境放入旧项目副本、旧个人副本、默认根缺失和正常包四种配置，盲评定位正确率、时间和误提示。若准确率未升、总人时上升或提示诱导误删，应放弃增加入口。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/test/probe-skills.mjs:14-34](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/test/probe-skills.mjs#L14-L34)

现有探针已能列出并读取真实装载定义。

<details>
<summary>查看原文（21行）</summary>

```text
  const deadline = Date.now() + timeoutMs;
  let list = [];
  do {
    list = await skills.list({ cwd });
    if (expectedNames.every((name) => list.some((skill) => skill.name === name))) break;
    if (Date.now() >= deadline) break;
    await sleep(pollMs);
  } while (true);
  const definitions = {};
  for (const name of expectedNames) {
    if (!list.some((skill) => skill.name === name)) continue;
    const definition = await skills.get(name, { cwd });
    if (!definition) continue;
    definitions[name] = {
      name: definition.name,
      provider: definition.provider,
      resourceBase: definition.resourceBase,
      path: definition.path,
      contentLength: definition.content?.length || 0,
      contentSha256: createHash('sha256').update(definition.content || '').digest('hex'),
    };
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:520-527](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L520-L527)

覆盖试验比较实际路径和正文摘要。

```text
async function verifyShadow(stage, expectedFile, expectedHash) {
  const { probe } = await probeProfile(PROFILE, stage);
  const definition = probe.definitions.archify;
  if (!definition?.path || sameEntry(expectedFile, definition.path).status !== 'match'
    || definition.contentSha256 !== expectedHash) {
    fail(stage, 'effective Archify body/path does not match the expected precedence', { definition, expectedFile });
  }
  pass(stage, { effectivePath: definition.path, contentSha256: definition.contentSha256 });
```

**依据 3 · 作者声明**：[integrations/deepseek-harness/README.md:15-19](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/integrations/deepseek-harness/README.md#L15-L19)

作者已有核查生效来源的操作指导。

```text
## Which Archify actually loads?

On a supported host, personal and project Skill sources outrank the bundled snapshot. An existing same-name `archify` can therefore shadow the bundle, even after the plugin has upgraded successfully. Upgrading the plugin does **not** necessarily upgrade the effective Skill. The acceptance matrix must check the actual loaded body and source path for older personal and project copies, then check that removing only the disposable test copy restores the bundled body. A version in the installed package alone is insufficient evidence.

When diagnosing a real installation, inspect the effective `archify` source path and version before changing anything. Updating or removing a personal/project copy is a separate user-controlled action; do not delete live Skills automatically to make the bundle win.
```

#### 缺口

- 尚未有面向操作员的实现或对照
  **影响**：不知道提示是否值得维护
  **进一步探讨**：以现有探针的脱敏回执先做小样本盲测。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
