# Archify DSH Skill适配器

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[25cf370](https://github.com/tt-a1i/archify/tree/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness)

<!-- BEGIN META -->
[![GitHub ★ 88,446](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=88%2C446&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify) [![npm 30d 31,404](https://img.shields.io/static/v1?label=npm+30d&message=31%2C404&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh) [![最新发布 2026-10-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tt-a1i/archify-dsh)
<!-- END META -->

> **功能**：将固定版本 Archify Skill 作为文件系统 Skill provider 接入 DeepSeek Harness。

> **亮点**：相对手拷Skill，适配器提供profile包身份解析、显式bundle与不可变Skill来源；核心图形能力归于固定上游Skill，不能继承仓库根当前全部能力。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：published1.0.0仍可能隐藏默认个人与项目Skill；本提交已改true并不证明安装命令拿到修复，更不证明所有新宿主兼容。[Q03](#research-q03)

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
  - [Q01 · DSH组件到底交付适配器还是当前Archify全套能力？](#detail-section-11)
  - [Q02 · 加载和打包如何避免把工作区状态误当发布来源？](#detail-section-12)
  - [Q03 · 当前源码修复是否代表已发布包解决默认Skill根丢失？](#detail-section-13)
  - [Q04 · 如何以小成本验证适配器增量，当前是否值得安装？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有DSH profile、希望通过普通Skill流程生成架构图的用户。

参照为将Skill手工拷贝到宿主默认根；只比较来源约束与接线，不将图形能力计为适配层原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Archify Skill provider | 在DSH中发现打包Skill | 依赖filesystem插件和profile包解析；非原生渲染工具 |
| 不可变来源打包 | 固定Skill版本并stage干净文件 | 开发分发流程，非安装时执行；本次未运行 |

启动条件与不满足时的影响见[Q03](#research-q03)的“启动与依赖”表。

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 核对 | 用户确认包版本、Skill源和宿主基线 | 不混同源码fix与npm版本 |
| 加载 | 临时profile添加bundle | 默认和Archify Skill同时可见 |
| 使用 | Agent调用Skill并返回JSON/HTML路径 | 用户从工作区打开并审核内容 |
| 退出 | 标准plugin remove | 检查原Skill与profile仍可用；本次未执行 |

**效果与成本**

首次使用、持续使用、失败恢复的现金/资源与人工成本见[Q03](#research-q03)的“成本”表；没有实测金额或时长的项目保持未知。

已实现机制与未确定效果分开列在[Q03](#research-q03)的“效果”表，不从源码或作者声明推算业务收益。

> **思考**：published1.0.0仍可能隐藏默认个人与项目Skill；本提交已改true并不证明安装命令拿到修复，更不证明所有新宿主兼容。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手拷Skill，适配器提供profile包身份解析、显式bundle与不可变Skill来源；核心图形能力归于固定上游Skill，不能继承仓库根当前全部能力。[Q01](#research-q01) [Q02](#research-q02)

cordis.patch.yml 插入 @deepseek-ai/dsh-skill-filesystem，providerName为archify-plugin，bundledSkillDir通过createRequire(baseUrl)解析安装包package.json，再定位skills；这避免把profile URL当文件目录拼接。lib/index.js的辅助解析器同样锚定profile包解析，缺baseUrl或无法resolve时抛带原因的错误。实际挂载来自patch表达式，不能把辅助函数存在当作它必然被宿主调用。

pack.mjs先stageAdapter，再releaseSnapshot到独立目录，以canonical clean-Skill stager生成skills/archify。release-source直接读HEAD Git blob和regular-file mode，拒绝符号链接，再核对release中的完整commit、精确SemVer和Skill版本。相对把当前工作区直接npm pack，这减少未提交内容或源码漂移混入发布物的机会。其收益依赖stager和包发布链实际执行，本轮只核查实现，不声称tarball已重建。

<a id="detail-section-5"></a>

### 1.4 主要限制

published1.0.0仍可能隐藏默认个人与项目Skill；本提交已改true并不证明安装命令拿到修复，更不证明所有新宿主兼容。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先等待能核对默认Skill根修复的包；熟悉DSH者只在临时profile检查个人、项目和Archify Skill共存，失败就移除适配层。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持provider接线与固定来源打包；发布包与未发布默认根修复必须区分，真实宿主未验收；未来共存矩阵未验证。

- 已检查：作者 README、包清单、源码路径 integrations/deepseek-harness/README.md、integrations/deepseek-harness/package.json、integrations/deepseek-harness/release.json、integrations/deepseek-harness/cordis.patch.yml、integrations/deepseek-harness/lib/index.js、integrations/deepseek-harness/scripts/pack.mjs、integrations/deepseek-harness/scripts/release-source.mjs 及固定范围 inventory；组件：integrations/deepseek-harness。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：限定DSH适配子目录及其打包引用；未审查release.sourceCommit全部Skill代码，不将根当前3.2.0当打包内容。没有运行目标脚本、安装或宿主验收。
- 下一步：核对发布tarball的patch、固定Skill来源与默认根，再在精确宿主临时profile测试加载/共存/移除；不跳过平台扫描。

**分析版本**

- **仓库**：[tt-a1i/archify](https://github.com/tt-a1i/archify)
- **版本号**：1.0.0（[固定提交 25cf370](https://github.com/tt-a1i/archify/tree/25cf37080fc8b1dbe758a4efc3935b55f3327083)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把默认Skill共存矩阵与双版本收据作为适配包发布合同，用同配置对照检验能否提前发现分发回归。[Q04](#research-q04)

核对发布tarball的patch、固定Skill来源与默认根，再在精确宿主临时profile测试加载/共存/移除；不跳过平台扫描。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 229 | — | — | 3674 |
| .js | source | 1 | 21 | 19 | 0 | — |
| .mjs | source | 5 | 936 | 843 | 35 | — |
| .mjs | test | 10 | 1167 | 1073 | 18 | — |

</details>

**活跃度**

[![Issue 未关闭 150](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=150&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 139](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=139&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+created%3A2026-09-24T10%3A26%3A52.933Z..2026-10-24T10%3A26%3A52.933Z) [![近30天关闭 87](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=87&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-24T10%3A26%3A52.933Z..2026-10-24T10%3A26%3A52.933Z)



统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定Skill分发和DSH接线能否支持可控采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH组件到底交付适配器还是当前Archify全套能力？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

该组件服务已有 DSH profile 的用户，把 Archify 作为 filesystem Skill 加载。适配器本身不提供原生渲染工具、独立界面、文件条或后台服务；生成仍走宿主普通Skill、shell与文件路径。合格交付是Skill能被加载，Agent按其流程生成文件并返回确切工作区路径，而不是安装后自动出现专用可视化入口。

核心身份边界是三组版本不能混同。本轮研究的是适配器源码提交；package声明适配器1.0.0；release.json则固定Skill3.0.1与sourceCommit 7158026e852f3aa6578c741e673b46d7878c92c1，验收宿主为0.1.2-rc.1。仓库根当前Skill 3.2.0不能替代此固定打包来源。相对手工拷贝Skill，该组件增加profile包身份解析、显式bundle层和不可变来源打包，主要是分发可靠性增量，Archify渲染创新归于上游Skill。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:3-13](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness/README.md#L3-L13)

作者明确发布版本、Skill来源、宿主范围和无原生工具。

<details>
<summary>查看原文（11行）</summary>

```text
Community DeepSeek Harness integration for [Archify](https://github.com/tt-a1i/archify). This is **not** an official DeepSeek product and does not imply DeepSeek endorsement.

The currently published npm package is **v1.0.0**. It bundles Archify Skill **3.0.1** and supports the exact developer-preview **`@deepseek-ai/dsh@0.1.2-rc.1`** on Node.js **`^22.19.0 || >=24.0.0`**. The 1.0 adapter contract covers this exact DSH host version; it does not make the host stable or guarantee compatibility with other DSH versions.

Version 1.0.0 was published on 2026-10-04: [npm package](https://www.npmjs.com/package/@tt-a1i/archify-dsh/v/1.0.0) · [release and verified tarball](https://github.com/tt-a1i/archify/releases/tag/archify-dsh-v1.0.0). It is a Skill-only bundle: it inserts one filesystem Skill provider named `archify-plugin` and exposes **Archify 3.0.1**, pinned to stable `main` commit `7158026e852f3aa6578c741e673b46d7878c92c1`. This snapshot includes the Skill installation fix from [#704](https://github.com/tt-a1i/archify/pull/704), which landed after the `v3.0.1` tag; it is not a byte-for-byte copy of that tag. The packaged `package.json` and `skill-release.json` both declare 3.0.1. Compared with the previous plugin 0.1.0, it includes the Archify 3.x authoring and delivery flow, authored brand marks, Workflow schema v2, Viewer localization, and update awareness.

`release.json` records the immutable Skill source commit, Skill version, and DSH version used by acceptance. Packaging uses the canonical clean-Skill stager against that commit, preserving license notices and excluding development files. Adapter version 0.1.0 and its `archify-dsh-v0.1.0` tag remain unchanged; reproduce that old release by checking out its tag first.

The adapter registers no native render/validate/deliver tools, custom Web client, Produced Files chips, telemetry, credentials handling, background services, or install hooks. The bundled Skill includes an optional, notification-only stable Archify update checker; it never upgrades the plugin. Authored remote brand assets may also use the Skill's bounded network path. The adapter itself makes no network requests.

## Default Skill roots: unreleased fix
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/release.json:1-5](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness/release.json#L1-L5)

固定Skill来源提交、版本及验收宿主。

```text
{
  "sourceCommit": "7158026e852f3aa6578c741e673b46d7878c92c1",
  "skillVersion": "3.0.1",
  "dshVersion": "0.1.2-rc.1"
}
```

**依据 3 · 源码核查**：[integrations/deepseek-harness/package.json:1-19](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness/package.json#L1-L19)

npm身份、版本和包内容声明。

<details>
<summary>查看原文（19行）</summary>

```text
{
  "name": "@tt-a1i/archify-dsh",
  "version": "1.0.0",
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
```

</details>

#### 缺口

- 未读取并执行打包所指Skill源提交的完整功能
  **影响**：不能宣称当前适配器包含根组件新能力
  **进一步探讨**：单独核对不可变源提交与发布tarball目录及字节；本次不执行目标打包

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 加载和打包如何避免把工作区状态误当发布来源？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

cordis.patch.yml 插入 @deepseek-ai/dsh-skill-filesystem，providerName为archify-plugin，bundledSkillDir通过createRequire(baseUrl)解析安装包package.json，再定位skills；这避免把profile URL当文件目录拼接。lib/index.js的辅助解析器同样锚定profile包解析，缺baseUrl或无法resolve时抛带原因的错误。实际挂载来自patch表达式，不能把辅助函数存在当作它必然被宿主调用。

pack.mjs先stageAdapter，再releaseSnapshot到独立目录，以canonical clean-Skill stager生成skills/archify。release-source直接读HEAD Git blob和regular-file mode，拒绝符号链接，再核对release中的完整commit、精确SemVer和Skill版本。相对把当前工作区直接npm pack，这减少未提交内容或源码漂移混入发布物的机会。其收益依赖stager和包发布链实际执行，本轮只核查实现，不声称tarball已重建。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:1-10](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness/cordis.patch.yml#L1-L10)

真实bundle挂载与安装包锚定解析。

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

**依据 2 · 源码核查**：[integrations/deepseek-harness/lib/index.js:1-21](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness/lib/index.js#L1-L21)

profile baseUrl解析和错误处理。

<details>
<summary>查看原文（21行）</summary>

```text
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

export const name = 'archify-dsh';
export const PACKAGE_NAME = '@tt-a1i/archify-dsh';

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

**依据 3 · 源码核查**：[integrations/deepseek-harness/scripts/pack.mjs:18-36](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness/scripts/pack.mjs#L18-L36)

适配器stage和固定Skill快照打包链。

<details>
<summary>查看原文（19行）</summary>

```text
const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'archify-dsh-pack-'));
const snapshot = fs.mkdtempSync(path.join(os.tmpdir(), 'archify-dsh-source-'));

try {
  stageAdapter(stage);
  releaseSnapshot(snapshot);
  stageCleanSkill({ repoRoot: snapshot, destination: path.join(stage, 'skills', 'archify') });
  fs.copyFileSync(path.join(snapshot, 'LICENSE'), path.join(stage, 'LICENSE'));

  const packed = spawnCliSync('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', stage], {
    cwd: stage,
    encoding: 'utf8',
  });
  if (packed.status !== 0) {
    throw new Error(`npm pack failed: ${packed.stderr || packed.stdout || packed.error?.message}`);
  }
  const produced = fs.readdirSync(stage).find((name) => name.endsWith('.tgz'));
  if (!produced) {
    throw new Error(`npm pack produced no tarball\n${packed.stdout}\n${packed.stderr}`);
```

</details>

**依据 4 · 源码核查**：[integrations/deepseek-harness/scripts/release-source.mjs:37-47](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness/scripts/release-source.mjs#L37-L47)

只读取固定Git blobs并拒绝符号链接。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[integrations/deepseek-harness/scripts/release-source.mjs:63-93](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness/scripts/release-source.mjs#L63-L93)

完整提交、精确宿主版本和独立快照版本核对。

<details>
<summary>查看原文（31行）</summary>

```text
if (!/^[a-f0-9]{40}$/.test(release.sourceCommit)) {
  throw new Error('DSH release sourceCommit must be a full immutable Git commit');
}

// Only an exact SemVer may pin the runtime: ranges, tags, registry aliases,
// URLs, and local paths would let the committed release file substitute an
// arbitrary package for @deepseek-ai/dsh.
const EXACT_SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?$/;
if (typeof release.dshVersion !== 'string' || !EXACT_SEMVER.test(release.dshVersion)) {
  throw new Error(`DSH release dshVersion must be an exact SemVer version: ${JSON.stringify(release.dshVersion)}`);
}
if (Object.keys(manifest.scripts || {}).length > 0) {
  throw new Error(`DSH adapter manifest must not declare npm scripts: ${Object.keys(manifest.scripts).join(', ')}`);
}

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 当前源码修复是否代表已发布包解决默认Skill根丢失？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

不能。本轮源码patch中includeDefaultRoots:true，但作者明确published1.0.0仍是false，并说明唯一live filesystem来源时可能让用户与项目Skills消失。这个问题影响“只是增加一个Skill”的核心承诺，必须区分源码修复和npm安装命令。README中的新宿主兼容分析也不是当前安装验收；release固定0.1.2-rc.1，不应外推所有0.2版本或平台。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH profile与filesystem Skill插件 | 必需 | 应用bundle并发现Skill | provider不能加载 |
| 声明Node ^22.19.0或>=24 | 必需 | 包解析与宿主运行 | 声明外兼容未知 |
| release固定DSH 0.1.2-rc.1 | 当前明确验收基线 | 约束适配器支持承诺 | 其他版本须单独核查 |
| Agent shell和文件权限 | 生成产物必需 | 运行Skill工具并写HTML | 无专用原生工具兜底 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | npm/宿主/模型资源金额未知 | profile安装、Skill根检查；时长未知 | 不能把源码fix当作已安装版本 |
| 持续使用 | 模型和Skill渲染资源未知 | 审核图内容、打开确切文件路径 | shell产物不自动进入Produced Files |
| 失败恢复 | 重装或切换包资源未知 | 检查provider和个人Skill，必要时移除bundle | 保留已有profile配置与Skill |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| provider默认根保留 | 本提交patch配置true | 新修复是否已发布及跨宿主可用性 |
| 固定Skill分发 | 打包脚本约束不可变来源 | 实际tarball和真实宿主行为 |

源码中的退出路径是标准plugin remove；这只是作者使用说明，不是本次已验证卸载。对生产profile优先等待可核查新发布，避免为得到一个Skill牺牲原有Skill可见性。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:15-24](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness/README.md#L15-L24)

作者区分published1.0.0缺陷与未发布源修复。

<details>
<summary>查看原文（10行）</summary>

```text
Published **1.0.0** sets `includeDefaultRoots: false`. If its `archify-plugin` provider is the profile's only live filesystem Skill source, personal and project Skills disappear while Archify remains available. This was reported on macOS Desktop `0.2.0-rc.2` in [#906](https://github.com/tt-a1i/archify/issues/906).

The **unreleased source fix** sets `includeDefaultRoots: true`, retaining the host's default personal and project roots alongside the packaged Archify root. The provider name and bundle directory are unchanged. The install command below still installs published 1.0.0, **not this fix**; no new adapter version has been published.

The acceptance script now seeds distinct Skills in both DSH and shared-agent personal/project roots and checks their actual loaded bodies and paths after clean installation and same-profile upgrade. It repeats those checks with the base filesystem provider disabled, so the Archify provider must preserve the roots by itself. The immutable 0.1.0 upgrade baseline retains its original `false` expectation; the candidate requires `true`.

These automated checks use the exact npm CLI host in `release.json` (`0.1.2-rc.1`). They do not establish macOS Desktop `0.2.0-rc.2` acceptance or explain why the reporter's original provider was inactive. That native Desktop verification remains pending; the published support statement is unchanged.

## Patch execution boundary

```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:5-10](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness/cordis.patch.yml#L5-L10)

固定提交实际includeDefaultRoots为true。

```text
    - id: archify-skill-filesystem
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: archify-plugin
        includeDefaultRoots: true
        bundledSkillDir: !!js process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:path').dirname(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('@tt-a1i/archify-dsh/package.json')), 'skills')
```

**依据 3 · 源码核查**：[integrations/deepseek-harness/package.json:28-30](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness/package.json#L28-L30)

Node引擎声明。

```text
    "node": "^22.19.0 || >=24.0.0"
  },
  "repository": {
```

**依据 4 · 源码核查**：[integrations/deepseek-harness/release.json:1-5](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness/release.json#L1-L5)

宿主支持绑定具体版本。

```text
{
  "sourceCommit": "7158026e852f3aa6578c741e673b46d7878c92c1",
  "skillVersion": "3.0.1",
  "dshVersion": "0.1.2-rc.1"
}
```

#### 缺口

- 当前源码修复的发布与实际宿主结果无独立证据
  **影响**：无法推荐直接安装npm命令用于主profile
  **进一步探讨**：核对新tarballpatch，在临时profile并存个人/项目Skill后验收加载、禁用和卸载

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何以小成本验证适配器增量，当前是否值得安装？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前采用结论为观察。稳定的包解析和固定来源有明确价值，但已发布包与源码修复不一致，默认Skill根又影响其他工作，妨碍对普通profile给出直接试用建议。熟悉DSH的开发者可在独立临时profile审阅或自行验证固定源码，但不能把这种工程验证路径当作一般用户安装完成。

未来假设是把“默认Skill共存矩阵”作为适配包发布验收物，覆盖仅一个provider、已有多个provider、个人/项目根及移除后状态，并将适配器提交和Skill源提交分别写入收据。其增量是让分发层与内容层的兼容承诺可分开证伪；这不是当前已实现的承诺。用本提交与已发布包在同一宿主配置下对照，检查默认根、Archify可见性、文件输出和移除残留。若仅靠现有宿主检查已覆盖同样回归，新增矩阵不值得独立维护；若新矩阵增加维护却无法发现默认根变化，也应放弃。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:15-24](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness/README.md#L15-L24)

发布与源修复间隙支撑观察结论。

<details>
<summary>查看原文（10行）</summary>

```text
Published **1.0.0** sets `includeDefaultRoots: false`. If its `archify-plugin` provider is the profile's only live filesystem Skill source, personal and project Skills disappear while Archify remains available. This was reported on macOS Desktop `0.2.0-rc.2` in [#906](https://github.com/tt-a1i/archify/issues/906).

The **unreleased source fix** sets `includeDefaultRoots: true`, retaining the host's default personal and project roots alongside the packaged Archify root. The provider name and bundle directory are unchanged. The install command below still installs published 1.0.0, **not this fix**; no new adapter version has been published.

The acceptance script now seeds distinct Skills in both DSH and shared-agent personal/project roots and checks their actual loaded bodies and paths after clean installation and same-profile upgrade. It repeats those checks with the base filesystem provider disabled, so the Archify provider must preserve the roots by itself. The immutable 0.1.0 upgrade baseline retains its original `false` expectation; the candidate requires `true`.

These automated checks use the exact npm CLI host in `release.json` (`0.1.2-rc.1`). They do not establish macOS Desktop `0.2.0-rc.2` acceptance or explain why the reporter's original provider was inactive. That native Desktop verification remains pending; the published support statement is unchanged.

## Patch execution boundary

```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/release.json:1-5](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness/release.json#L1-L5)

现有双版本来源可扩展为矩阵收据。

```text
{
  "sourceCommit": "7158026e852f3aa6578c741e673b46d7878c92c1",
  "skillVersion": "3.0.1",
  "dshVersion": "0.1.2-rc.1"
}
```

**依据 3 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:5-10](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/integrations/deepseek-harness/cordis.patch.yml#L5-L10)

共存行为由provider配置决定。

```text
    - id: archify-skill-filesystem
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: archify-plugin
        includeDefaultRoots: true
        bundledSkillDir: !!js process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:path').dirname(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('@tt-a1i/archify-dsh/package.json')), 'skills')
```

#### 缺口

- 共存矩阵假设未比较维护成本
  **影响**：不能计入已有创新
  **进一步探讨**：固定两个适配版本与相同宿主，比较回归检出和维护时间

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
