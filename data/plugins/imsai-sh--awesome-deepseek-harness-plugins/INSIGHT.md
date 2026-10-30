# Awesome DeepSeek Harness Plugins（imsai-sh）

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[3d9ab41](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/tree/3d9ab413220f37dccc8a5ec336b0ed3105397b71)

<!-- BEGIN META -->
[![GitHub ★ 332](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=332&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/imsai-sh/awesome-deepseek-harness-plugins)
<!-- END META -->

> **功能**：维护社区插件目录与提交 Skill，通过可信静态审查、按目录 PR 版本合并、远端同步和双语 README 生成组织收录。

> **亮点**：结构化提交、可信代码与不可信数据分开、目录head守卫、同步与分页一致投影组合，见 [Q02](#research-q02) 至 [Q03](#research-q03)。

> **主要限制**：静态通过/目录PR head/HTTP ack/快照一致分别只覆盖一层；外部插件版本、npm可用、未知POST和跨仓DB恢复仍需核，见 [Q03](#research-q03)。

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
  - [Q01 · 当前根对象是什么，哪些市场能力实际在别处？](#detail-section-11)
  - [Q02 · Skill、静态审查和自动合并实际如何接通？](#detail-section-12)
  - [Q03 · 从合并到数据库和README的成功/失败边界是什么？](#detail-section-13)
  - [Q04 · 谁适合有限试用，四阶段成本和退出在哪里？](#detail-section-14)
  - [Q05 · 未来需要补的采用证据与现有SHA/快照守卫有何区别？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：插件作者准备结构收录，维护者发布目录，用户找候选；网站/CLI实现属姊妹仓，见 [Q01](#research-q01)。

手工审目录PR/入库/编辑中英列表；直接原仓核具体插件。自动收录比目录转链多，但不是插件运行验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 资源目录 | 查候选与来源 | 网站/CLI实现已拆仓 |
| 提交Skill/helper | 生成唯一JSON/检查授权 | 不运行作者代码，不自授权PR |
| 静态审查/merge | 管收录范围与目录head | 单新增自动；非行为/工件证明 |
| 同步/README | POST与一致全量快照投影 | Worker/外部结果另核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node22+/npm10+、干净目录 | 准备/维护需要 | helper与可信审查脚本 | Skill不替代环境检查 |
| Agent宿主/作者原件 | 用Skill时 | 读指令、核manifest/作者测试 | 不是自动运行验证 |
| GitHub/API/明确发布权限 | 提交与合并时 | PR/评论/受限merge | 旧head跳过、修改删项人工审 |
| Worker/API/共享令牌与写部署权 | 维护同步时 | 外部目录/README | 姊妹仓服务端语义未核 |
| 完整一致远端快照 | 生成时 | 双语README | 旋转/截断/零结果拒绝 |
| 具体候选npm工件/Runtime | 采用插件时 | 真实安装与行为 | 静态收录不代验 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 作者/Agent只生成唯一JSON | id/分类/范围/dry-run，拒覆盖 |
| 收录审查 | 可信脚本读PR数据和插件tree | metadata/patch存在，不跑插件 |
| 合并 | 非draft单新增才自动merge | 目录预期head一致；修改删人工 |
| 同步 | 维护workflow POST后读API | ack与一致分页分别判 |
| 投影 | 生成并提交双语README | 不证明具体候选已安装 |
| 采用退出 | 用户核工件/功能与撤销 | 目录资源和已装对象分开处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地Node/GitHub；维护Worker/DB未知 | 干净目录/分类/授权/密钥配置 | root私有包非服务价格 |
| 持续使用 | API/runner/数据库/截图未知 | 条目与双语/两仓协议适配 | 候选模型/遥测费用另计 |
| 失败恢复 | 部分合并/远端写入/重试未知 | 核head/ack/快照/推送状态再恢复 | 不承诺跨仓事务或回滚 |
| 退出 | 已合并目录/外部服务/插件另计 | 删本地未提交项或人工删除PR/撤权 | 不等删除所有副本与已装对象 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 作者准备 | Skill/helper唯一JSON/dry-run | 真实作者净节时 |
| 可信收录 | base脚本/变更范围/目录SHA | 插件行为/最新工件安全 |
| 发布组织 | POST接线和一致分页生成 | Worker事务/线上全链通过 |
| 候选发现 | 双语目录/原仓链接 | 安装/用户数/质量 |

> **思考**：静态通过/目录PR head/HTTP ack/快照一致分别只覆盖一层；外部插件版本、npm可用、未知POST和跨仓DB恢复仍需核，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：结构化提交、可信代码与不可信数据分开、目录head守卫、同步与分页一致投影组合，见 [Q02](#research-q02) 至 [Q03](#research-q03)。

[Q02](#research-q02) 可信脚本与提交数据分离、预期head merge及[Q03](#research-q03)全量快照拒退化可借鉴，但各层结果和外部事务必须分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

静态通过/目录PR head/HTTP ack/快照一致分别只覆盖一层；外部插件版本、npm可用、未知POST和跨仓DB恢复仍需核，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在干净目录准备单项，授权外部PR前看自动合并条件；只把目录当候选，不把静态PASS或ack当功能验收，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码提交流程、真实CI/merge/POST/README活动链可核；未运行目标或CI、未审姊妹仓运行时/真实线上结果。可先本地单项准备试用。

- 已检查：作者 README、包清单、源码路径 .github/workflows/catalog-sync.yml、.github/workflows/plugin-review.yml、README.md、catalog/plugins/030611--dsh-verification-receipt.json、package.json、scripts/build-readme.mjs、scripts/lib/catalog-entry.mjs、scripts/merge-plugin-submission.mjs、scripts/review-plugin-submission.mjs、scripts/sync-catalog.mjs、skills/submit-dsh-plugin/SKILL.md、skills/submit-dsh-plugin/scripts/create-catalog-entry.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核completed/四摘要与固定SOURCE；读root分工、提交Skill/helper、schema/代表条目、可信审查main到插件tree、变更类别/merge、真实workflow链、同步POST和README分页/写入。未执行Skill或脚本、未跑测试/CI、未审姊妹仓网站/CLI/Worker/遥测或线上部署；不外推所有条目均过PR审。
- 下一步：单项本地准备后核获授权测试PR的head竞争/修改删分支，再定向核Worker幂等与未知POST对账、分页旋转/截断、投影推送失败及候选真实工件。

**分析版本**

- **仓库**：[imsai-sh/awesome-deepseek-harness-plugins](https://github.com/imsai-sh/awesome-deepseek-harness-plugins)
- **版本号**：0.5.0（私有维护包；不是网站或 CLI 统一版本）（[固定提交 3d9ab41](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/tree/3d9ab413220f37dccc8a5ec336b0ed3105397b71)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在现有目录SHA/快照校验之上绑定被审插件tree、实际npm工件与最小任务/退出证据，比较误采/重做和总工时，见 [Q05](#research-q05)。

单项本地准备后核获授权测试PR的head竞争/修改删分支，再定向核Worker幂等与未知POST对账、分页旋转/截断、投影推送失败及候选真实工件。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 6400 | — | — | 160884 |
| .mjs | source | 7 | 1898 | 1455 | 250 | — |
| .mjs | test | 6 | 2006 | 1727 | 137 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：根仓的提交/静态审核/合并到目录投影能支持哪些采用判断，是否绑定真实插件安装工件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 当前根对象是什么，哪些市场能力实际在别处？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

当前根对象是社区插件资源目录与收录/发布工程，另附submit-dsh-plugin Skill，不是dsh1024安装器、市场客户端或DSH bundle。私有维护包0.5.0不能当线上服务或独立CLI版本。README明示网站/CLI移至imsai-sh/dsh-1024store；市场、公开API和安装遥测虽有介绍，运行时实现不在本轮固定根仓，本研究不据其文案宣称参数转发/真实安装核对/隐私过滤已独立验证。

用户查候选，作者准备结构条目，维护者让收录合并后同步并生成中英README，这是当前直接活动链。对照人工收PR、手写分类与双语列表、手工入站数据库：唯一JSON、可信审查、受限自动合并和远端投影减少重复步骤。README同时说明含PR与topic自动发现，目录数量/排名不是用户数、真实安装结果或所有项都过同一审查。代表catalog条目只是id、仓库、分类、双语说明和日期，不绑定插件源码commit/发行工件。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:3-13](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/README.md#L3-L13)

根仓/姊妹仓分工及自动生成目录。

<details>
<summary>查看原文（11行）</summary>

```text
<!-- 本文件由 scripts/build-readme.mjs 从 deepseek1024.com 目录 API 自动生成，请勿手工编辑。 -->

面向 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness)（`dsh`）生态的社区插件目录，共收录 **13896** 个插件（含 PR 收录与 GitHub `dsh-plugin` topic 自动发现），目录数据更新于 2026-10-29。

> 📦 **仓库拆分公告**：自 2026-08-25 起，deepseek1024.com 网站与 `dsh1024` CLI 的源码已拆分至独立仓库 [imsai-sh/dsh-1024store](https://github.com/imsai-sh/dsh-1024store)。本仓库从此专注插件目录（awesome 清单）与收录流程；网站与 CLI 相关的 issue / PR 请移步新仓库，插件收录照旧在这里提交。

**但这个项目不只是一份 awesome list。** 它还包括一个在线插件市场、一个把市场装进 `dsh` 本体的插件，以及一套免费的公开查询 API——这些应用代码开源在姊妹仓库 [dsh-1024store](https://github.com/imsai-sh/dsh-1024store)；本仓库专注目录本身：经静态校验的 PR 收录流水线与自动生成的目录 README，目录数据另有自动收集服务持续喂入。全部代码 MIT 协议，fork 之后就能部署成你自己的插件市场。

[![DSH 1024Store 插件市场首页](https://raw.githubusercontent.com/imsai-sh/awesome-deepseek-harness-plugins/assets/homepage.zh.png?v=808d55544a6c)](https://deepseek1024.com/)

[在线网站](https://deepseek1024.com/) · [API 文档](https://github.com/imsai-sh/dsh-1024store/blob/main/web/docs/api.md) · [英文目录](catalog/README.md) · [提交插件](CONTRIBUTING.md) · [网站与 CLI 源码](https://github.com/imsai-sh/dsh-1024store)
```

</details>

**依据 2 · 源码核查**：[package.json:1-25](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/package.json#L1-L25)

私有维护包和本仓脚本。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "name": "awesome-deepseek-harness-plugins",
  "version": "0.5.0",
  "private": true,
  "license": "MIT",
  "homepage": "https://deepseek1024.com/",
  "type": "module",
  "packageManager": "npm@11.16.0",
  "scripts": {
    "plugin:review": "node scripts/review-plugin-submission.mjs",
    "catalog:sync": "node scripts/sync-catalog.mjs",
    "readme:build": "node scripts/build-readme.mjs",
    "readme:check": "node scripts/build-readme.mjs --check",
    "test:plugin-review": "node --test scripts/review-plugin-submission.test.mjs",
    "test:plugin-merge": "node --test scripts/merge-plugin-submission.test.mjs",
    "test:submit-skill": "node --test scripts/submit-dsh-plugin-skill.test.mjs",
    "test:catalog-sync": "node --test scripts/sync-catalog.test.mjs",
    "test:readme-build": "node --test scripts/build-readme.test.mjs",
    "test:capture-homepage": "node --test scripts/capture-homepage.test.mjs",
    "test": "npm run test:plugin-review && npm run test:plugin-merge && npm run test:submit-skill && npm run test:catalog-sync && npm run test:readme-build && npm run test:capture-homepage"
  },
  "engines": {
    "node": ">=22",
    "npm": ">=10"
  }
```

</details>

**依据 3 · 源码核查**：[skills/submit-dsh-plugin/SKILL.md:1-15](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/skills/submit-dsh-plugin/SKILL.md#L1-L15)

附真实Skill及授权范围。

<details>
<summary>查看原文（15行）</summary>

```text
---
name: submit-dsh-plugin
description: 验证并提交 DeepSeek Harness 插件到 imsai-sh/awesome-deepseek-harness-plugins 社区目录。适用于插件作者要求收录、发布或提交自己的插件，创建目录 JSON，修复目录提交 PR，或者发起合规 PR。检查公开仓库、dsh-plugin topic、dsh.bundle.patch、作者测试证据、双语元数据和单文件差异，并在获得授权后执行 fork、push 和创建 PR。
---

# 提交 DSH 插件

从插件作者的仓库准备一份聚焦的目录收录 PR。始终把 `catalog/plugins/*.json` 视为贡献者唯一可以编辑的目录源数据。

## 安全与范围

- 不得在插件提交 PR 中编辑 `README.md`、`catalog/README.md`、工作流或脚本。两个 README 是 bot 生成的目录投影，合并后由 CI 自动刷新。
- 不得仅为了检查插件而安装依赖、运行生命周期脚本、构建或执行插件代码。运行作者代码前必须先征得同意。
- 保留所有无关的本地改动。如果目录仓库工作区不干净，应停止操作；除非用户指定一个干净 worktree，或明确界定现有改动的范围。
- 将“准备”或“起草”理解为仅做本地修改。只有用户明确要求“提交”“推送”或“创建 PR”时，才视为已授权在展示准确目标后执行 fork、push 和创建 PR。
```

</details>

**依据 4 · 源码核查**：[catalog/plugins/030611--dsh-verification-receipt.json:1-12](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/catalog/plugins/030611--dsh-verification-receipt.json#L1-L12)

代表目录条目非被核插件SHA。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "$schema": "../schema/plugin.schema.json",
  "id": "030611/dsh-verification-receipt",
  "name": "dsh-verification-receipt",
  "repository": "https://github.com/030611/dsh-verification-receipt",
  "category": "dev",
  "description": {
    "en": "Writes local JSONL summaries of per-turn tool counts and coarse verification signals without storing prompts, tool arguments, or result text.",
    "zh": "把每轮工具计数与粗粒度验证信号写入本地 JSONL，不保存提示词、工具参数或结果正文。"
  },
  "added": "2026-08-14"
}
```

</details>

**依据 5 · 源码核查**：[scripts/lib/catalog-entry.mjs:82-103](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/lib/catalog-entry.mjs#L82-L103)

条目精确字段合同。

<details>
<summary>查看原文（22行）</summary>

```text
export function validateCatalogEntry(entry, file, categoryIds) {
  const label = file
  assert(isObject(entry), `${label} must contain a JSON object`)
  assertExactKeys(entry, ['$schema', 'id', 'name', 'repository', 'category', 'description', 'added'], label)
  assert(entry.$schema === schemaReference, `${label} must reference ${schemaReference}`)
  // The 201-character cap mirrors the catalog sync endpoint's id bound in
  // web/worker/app.ts (ENTRY_ID) and install-metrics.ts (PLUGIN_ID) of
  // the dsh-1024store repository. Drift means a submission passes review here
  // but the sync endpoint rejects it there.
  assert(typeof entry.id === 'string' && entry.id.length <= 201 && isValidPluginId(entry.id), `${label} has an invalid id`)
  assert(path.posix.basename(file) === pluginFileName(entry.id), `${label} should be named ${pluginFileName(entry.id)}`)
  assert(typeof entry.name === 'string' && entry.name.trim().length > 0 && entry.name.length <= 120, `${label} has an invalid name`)
  assert(entry.repository === repositoryUrl(entry.id), `${label}.repository must be ${repositoryUrl(entry.id)}`)
  assert(categoryIds instanceof Set && categoryIds.has(entry.category), `${label} has an unknown category`)
  assert(isObject(entry.description), `${label}.description must be an object`)
  assertExactKeys(entry.description, ['en', 'zh'], `${label}.description`)
  for (const locale of ['en', 'zh']) {
    const description = entry.description[locale]
    assert(typeof description === 'string' && description.trim().length > 0 && description.length <= 1000, `${label} has an invalid ${locale} description`)
  }
  assert(typeof entry.added === 'string' && isIsoDate(entry.added), `${label} has an invalid added date`)
  return entry
```

</details>

#### 缺口

- 未核姊妹仓CLI/Worker/遥测实现或真实用户任务。
  **影响**：根仓贡献不能外推安装器正确、匿名上报无泄漏或目录受欢迎程度。
  **进一步探讨**：分别固定姊妹仓和安装工件后定向核真实安装/退出；本仓先核少数作者提交及投影结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Skill、静态审查和自动合并实际如何接通？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Skill规定Agent先只读查插件、作者测试证据，再用随附helper生成唯一JSON；helper校id/分类/日期/双语说明，扫描重复id，以wx拒覆盖，dry-run不写。它是Agent操作指南和文件生成器，不是本仓自主模型循环；作者测试由作者给证据，静态审查不执行插件。Skill明确外部提交需授权，安装代码检查不可默认运行，不能把安装此Skill理解为授权发布。

pull_request_target用基础分支可信reviewer、另把PR checkout当数据且不持久凭据。真实main按GitHub PR diff→允许catalog JSON范围→可信分类allow-list→普通文件/字段校验→插件仓默认分支固定tree读取，subdir id要在对应位置找manifest，检查dsh.bundle.patch存在。单新增文件才auto-merge，多项/修改/删除manual-review；入口不可获得或npm可安装性只是advisory，不是运行拒绝门槛。非draft且verdict符合才进merger；它重读PR的open/base/head，head不等预期则skip，并在GitHub squash请求传同一sha，随后显式dispatch目录同步，避免只靠bot push触发。SHA保护针对目录PR，不等将插件仓被核tree绑定到未来npm安装。

#### 证据与依据

**依据 1 · 源码核查**：[skills/submit-dsh-plugin/SKILL.md:8-15](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/skills/submit-dsh-plugin/SKILL.md#L8-L15)

不可执行作者代码/外部授权/单文件范围。

```text
从插件作者的仓库准备一份聚焦的目录收录 PR。始终把 `catalog/plugins/*.json` 视为贡献者唯一可以编辑的目录源数据。

## 安全与范围

- 不得在插件提交 PR 中编辑 `README.md`、`catalog/README.md`、工作流或脚本。两个 README 是 bot 生成的目录投影，合并后由 CI 自动刷新。
- 不得仅为了检查插件而安装依赖、运行生命周期脚本、构建或执行插件代码。运行作者代码前必须先征得同意。
- 保留所有无关的本地改动。如果目录仓库工作区不干净，应停止操作；除非用户指定一个干净 worktree，或明确界定现有改动的范围。
- 将“准备”或“起草”理解为仅做本地修改。只有用户明确要求“提交”“推送”或“创建 PR”时，才视为已授权在展示准确目标后执行 fork、push 和创建 PR。
```

**依据 2 · 源码核查**：[skills/submit-dsh-plugin/SKILL.md:65-85](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/skills/submit-dsh-plugin/SKILL.md#L65-L85)

真实helper调用和范围约束。

<details>
<summary>查看原文（21行）</summary>

````text

解析本 Skill 目录的绝对路径，然后运行其中的确定性创建脚本：

```bash
node <skill-directory>/scripts/create-catalog-entry.mjs \
  --catalog-root <catalog-checkout> \
  --id owner/repository \
  --category skill \
  --description-en "A factual English description." \
  --description-zh "客观、具体的中文说明。"
```

monorepo 子包传入完整 ID，例如 `--id owner/repository/packages/foo`；脚本会保持 `repository` 为仓库根 URL，并把路径段编入文件名。

仅当展示名称需要不同于默认值（两段 ID 为仓库名，子目录 ID 为最后一个路径段）时传入 `--name`。仅当需要覆盖当天 UTC 日期时传入 `--added YYYY-MM-DD`。

脚本必须拒绝未知分类、重复 ID（不区分大小写，含路径段）、无效 ID 和已存在的目标文件。同一仓库以不同子目录路径提交多个条目是允许的，只要每个完整 ID 唯一。不得绕过这些错误手工创建文件。

## 5. 验证单文件约束

要求当前分支相对上游最新默认分支的完整差异只包含一个新增文件：
````

</details>

**依据 3 · 源码核查**：[skills/submit-dsh-plugin/scripts/create-catalog-entry.mjs:120-152](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/skills/submit-dsh-plugin/scripts/create-catalog-entry.mjs#L120-L152)

参数/分类/日期/JSON。

<details>
<summary>查看原文（33行）</summary>

```text
  const root = path.resolve(required(values, 'catalog-root'))
  const id = required(values, 'id')
  if (!isValidPluginId(id)) {
    fail('--id 必须使用 owner/repository[/sub/dir] 格式（各段仅限 A-Za-z0-9_.-，路径段不能是 . 或 ..，总长不超过 201 字符）')
  }
  const idSegments = id.split('/')
  const [owner, repositoryName] = idSegments
  // 默认展示名称取 ID 的最后一段：两段 ID 即仓库名，子目录 ID 即子包目录名。
  const name = (values.get('name') ?? idSegments.at(-1)).trim()
  if (name.length === 0 || name.length > 120) fail('--name 长度必须为 1–120 个字符')

  const categoriesFile = path.join(root, 'catalog/categories.json')
  const pluginsDirectory = path.join(root, 'catalog/plugins')
  const categories = await readJson(categoriesFile)
  const categoryIds = new Set(categories?.categories?.map(category => category?.id))
  const category = required(values, 'category')
  if (!categoryIds.has(category)) {
    fail(`未知分类“${category}”。可用分类：${[...categoryIds].join(', ')}`)
  }

  const added = (values.get('added') ?? new Date().toISOString().slice(0, 10)).trim()
  if (!isIsoDate(added)) fail('--added 必须是 YYYY-MM-DD 格式的有效日期')

  const entry = {
    $schema: '../schema/plugin.schema.json',
    id,
    name,
    // repository 始终是由 ID 前两段推导的仓库根 URL；子目录路径只存在于 id 中。
    repository: `https://github.com/${owner}/${repositoryName}`,
    category,
    description: {
      en: validateDescription(required(values, 'description-en'), '英文'),
      zh: validateDescription(required(values, 'description-zh'), '中文'),
```

</details>

**依据 4 · 源码核查**：[skills/submit-dsh-plugin/scripts/create-catalog-entry.mjs:157-188](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/skills/submit-dsh-plugin/scripts/create-catalog-entry.mjs#L157-L188)

重复ID/dry-run/wx落盘。

<details>
<summary>查看原文（32行）</summary>

```text
  let existingFiles
  try {
    existingFiles = (await readdir(pluginsDirectory)).filter(file => file.endsWith('.json'))
  } catch (error) {
    fail(`无法读取 ${pluginsDirectory}：${error instanceof Error ? error.message : String(error)}`)
  }
  // 唯一性按完整 ID（不区分大小写）判断：同一仓库允许以不同子目录路径
  // 出现在多个条目中，因此不做仓库级别的重复拦截。
  for (const file of existingFiles) {
    const existing = await readJson(path.join(pluginsDirectory, file))
    if (existing?.id?.toLocaleLowerCase('en-US') === id.toLocaleLowerCase('en-US')) {
      fail(`插件 ID 已存在于 catalog/plugins/${file}`)
    }
  }

  const relativeTarget = path.posix.join('catalog/plugins', pluginFileName(id))
  const target = path.join(root, relativeTarget)
  const serialized = `${JSON.stringify(entry, null, 2)}\n`
  if (dryRun) {
    console.log(serialized.trimEnd())
    console.error(`试运行：将创建 ${relativeTarget}`)
    return
  }

  await mkdir(pluginsDirectory, { recursive: true })
  try {
    await writeFile(target, serialized, { flag: 'wx' })
  } catch (error) {
    if (error?.code === 'EEXIST') fail(`拒绝覆盖 ${relativeTarget}`)
    throw error
  }
  console.log(`已创建 ${relativeTarget}`)
```

</details>

**依据 5 · 源码核查**：[.github/workflows/plugin-review.yml:28-62](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/.github/workflows/plugin-review.yml#L28-L62)

可信reviewer和PR数据分离。

<details>
<summary>查看原文（35行）</summary>

```text
      - name: Check out trusted reviewer
        uses: actions/checkout@v4
        with:
          # The base BRANCH, not the event's base.sha. base.sha is frozen at the
          # revision main had when the pull request was opened, and reopening
          # does not refresh it — pinning to it means a fix to this reviewer can
          # never reach a pull request that was opened before the fix landed.
          ref: ${{ github.event.pull_request.base.ref }}
          path: reviewer
          persist-credentials: false
      - name: Check out submitted files as data
        uses: actions/checkout@v4
        with:
          # checkout's fork guard exists to stop pull_request_target workflows
          # from RUNNING fork code in a trusted context. This job never executes
          # anything from this checkout: every script comes from the base-branch
          # "reviewer" checkout above, this path is only parsed as data, and
          # persist-credentials is off. Removing this opt-in makes every fork PR
          # fail here, before the reviewer can run or comment.
          allow-unsafe-pr-checkout: true
          repository: ${{ github.event.pull_request.head.repo.full_name }}
          ref: ${{ github.event.pull_request.head.sha }}
          path: submission
          persist-credentials: false
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Check submitted files and DeepSeek Harness plugin manifest
        id: review
        run: node reviewer/scripts/review-plugin-submission.mjs
        env:
          GITHUB_TOKEN: ${{ github.token }}
          PLUGIN_REVIEW_REPOSITORY: ${{ github.repository }}
          PLUGIN_REVIEW_PULL_NUMBER: ${{ github.event.pull_request.number }}
          PLUGIN_REVIEW_ROOT: ${{ github.workspace }}/submission
```

</details>

**依据 6 · 源码核查**：[scripts/review-plugin-submission.mjs:343-383](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/review-plugin-submission.mjs#L343-L383)

变更分类/普通文件。

<details>
<summary>查看原文（41行）</summary>

```text
export function validateSubmissionChanges(changes) {
  if (changes.length === 0) {
    throw new Error(`Plugin submission PRs must change at least one ${catalogPrefix}*.json file`)
  }

  const problems = []
  const reviewables = []
  const deletions = []
  let additions = 0
  for (const change of changes) {
    // git reports rename/copy statuses with a similarity score (R100, C75).
    const status = change.status[0]
    const paths = change.oldPath === undefined ? [change.file] : [change.oldPath, change.file]
    if (!['A', 'M', 'D', 'R', 'C'].includes(status)) {
      problems.push(`unsupported change: ${describeChange(change)}`)
      continue
    }
    if (!paths.every(candidate => catalogFilePattern.test(candidate))) {
      problems.push(`unexpected change: ${describeChange(change)}`)
      continue
    }
    if (status === 'D') deletions.push(change.file)
    else reviewables.push(change.file)
    if (status === 'A') additions += 1
  }
  if (problems.length > 0) {
    throw new Error([
      `Plugin submission PRs may only add, modify, or delete ${catalogPrefix}*.json files.`,
      ...problems,
    ].join('\n'))
  }

  const verdict = changes.length === 1 && additions === 1 ? 'auto-merge' : 'manual-review'
  return { verdict, reviewables, deletions, changes }
}

export async function readCatalogEntry(rootDirectory, file) {
  const target = path.join(rootDirectory, file)
  const metadata = await lstat(target)
  assert(metadata.isFile(), `${file} must be a regular file`)
  return JSON.parse(await readFile(target, 'utf8'))
```

</details>

**依据 7 · 源码核查**：[scripts/review-plugin-submission.mjs:416-440](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/review-plugin-submission.mjs#L416-L440)

main真实分类/校验/调用仓审查。

<details>
<summary>查看原文（25行）</summary>

```text
    const changes = repository === undefined && pullNumber === undefined
      ? changedFiles(base, head)
      : await pullRequestChanges(repository, pullNumber, client)
    const submission = validateSubmissionChanges(changes)
    // Read the category allow-list from the trusted checkout this script was
    // loaded from, never from the submitted tree: it decides which categories a
    // submission may claim, so it must not be attacker-controlled.
    const categories = JSON.parse(await readFile(path.join(scriptRoot, 'catalog/categories.json'), 'utf8'))
    const categoryIds = new Set(categories?.categories?.map(category => category?.id))
    // Upstream's change-set loop stays; the install-availability note rides
    // along per reviewed entry and is reported, never enforced. The git
    // classification is logged for the record — installs are npm-only, so it
    // no longer reaches the author-facing comment.
    const advisories = []
    for (const target of submission.reviewables) {
      file = target
      const entry = await readCatalogEntry(root, target)
      validateCatalogEntry(entry, target, categoryIds)
      const result = await reviewRepository(entry, client)
      const { code, requiresBuildAllowance } = result.gitInstall
      console.log(
        `PASS ${entry.id}: ${result.packagePath} -> ${result.patchPath}`
        + ` [git-install: ${code}${requiresBuildAllowance ? ', requires build allowance' : ''}]`,
      )
      advisories.push(`**${entry.id}** — ${installAvailabilityAdvisory(result.packageName)}`)
```

</details>

**依据 8 · 源码核查**：[scripts/review-plugin-submission.mjs:291-312](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/review-plugin-submission.mjs#L291-L312)

插件默认分支tree固定读取并拒truncated。

<details>
<summary>查看原文（22行）</summary>

```text
export async function reviewRepository(entry, client) {
  if (!isObject(entry) || typeof entry.id !== 'string' || typeof entry.repository !== 'string') {
    throw new Error('Catalog entry must contain string id and repository fields')
  }
  if (entry.repository !== repositoryUrl(entry.id)) {
    throw new Error(`repository must be ${repositoryUrl(entry.id)}`)
  }

  const { owner, repository, subPath } = repositoryParts(entry.id)
  const base = `/repos/${owner}/${repository}`
  const metadata = await client.request(base)
  if (typeof metadata.default_branch !== 'string' || metadata.default_branch.length === 0) {
    throw new Error('Repository has no default branch')
  }
  const commit = await client.request(`${base}/commits/${encodeURIComponent(metadata.default_branch)}`)
  const treeSha = commit?.commit?.tree?.sha
  if (typeof treeSha !== 'string') throw new Error('Default branch commit has no tree')
  const tree = await client.request(`${base}/git/trees/${treeSha}?recursive=1`)
  if (!Array.isArray(tree.tree)) throw new Error('Repository tree is unavailable')
  if (tree.truncated === true) throw new Error('Repository tree is too large to inspect completely')

  return findHarnessBundle(tree.tree, sha => client.request(`${base}/git/blobs/${sha}`), subPath)
```

</details>

**依据 9 · 源码核查**：[scripts/review-plugin-submission.mjs:131-180](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/review-plugin-submission.mjs#L131-L180)

子目录和manifest/patch存在，分类非拒绝。

<details>
<summary>查看原文（50行）</summary>

```text
  const packages = requiredPackagePath === undefined
    ? allPackages
    : allPackages.filter(item => item.path === requiredPackagePath)

  if (packages.length === 0) {
    if (requiredPackagePath !== undefined) {
      const declared = allPackages.map(item => item.path)
      throw new Error([
        `Repository has no ${requiredPackagePath}; the id's subdirectory path must contain the plugin's package.json.`,
        ...(declared.length > 0 ? [`package.json files found: ${declared.slice(0, 20).join(', ')}`] : []),
      ].join('\n'))
    }
    throw new Error('Repository contains no package.json')
  }

  const invalidBundles = []
  for (const packageFile of packages) {
    let manifest
    try {
      manifest = JSON.parse(decodeBlob(await readBlob(packageFile.sha), packageFile.path))
    } catch (error) {
      invalidBundles.push(`${packageFile.path}: ${error instanceof Error ? error.message : String(error)}`)
      continue
    }

    const bundle = isObject(manifest) && isObject(manifest.dsh) && isObject(manifest.dsh.bundle)
      ? manifest.dsh.bundle
      : undefined
    if (bundle === undefined) continue
    if (typeof bundle.patch !== 'string' || bundle.patch.trim().length === 0) {
      invalidBundles.push(`${packageFile.path}: dsh.bundle.patch must be a non-empty string`)
      continue
    }

    try {
      const patchPath = resolvePatchPath(packageFile.path, bundle.patch.trim())
      if (!files.has(patchPath)) {
        invalidBundles.push(`${packageFile.path}: dsh.bundle.patch does not exist: ${patchPath}`)
        continue
      }
      // Classification never rejects: the entry point being unobtainable is a
      // recorded label, not grounds for refusing the submission. Bundle
      // selection therefore stays independent of the verdict — the first
      // manifest declaring dsh.bundle wins, matching what the website's
      // crawler picks for the same repository.
      const gitInstall = classifyGitInstall(packageFile.path, manifest, files)
      return {
        packagePath: packageFile.path,
        patchPath,
        packageName: typeof manifest.name === 'string' ? manifest.name : undefined,
```

</details>

**依据 10 · 源码核查**：[.github/workflows/plugin-review.yml:65-94](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/.github/workflows/plugin-review.yml#L65-L94)

自动合并条件及预期head注入。

<details>
<summary>查看原文（30行）</summary>

```text
    needs: static-review
    # Only the single-new-entry fast path is merged automatically. Modification
    # and deletion PRs pass static review with verdict=manual-review and MUST be
    # merged by a maintainer by hand.
    if: ${{ !github.event.pull_request.draft && needs.static-review.outputs.verdict == 'auto-merge' }}
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: write
      actions: write
    steps:
      - name: Check out trusted merger
        uses: actions/checkout@v4
        with:
          # Same reasoning as the reviewer checkout above: always the latest
          # trusted revision of the base branch, never the frozen base.sha.
          ref: ${{ github.event.pull_request.base.ref }}
          path: reviewer
          persist-credentials: false
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Squash-merge the validated head
        run: node reviewer/scripts/merge-plugin-submission.mjs
        env:
          GITHUB_TOKEN: ${{ github.token }}
          PLUGIN_REVIEW_REPOSITORY: ${{ github.repository }}
          PLUGIN_REVIEW_PULL_NUMBER: ${{ github.event.pull_request.number }}
          PLUGIN_REVIEW_EXPECTED_HEAD_SHA: ${{ github.event.pull_request.head.sha }}
          PLUGIN_REVIEW_EXPECTED_BASE_REF: main
```

</details>

**依据 11 · 源码核查**：[scripts/merge-plugin-submission.mjs:17-44](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/merge-plugin-submission.mjs#L17-L44)

真实重读/过期跳过/sha绑定merge。

<details>
<summary>查看原文（28行）</summary>

```text
export async function mergeValidatedSubmission({
  repository,
  pullNumber,
  expectedHeadSha,
  expectedBaseRef,
  client,
}) {
  validateInputs(repository, pullNumber, expectedHeadSha, expectedBaseRef)
  const apiPath = `/repos/${repository}/pulls/${pullNumber}`
  const pull = await client.request(apiPath)

  if (pull?.merged === true) return { status: 'already-merged' }
  if (pull?.state !== 'open') throw new Error(`Pull request #${pullNumber} is not open`)
  if (pull?.base?.ref !== expectedBaseRef) {
    throw new Error(`Pull request #${pullNumber} targets ${pull?.base?.ref ?? 'an unknown branch'} instead of ${expectedBaseRef}`)
  }
  if (pull?.head?.sha !== expectedHeadSha) {
    return { status: 'stale', currentHeadSha: pull?.head?.sha }
  }

  const result = await client.request(`${apiPath}/merge`, {
    method: 'PUT',
    body: JSON.stringify({ sha: expectedHeadSha, merge_method: 'squash' }),
  })
  if (result?.merged !== true) {
    throw new Error(`GitHub refused to merge pull request #${pullNumber}: ${result?.message ?? 'unknown reason'}`)
  }
  return { status: 'merged', sha: result.sha }
```

</details>

**依据 12 · 源码核查**：[.github/workflows/plugin-review.yml:99-104](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/.github/workflows/plugin-review.yml#L99-L104)

真实dispatch同步接线。

```text
      # reaches D1 and the README without waiting for the daily cron.
      - name: Chain catalog sync after the merge
        run: gh workflow run catalog-sync.yml --repo "$GH_REPO"
        env:
          GH_TOKEN: ${{ github.token }}
          GH_REPO: ${{ github.repository }}
```

#### 缺口

- 未运行Skill/CI、模拟头部竞争或核GitHub保护配置；外部插件最小功能未验。
  **影响**：源码权限/版本门槛不等已成功收录或插件安全，目录head一致不能替代插件工件身份与行为。
  **进一步探讨**：用干净测试目录先生成/校验，不提交；另在获授权测试PR验证范围、旧head跳过和manual分支，再核固定插件工件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 从合并到数据库和README的成功/失败边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

sync主函数读取/验证目录与分类，构造github_ci POST body；dry-run仅打印。非dry需要CATALOG_SYNC_TOKEN，真实post带Bearer，要求HTTP成功、JSON且ok=true，否则抛错；这证明客户端收到ack，不是独立查过外部D1事务或整链原子性。workflow重试最多20次再构建README，注释称endpoint幂等upsert；Worker在姊妹仓未核，不能只凭此承诺未知结果重试无重复或已完全回滚。分类约束还明确需要两仓手动保持一致。

README并非简单从本仓JSON直接拼接：build-readme从线上api/v2/plugins分页，要求同一generatedAt、计数=total、id唯一，否则换排序键重试；仅v2未部署404才回退registry/legacy，拒被截断的registry和零条退化结果。成功main生成双语文本；--check真正将当前文件与预期内容比较，不同于只parse格式，正常则写文件。workflow POST→读取远端API→刷新README并提交，可能一段成功后一段失败，不能把合并、HTTP ack、快照一致或生成成功当所有候选已可安装。远端topic自动发现还会进入目录，PR门槛不覆盖每条。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/sync-catalog.mjs:40-70](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/sync-catalog.mjs#L40-L70)

body/令牌/dry-run配置。

<details>
<summary>查看原文（31行）</summary>

```text
export function buildSyncBody(entries, categories) {
  const body = { source: 'github_ci' }
  if (categories !== undefined) {
    assert(Array.isArray(categories) && categories.length > 0 && categories.length <= 200, 'categories must be a list of 1 to 200 entries')
    body.categories = categories.map(syncCategory)
    assert(new Set(body.categories.map(category => category.id)).size === body.categories.length, 'category ids must be unique')
  }
  body.entries = entries.map(entry => ({
    id: entry.id,
    name: entry.name,
    repository: entry.repository,
    category: entry.category,
    description: {
      en: entry.description.en,
      zh: entry.description.zh,
    },
    added: entry.added,
  }))
  return body
}

export function resolveSyncConfig(env, options = {}) {
  const url = env.CATALOG_SYNC_URL !== undefined && env.CATALOG_SYNC_URL.length > 0
    ? env.CATALOG_SYNC_URL
    : defaultSyncUrl
  if (options.dryRun === true) return { url, token: undefined }
  const token = env.CATALOG_SYNC_TOKEN
  if (typeof token !== 'string' || token.trim().length === 0) {
    throw new Error('CATALOG_SYNC_TOKEN is not set. Configure the repository secret (or export the variable) before running catalog:sync, or pass --dry-run to preview the request body.')
  }
  return { url, token: token.trim() }
```

</details>

**依据 2 · 源码核查**：[scripts/sync-catalog.mjs:73-97](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/sync-catalog.mjs#L73-L97)

真实POST和ack判定。

<details>
<summary>查看原文（25行）</summary>

```text
export async function postCatalogSync({ url, token, body, fetchImplementation = globalThis.fetch }) {
  assert(typeof fetchImplementation === 'function', 'A fetch implementation is required')
  const response = await fetchImplementation(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'dsh-1024store-catalog-sync',
    },
    body: JSON.stringify(body),
  })
  const detail = await response.text()
  if (!response.ok) {
    throw new Error(`Catalog sync failed: HTTP ${response.status} for ${url}: ${detail.slice(0, 500)}`)
  }
  let result
  try {
    result = JSON.parse(detail)
  } catch {
    throw new Error(`Catalog sync returned a non-JSON response: ${detail.slice(0, 200)}`)
  }
  if (result?.ok !== true) {
    throw new Error(`Catalog sync was not acknowledged: ${detail.slice(0, 500)}`)
  }
  return result
```

</details>

**依据 3 · 源码核查**：[scripts/sync-catalog.mjs:140-151](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/sync-catalog.mjs#L140-L151)

实际调用路径。

<details>
<summary>查看原文（12行）</summary>

```text
  const categories = await readCategories(options.root)
  const entries = await loadCatalogEntries(options.root, categoryIdSet(categories))
  const body = buildSyncBody(entries, categories)
  if (options.dryRun) {
    process.stdout.write(`${JSON.stringify(body, null, 2)}\n`)
    console.error(`Dry run: validated ${entries.length} entries and ${categories.length} categories; nothing was sent.`)
    return
  }
  const { url, token } = resolveSyncConfig(process.env)
  const result = await postCatalogSync({ url, token, body })
  const acknowledgedCategories = result.categories === undefined ? '' : `, categories=${result.categories}`
  console.log(`Synced ${entries.length} catalog entries and ${categories.length} categories to ${url}: total=${result.total ?? 'unknown'}${acknowledgedCategories}, removedSources=${result.removedSources ?? 'unknown'}`)
```

</details>

**依据 4 · 源码核查**：[.github/workflows/catalog-sync.yml:68-90](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/.github/workflows/catalog-sync.yml#L68-L90)

最多20次重试后建README，服务端幂等仅注释。

<details>
<summary>查看原文（23行）</summary>

```text
      - name: Sync catalog entries to the D1 catalog
        env:
          CATALOG_SYNC_TOKEN: ${{ secrets.CATALOG_SYNC_TOKEN }}
        run: |
          if [ -z "$CATALOG_SYNC_TOKEN" ]; then
            echo "::error::The CATALOG_SYNC_TOKEN repository secret is not configured. Catalog entries were NOT synced to production. Create the secret with the Worker's CATALOG_SYNC_TOKEN value."
            exit 1
          fi
          # Retry with backoff: the Worker is deployed manually from the dsh-1024store
          # repository, so this run may race a deploy that is still rolling out (or,
          # on first rollout, land before the Worker or its secret exists). The
          # endpoint is an idempotent upsert reconciliation, so retries are safe.
          for attempt in $(seq 1 20); do
            if npm run catalog:sync; then
              exit 0
            fi
            echo "Catalog sync attempt ${attempt} failed; retrying in 30s (a Worker deploy may still be rolling out)."
            sleep 30
          done
          echo "::error::Catalog sync failed after 20 attempts."
          exit 1
      - name: Rebuild the README projections from the catalog API
        run: npm run readme:build
```

</details>

**依据 5 · 源码核查**：[scripts/sync-catalog.mjs:20-25](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/sync-catalog.mjs#L20-L25)

跨仓校验手动同步边界。

```text
// Mirrors parseSyncCategories in web/worker/app.ts of the dsh-1024store
// repository — the endpoint rejects the WHOLE sync on any violation, so a
// malformed categories.json must fail loudly here instead of turning the
// daily sync red. Keep the two validators aligned by hand (no CI spans the
// repos): ids /^[a-z][a-z0-9-]{0,39}$/ and unique, `unclassified` reserved,
// order an integer in [0, 1000000], labels 1..120 chars, list 1..200 items.
```

**依据 6 · 源码核查**：[scripts/build-readme.mjs:113-156](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/build-readme.mjs#L113-L156)

分页快照/total/重复id真实验证。

<details>
<summary>查看原文（44行）</summary>

```text
async function loadPagedCatalog(fetchImplementation, base, retryDelayMs = v2SweepRetryDelayMs) {
  let lastError = null
  for (const [attempt, sort] of v2SweepSorts.entries()) {
    if (attempt > 0 && retryDelayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, retryDelayMs))
    }
    const firstResponse = await fetchImplementation(v2PageUrl(base, sort, 1))
    if (firstResponse.status === 404) return null
    if (!firstResponse.ok) {
      lastError = new Error(`GET ${base}/api/v2/plugins failed: HTTP ${firstResponse.status}`)
      continue
    }
    const first = JSON.parse(await firstResponse.text())
    assert(
      isObject(first) && Array.isArray(first.plugins)
        && Number.isInteger(first.totalPages) && first.totalPages >= 1
        && Number.isInteger(first.total) && typeof first.generatedAt === 'string',
      'The /api/v2/plugins response is missing its pagination metadata',
    )
    const plugins = [...first.plugins]
    let attemptError = null
    for (let page = 2; page <= first.totalPages; page += 1) {
      const response = await fetchImplementation(v2PageUrl(base, sort, page))
      if (!response.ok) {
        attemptError = new Error(`GET ${base}/api/v2/plugins page ${page} failed: HTTP ${response.status}`)
        break
      }
      const body = JSON.parse(await response.text())
      if (!isObject(body) || !Array.isArray(body.plugins) || body.generatedAt !== first.generatedAt) {
        attemptError = new Error('The catalog snapshot rotated while paging /api/v2/plugins; the sweep was inconsistent')
        break
      }
      plugins.push(...body.plugins)
    }
    if (attemptError === null) {
      const ids = new Set(plugins.map(plugin => (isObject(plugin) ? plugin.id : undefined)))
      if (plugins.length === first.total && ids.size === plugins.length) {
        return normalizeRegistry({ updated: first.generatedAt, plugins })
      }
      attemptError = new Error('The /api/v2/plugins sweep did not add up to the advertised catalog total')
    }
    lastError = attemptError
  }
  throw lastError
```

</details>

**依据 7 · 源码核查**：[scripts/build-readme.mjs:159-179](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/build-readme.mjs#L159-L179)

明确404回退。

<details>
<summary>查看原文（21行）</summary>

```text
export async function loadRegistry(options = {}) {
  if (options.fromFile !== undefined) {
    return detectRegistryShape(JSON.parse(await readFile(options.fromFile, 'utf8')))
  }
  const fetchImplementation = options.fetchImplementation ?? globalThis.fetch
  const base = (options.base ?? defaultBase).replace(/\/+$/, '')
  const paged = await loadPagedCatalog(fetchImplementation, base, options.retryDelayMs)
  if (paged !== null) return paged
  // v2 not deployed yet: the original bootstrap chain. normalizeRegistry
  // refuses a capped registry response (total larger than the entries served)
  // instead of silently shrinking the README to the cap.
  const registryResponse = await fetchImplementation(`${base}/api/v1/registry`)
  if (registryResponse.ok) {
    return normalizeRegistry(JSON.parse(await registryResponse.text()))
  }
  if (registryResponse.status !== 404) {
    throw new Error(`GET ${base}/api/v1/registry failed: HTTP ${registryResponse.status}`)
  }
  const legacyResponse = await fetchImplementation(`${base}/plugins.json`)
  if (!legacyResponse.ok) {
    throw new Error(`GET ${base}/plugins.json fallback failed: HTTP ${legacyResponse.status}`)
```

</details>

**依据 8 · 源码核查**：[scripts/build-readme.mjs:51-61](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/build-readme.mjs#L51-L61)

拒截断registry。

<details>
<summary>查看原文（11行）</summary>

```text
export function normalizeRegistry(data) {
  assert(isObject(data) && Array.isArray(data.plugins), 'Registry response must contain a plugins array')
  // A capped /api/v1/registry response advertises the full catalog size in
  // `total` while serving only its install-ranked head. Regenerating from it —
  // over the network or via --from-file — would silently shrink the README to
  // the cap, so it is refused here, in the one place every registry-shaped
  // payload passes through.
  assert(
    typeof data.total !== 'number' || data.total <= data.plugins.length,
    'The registry payload is capped and cannot rebuild the README; use a full-catalog source such as /api/v2/plugins',
  )
```

</details>

**依据 9 · 源码核查**：[scripts/build-readme.mjs:674-699](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/build-readme.mjs#L674-L699)

拒零/生成/字节比较/写文件。

<details>
<summary>查看原文（26行）</summary>

```text
  const categories = await readCategories(options.root)
  const registry = await loadRegistry(options)
  assert(
    registry.plugins.length > 0,
    'Registry returned 0 plugins; refusing to regenerate README projections from a degenerate snapshot.',
  )
  const files = await buildReadmeFiles(registry, categories)

  if (options.check) {
    const stale = []
    for (const [relative, content] of Object.entries(files)) {
      const existing = await readFile(path.join(options.root, relative), 'utf8').catch(() => '')
      if (existing !== content) stale.push(relative)
    }
    if (stale.length > 0) {
      console.error(`Stale generated files: ${stale.join(', ')}. Run npm run readme:build.`)
      process.exitCode = 1
      return
    }
    console.log('README projections are up to date.')
    return
  }

  for (const [relative, content] of Object.entries(files)) {
    await writeFile(path.join(options.root, relative), content)
    console.log(`Wrote ${relative} (${registry.plugins.length} plugins, updated ${registry.updated})`)
```

</details>

**依据 10 · 源码核查**：[README.md:3-9](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/README.md#L3-L9)

目录含自动发现，非全项同等PR校验。

```text
<!-- 本文件由 scripts/build-readme.mjs 从 deepseek1024.com 目录 API 自动生成，请勿手工编辑。 -->

面向 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness)（`dsh`）生态的社区插件目录，共收录 **13896** 个插件（含 PR 收录与 GitHub `dsh-plugin` topic 自动发现），目录数据更新于 2026-10-29。

> 📦 **仓库拆分公告**：自 2026-08-25 起，deepseek1024.com 网站与 `dsh1024` CLI 的源码已拆分至独立仓库 [imsai-sh/dsh-1024store](https://github.com/imsai-sh/dsh-1024store)。本仓库从此专注插件目录（awesome 清单）与收录流程；网站与 CLI 相关的 issue / PR 请移步新仓库，插件收录照旧在这里提交。

**但这个项目不只是一份 awesome list。** 它还包括一个在线插件市场、一个把市场装进 `dsh` 本体的插件，以及一套免费的公开查询 API——这些应用代码开源在姊妹仓库 [dsh-1024store](https://github.com/imsai-sh/dsh-1024store)；本仓库专注目录本身：经静态校验的 PR 收录流水线与自动生成的目录 README，目录数据另有自动收集服务持续喂入。全部代码 MIT 协议，fork 之后就能部署成你自己的插件市场。
```

#### 缺口

- 未核Worker事务/幂等或真实部署、API旧缓存/同步后断连及推送失败恢复。
  **影响**：不能保证一次PR自动出现在所有表面，或对未确认POST直接重试就无副作用。
  **进一步探讨**：定向核固定Worker的写入/幂等协议，再模拟提交已成功但响应丢失、分页旋转/截断和README推送失败，对账后恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁适合有限试用，四阶段成本和退出在哪里？

**研究主题**：效果与总成本、采用判断

#### 完整回答

可先让愿审元数据和授权范围的插件作者/维护者试一个本地JSON收录准备，用户仅把目录当候选发现。首次需Node22+/npm10+、干净工作区、GitHub读权限；真正fork/push/PR另需明确授权，符合条件新增会自动合并不是长期草稿。维护同步还需Worker、共享令牌、部署/写权限和远端API；包本身private不等整套服务免费或无需运营。

持续有GitHub查询/分页API、Actions runner、外部Worker/数据库/截图与双语投影维护，所选插件模型/服务费用另算。失败区分JSON未写、审查拒、旧head跳过、merge已成而sync未知、远端已写而README失败，保留commit和响应先核现状，不盲目再发PR或post。退出准备可删未提交JSON/撤授权；已合并条目需后续修改/删除PR人工核，远端数据库与已装插件/遥测/凭据分开，不把删除源记录等同全局回滚。实际金额与工时未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:22-26](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/package.json#L22-L26)

维护运行时。

```text
  "engines": {
    "node": ">=22",
    "npm": ">=10"
  }
}
```

**依据 2 · 源码核查**：[skills/submit-dsh-plugin/SKILL.md:8-15](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/skills/submit-dsh-plugin/SKILL.md#L8-L15)

本地/发布授权与自动合并边界。

```text
从插件作者的仓库准备一份聚焦的目录收录 PR。始终把 `catalog/plugins/*.json` 视为贡献者唯一可以编辑的目录源数据。

## 安全与范围

- 不得在插件提交 PR 中编辑 `README.md`、`catalog/README.md`、工作流或脚本。两个 README 是 bot 生成的目录投影，合并后由 CI 自动刷新。
- 不得仅为了检查插件而安装依赖、运行生命周期脚本、构建或执行插件代码。运行作者代码前必须先征得同意。
- 保留所有无关的本地改动。如果目录仓库工作区不干净，应停止操作；除非用户指定一个干净 worktree，或明确界定现有改动的范围。
- 将“准备”或“起草”理解为仅做本地修改。只有用户明确要求“提交”“推送”或“创建 PR”时，才视为已授权在展示准确目标后执行 fork、push 和创建 PR。
```

**依据 3 · 源码核查**：[skills/submit-dsh-plugin/SKILL.md:113-129](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/skills/submit-dsh-plugin/SKILL.md#L113-L129)

推送授权/跟进检查，不替代安全。

<details>
<summary>查看原文（17行）</summary>

```text
推送前，说明 fork、分支、上游仓库和唯一暂存的文件。只有获得授权后才可推送并创建 PR。

使用 [references/submission-reference.md](references/submission-reference.md) 中的模板编写 PR，填写真实的测试命令和结果，并保持“允许维护者修改”开启。
仓库根 PR 模板只包含插件与目录提交确认清单，逐项如实完成即可。

## 7. 跟进自动检查

创建 PR 后：

1. 返回 PR URL。
2. 检查 `Plugin submission review / static-review` 及其机器人评论。
3. 如果检查失败，PR 会保持打开且不会被工作流自动关闭；仅通过修改目录 JSON 修复。不得为了通过检查而加入 README 或其他生成投影。
4. 非草稿新增类 PR 检查通过后会自动 squash merge，GitHub 随后将其记录为已合并（因此不再保持打开）；草稿 PR 会在标记 ready for review 后重新检查并自动合并。
5. 修改或删除既有条目的 PR 检查通过后，机器人会评论说明需要维护者人工审核；此时无须任何贡献者操作，等待维护者手动合并即可，不要催促或自行合并。
6. 不要请求维护者批准 fork CI，也不要手动合并；目录 PR 不运行贡献者分支上的通用 CI。

静态审查通过即表示该目录元数据符合收录规则；新增类 PR 随之触发自动合并，修改/删除类 PR 则进入维护者人工审核。合并进入 `main` 后，catalog-sync 工作流会自动把条目同步到线上目录数据库并刷新 `README.md` 与 `catalog/README.md`（github-actions[bot] 提交），插件随即出现在 [deepseek1024.com](https://deepseek1024.com/) 与两个 README 目录中。该结果仍不代表对第三方插件行为、安全性或质量的背书。
```

</details>

**依据 4 · 源码核查**：[scripts/merge-plugin-submission.mjs:28-44](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/merge-plugin-submission.mjs#L28-L44)

已合并/过期/成功路径有别。

<details>
<summary>查看原文（17行）</summary>

```text
  if (pull?.merged === true) return { status: 'already-merged' }
  if (pull?.state !== 'open') throw new Error(`Pull request #${pullNumber} is not open`)
  if (pull?.base?.ref !== expectedBaseRef) {
    throw new Error(`Pull request #${pullNumber} targets ${pull?.base?.ref ?? 'an unknown branch'} instead of ${expectedBaseRef}`)
  }
  if (pull?.head?.sha !== expectedHeadSha) {
    return { status: 'stale', currentHeadSha: pull?.head?.sha }
  }

  const result = await client.request(`${apiPath}/merge`, {
    method: 'PUT',
    body: JSON.stringify({ sha: expectedHeadSha, merge_method: 'squash' }),
  })
  if (result?.merged !== true) {
    throw new Error(`GitHub refused to merge pull request #${pullNumber}: ${result?.message ?? 'unknown reason'}`)
  }
  return { status: 'merged', sha: result.sha }
```

</details>

**依据 5 · 源码核查**：[scripts/sync-catalog.mjs:61-97](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/sync-catalog.mjs#L61-L97)

令牌/外部写入及未确认失败。

<details>
<summary>查看原文（37行）</summary>

```text
export function resolveSyncConfig(env, options = {}) {
  const url = env.CATALOG_SYNC_URL !== undefined && env.CATALOG_SYNC_URL.length > 0
    ? env.CATALOG_SYNC_URL
    : defaultSyncUrl
  if (options.dryRun === true) return { url, token: undefined }
  const token = env.CATALOG_SYNC_TOKEN
  if (typeof token !== 'string' || token.trim().length === 0) {
    throw new Error('CATALOG_SYNC_TOKEN is not set. Configure the repository secret (or export the variable) before running catalog:sync, or pass --dry-run to preview the request body.')
  }
  return { url, token: token.trim() }
}

export async function postCatalogSync({ url, token, body, fetchImplementation = globalThis.fetch }) {
  assert(typeof fetchImplementation === 'function', 'A fetch implementation is required')
  const response = await fetchImplementation(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'dsh-1024store-catalog-sync',
    },
    body: JSON.stringify(body),
  })
  const detail = await response.text()
  if (!response.ok) {
    throw new Error(`Catalog sync failed: HTTP ${response.status} for ${url}: ${detail.slice(0, 500)}`)
  }
  let result
  try {
    result = JSON.parse(detail)
  } catch {
    throw new Error(`Catalog sync returned a non-JSON response: ${detail.slice(0, 200)}`)
  }
  if (result?.ok !== true) {
    throw new Error(`Catalog sync was not acknowledged: ${detail.slice(0, 500)}`)
  }
  return result
```

</details>

**依据 6 · 源码核查**：[.github/workflows/catalog-sync.yml:12-26](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/.github/workflows/catalog-sync.yml#L12-L26)

维护者Worker/令牌/写部署密钥条件。

<details>
<summary>查看原文（15行）</summary>

```text
# First-rollout runbook (one-time, BEFORE this workflow can go green):
#   1. Deploy the Worker (source: imsai-sh/dsh-1024store) so /api/v1/catalog/sync
#      and /api/v1/registry exist.
#   2. Set CATALOG_SYNC_TOKEN on the Worker (wrangler secret put CATALOG_SYNC_TOKEN,
#      run from the dsh-1024store checkout) AND as a repository Actions secret here
#      with the same value. Rotating it is a coordinated two-repo change.
#   3. Run this workflow via workflow_dispatch (or wait for the next trigger).
#   The sync step retries for up to ~10 minutes, so a run racing a Worker deploy
#   normally self-heals; a run started before the secrets exist must be re-run.
#
# Branch protection: the final step pushes README commits to main over SSH,
# authenticated by a write deploy key (repository secret CATALOG_DEPLOY_KEY).
# Personal-account rulesets cannot list the GitHub Actions app as a bypass
# actor, so the ruleset's bypass list must include "Deploy keys" instead —
# see CONTRIBUTING.md "Repository owners must protect main".
```

</details>

#### 缺口

- 未测作者首用/维护工时、实际API与部署费用或修改/删除在外部数据库的恢复结果。
  **影响**：不能称一份Skill完成低成本安全发布、删除JSON就撤销所有收录或目录统计代表用户价值。
  **进一步探讨**：先只生成单项并核diff，授权测试PR后逐段记录原件/ack/投影与恢复工时，核撤权和人工删除到外部结果。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 未来需要补的采用证据与现有SHA/快照守卫有何区别？

**研究主题**：新假设与验证

#### 完整回答

当前已有可信审查、目录PR head绑定、dry-run、POST ack和远端分页一致性，不能重复包装为新门禁。未来增量是把“被核插件的固定源码tree/manifest与实际npm版本工件”及最小任务/退出证据绑定到候选状态，明确哪个版本仅静态收录、哪个版本实测过、当前入口是否漂移。目录条目现合同只记仓库/简介/分类日期，PR head SHA也只锁目录变更，尚不足作安装工件证明；这是本轮已核范围的具体缺口，不是泛称整套市场没有验证。

最小对照覆盖子目录同仓兄弟、上游默认分支在审核后变化、源通过而npm未发布、同步ack后投影失败四种固定样本，对照当前人工查阅与绑定证据版本。验错工件/伪兼容/未确认重复操作、真实最小任务成功率及人工核验和维护总工时；不能降低误采或记录维护比收益高则不扩大，先只交版本状态区分，未知项仍可发现而不背书。未实现，不能计当前贡献。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/lib/catalog-entry.mjs:82-103](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/lib/catalog-entry.mjs#L82-L103)

当前精确字段无被核插件SHA/工件版本。

<details>
<summary>查看原文（22行）</summary>

```text
export function validateCatalogEntry(entry, file, categoryIds) {
  const label = file
  assert(isObject(entry), `${label} must contain a JSON object`)
  assertExactKeys(entry, ['$schema', 'id', 'name', 'repository', 'category', 'description', 'added'], label)
  assert(entry.$schema === schemaReference, `${label} must reference ${schemaReference}`)
  // The 201-character cap mirrors the catalog sync endpoint's id bound in
  // web/worker/app.ts (ENTRY_ID) and install-metrics.ts (PLUGIN_ID) of
  // the dsh-1024store repository. Drift means a submission passes review here
  // but the sync endpoint rejects it there.
  assert(typeof entry.id === 'string' && entry.id.length <= 201 && isValidPluginId(entry.id), `${label} has an invalid id`)
  assert(path.posix.basename(file) === pluginFileName(entry.id), `${label} should be named ${pluginFileName(entry.id)}`)
  assert(typeof entry.name === 'string' && entry.name.trim().length > 0 && entry.name.length <= 120, `${label} has an invalid name`)
  assert(entry.repository === repositoryUrl(entry.id), `${label}.repository must be ${repositoryUrl(entry.id)}`)
  assert(categoryIds instanceof Set && categoryIds.has(entry.category), `${label} has an unknown category`)
  assert(isObject(entry.description), `${label}.description must be an object`)
  assertExactKeys(entry.description, ['en', 'zh'], `${label}.description`)
  for (const locale of ['en', 'zh']) {
    const description = entry.description[locale]
    assert(typeof description === 'string' && description.trim().length > 0 && description.length <= 1000, `${label} has an invalid ${locale} description`)
  }
  assert(typeof entry.added === 'string' && isIsoDate(entry.added), `${label} has an invalid added date`)
  return entry
```

</details>

**依据 2 · 源码核查**：[scripts/review-plugin-submission.mjs:299-312](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/review-plugin-submission.mjs#L299-L312)

当前审默认分支tree。

<details>
<summary>查看原文（14行）</summary>

```text
  const { owner, repository, subPath } = repositoryParts(entry.id)
  const base = `/repos/${owner}/${repository}`
  const metadata = await client.request(base)
  if (typeof metadata.default_branch !== 'string' || metadata.default_branch.length === 0) {
    throw new Error('Repository has no default branch')
  }
  const commit = await client.request(`${base}/commits/${encodeURIComponent(metadata.default_branch)}`)
  const treeSha = commit?.commit?.tree?.sha
  if (typeof treeSha !== 'string') throw new Error('Default branch commit has no tree')
  const tree = await client.request(`${base}/git/trees/${treeSha}?recursive=1`)
  if (!Array.isArray(tree.tree)) throw new Error('Repository tree is unavailable')
  if (tree.truncated === true) throw new Error('Repository tree is too large to inspect completely')

  return findHarnessBundle(tree.tree, sha => client.request(`${base}/git/blobs/${sha}`), subPath)
```

</details>

**依据 3 · 源码核查**：[scripts/merge-plugin-submission.mjs:28-39](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/merge-plugin-submission.mjs#L28-L39)

目录PR head保护不等插件工件锁定。

<details>
<summary>查看原文（12行）</summary>

```text
  if (pull?.merged === true) return { status: 'already-merged' }
  if (pull?.state !== 'open') throw new Error(`Pull request #${pullNumber} is not open`)
  if (pull?.base?.ref !== expectedBaseRef) {
    throw new Error(`Pull request #${pullNumber} targets ${pull?.base?.ref ?? 'an unknown branch'} instead of ${expectedBaseRef}`)
  }
  if (pull?.head?.sha !== expectedHeadSha) {
    return { status: 'stale', currentHeadSha: pull?.head?.sha }
  }

  const result = await client.request(`${apiPath}/merge`, {
    method: 'PUT',
    body: JSON.stringify({ sha: expectedHeadSha, merge_method: 'squash' }),
```

</details>

**依据 4 · 源码核查**：[scripts/build-readme.mjs:140-152](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/3d9ab413220f37dccc8a5ec336b0ed3105397b71/scripts/build-readme.mjs#L140-L152)

已有分页一致性不是安装结果。

<details>
<summary>查看原文（13行）</summary>

```text
      const body = JSON.parse(await response.text())
      if (!isObject(body) || !Array.isArray(body.plugins) || body.generatedAt !== first.generatedAt) {
        attemptError = new Error('The catalog snapshot rotated while paging /api/v2/plugins; the sweep was inconsistent')
        break
      }
      plugins.push(...body.plugins)
    }
    if (attemptError === null) {
      const ids = new Set(plugins.map(plugin => (isObject(plugin) ? plugin.id : undefined)))
      if (plugins.length === first.total && ids.size === plugins.length) {
        return normalizeRegistry({ updated: first.generatedAt, plugins })
      }
      attemptError = new Error('The /api/v2/plugins sweep did not add up to the advertised catalog total')
```

</details>

#### 缺口

- 没有绑定证据版或真实作者/安装者对照。
  **影响**：不能把工程收录自动化升级为已验证安全安装市场，或提前认定版本回执产品值钱。
  **进一步探讨**：固定这四类案例及独立最小任务真值，盲核错误/遗漏/重做/总工时，未改善即只修局部传播问题。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
