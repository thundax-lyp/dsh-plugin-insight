# Archify DSH 适配器

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d605933](https://github.com/tt-a1i/archify/tree/d6059331abbddb49bca380ff46dca8ce33158b04/integrations/deepseek-harness)

<!-- BEGIN META -->
[![GitHub ★ 90,283](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=90%2C283&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify) [![npm 30d 36,510](https://img.shields.io/static/v1?label=npm+30d&message=36%2C510&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh) [![最新发布 2026-10-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供 Archify 架构图 Skill 的可选 npm 分发包

> **亮点**：本包把固定 Skill 版本、profile bundle 和 npm 移除路径串为分发契约；实际入口是 patch 的 filesystem provider。默认根共存验收检查正文与路径，超过仅发现名称的检查，但不证明图本身正确。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：源码修复不等于公开安装已修复：当前 patch 保留默认根，而 README 明示公开 1.0.0 仍不保留默认根；新 Desktop 尚缺原生验收。这使新用户无法靠文档安装命令取得本轮研究的修复。[Q02](#research-q02)

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
  - [Q01 · 适配包增加了什么，真实入口在哪里？](#detail-section-11)
  - [Q02 · 当前源码修复是否等于公开安装包已修复？](#detail-section-12)
  - [Q03 · 打包和验收怎样保护 Skill 来源、共存与退出？](#detail-section-13)
  - [Q04 · 一次合格架构交付需要哪些操作与成本？](#detail-section-14)
  - [Q05 · 当前应如何决策，什么假设值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已经使用 DSH、希望按 profile 管理 Archify 架构图 Skill 的开发者。

直接安装 Archify Skill 或手工维护 Skill 目录；图形创作不是本适配器新增。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| filesystem Skill provider | 在 profile 中发现并加载 Archify | 源码保留默认根；公开 1.0.0 修复状态不同 |
| npm bundle 分发 | 固定内嵌 Skill 来源、安装和移除 | 无原生绘图工具或文件条 UI |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 0.1.2-rc.1 与 Node ^22.19.0 或 >=24 | 启动必需，作者支持合同 | 加载 bundle 与 filesystem provider | 其他 host 须另验收，不能继承兼容声明 |
| Archify 固定 Skill 3.0.1 来源 | 打包必需 | 产物实际图能力 | 当前仓库根新版不自动进入包 |
| 模型、shell、filesystem 与可读仓库 | 作图必需 | 构建 JSON/HTML | 任务不能由适配器单独完成，费用未知 |
| 浏览器与人工架构知识 | 验收必需 | 打开并核对图 | 自动门禁不能证明语义正确 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户确认 host、profile 与发布状态 | 不把未发布源码修复当公开包 |
| 2 | 用户在隔离 profile 使用精确包版本 | Archify 与默认 Skill 均能加载正文；否则移除 |
| 3 | Agent 显式调用 Skill，输出 JSON/HTML 路径 | 不以 Produced Files 条缺失判断生成失败 |
| 4 | 用户逐边核对并打开 HTML | 错误先修规格；不再需要时 plugin remove |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | host、模型与 Node 资源；金额未知 | 核版本、安装并查默认根；时长未知 | 公开包不含源码修复 |
| 持续使用 | 模型、渲染资源未知 | 核对架构事实与文件路径 | 无合格任务对照 |
| 失败恢复 | 修订和重复调用资源未知 | 分开查加载、生成和文件展示问题 | 不重复创建已存在产物 |
| 退出 | 资源未知 | 移除 profile bundle，另管理已有图 | 移除不能替代产物治理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 分发一致性 | patch、固定来源和 pack 必需文件检查 | 公开 tarball 当前字节与本机加载 |
| 默认根共存 | 源码 true 与正文/路径 probe | 新修复发布及原生 Desktop |
| 架构沟通 | Skill 普通文件交付路径 | 节时、语义准确率及单位成本 |

> **思考**：源码修复不等于公开安装已修复：当前 patch 保留默认根，而 README 明示公开 1.0.0 仍不保留默认根；新 Desktop 尚缺原生验收。这使新用户无法靠文档安装命令取得本轮研究的修复。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：本包把固定 Skill 版本、profile bundle 和 npm 移除路径串为分发契约；实际入口是 patch 的 filesystem provider。默认根共存验收检查正文与路径，超过仅发现名称的检查，但不证明图本身正确。[Q01](#research-q01) [Q03](#research-q03)

可借鉴的设计是将适配器、内嵌 Skill 与宿主版本分开固定，并在默认 provider 停用时核对每个默认根的正文摘要与真实路径。仅名称发现通过不能证明正确版本的 Skill 已加载。[Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

源码修复不等于公开安装已修复：当前 patch 保留默认根，而 README 明示公开 1.0.0 仍不保留默认根；新 Desktop 尚缺原生验收。这使新用户无法靠文档安装命令取得本轮研究的修复。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

观察默认根修复正式发布；若已有受支持 CLI 环境，先验证 Archify 与所有默认根正文共同加载，失败即移除并回到原安装方式。[Q02](#research-q02) [Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

分发接线和默认根修复为源码可见事实；公开包差异及历史运行是作者报告。发布收据为未验证假设；本轮未执行目标。

- 已检查：作者 README、包清单、源码路径 integrations/deepseek-harness/package.json、integrations/deepseek-harness/README.md、integrations/deepseek-harness/cordis.patch.yml、integrations/deepseek-harness/release.json、integrations/deepseek-harness/lib/index.js、integrations/deepseek-harness/scripts/pack.mjs、integrations/deepseek-harness/scripts/distribution-acceptance.mjs 及固定范围 inventory；组件：integrations/deepseek-harness。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：组件范围 19 个 tracked 文件统计；重点检查 patch、resolver、打包与共存验收路径。未将上游 Skill 内部算法归为适配器实现；未运行目标、未独立验证历史外部评论。
- 下一步：在授权隔离环境分别校验公开包和候选包的摘要、默认根正文及路径；原生 Desktop 与 npm CLI 分开验收，比较相同图任务的总人工投入。

**分析版本**

- **仓库**：[tt-a1i/archify](https://github.com/tt-a1i/archify)
- **版本号**：1.0.0（[固定提交 d605933](https://github.com/tt-a1i/archify/tree/d6059331abbddb49bca380ff46dca8ce33158b04)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是将适配器、内嵌 Skill、宿主与默认根正文身份组成发布收据，比仅检查名称更早发现分发回归。用默认 provider 开启／关闭、干净安装／同 profile 升级四格对照注入错根和旧正文，记录检出率、误报及排查分钟；不能提前发现问题或维护成本超过手工清单时停止扩展。[Q05](#research-q05)

在授权隔离环境分别校验公开包和候选包的摘要、默认根正文及路径；原生 Desktop 与 npm CLI 分开验收，比较相同图任务的总人工投入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 229 | — | — | 3674 |
| .js | source | 1 | 21 | 19 | 0 | — |
| .mjs | source | 5 | 936 | 842 | 35 | — |
| .mjs | test | 10 | 1167 | 1073 | 18 | — |

</details>

**活跃度**

[![Issue 未关闭 132](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=132&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 152](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=152&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+created%3A2026-09-28T03%3A54%3A21.981Z..2026-10-28T03%3A54%3A21.981Z) [![近30天关闭 127](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=127&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T03%3A54%3A21.981Z..2026-10-28T03%3A54%3A21.981Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定适配器能否可靠分发 Archify 并保留默认 Skill，公开安装路径与源码是否一致？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适配包增加了什么，真实入口在哪里？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

目标用户是已经通过 DSH 解释仓库架构、希望统一安装和移除 Archify 的开发者；合格结果是可打开并能核对关系的 JSON 规格与 HTML，而不是仅出现 Skill 名称。相对手工拷贝 Skill，本包增加 npm 身份、profile 级 bundle 与固定 Skill 来源的分发；图形创作和校验能力归于上游 Archify，不能归为适配器原创。真实激活路径是 package 的 dsh.bundle.patch 指向 cordis.patch.yml，patch 直接插入名为 archify-plugin 的 filesystem provider，再从已安装包解析 skills 目录。lib/index.js 虽有同义解析函数，却不是该 bundle 的激活钩子。该包未注册原生渲染工具或 Produced Files 组件，不能期待 HTML 自动进入文件条。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:1-10](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/integrations/deepseek-harness/cordis.patch.yml#L1-L10)

完整 patch 只有一个 filesystem provider，目录解析通过 host 执行的 JS。

<details>
<summary>查看原文（10行）</summary>

```text
# Opt-in Archify filesystem Skill provider for DeepSeek Harness.
# Resolves the packaged Skill root from the installed npm identity anchored at
# the DSH profile (Loader baseUrl), never as a path concatenated onto baseUrl.
- insert:
    - id: archify-skill-filesystem
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: archify-plugin
        includeDefaultRoots: true
        bundledSkillDir: !!js process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:path').dirname(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('@tt-a1i/archify-dsh/package.json')), 'skills')
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/lib/index.js:7-20](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/integrations/deepseek-harness/lib/index.js#L7-L20)

导出的 resolver 只处理包路径与错误；不能据函数存在推断宿主调用它。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 3 · 作者声明**：[integrations/deepseek-harness/README.md:135-150](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/integrations/deepseek-harness/README.md#L135-L150)

作者要求通过普通 Skill、shell、文件路径交付。

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 当前源码修复是否等于公开安装包已修复？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不等同。固定源码 includeDefaultRoots=true，能表达保留默认个人和项目根的配置；作者明确公开 npm 1.0.0 仍为 false，README 安装命令装不到本次未发布修复。这一差别直接影响已有 Skill 共存：只有 Archify provider 存活时，旧包会隐藏默认根。release.json 固定打包 Skill 3.0.1 的 7158026e…，宿主验收 0.1.2-rc.1；不能拿当前仓库根新版 Archify 或较新 CLI 调查替代这个合同。包名版本相同也不证明当前源码与已发布字节一致。源码 patch 的 !!js 在宿主进程执行，权限不是 agent 沙箱权限；当前表达式仅使用 Node path/module 解析，但升级仍需检查。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:5-27](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/integrations/deepseek-harness/README.md#L5-L27)

作者明确三版本与发布/修复分界，且说明 Desktop 尚未验收。

<details>
<summary>查看原文（23行）</summary>

```text
The currently published npm package is **v1.0.0**. It bundles Archify Skill **3.0.1** and supports the exact developer-preview **`@deepseek-ai/dsh@0.1.2-rc.1`** on Node.js **`^22.19.0 || >=24.0.0`**. The 1.0 adapter contract covers this exact DSH host version; it does not make the host stable or guarantee compatibility with other DSH versions.

Version 1.0.0 was published on 2026-10-04: [npm package](https://www.npmjs.com/package/@tt-a1i/archify-dsh/v/1.0.0) · [release and verified tarball](https://github.com/tt-a1i/archify/releases/tag/archify-dsh-v1.0.0). It is a Skill-only bundle: it inserts one filesystem Skill provider named `archify-plugin` and exposes **Archify 3.0.1**, pinned to stable `main` commit `7158026e852f3aa6578c741e673b46d7878c92c1`. This snapshot includes the Skill installation fix from [#704](https://github.com/tt-a1i/archify/pull/704), which landed after the `v3.0.1` tag; it is not a byte-for-byte copy of that tag. The packaged `package.json` and `skill-release.json` both declare 3.0.1. Compared with the previous plugin 0.1.0, it includes the Archify 3.x authoring and delivery flow, authored brand marks, Workflow schema v2, Viewer localization, and update awareness.

`release.json` records the immutable Skill source commit, Skill version, and DSH version used by acceptance. Packaging uses the canonical clean-Skill stager against that commit, preserving license notices and excluding development files. Adapter version 0.1.0 and its `archify-dsh-v0.1.0` tag remain unchanged; reproduce that old release by checking out its tag first.

The adapter registers no native render/validate/deliver tools, custom Web client, Produced Files chips, telemetry, credentials handling, background services, or install hooks. The bundled Skill includes an optional, notification-only stable Archify update checker; it never upgrades the plugin. Authored remote brand assets may also use the Skill's bounded network path. The adapter itself makes no network requests.

## Default Skill roots: unreleased fix

Published **1.0.0** sets `includeDefaultRoots: false`. If its `archify-plugin` provider is the profile's only live filesystem Skill source, personal and project Skills disappear while Archify remains available. This was reported on macOS Desktop `0.2.0-rc.2` in [#906](https://github.com/tt-a1i/archify/issues/906).

The **unreleased source fix** sets `includeDefaultRoots: true`, retaining the host's default personal and project roots alongside the packaged Archify root. The provider name and bundle directory are unchanged. The install command below still installs published 1.0.0, **not this fix**; no new adapter version has been published.

The acceptance script now seeds distinct Skills in both DSH and shared-agent personal/project roots and checks their actual loaded bodies and paths after clean installation and same-profile upgrade. It repeats those checks with the base filesystem provider disabled, so the Archify provider must preserve the roots by itself. The immutable 0.1.0 upgrade baseline retains its original `false` expectation; the candidate requires `true`.

These automated checks use the exact npm CLI host in `release.json` (`0.1.2-rc.1`). They do not establish macOS Desktop `0.2.0-rc.2` acceptance or explain why the reporter's original provider was inactive. That native Desktop verification remains pending; the published support statement is unchanged.

## Patch execution boundary

The `cordis.patch.yml` file is configuration consumed by the DSH host. Its `bundledSkillDir` value uses the host loader's `!!js` expression to resolve the installed package's `skills` directory when the entry is activated. This expression runs in the DSH host process, outside the agent sandbox; it is not an inert YAML value and should be treated as host-loaded code.

The current expression is intentionally limited to Node's built-in `path` and `module` helpers for package resolution. It does not fetch data, read credentials, spawn processes, or register another permission path. The normal `lib/index.js` resolver documents the same package-root logic, but the filesystem provider is mounted directly by the patch, so that module is not the activation hook for this bundle. Keep the published install exact-pinned and review any patch change as host-process code.
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/release.json:1-5](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/integrations/deepseek-harness/release.json#L1-L5)

打包来源与验收宿主固定值。

```text
{
  "sourceCommit": "7158026e852f3aa6578c741e673b46d7878c92c1",
  "skillVersion": "3.0.1",
  "dshVersion": "0.1.2-rc.1"
}
```

**依据 3 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:8-10](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/integrations/deepseek-harness/cordis.patch.yml#L8-L10)

源码实际为 true，表达式在 profile baseUrl 解析 npm 包。

```text
        providerName: archify-plugin
        includeDefaultRoots: true
        bundledSkillDir: !!js process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:path').dirname(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('@tt-a1i/archify-dsh/package.json')), 'skills')
```

#### 缺口

- 公开 npm 1.0.0 当前 tarball 未独立下载对照；Desktop 0.2.0-rc.2 新修复未验收。
  **影响**：不能宣称用户执行公开命令已得到修复，也不能建议直接升级 Desktop。
  **进一步探讨**：对获授权隔离 profile 校验 tarball 摘要、配置及全部默认根，另做对应 Desktop 原生命令验收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 打包和验收怎样保护 Skill 来源、共存与退出？

**研究主题**：工程质量与复用、功能与机制

#### 完整回答

pack 先 stageAdapter，再按 releaseSnapshot 调用 canonical clean-Skill stager，npm pack 使用 --ignore-scripts，最后检查 Skill 入口与 patch 等必须文件。它刻意把适配器提交与内嵌 Skill 提交分开，避免误把仓库 HEAD 当内嵌版本。验收脚本不只数 discovery 名称，还对每个默认根 fixture 检查唯一命中、实际正文 SHA、路径身份，并在 base filesystem provider 禁用时重复，以复现独占 provider 的故障前提。probe 有 90 秒等待和终止逻辑，失败明确终止；因此可借鉴的是“默认根共存＋正文和路径”契约，而非单独一个布尔值。脚本包含安装后 doctor/demo、升级及卸载检查；本轮只检查这些调用存在，不声明已运行通过。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/scripts/pack.mjs:21-32](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/integrations/deepseek-harness/scripts/pack.mjs#L21-L32)

打包链与禁用 npm lifecycle。

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/scripts/pack.mjs:60-74](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/integrations/deepseek-harness/scripts/pack.mjs#L60-L74)

所需文件检查和双提交输出。

<details>
<summary>查看原文（15行）</summary>

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
    filename: path.basename(destination),
```

</details>

**依据 3 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:377-418](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L377-L418)

默认根的唯一性、正文、路径及独占 provider 核对。

<details>
<summary>查看原文（42行）</summary>

```text
  } finally {
    child.kill('SIGTERM');
  }
  return { probe: JSON.parse(fs.readFileSync(probeOut, 'utf8')), stdout, stderr };
}

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
}

const { probe: probeReceipt, stdout: probeStdout, stderr: probeStderr } = await probeProfile(PROFILE, 'skill-discovery');
verifyDefaultSkills('default-skill-roots', probeReceipt);
await verifyIsolatedRoots(PROFILE, 'isolated-default-skill-roots', true);
```

</details>

**依据 4 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:466-473](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L466-L473)

真实安装目录调用 doctor/demo 的脚本接线。

```text
for (const args of [['doctor'], ['demo', path.join(workspace, 'installed-smoke')]]) {
  const installedSmoke = run(process.execPath, [installedCli, ...args], {
    cwd: workspace,
    timeout: 120_000,
  });
  requireStatus('installed-skill-smoke', installedSmoke, { command: `installed archify ${args[0]}` });
}
pass('installed-skill-smoke', { skillRoot, commands: ['doctor', 'demo'] });
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 一次合格架构交付需要哪些操作与成本？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

使用者先确认精确 host/Node 与 profile，再安装发布包；这里要承认安装仍缺源码修复。任务时显式加载 Archify，输入熟悉仓库与一条核心路径，要求 JSON 和 HTML 的准确路径，最后人工逐边核对架构事实和打开 HTML。宿主普通 shell 和 filesystem 权限承担实际渲染，不存在独立原生图形工具。持续成本包括模型调用、源码阅读、图结构修订和人工复核；没有任务对照不能认定包管理便利抵消这些负担。失败时先分清 Skill 没加载、生成失败还是文件没有出现在 Produced Files；后者要按工作区路径打开，不应重复生成。退出使用标准 plugin remove；已生成架构文件的保留策略由用户管理。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:29-45](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/integrations/deepseek-harness/README.md#L29-L45)

精确安装、host 与根目录不可安装边界。

<details>
<summary>查看原文（17行）</summary>

````text
## Install

Use the prebuilt npm package with an exact version. Do not install from Git source.

```bash
dsh plugin --profile web add @tt-a1i/archify-dsh@1.0.0
```

## Upgrade

The 1.0.0 release gate covers both a clean installation and upgrading the previous plugin 0.1.0 to 1.0.0 in the same isolated profile on `@deepseek-ai/dsh@0.1.2-rc.1`. The older host `0.1.0-rc.6` is not a supported 1.0 target: update the host separately before upgrading the plugin. The Node requirement remains `^22.19.0 || >=24.0.0`; the three-platform release gate runs on Node 22. See the [adapter changelog](CHANGELOG.md) for the bundled Archify change.

Run the same exact-version install command above in each profile that uses Archify. Updating DSH itself or the Archify repository does not update an already installed plugin.

For newer-host investigations, see the [host migration review and evidence matrix](#host-migration-review). The CLI checks recorded there do not extend the published support contract to Desktop or other DSH versions.

Do **not** use `dsh plugin add tt-a1i/archify`: the repository root is not a DSH package and has no bundle metadata (see [#341](https://github.com/tt-a1i/archify/issues/341)). For an npm download problem, a locally downloaded, integrity-verified `.tgz` can be passed to `dsh plugin --profile web add /absolute/path/to/package.tgz`.
````

</details>

**依据 2 · 作者声明**：[integrations/deepseek-harness/README.md:135-158](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/integrations/deepseek-harness/README.md#L135-L158)

任务提示、交付路径限制与移除命令。

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

#### 缺口

- 没有同一仓库上手工 Skill 与 npm bundle 的合格交付率、时间和模型费用对照。
  **影响**：不能证明端到端节时或单位合格图更便宜。
  **进一步探讨**：以相同模型和核心请求链各完成三次图，记录错误关系、总尝试、人工分钟及资源支出。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前应如何决策，什么假设值得验证？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前建议观察修复发布与原生 Desktop 验收，而非把当前源码修复当作可直接安装的稳定功能。已经在受支持 CLI 使用发布 1.0.0、且能确认默认 Skill 共存的人，可以继续在隔离 profile 核查；这不构成本轮安装推荐。新用户若只需一张图，手工安装原生 Skill 或简单图通常更直接。由双版本身份和默认根故障推导出的未验证假设是：把适配器、内嵌 Skill、host、所有默认根正文身份一起写入发布收据，能比只查 Skill 名称更早发现分发回归。最小验证以同一包在 base provider 开启/关闭、干净安装/同 profile 升级四格对照，注入错根或旧正文；若收据不能区分错误、或维护成本大于手工清单，就否定自动收据方案。这个假设属于发布质量机制，不是已验证市场需求。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:15-21](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/integrations/deepseek-harness/README.md#L15-L21)

未发布修复与原生 Desktop 缺口直接约束采用。

```text
Published **1.0.0** sets `includeDefaultRoots: false`. If its `archify-plugin` provider is the profile's only live filesystem Skill source, personal and project Skills disappear while Archify remains available. This was reported on macOS Desktop `0.2.0-rc.2` in [#906](https://github.com/tt-a1i/archify/issues/906).

The **unreleased source fix** sets `includeDefaultRoots: true`, retaining the host's default personal and project roots alongside the packaged Archify root. The provider name and bundle directory are unchanged. The install command below still installs published 1.0.0, **not this fix**; no new adapter version has been published.

The acceptance script now seeds distinct Skills in both DSH and shared-agent personal/project roots and checks their actual loaded bodies and paths after clean installation and same-profile upgrade. It repeats those checks with the base filesystem provider disabled, so the Archify provider must preserve the roots by itself. The immutable 0.1.0 upgrade baseline retains its original `false` expectation; the candidate requires `true`.

These automated checks use the exact npm CLI host in `release.json` (`0.1.2-rc.1`). They do not establish macOS Desktop `0.2.0-rc.2` acceptance or explain why the reporter's original provider was inactive. That native Desktop verification remains pending; the published support statement is unchanged.
```

**依据 2 · 源码核查**：[integrations/deepseek-harness/scripts/distribution-acceptance.mjs:382-418](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/integrations/deepseek-harness/scripts/distribution-acceptance.mjs#L382-L418)

正文/路径身份和独占 provider 提供假设推导基础。

<details>
<summary>查看原文（37行）</summary>

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
}

const { probe: probeReceipt, stdout: probeStdout, stderr: probeStderr } = await probeProfile(PROFILE, 'skill-discovery');
verifyDefaultSkills('default-skill-roots', probeReceipt);
await verifyIsolatedRoots(PROFILE, 'isolated-default-skill-roots', true);
```

</details>

#### 缺口

- 收据相对现有脚本/清单的误报和维护负担未知。
  **影响**：新假设不能计入已有创新或收益。
  **进一步探讨**：四格对照记录检出率、误报、排查分钟，结果不能改善发现时点则停止扩展。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
