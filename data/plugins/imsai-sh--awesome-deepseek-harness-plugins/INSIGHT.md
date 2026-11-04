# Awesome DeepSeek Harness Plugins

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[cf05ee2](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/tree/cf05ee29cea08c409c1e13f50925d3566348d03d)

<!-- BEGIN META -->
[![GitHub ★ 359](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=359&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/imsai-sh/awesome-deepseek-harness-plugins)
<!-- END META -->

> **功能**：提供 DeepSeek Harness 社区插件目录、结构化投稿审核与双语目录生成。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明，目录维护者可以用单一条目源数据组织投稿，并把只有一个新增条目的 PR 交给绑定 head 的自动合并流程。实质增量在于让变更范围决定审核分工，并让可浏览条目和安装入口各用自己的判据。低频、单语目录可以保留普通链接表。

> **主要限制**：[Q03](#research-q03) 对采用最重要的限制是 PR 通过仅覆盖 Git 中的目录与补丁结构，npm 工件另有静态判据且作者文档声明不核回链。选择插件前仍需核包归属、版本与宿主行为。[Q04](#research-q04) 另显示同步回执与 README 推送分开，目录提交合并后仍需回读展示。

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
  - [Q01 · 谁通过这个仓库完成什么，和手工链接表相比有什么改变？](#detail-section-11)
  - [Q02 · 从 PR 到可合并如何检查，失败与陈旧状态如何处理？](#detail-section-12)
  - [Q03 · 安装标签依赖什么，能证明哪些事情？](#detail-section-13)
  - [Q04 · 发布和维护需要什么，失败时在哪里核对？](#detail-section-14)
  - [Q05 · 如何验证自动化能减少人工核对而且没有让读者误会？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：插件作者需要提交一条可维护的收录记录，目录维护者要持续审核投稿和生成两份目录，读者可据此定位候选仓库。

手工链接表可以快速满足低频收录；同时维护双语目录和开放投稿时，人工要跨文件校验描述、清单路径与页面状态。普通 GitHub 校验和静态生成器能复现各环节，比较对象是它们的具体组合。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 投稿准备 | 记录完整仓库 ID、分类与双语描述 | 作者仍需确认实际测试和仓库位置 |
| 可信静态审查 | 限制目录差异并校验 Git bundle 结构 | 单新增可自动分流，静态通过仅支持收录 |
| 线上同步与双语投影 | 向 Worker 同步并从目录快照生成文档 | 需要权限、令牌与一致读回 |
| 安装状态区分 | 说明仅浏览或存在 npm 安装入口 | 目录不执行安装和宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node.js 22+、npm 10+ | 本地准备或维护需要 | 运行条目辅助与审核脚本 | 停止并确认目录工具环境 |
| GitHub 读取与受限工作流权限 | PR 审查需要 | 读取提交、插件默认分支和发表评论 | 限制在本地准备并交由维护者核查 |
| Worker 与 Actions 匹配的同步令牌 | 正式同步需要 | 对目录同步端点授权 | 同步失败，独立检查两端配置 |
| 部署密钥和一致的 API 快照 | 回写 README 需要 | 生成并推送双语投影 | 保留旧投影，定位失败阶段 |
| 已核实的 npm 工件和宿主环境 | 实际安装候选需要 | 验证来源、版本及功能 | 仅浏览候选，暂停安装 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 作者核默认分支、插件包路径及双语描述，生成单条记录 | 本地差异只含正确的目录 JSON |
| 审核 | 维护者看可信审查的路径、schema、manifest 和补丁结果 | 新增才考虑自动合并，其他变更人工核对 |
| 发布 | 维护者核对合并提交并观察同步与两份 README | Git、同步应答和读回一致；异常逐环节恢复 |
| 选择 | 读者把安装入口视作静态线索，核包与目标宿主 | 证据不齐则保留候选并暂缓安装 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 部署与 CI 额度未知；隔离准备只需现有工具 | 梳理分类、环境和权限，所需工时未知 | 生产跨 GitHub 与 Worker |
| 持续使用 | CI、API 和数据存储消耗未测 | 审核变更、维护令牌与依赖 | 单新增自动分流；多变更人工 |
| 失败恢复 | 重试与重复生成资源未量化 | 核对 Git、同步日志和页面后再重试 | 真实恢复时延和人工耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 投稿 | 单 JSON 与受限静态审查，改删保留人工权限 | 平均收录时长、规则误拒率 |
| 展示 | 从一致分页快照生成双语目录 | 真实缓存时延与服务可用性 |
| 安装辨识 | 收录和 npm 安装入口分别有判据 | 具体工件的身份、可运行性与安全性 |

> **思考**：[Q03](#research-q03) 对采用最重要的限制是 PR 通过仅覆盖 Git 中的目录与补丁结构，npm 工件另有静态判据且作者文档声明不核回链。选择插件前仍需核包归属、版本与宿主行为。[Q04](#research-q04) 另显示同步回执与 README 推送分开，目录提交合并后仍需回读展示。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明，目录维护者可以用单一条目源数据组织投稿，并把只有一个新增条目的 PR 交给绑定 head 的自动合并流程。实质增量在于让变更范围决定审核分工，并让可浏览条目和安装入口各用自己的判据。低频、单语目录可以保留普通链接表。

[Q02](#research-q02) 的可信审查与目录 head 绑定减少了直接执行投稿脚本和合并错误 head 的风险。[Q04](#research-q04) 的分页一致性校验可拒绝部分目录，但同步回执和投影回推仍有独立失败点。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 对采用最重要的限制是 PR 通过仅覆盖 Git 中的目录与补丁结构，npm 工件另有静态判据且作者文档声明不核回链。选择插件前仍需核包归属、版本与宿主行为。[Q04](#research-q04) 另显示同步回执与 README 推送分开，目录提交合并后仍需回读展示。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先选一个公开且已定位 manifest 的仓库，从干净分支准备单条 JSON，用本地文件或隔离服务检查投影。遇到版本或目录回读不一致时停止同步，并分别核对提交、发布日志和页面。要采用候选插件，应按 [Q03](#research-q03) 单独验收 npm 版本和宿主。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码与作者文档支持目录分层和审核机制；线上服务状态、宿主安装与未来标签的效用尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、docs/repository-layout.md、package.json、.github/workflows/plugin-review.yml、scripts/review-plugin-submission.mjs、scripts/merge-plugin-submission.mjs、docs/plugin-discovery.md、skills/submit-dsh-plugin/SKILL.md、scripts/sync-catalog.mjs、.github/workflows/catalog-sync.yml、scripts/build-readme.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根仓，读取作者说明、审查与合并工作流、默认分支审查、同步客户端、目录生成和提交 Skill。未执行目标脚本或测试，未检查姊妹仓实现、线上 GitHub 规则或真实宿主。目录全量条目未逐个审查。
- 下一步：回放新增、修改、陈旧 head、npm 尚未发布和同步回执失败等样例。逐环节比较本地差异、可信作业、D1 读回及 README，另对授权的具体插件工件做安装、核心功能和退出验收。

**分析版本**

- **仓库**：[imsai-sh/awesome-deepseek-harness-plugins](https://github.com/imsai-sh/awesome-deepseek-harness-plugins)
- **版本号**：0.5.0（[固定提交 cf05ee2](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/tree/cf05ee29cea08c409c1e13f50925d3566348d03d)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可以对照现有标签，将收录依据、可用入口和工件归属证据分别展示，测维护复核次数及读者误判。若错判不降、判断更慢或合法包误判上升，则放弃这一方案；目前未做实验。

回放新增、修改、陈旧 head、npm 尚未发布和同步回执失败等样例。逐环节比较本地差异、可信作业、D1 读回及 README，另对授权的具体插件工件做安装、核心功能和退出验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 6398 | — | — | 160981 |
| .mjs | source | 7 | 1898 | 1455 | 250 | — |
| .mjs | test | 6 | 2006 | 1727 | 137 | — |

</details>

**活跃度**

[![Issue 未关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：目录如何把收录、安装入口和人工审核分开，维护者何时能复用这种分层？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁通过这个仓库完成什么，和手工链接表相比有什么改变？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件作者提交一份结构化条目，维护者按固定规则审核并发布，读者用中英文目录找到候选项目。结构化 JSON 把描述、分类和仓库定位集中在一份源数据上，生成器承担两份 README 的重复编辑。只维护一份少量链接时，手工表更容易搬迁和托管，此方案的增量主要出现在需要重复接收贡献、维护两种语言并与线上目录一致的团队。仓库本身提供维护脚本与提交 Skill，属于目录资源。网站、Worker 与 dsh1024 包位于姊妹仓。固定 README 宣称的收录规模包含 GitHub 自动发现，因而不能当成通过本仓 PR 审查的数量或已可安装数量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-13](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/README.md#L3-L13)

作者区分收录来源和应用代码，生成页面的数量只作当时目录投影。

<details>
<summary>查看原文（11行）</summary>

```text
<!-- 本文件由 scripts/build-readme.mjs 从 deepseek1024.com 目录 API 自动生成，请勿手工编辑。 -->

面向 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness)（`dsh`）生态的社区插件目录，共收录 **13949** 个插件（含 PR 收录与 GitHub `dsh-plugin` topic 自动发现），目录数据更新于 2026-11-04。

> 📦 **仓库拆分公告**：自 2026-08-25 起，deepseek1024.com 网站与 `dsh1024` CLI 的源码已拆分至独立仓库 [imsai-sh/dsh-1024store](https://github.com/imsai-sh/dsh-1024store)。本仓库从此专注插件目录（awesome 清单）与收录流程；网站与 CLI 相关的 issue / PR 请移步新仓库，插件收录照旧在这里提交。

**但这个项目不只是一份 awesome list。** 它还包括一个在线插件市场、一个把市场装进 `dsh` 本体的插件，以及一套免费的公开查询 API——这些应用代码开源在姊妹仓库 [dsh-1024store](https://github.com/imsai-sh/dsh-1024store)；本仓库专注目录本身：经静态校验的 PR 收录流水线与自动生成的目录 README，目录数据另有自动收集服务持续喂入。全部代码 MIT 协议，fork 之后就能部署成你自己的插件市场。

[![DSH 1024Store 插件市场首页](https://raw.githubusercontent.com/imsai-sh/awesome-deepseek-harness-plugins/assets/homepage.zh.png?v=4d2057ec9a77)](https://deepseek1024.com/)

[在线网站](https://deepseek1024.com/) · [API 文档](https://github.com/imsai-sh/dsh-1024store/blob/main/web/docs/api.md) · [英文目录](catalog/README.md) · [提交插件](CONTRIBUTING.md) · [网站与 CLI 源码](https://github.com/imsai-sh/dsh-1024store)
```

</details>

**依据 2 · 作者声明**：[docs/repository-layout.md:12-35](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/docs/repository-layout.md#L12-L35)

说明目录文件、生成投影和外部服务的真相源分工。

<details>
<summary>查看原文（24行）</summary>

```text
## Directory responsibilities

| Path | Responsibility | Generated? |
| --- | --- | --- |
| `catalog/plugins/*.json` | One curated entry per plugin; the submission form of record | No — contributed via PR |
| `catalog/categories.json` | Category definitions: ids, order, bilingual labels (source of truth; pushed to the Worker as data by catalog-sync) | No |
| `catalog/schema/plugin.schema.json` | The JSON Schema submissions validate against | No |
| `catalog/README.md` | English directory projection | Yes — `npm run readme:build` |
| `README.md` | Chinese directory projection | Yes — `npm run readme:build` |
| `scripts/` | Review gate, merge, catalog sync, README generation, homepage capture | No |
| `skills/submit-dsh-plugin/` | The guided submission skill; must track the live spec | No |
| `docs/` | Catalog data-model docs, permanent-URL stubs, and historical plans | No |
| `docs/assets/` | README-referenced assets — `wechat-group.jpg` is embedded by the generated `README.md`; deleting it 404s the QR | No |
| `.github/workflows/` | plugin-review (PR gate + auto-merge), catalog-sync (D1 sync + README refresh), CI (script tests) | No |

## Single sources of truth

| Data | Source of truth |
| --- | --- |
| Curated plugin entries | `catalog/plugins/*.json` here |
| Category definitions | `catalog/categories.json` here (synced into production D1 by this repo's catalog-sync workflow) |
| Live catalog | Production D1, fed by this repo's catalog-sync workflow plus the maintainer's out-of-band collection jobs |
| Directory READMEs | Generated from the live catalog API — never hand-edited |
| Site, API, CLI code | [imsai-sh/dsh-1024store](https://github.com/imsai-sh/dsh-1024store) |
```

</details>

**依据 3 · 源码核查**：[package.json:2-20](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/package.json#L2-L20)

私有根包登记目录维护和验证命令，没有发布原生宿主扩展入口。

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

#### 缺口

- 没有手工维护与自动化的真实工作量样本
  **影响**：无法给出采用所需的提交量或节省时间
  **进一步探讨**：按相同数量和复杂度的条目回放两种维护流程，记录耗时与投影出错率。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从 PR 到可合并如何检查，失败与陈旧状态如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工作流用目标分支中的可信脚本审查提交树，把贡献者 checkout 用于读取数据，并关闭其持久凭据。审查脚本限制变更为平铺目录 JSON，拒绝意外路径，并从可信树读取分类。每个新增或修改条目检查 schema 后，再读取插件仓库默认分支树核对 bundle。只有单个新增、非草稿的 PR 会进入自动合并分支，修改、删除及多文件变更交给维护者。合并脚本重新检查 PR 是否开放、目标分支及预期 head，SHA 漂移时跳过并把该 SHA 传给合并 API。这比只匹配文件名多约束了执行来源和目录 PR 的版本。不过 reviewer 按 PR 编号读取当前文件列表，checkout 绑定事件 head，两次读取有时间差。合并端的 SHA 检查可以阻止直接合入不同 head；它无法冻结插件仓库默认分支，也不证明跨步骤全部读取来自同一个快照。脚本遇到审查错误写 rejected，尝试留言并失败退出。工作流在合并步骤成功退出后调度同步，合并脚本对 stale 和 already-merged 也成功退出，因而调度动作本身不能证明发生新合并。

#### 证据与依据

**依据 1 · 源码核查**：[.github/workflows/plugin-review.yml:27-62](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/.github/workflows/plugin-review.yml#L27-L62)

可信脚本与提交数据分开，固定事件 head，仅执行可信脚本。

<details>
<summary>查看原文（36行）</summary>

```text
    steps:
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

**依据 2 · 源码核查**：[.github/workflows/plugin-review.yml:64-104](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/.github/workflows/plugin-review.yml#L64-L104)

对自动合并分支限制草稿和审核结果，并显式调度后续同步。

<details>
<summary>查看原文（41行）</summary>

```text
  merge:
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
      # Pushes made with the default GITHUB_TOKEN never fire other workflows'
      # push triggers (GitHub's recursion guard), so the squash merge above
      # does NOT start catalog-sync by itself. workflow_dispatch is exempt from
      # that guard — chain the sync explicitly so every auto-merged submission
      # reaches D1 and the README without waiting for the daily cron.
      - name: Chain catalog sync after the merge
        run: gh workflow run catalog-sync.yml --repo "$GH_REPO"
        env:
          GH_TOKEN: ${{ github.token }}
          GH_REPO: ${{ github.repository }}
```

</details>

**依据 3 · 源码核查**：[scripts/review-plugin-submission.mjs:343-383](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/scripts/review-plugin-submission.mjs#L343-L383)

限制平铺 JSON 路径、单新增分流及常规文件。

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

**依据 4 · 源码核查**：[scripts/review-plugin-submission.mjs:408-441](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/scripts/review-plugin-submission.mjs#L408-L441)

实际读取变更、可信分类、schema 和插件默认分支。

<details>
<summary>查看原文（34行）</summary>

```text
async function main() {
  const base = process.env.PLUGIN_REVIEW_BASE_SHA
  const head = process.env.PLUGIN_REVIEW_HEAD_SHA
  const client = createGitHubClient(process.env.GITHUB_TOKEN)
  const repository = process.env.PLUGIN_REVIEW_REPOSITORY
  const pullNumber = process.env.PLUGIN_REVIEW_PULL_NUMBER
  let file = catalogPrefix
  try {
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
    }
```

</details>

**依据 5 · 源码核查**：[scripts/review-plugin-submission.mjs:466-478](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/scripts/review-plugin-submission.mjs#L466-L478)

拒绝路径写明失败并以非零状态退出。

<details>
<summary>查看原文（13行）</summary>

```text
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    publishVerdict('rejected')
    workflowError(file, message)
    console.error(`FAIL ${file}\n${message}`)
    if (repository !== undefined && pullNumber !== undefined) {
      try {
        await upsertReviewComment(repository, pullNumber, client, reviewComment('failed', message))
      } catch (commentError) {
        console.error(`Unable to report the failure on the pull request: ${commentError instanceof Error ? commentError.message : String(commentError)}`)
      }
    }
    process.exitCode = 1
```

</details>

**依据 6 · 源码核查**：[scripts/merge-plugin-submission.mjs:17-44](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/scripts/merge-plugin-submission.mjs#L17-L44)

合并前重读 PR，并在调用合并 API 时指定 head SHA。

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

**依据 7 · 源码核查**：[scripts/merge-plugin-submission.mjs:52-64](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/scripts/merge-plugin-submission.mjs#L52-L64)

陈旧或已合并分支打印跳过，未将其设为失败。

<details>
<summary>查看原文（13行）</summary>

```text
  const result = await mergeValidatedSubmission({
    repository,
    pullNumber,
    expectedHeadSha,
    expectedBaseRef,
    client,
  })

  if (result.status === 'stale') {
    log(`SKIP stale workflow head ${expectedHeadSha}; current head is ${result.currentHeadSha}`)
    return result
  }
  log(`${result.status === 'merged' ? 'MERGED' : 'SKIP'} ${repository}#${pullNumber}${result.sha === undefined ? '' : ` as ${result.sha}`}`)
```

</details>

#### 缺口

- 未在 GitHub 上回放 fork 更新、陈旧事件和分支保护拒绝
  **影响**：只能确认保护设计与可达分支，不能验证具体规则下的行为
  **进一步探讨**：在隔离测试仓用事件重放验证审批前后的 head 改动、评论与同步调度。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装标签依赖什么，能证明哪些事情？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

收录审查关注 Git 默认分支是否有结构上像 DSH bundle 的 manifest 和存在的补丁。子目录 ID 必须匹配该目录的 package.json，根 ID 可在多包仓库中搜索；树截断会拒绝。代码按导出路径、文件是否提交及 prepare 是否声明给 Git 安装分类。prepare 存在只说明脚本已声明，补丁存在只说明可定位，二者都没有执行验证。该分类留在日志，作者评论引导发布 npm 包。发现文档写明对外安装入口使用最新 npm manifest 的 dsh.bundle 声明，且不要求仓库回链匹配。未发布的条目可以浏览，不能从 PR 通过推断能安装；即使页面给出命令，也需要单独确认 npm 包身份、版本内容与真实宿主兼容。回链策略允许不同 URL 的合法发布，同时减少了目录用户可直接用回链核对包归属的线索。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/review-plugin-submission.mjs:291-312](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/scripts/review-plugin-submission.mjs#L291-L312)

检查默认分支、递归树及截断的失败路径。

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

**依据 2 · 源码核查**：[scripts/review-plugin-submission.mjs:120-143](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/scripts/review-plugin-submission.mjs#L120-L143)

子目录 ID 精确约束 manifest，根 ID 在候选包中寻找。

<details>
<summary>查看原文（24行）</summary>

```text
export async function findHarnessBundle(tree, readBlob, subPath = '') {
  const files = new Map(tree.filter(item => item.type === 'blob').map(item => [item.path, item]))
  const allPackages = [...files.values()]
    .filter(item => item.path === 'package.json' || item.path.endsWith('/package.json'))
    .filter(item => !item.path.split('/').includes('node_modules'))
    .sort((left, right) => left.path.split('/').length - right.path.split('/').length || left.path.localeCompare(right.path))

  // A subdirectory id pins the manifest to exactly that directory: the id's
  // path becomes the pnpm `#path:` install spec, so a bundle anywhere else in
  // the repository would not be what the derived install command installs.
  const requiredPackagePath = subPath.length === 0 ? undefined : `${subPath}/package.json`
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
```

</details>

**依据 3 · 源码核查**：[scripts/review-plugin-submission.mjs:156-182](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/scripts/review-plugin-submission.mjs#L156-L182)

实际验证补丁路径及文件存在，再单独附 Git 安装分类。

<details>
<summary>查看原文（27行）</summary>

```text
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
        packageVersion: typeof manifest.version === 'string' ? manifest.version : undefined,
        gitInstall,
```

</details>

**依据 4 · 源码核查**：[scripts/review-plugin-submission.mjs:75-117](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/scripts/review-plugin-submission.mjs#L75-L117)

分类依赖声明与文件存在，评论提示未发布时仅浏览。

<details>
<summary>查看原文（43行）</summary>

```text
 * This is a LABEL, not an admission test: the submission is still accepted
 * and the plugin still gets catalogued.
 *
 * @returns `{ code, entryPoint, requiresBuildAllowance }`; never throws.
 */
export function classifyGitInstall(packagePath, manifest, files) {
  const prepare = isObject(manifest.scripts) ? manifest.scripts.prepare : undefined
  const requiresBuildAllowance = typeof prepare === 'string' && prepare.trim().length > 0
  const entry = declaredEntryPoint(manifest)

  if (entry === undefined) {
    return { code: 'no_entry_declared', entryPoint: undefined, requiresBuildAllowance }
  }
  let entryPath
  try {
    entryPath = resolvePatchPath(packagePath, entry)
  } catch {
    return { code: 'entry_outside_repository', entryPoint: entry, requiresBuildAllowance }
  }
  if (files.has(entryPath)) {
    return { code: 'entry_committed', entryPoint: entry, requiresBuildAllowance }
  }
  if (requiresBuildAllowance) {
    return { code: 'prepare_builds_entry', entryPoint: entry, requiresBuildAllowance }
  }
  return { code: 'entry_missing_no_prepare', entryPoint: entry, requiresBuildAllowance }
}

/**
 * The author-facing note on how the plugin becomes installable.
 *
 * The 1024 Store currently offers npm installs only — the github source
 * method stays recorded but has no user-facing entry point. This is a LABEL,
 * not an admission test: the submission is accepted and the plugin catalogued
 * either way, listed browse-only until a published npm package with
 * `dsh.bundle` appears.
 */
export function installAvailabilityAdvisory(packageName) {
  const name = packageName === undefined ? 'your package' : `\`${packageName}\``
  return 'The 1024 Store installs plugins from npm only. Until '
    + `${name} (with its \`dsh.bundle\` declaration) is published to npm, this plugin is listed `
    + 'browse-only — visitors see the repository link but no install command. The catalog '
    + 'detects a newly published package automatically; no follow-up pull request is needed.'
```

</details>

**依据 5 · 作者声明**：[docs/plugin-discovery.md:61-81](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/docs/plugin-discovery.md#L61-L81)

作者明确 npm 静态证据与 Git 浏览、宿主兼容及安全审查的边界。

<details>
<summary>查看原文（21行）</summary>

```text
## Install method inference

Install methods are derived from facts recorded by the collection jobs; nothing installs or
executes third-party plugins, here or there. GitHub inspection records whether the declared
entry point is committed and whether `prepare` exists. npm inspection fetches the latest
manifest for the exact package name declared by the repository and records whether it
declares `dsh.bundle`.

- A published npm package whose latest manifest declares `dsh.bundle` is a verified method
  and the only one OFFERED to users. Its `repository` field is diagnostic only: a missing,
  stale, or different backlink does not change npm verification.
- The GitHub source method stays derived and recorded — a committed entry, a carrier package
  with no declared entry, or an entry produced by `prepare` is statically considered loadable —
  but no user-facing surface currently offers it: its `--allow-build` grant quoted a
  repository-author-controlled package name, and one unvalidatable value invalidated the whole
  registry for every store client (issue #159). A plugin without a published npm package is
  therefore listed browse-only. Re-opening source installs later is a display-layer decision;
  the collected data already supports it.

“Verified” means the static evidence supports a loadable installation path. It is not a runtime
test, compatibility guarantee, quality rating, or security review.
```

</details>

**依据 6 · 作者声明**：[skills/submit-dsh-plugin/SKILL.md:34-49](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/skills/submit-dsh-plugin/SKILL.md#L34-L49)

作者测试与 PR 自动静态审查分别由不同主体承担。

<details>
<summary>查看原文（16行）</summary>

```text
## 2. 检查插件仓库

先完成只读检查：

1. 确认仓库公开且存在默认分支。
2. 确认仓库包含 `dsh-plugin` GitHub topic。如果缺少 topic、用户拥有该仓库且已授权外部写入，才可执行 `gh repo edit owner/repository --add-topic dsh-plugin`。topic 作用于仓库本身：`gh repo edit` 的参数只取 ID 的前两段 `owner/repository`，子目录 ID 的路径段不参与。
3. 定位插件的 manifest：两段 ID 可使用根目录或任意嵌套的 `package.json`（排除 `node_modules`）；子目录 ID 则必须在 `<sub/dir>/package.json` 恰好找到 manifest——ID 的路径就是插件在仓库中的位置，仓库里其他位置的 manifest 不算数。
4. 确认其中声明了非空字符串 `dsh.bundle.patch`。
5. 相对于声明该字段的 `package.json` 解析补丁路径；拒绝绝对路径、反斜杠以及跳出仓库的路径。
6. 确认 manifest 和引用的补丁都存在于 GitHub 默认分支，而不只是尚未推送的本地提交。
7. 向作者说明**安装可用性**：1024 Store 只提供 npm 安装，不再提供 GitHub 源码安装。
   网站会自动探测 manifest 中声明的 npm 包名；只要 npm 上的 latest manifest 声明 `dsh.bundle`，插件即可安装（`repository` 回链缺失或不一致不影响验证）。
   **未发布 npm 包不影响收录**：插件照常收录，以浏览模式展示（有仓库链接，无安装命令），PR 评论会提示作者发布 npm 包后目录自动检测、无需追加 PR。
8. 记录作者实际执行的兼容性测试。如果尚未测试，应停止并要求作者先测试；目录自动审查不会执行第三方代码。

使用 GitHub 或 `gh` 获取远程默认分支证据。不得用仅存在于本地的文件作为证明。
```

</details>

#### 缺口

- 没有核查姊妹仓的安装探测实现，也没有验证任何具体 npm 工件
  **影响**：不能把作者说明外推为当前线上行为或任一插件可信结论
  **进一步探讨**：对一条已发布和一条仅浏览候选，从目录卡片追溯包名、固定版本及 tarball，比较来源并在授权后验收。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 发布和维护需要什么，失败时在哪里核对？

**研究主题**：效果与总成本、采用判断

#### 完整回答

作者可先核默认分支与提交规范，只准备单条 JSON 和差异，避免占用发布权限。维护者生产链还要照管 GitHub 审查权限、Worker 和 Actions 两侧一致的同步令牌，以及 README 推送的部署密钥。同步脚本可预览，正式 POST 要求成功状态和 ok=true，之后工作流才读取 API 生成两份 README。分页收集检查生成时间一致、ID 唯一和总数，失败持续出现时拒绝发布，首请求 404 时可回退到旧入口。回执与展示分成多个提交点，Worker 已确认但 README 尚未推送在源码结构上可以发生；回读应分别核 Git 条目、同步作业、线上对应条目与文档快照。只准备目录条目的试用可停在本地差异并回退；若评估自托管，则应先用隔离部署或固定文件输入，避免把生产同步当作试用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:9-25](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/package.json#L9-L25)

命令与 Node/npm 要求。

<details>
<summary>查看原文（17行）</summary>

```text
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

**依据 2 · 源码核查**：[scripts/sync-catalog.mjs:63-97](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/scripts/sync-catalog.mjs#L63-L97)

正式请求的令牌和成功回执条件。

<details>
<summary>查看原文（35行）</summary>

```text
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

**依据 3 · 源码核查**：[scripts/sync-catalog.mjs:140-151](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/scripts/sync-catalog.mjs#L140-L151)

预览分支在 POST 前返回，正式分支报告应答。

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

**依据 4 · 源码核查**：[.github/workflows/catalog-sync.yml:56-90](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/.github/workflows/catalog-sync.yml#L56-L90)

同步令牌、失败重试及后续生成顺序。

<details>
<summary>查看原文（35行）</summary>

```text
      # With ssh-key set, checkout rewrites origin to the SSH URL, so the final
      # git push authenticates as the write deploy key ("Deploy keys" is on the
      # main ruleset's bypass list). When the secret is absent, checkout falls
      # back to the default token and the README push step fails fast below.
      - uses: actions/checkout@v4
        with:
          ssh-key: ${{ secrets.CATALOG_DEPLOY_KEY }}
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
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

**依据 5 · 源码核查**：[.github/workflows/catalog-sync.yml:131-156](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/.github/workflows/catalog-sync.yml#L131-L156)

部署密钥是生成文件回推的独立条件，推送竞争会触发重试。

<details>
<summary>查看原文（26行）</summary>

```text
      - name: Commit refreshed README projections
        if: steps.projections.outputs.changed == 'true'
        env:
          HAS_DEPLOY_KEY: ${{ secrets.CATALOG_DEPLOY_KEY != '' }}
        run: |
          if [ "$HAS_DEPLOY_KEY" != "true" ]; then
            echo "::error::README projections changed but the CATALOG_DEPLOY_KEY repository secret is not configured, so the push to main would be rejected by branch protection. Add a write deploy key and store its private key as CATALOG_DEPLOY_KEY."
            exit 1
          fi
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add README.md catalog/README.md
          git commit -m "docs: refresh catalog readme"
          # main may have advanced while this run was installing/syncing (for
          # example an auto-merged plugin PR). Rebase and retry instead of failing
          # on a non-fast-forward push; rebase conflicts cannot occur because this
          # bot is the only writer of the generated README files and runs are
          # serialized by the catalog-sync concurrency group.
          for attempt in 1 2 3; do
            if git push; then
              exit 0
            fi
            echo "git push attempt ${attempt} rejected; rebasing onto the latest main and retrying."
            git pull --rebase origin main
          done
          git push
```

</details>

**依据 6 · 源码核查**：[scripts/build-readme.mjs:125-175](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/scripts/build-readme.mjs#L125-L175)

分页快照、去重与兼容回退条件。

<details>
<summary>查看原文（51行）</summary>

```text
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
}

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
```

</details>

**依据 7 · 源码核查**：[scripts/build-readme.mjs:662-699](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/scripts/build-readme.mjs#L662-L699)

支持本地快照与只校验，并拒绝空结果写出。

<details>
<summary>查看原文（38行）</summary>

```text
  --from-file <json>  Build from a local registry JSON file instead of the network
  --root <path>       Repository root for categories.json and output files
  --check             Verify the committed files are current; do not write
  --help              Show this help`
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  if (options.help) {
    console.log(usage())
    return
  }
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

#### 缺口

- 未观察真实令牌故障、同步后的 KV 延迟或恢复成本
  **影响**：不能承诺目录更新时延或生产自动恢复
  **进一步探讨**：隔离部署注入 401、滞后快照和推送拒绝，分别检查状态、人工处理分钟数与回读。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证自动化能减少人工核对而且没有让读者误会？

**研究主题**：新假设与验证

#### 完整回答

可检验的假设是把收录判定、可用入口和工件归属拆成三个可独立审查的字段，会降低维护者返工且减少读者把收录误读成已验收的比例。既有代码已经对未发布条目出提示，假设新增的是读者可见的工件归属证据与分阶段回执，不能算作已实现。对照组使用当前说明与人工复核，实验组展示三个字段。让维护者和目录读者处理同一组未发布、回链不匹配与正常发布的样例，分别记录重复核对次数和错误安装意图。若错判不降、判断时间反而明显上升，或合法包因为回链缺失被过度误判，就不支持这一假设。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/review-plugin-submission.mjs:425-449](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/scripts/review-plugin-submission.mjs#L425-L449)

现有审核已把安装说明附在 verdict 之外，构成实验基线。

<details>
<summary>查看原文（25行）</summary>

```text
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
    }
    for (const target of submission.deletions) {
      console.log(`PASS delete ${target}`)
    }
    file = catalogPrefix
    publishVerdict(submission.verdict)
    if (repository !== undefined && pullNumber !== undefined) {
      const summary = submission.verdict === 'auto-merge'
        ? 'All static checks passed. The validated pull request will be squash-merged automatically.'
```

</details>

**依据 2 · 作者声明**：[docs/plugin-discovery.md:63-81](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/cf05ee29cea08c409c1e13f50925d3566348d03d/docs/plugin-discovery.md#L63-L81)

静态声明和回链政策提供最有区分度的实验样例。

<details>
<summary>查看原文（19行）</summary>

```text
Install methods are derived from facts recorded by the collection jobs; nothing installs or
executes third-party plugins, here or there. GitHub inspection records whether the declared
entry point is committed and whether `prepare` exists. npm inspection fetches the latest
manifest for the exact package name declared by the repository and records whether it
declares `dsh.bundle`.

- A published npm package whose latest manifest declares `dsh.bundle` is a verified method
  and the only one OFFERED to users. Its `repository` field is diagnostic only: a missing,
  stale, or different backlink does not change npm verification.
- The GitHub source method stays derived and recorded — a committed entry, a carrier package
  with no declared entry, or an entry produced by `prepare` is statically considered loadable —
  but no user-facing surface currently offers it: its `--allow-build` grant quoted a
  repository-author-controlled package name, and one unvalidatable value invalidated the whole
  registry for every store client (issue #159). A plugin without a published npm package is
  therefore listed browse-only. Re-opening source installs later is a display-layer decision;
  the collected data already supports it.

“Verified” means the static evidence supports a loadable installation path. It is not a runtime
test, compatibility guarantee, quality rating, or security review.
```

</details>

#### 缺口

- 未实施上述对照实验
  **影响**：没有证据说明更多字段能降低错判或维护耗时
  **进一步探讨**：先用固定样例做盲读与复核计时，分开报告维护者和读者结果。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
