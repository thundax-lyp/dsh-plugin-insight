# Archify DSH 适配器

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[a406594](https://github.com/tt-a1i/archify/tree/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness)

<!-- BEGIN META -->
[![GitHub ★ 92,197](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=92%2C197&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify) [![npm 30d 40,336](https://img.shields.io/static/v1?label=npm+30d&message=40%2C336&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh) [![最新发布 2026-10-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh)
<!-- END META -->

> **功能**：以 DSH 文件系统 Skill provider 分发 Archify 架构图技能。

> **亮点**：[Q02](#research-q02) 用包和 profile 管理固定 Skill 来源，相对手工复制增加受版本控制的发现路径。

> **主要限制**：[Q03](#research-q03) 文档称已发布 1.0.0 可能隐藏默认 Skill，源码修复仍是候选；同名 Skill 也可能遮蔽包内版本。

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
  - [Q01 · 用途和适用条件是什么？](#detail-section-11)
  - [Q02 · 适配器如何让宿主发现 Skill？](#detail-section-12)
  - [Q03 · 发布、默认 Skill 共存和宿主边界是什么？](#detail-section-13)
  - [Q04 · 成本和可证伪假设是什么？](#detail-section-14)
  - [Q05 · 何时试用或退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 希望在 DSH 中调用 Archify 生成架构图的开发者需要加载正确技能及工作区产物。

手工将 Archify Skill 放在 DSH 支持的个人或项目 Skill 目录，并自行维护版本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Skill 分发 | 通过 DSH profile 发现架构图技能 | 依赖宿主 provider，实际同名来源可能遮蔽 |
| 文件产物 | 普通 Skill 流程输出 JSON 与 HTML | 需 shell 和工作区权限，不自动产生原生工具结果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH filesystem provider | 必需 | 发现包内技能 | 无法加载或影响其他技能 |
| 已安装的正确包和技能 | 必需 | 提供 Archify 资源 | 无法加载预期版本 |
| shell 与工作区权限 | 执行时必需 | 运行技能并输出文件 | 无法得到产物 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 核验 | 用户核对正式发布与宿主 | 版本和支持证据明确 |
| 隔离验收 | 在测试 profile 检查实际技能来源 | 其他技能保持可发现 |
| 使用 | 请求架构图并检查 JSON/HTML 路径 | 产物内容符合任务 |
| 异常 | 停用并回原有方式 | 保留用户技能并核查来源 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包与宿主运行资源 | 核查版本、来源和兼容 | 时间未知 |
| 持续使用 | 模型和渲染资源 | 审核图与更新版本 | 实测费用未知 |
| 失败恢复 | 排查 profile 和产物 | 核对技能遮蔽与共存 | 实际影响未知 |
| 退出 | 恢复配置资源 | 检查原有技能和文件 | 不自动删除用户技能 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 包内技能发现 | patch 解析并插入 provider | 特定宿主真实加载版本 |
| 架构图 | 作者描述普通技能输出 JSON 与 HTML | 当前任务图像正确性及效率 |

> **思考**：[Q03](#research-q03) 文档称已发布 1.0.0 可能隐藏默认 Skill，源码修复仍是候选；同名 Skill 也可能遮蔽包内版本。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 用包和 profile 管理固定 Skill 来源，相对手工复制增加受版本控制的发现路径。

[Q02](#research-q02) patch 在宿主进程解析包路径，[Q03](#research-q03) 候选修复与公开包需分开评估。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 文档称已发布 1.0.0 可能隐藏默认 Skill，源码修复仍是候选；同名 Skill 也可能遮蔽包内版本。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先观察正式发布和宿主验收；隔离 profile 核对默认技能及实际来源。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 provider 接线及默认根修复；文档称候选未发布，实际注册表和宿主未核验。

- 已检查：作者 README、包清单、源码路径 integrations/deepseek-harness/package.json、integrations/deepseek-harness/README.md、integrations/deepseek-harness/cordis.patch.yml、integrations/deepseek-harness/lib/index.js 及固定范围 inventory；组件：integrations/deepseek-harness。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅静态检查 integrations/deepseek-harness 子组件；未运行 Host、Skill、真实安装或核验 npm 当前状态。
- 下一步：核查正式发布及 tarball，并在隔离宿主验证实际 Skill 正文、同名冲突与默认根共存。

**分析版本**

- **仓库**：[tt-a1i/archify](https://github.com/tt-a1i/archify)
- **版本号**：1.1.0（[固定提交 a406594](https://github.com/tt-a1i/archify/tree/a4065941f12be7967436261d9934784e381d423c)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 展示有效 Skill 来源与同名遮蔽可减少升级诊断时间，需在隔离配置验证。

核查正式发布及 tarball，并在隔离宿主验证实际 Skill 正文、同名冲突与默认根共存。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 261 | — | — | 4492 |
| .js | source | 1 | 21 | 19 | 0 | — |
| .mjs | source | 5 | 989 | 885 | 43 | — |
| .mjs | test | 10 | 1182 | 1087 | 18 | — |

</details>

**活跃度**

[![Issue 未关闭 137](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=137&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 144](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=144&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 116](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=116&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 Archify Skill 在 DSH 的安装发现、版本和默认 Skill 共存边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用途和适用条件是什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

Archify DSH 适配器面向希望在 DSH 用 Archify Skill 制作架构图的开发者；可接受结果是实际加载预期 Skill，并得到可核验的工作区 JSON 和 HTML 路径。该包是 Skill-only bundle，依赖兼容 DSH 的 filesystem Skill provider、Node 和正常 shell/文件系统；它没有独立图形工具或自定义前端。固定源码包为候选 1.1.0，作者记录的已发布包为 1.0.0，不能把候选当成已发布。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/package.json:2-5](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/package.json#L2-L5)

包身份和 Skill-only 描述。

```text
  "name": "@tt-a1i/archify-dsh",
  "version": "1.1.0",
  "description": "Opt-in DeepSeek Harness Skill-only bundle for the Archify architecture-diagram skill.",
  "license": "MIT",
```

**依据 2 · 作者声明**：[integrations/deepseek-harness/README.md:5-15](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/README.md#L5-L15)

作者区分发布版本与候选。

<details>
<summary>查看原文（11行）</summary>

```text
The currently published npm package is **v1.0.0**. It bundles Archify Skill **3.0.1** and supports the exact developer-preview **`@deepseek-ai/dsh@0.1.2-rc.1`** on Node.js **`^22.19.0 || >=24.0.0`**. The 1.0 adapter contract covers this exact DSH host version; it does not make the host stable or guarantee compatibility with other DSH versions.

Version 1.0.0 was published on 2026-10-04: [npm package](https://www.npmjs.com/package/@tt-a1i/archify-dsh/v/1.0.0) · [release and verified tarball](https://github.com/tt-a1i/archify/releases/tag/archify-dsh-v1.0.0). It is a Skill-only bundle: it inserts one filesystem Skill provider named `archify-plugin` and exposes **Archify 3.0.1**, pinned to stable `main` commit `7158026e852f3aa6578c741e673b46d7878c92c1`. This snapshot includes the Skill installation fix from [#704](https://github.com/tt-a1i/archify/pull/704), which landed after the `v3.0.1` tag; it is not a byte-for-byte copy of that tag. The packaged `package.json` and `skill-release.json` both declare 3.0.1. Compared with the previous plugin 0.1.0, it includes the Archify 3.x authoring and delivery flow, authored brand marks, Workflow schema v2, Viewer localization, and update awareness.

`release.json` records the current candidate's immutable Skill source commit, Skill version, and target DSH acceptance version; historical release pins remain in their tags. Packaging uses the canonical clean-Skill stager against that commit, preserving license notices and excluding development files. Adapter version 0.1.0 and its `archify-dsh-v0.1.0` tag remain unchanged; reproduce that old release by checking out its tag first.

The adapter registers no native render/validate/deliver tools, custom Web client, Produced Files chips, telemetry, credentials handling, background services, or install hooks. The bundled Skill includes an optional, notification-only stable Archify update checker; it never upgrades the plugin. Authored remote brand assets may also use the Skill's bounded network path. The adapter itself makes no network requests.

## Pending 1.1.0 candidate — not published

[#1153](https://github.com/tt-a1i/archify/issues/1153) prepares **adapter 1.1.0**, bundling **Archify 3.2.0** from immutable stable `main` commit `edf158c4e7a1d18d20cc329840f864289634c090`, with **`@deepseek-ai/dsh@0.2.1-rc.2`** as its exact acceptance target. This is a candidate, not an npm availability or completed support claim. The public install command and community catalog remain on published 1.0.0 until a separately authorized publication is verified.
```

</details>

**依据 3 · 作者声明**：[integrations/deepseek-harness/README.md:153-164](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/README.md#L153-L164)

作者说明调用和文件输出。

<details>
<summary>查看原文（12行）</summary>

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
````

</details>

#### 缺口

- 当前注册表与目标宿主的真实安装状态
  **影响**：决定用户实际取得的版本和兼容性
  **进一步探讨**：安装前核验注册表、版本及实际加载路径

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 适配器如何让宿主发现 Skill？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

包声明 DSH bundle，cordis patch 直接插入 filesystem Skill provider，providerName 为 archify-plugin，表达式以 profile baseUrl 的 createRequire 解析包 manifest，再定位 skills 目录；当前源码把 includeDefaultRoots 设为 true。宿主激活 patch 时执行该表达式；lib 中解析函数记录相同路径逻辑，但并不是此 bundle 的激活 hook。Skill 本身按普通 DSH Skill、shell 和文件系统执行，产生的 JSON/HTML 需返回路径；适配器并未注册原生渲染工具。相对手工复制 Skill，它提供包和 profile 的安装/版本管理，实际加载哪个同名 Skill 还受宿主优先级影响。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/package.json:27-40](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/package.json#L27-L40)

包目录、Node 及 bundle 声明。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:1-10](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/cordis.patch.yml#L1-L10)

直接插入 provider、默认根与路径解析。

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

**依据 3 · 源码核查**：[integrations/deepseek-harness/lib/index.js:7-20](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/lib/index.js#L7-L20)

同样的 profile 解析逻辑。

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

**依据 4 · 作者声明**：[integrations/deepseek-harness/README.md:37-41](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/README.md#L37-L41)

作者明确 patch 是激活点和 host 执行边界。

```text
## Patch execution boundary

The `cordis.patch.yml` file is configuration consumed by the DSH host. Its `bundledSkillDir` value uses the host loader's `!!js` expression to resolve the installed package's `skills` directory when the entry is activated. This expression runs in the DSH host process, outside the agent sandbox; it is not an inert YAML value and should be treated as host-loaded code.

The current expression is intentionally limited to Node's built-in `path` and `module` helpers for package resolution. It does not fetch data, read credentials, spawn processes, or register another permission path. The normal `lib/index.js` resolver documents the same package-root logic, but the filesystem provider is mounted directly by the patch, so that module is not the activation hook for this bundle. Keep the published install exact-pinned and review any patch change as host-process code.
```

**依据 5 · 作者声明**：[integrations/deepseek-harness/README.md:153-164](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/README.md#L153-L164)

普通 Skill 与文件路径执行。

<details>
<summary>查看原文（12行）</summary>

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
````

</details>

#### 缺口

- 已打包 Skill 和宿主实际解析行为
  **影响**：影响安装后是否发现及执行正确版本
  **进一步探讨**：在隔离 profile 验证加载来源、正文与输出

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 发布、默认 Skill 共存和宿主边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

作者记录已发布 1.0.0 将 includeDefaultRoots 设为 false：若它是唯一活跃文件系统来源，个人和项目 Skill 可能消失；本固定源码 true 是尚未发布的修复，不能推断公开安装已获得。作者还说明同名个人/项目 archify 在候选宿主优先于包内版本，成功升级包不保证实际生效。patch 的 !!js 在宿主进程执行；候选设定的 rc.2 验收目标及脚本存在不等于已通过，Desktop 和运行中更新另需验证。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:4-10](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/cordis.patch.yml#L4-L10)

候选启用默认根且含 host 表达式。

```text
- insert:
    - id: archify-skill-filesystem
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: archify-plugin
        includeDefaultRoots: true
        bundledSkillDir: !!js process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:path').dirname(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('@tt-a1i/archify-dsh/package.json')), 'skills')
```

**依据 2 · 作者声明**：[integrations/deepseek-harness/README.md:13-19](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/README.md#L13-L19)

候选与验收条件。

```text
## Pending 1.1.0 candidate — not published

[#1153](https://github.com/tt-a1i/archify/issues/1153) prepares **adapter 1.1.0**, bundling **Archify 3.2.0** from immutable stable `main` commit `edf158c4e7a1d18d20cc329840f864289634c090`, with **`@deepseek-ai/dsh@0.2.1-rc.2`** as its exact acceptance target. This is a candidate, not an npm availability or completed support claim. The public install command and community catalog remain on published 1.0.0 until a separately authorized publication is verified.

The snapshot adds 3.1's ERD, Class, Tree, Timeline and Waterfall types and 3.2's one-page explainer. It includes the Apache-2.0 transition (`9c306ee89`) and standalone third-party notice fix (`edf158c4e`) after the `v3.2.0` tag; it is not a byte-for-byte copy of that tag. Both bundled version manifests declare 3.2.0. The adapter remains MIT-licensed; the bundled Skill is Apache-2.0 and retains historical MIT grants and third-party notices. Inspect `LICENSE`, `LICENSE-MIT`, `NOTICE` and `THIRD_PARTY_NOTICES.md` in the actual bundled Skill, not just the outer package's license field.

Before publication, retain candidate-head receipts for clean installation, full Skill loading, installed `doctor`/`demo`, same-profile upgrades from **both 0.1.0 and 1.0.0**, and uninstall/base-profile preservation. Record the tarball digest, immutable source, exact host/command source, OS, Node and date. Add same-name `archify` conflicts to these checks, not just distinct test Skills. Candidate acceptance results belong in the linked PR/release record; the historical matrix below does not certify this candidate. Three-platform release acceptance and native Desktop/Electron acceptance remain separate; untested platforms, running-host updates and Desktop are not covered by a CLI pass. No support range for all `0.2.x` hosts is claimed.
```

**依据 3 · 作者声明**：[integrations/deepseek-harness/README.md:21-35](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/README.md#L21-L35)

作者报告同名遮蔽和已发布默认根问题。

<details>
<summary>查看原文（15行）</summary>

```text
### Which Archify actually loads?

On the candidate host, personal and project Skill sources outrank the bundled snapshot. An existing same-name `archify` can therefore shadow the bundle, even after the plugin has upgraded successfully. Upgrading the plugin does **not** necessarily upgrade the effective Skill. The acceptance matrix must check the actual loaded body and source path for older personal and project copies, then check that removing only the disposable test copy restores the bundled body. A version in the installed package alone is insufficient evidence.

When diagnosing a real installation, inspect the effective `archify` source path and version before changing anything. Updating or removing a personal/project copy is a separate user-controlled action; do not delete live Skills automatically to make the bundle win.

## Default Skill roots: unreleased fix

Published **1.0.0** sets `includeDefaultRoots: false`. If its `archify-plugin` provider is the profile's only live filesystem Skill source, personal and project Skills disappear while Archify remains available. This was reported on macOS Desktop `0.2.0-rc.2` in [#906](https://github.com/tt-a1i/archify/issues/906).

The **unreleased source fix** sets `includeDefaultRoots: true`, retaining the host's default personal and project roots alongside the packaged Archify root. The provider name and bundle directory are unchanged. The install command below still installs published 1.0.0, **not this fix**; no new adapter version has been published.

The acceptance script now seeds distinct Skills in both DSH and shared-agent personal/project roots and checks their actual loaded bodies and paths after clean installation and same-profile upgrade. It repeats those checks with the base filesystem provider disabled, so the Archify provider must preserve the roots by itself. The immutable 0.1.0 and 1.0.0 upgrade baselines retain their original `false` expectation; the candidate requires `true`.

Candidate automated checks target the exact npm CLI host in `release.json` (`0.2.1-rc.2`); configuring that target is not an acceptance result. They do not establish macOS Desktop `0.2.0-rc.2` acceptance or explain why the reporter's original provider was inactive. That native Desktop verification remains pending; the published support statement is unchanged.
```

</details>

**依据 4 · 作者声明**：[integrations/deepseek-harness/README.md:37-41](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/README.md#L37-L41)

宿主进程执行边界。

```text
## Patch execution boundary

The `cordis.patch.yml` file is configuration consumed by the DSH host. Its `bundledSkillDir` value uses the host loader's `!!js` expression to resolve the installed package's `skills` directory when the entry is activated. This expression runs in the DSH host process, outside the agent sandbox; it is not an inert YAML value and should be treated as host-loaded code.

The current expression is intentionally limited to Node's built-in `path` and `module` helpers for package resolution. It does not fetch data, read credentials, spawn processes, or register another permission path. The normal `lib/index.js` resolver documents the same package-root logic, but the filesystem provider is mounted directly by the patch, so that module is not the activation hook for this bundle. Keep the published install exact-pinned and review any patch change as host-process code.
```

#### 缺口

- 当前发布状态、真实 profile 中的 provider 与 Skill 优先级
  **影响**：可能导致既有 Skill 消失或加载旧版本
  **进一步探讨**：核验发布记录与隔离 profile 的实际正文和路径

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本和可证伪假设是什么？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

用户需核对宿主和插件版本、Skill 来源、许可及正常 shell 工作流，并维护升级和输出文件；复杂图还需人工复核。没有本次出图时间、质量或安装故障率对照，不能证明节省时间。假设安装后显示有效 Skill 来源与同名遮蔽提醒可减少错误归因；需测覆盖率和额外提示负担。若未发现更多实际遮蔽或误报过多，则否定。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:21-25](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/README.md#L21-L25)

作者说明同名 Skill 遮蔽。

```text
### Which Archify actually loads?

On the candidate host, personal and project Skill sources outrank the bundled snapshot. An existing same-name `archify` can therefore shadow the bundle, even after the plugin has upgraded successfully. Upgrading the plugin does **not** necessarily upgrade the effective Skill. The acceptance matrix must check the actual loaded body and source path for older personal and project copies, then check that removing only the disposable test copy restores the bundled body. A version in the installed package alone is insufficient evidence.

When diagnosing a real installation, inspect the effective `archify` source path and version before changing anything. Updating or removing a personal/project copy is a separate user-controlled action; do not delete live Skills automatically to make the bundle win.
```

**依据 2 · 作者声明**：[integrations/deepseek-harness/README.md:19-19](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/README.md#L19-L19)

候选验收需要覆盖安装和升级。

```text
Before publication, retain candidate-head receipts for clean installation, full Skill loading, installed `doctor`/`demo`, same-profile upgrades from **both 0.1.0 and 1.0.0**, and uninstall/base-profile preservation. Record the tarball digest, immutable source, exact host/command source, OS, Node and date. Add same-name `archify` conflicts to these checks, not just distinct test Skills. Candidate acceptance results belong in the linked PR/release record; the historical matrix below does not certify this candidate. Three-platform release acceptance and native Desktop/Electron acceptance remain separate; untested platforms, running-host updates and Desktop are not covered by a CLI pass. No support range for all `0.2.x` hosts is claimed.
```

**依据 3 · 作者声明**：[integrations/deepseek-harness/README.md:153-164](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/README.md#L153-L164)

输出路径和常规执行方式。

<details>
<summary>查看原文（12行）</summary>

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
````

</details>

#### 缺口

- 同名冲突率及图表制作时间
  **影响**：无法量化收益
  **进一步探讨**：在隔离配置比较实际来源核查和诊断时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时试用或退出？

**研究主题**：采用判断

#### 完整回答

需要在 DSH 管理 Archify 的开发者应先观察默认 Skill 共存修复的正式发布和对应宿主验收，再用隔离 profile 检查实际 Skill 正文、路径及产物。相比手工拷贝，该包提供版本固定和 profile 管理，但固定源码的候选与已发布包不是同一状态。若个人或项目 Skill 消失或加载了不期望的版本，应停止在该 profile 使用适配器并核查来源，回到原有 Skill 方式；不得自动删除用户 Skill。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:21-35](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/README.md#L21-L35)

作者记录遮蔽、默认根和候选状态。

<details>
<summary>查看原文（15行）</summary>

```text
### Which Archify actually loads?

On the candidate host, personal and project Skill sources outrank the bundled snapshot. An existing same-name `archify` can therefore shadow the bundle, even after the plugin has upgraded successfully. Upgrading the plugin does **not** necessarily upgrade the effective Skill. The acceptance matrix must check the actual loaded body and source path for older personal and project copies, then check that removing only the disposable test copy restores the bundled body. A version in the installed package alone is insufficient evidence.

When diagnosing a real installation, inspect the effective `archify` source path and version before changing anything. Updating or removing a personal/project copy is a separate user-controlled action; do not delete live Skills automatically to make the bundle win.

## Default Skill roots: unreleased fix

Published **1.0.0** sets `includeDefaultRoots: false`. If its `archify-plugin` provider is the profile's only live filesystem Skill source, personal and project Skills disappear while Archify remains available. This was reported on macOS Desktop `0.2.0-rc.2` in [#906](https://github.com/tt-a1i/archify/issues/906).

The **unreleased source fix** sets `includeDefaultRoots: true`, retaining the host's default personal and project roots alongside the packaged Archify root. The provider name and bundle directory are unchanged. The install command below still installs published 1.0.0, **not this fix**; no new adapter version has been published.

The acceptance script now seeds distinct Skills in both DSH and shared-agent personal/project roots and checks their actual loaded bodies and paths after clean installation and same-profile upgrade. It repeats those checks with the base filesystem provider disabled, so the Archify provider must preserve the roots by itself. The immutable 0.1.0 and 1.0.0 upgrade baselines retain their original `false` expectation; the candidate requires `true`.

Candidate automated checks target the exact npm CLI host in `release.json` (`0.2.1-rc.2`); configuring that target is not an acceptance result. They do not establish macOS Desktop `0.2.0-rc.2` acceptance or explain why the reporter's original provider was inactive. That native Desktop verification remains pending; the published support statement is unchanged.
```

</details>

**依据 2 · 作者声明**：[integrations/deepseek-harness/README.md:43-49](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/README.md#L43-L49)

作者的已发布版本固定安装。

````text
## Install

Use the prebuilt npm package with an exact version. Do not install from Git source.

```bash
dsh plugin --profile web add @tt-a1i/archify-dsh@1.0.0
```
````

**依据 3 · 作者声明**：[integrations/deepseek-harness/README.md:153-164](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/README.md#L153-L164)

调用与产物。

<details>
<summary>查看原文（12行）</summary>

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
````

</details>

#### 缺口

- 目标环境和实际发布状态
  **影响**：影响是否可安全采用
  **进一步探讨**：核对正式发布与隔离宿主验收

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
