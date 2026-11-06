# AI Novel Writer for DeepSeek Harness

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[b5bb7b4](https://github.com/EthanYoQ/Pagekin/tree/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer)

<!-- BEGIN META -->
[![GitHub ★ 2,371](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C371&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EthanYoQ/Pagekin) [![npm 30d 1,470](https://img.shields.io/static/v1?label=npm+30d&message=1%2C470&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ethanyoq/dsh-ai-novel-writer) [![最新发布 2026-08-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ethanyoq/dsh-ai-novel-writer)
<!-- END META -->

> **功能**：在DSH Web管理本地小说项目，通过V1单资产审批或V2人审提案协作写作。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持有限小说工具面、V1单资产审批和V2持久非权威提案；以人审应用明确项目事实，增量是协作变更边界。依赖DSH既有loop/审批，不证明文学质量。

> **主要限制**：[Q03](#research-q03)、[Q04](#research-q04)表明逐item事务可能partial，提案/表单非保存，迁移发布后失败仍可能有DB；Git忽略DB且无导出、冻结旧rc兼容未验，新用户不能从根桌面成熟度推可用。

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
  - [Q01 · 冻结的DSH小说插件与桌面Pagekin有什么不同？](#detail-section-11)
  - [Q02 · V1原生审批和V2人审提案如何真正写入？](#detail-section-12)
  - [Q03 · 冲突、部分失败、锁和迁移意味着什么？](#detail-section-13)
  - [Q04 · 冻结维护下的安装、备份和退出是否值得？](#detail-section-14)
  - [Q05 · 如何检验提案式创作的增量而不继承桌面结论？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户是已有兼容DSH Web、希望在同一会话围绕本地小说设定、架构、人物、蓝图和单章正文协作的作者。相对聊天后手工存文件，V1提供单资产审批保存，V2以结构化提案收件箱将模型建议与作者应用分开；合格结果是用户接受的项目状态与可回读receipt，而非生成文字。相对根桌面，本插件没有其批量流程或自动审稿，也无项目导出。

聊天复制文件、DSH原生Preset/审批/文件原子写，以及同仓库独立桌面产品；不把根批量/自动审稿/导入导出算本插件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| V1 read/apply | 单资产审批后保存 | SHA revision/lock，不是会话接受即保存 |
| V2 read/propose | 持久非权威修改建议 | 模型不apply，局部表单需重新提交 |
| 工作台apply | 人审更新项目 | 每item事务，partial不是全成功 |
| V1→V2开发迁移 | 归档/候选DB转换 | 非桌面导入，发布后失败仍检查DB |
| Preset安装 | 并存两个版本 | 冲突不覆盖，旧会话不自动切换 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH Web与rc.6 peers | 必需 | Host、客户端与agent | 冻结版本兼容当前Host未验 |
| Node^22.19或>=24 | 必需 | 包运行 | 不满足不装 |
| 两Preset/新V2会话 | 按版本必需 | 有限工具面 | 旧会话不自动切V2 |
| workspace本地目录/SQLite | 必需 | V1文件/V2DB | 云同步/网络盘不支持，锁与绑定拒绝 |
| Host模型与目录备份 | 创作/恢复必需 | 推理和独立恢复 | 本地项目不等推理离线，Git不备DB |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 独立profile核兼容与目录备份 | 不用唯一作品测试 |
| 加载 | 同Web profile安装bundle/两个Preset，新V2会话 | 核工作台/工具/Workspace blocker |
| 创作 | read→propose，用户编辑后重新提交 | 看到文字和pending不等事实 |
| 应用 | 用户apply后逐item回读 | partial只处理剩余项，源变重读 |
| 退出 | 备份DB/sidecars，停会话并移相应配置 | 不自动删作品或撤回模型文本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Host/模型资源金额未知 | 旧rc兼容、profile/Preset与备份恢复 | 冻结维护，无当前安装验收 |
| 持续 | 模型/SQLite/磁盘未知 | 每提案人审、冲突与备份 | 无文学质量/时间增益实测 |
| 失败 | 迁移/DB恢复资源未知 | partial、stale、锁及发布后状态核对 | 非全包回滚 |
| 退出 | 独立目录保存未知 | DB/sidecars不靠Git、无项目导出 | 已发模型内容不撤回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 人审边界 | 模型提案/用户apply分开 | 当前Host授权与误操作 |
| 持久状态 | item事务receipt、revision和inbox | 崩溃/重启/partial恢复 |
| 小说协作 | 有限工具和阶段设置 | 叙事质量与净审阅收益 |

> **思考**：[Q03](#research-q03)、[Q04](#research-q04)表明逐item事务可能partial，提案/表单非保存，迁移发布后失败仍可能有DB；Git忽略DB且无导出、冻结旧rc兼容未验，新用户不能从根桌面成熟度推可用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持有限小说工具面、V1单资产审批和V2持久非权威提案；以人审应用明确项目事实，增量是协作变更边界。依赖DSH既有loop/审批，不证明文学质量。

有限工具scope、Host来源身份、非权威inbox、item receipt与源revision有明确边界；双格式、partial/迁移后发布状态和冻结依赖仍需维护，不冒充全插件/全Host安全审计。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)、[Q04](#research-q04)表明逐item事务可能partial，提案/表单非保存，迁移发布后失败仍可能有DB；Git忽略DB且无导出、冻结旧rc兼容未验，新用户不能从根桌面成熟度推可用。

<a id="detail-section-6"></a>

### 1.5 使用建议

新用户观察冻结版本，先核兼容/备份恢复；已有用户在独立副本核read-propose-human apply-read，逐item核状态，不以Git替代DB备份。需要桌面批量或自动审稿时不要假定子包具备。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

0.1.0预览冻结，Host/agent/client真实接线与人审状态有源码支持；未验真实Host兼容/持久恢复。叙事冲突预览是假设，不解除冻结前提。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-ai-novel-writer/README.md、plugins/dsh-ai-novel-writer/cordis.patch.yml、plugins/dsh-ai-novel-writer/package.json、plugins/dsh-ai-novel-writer/presets/ai-novel-writer-v2/agent.cordis.yml、plugins/dsh-ai-novel-writer/src/agent.ts、plugins/dsh-ai-novel-writer/src/client/workbench-v2.ts、plugins/dsh-ai-novel-writer/src/command-rpc.ts、plugins/dsh-ai-novel-writer/src/index.ts、plugins/dsh-ai-novel-writer/src/novel-migration.ts、plugins/dsh-ai-novel-writer/src/novel-project.ts、plugins/dsh-ai-novel-writer/src/novel-store.ts、plugins/dsh-ai-novel-writer/src/preset-installer.ts 及固定范围 inventory；组件：plugins/dsh-ai-novel-writer。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核子包README/package/bundle、专用Preset、agent gate和V2 submit、workbench应用、Host RPC、V1原子写、V2 item/revision/绑定、迁移与Preset安装；未运行qualification或审计全Host、数据库引擎及完整UI。
- 下一步：未安装、执行目标代码/测试/qualification、模型创作、审批或迁移。README资格说明不当本次证据；与根桌面独立评价。

**分析版本**

- **仓库**：[EthanYoQ/Pagekin](https://github.com/EthanYoQ/Pagekin)
- **版本号**：0.1.0（[固定提交 b5bb7b4](https://github.com/EthanYoQ/Pagekin/tree/b5bb7b493c955ced13a7decb0c03e56f240f6d0a)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的基线差异/叙事约束冲突预览加应用后回读；同章对照错误接受、返工与人审成本，不改善就放弃，不能借用桌面审稿或算当前贡献。

未安装、执行目标代码/测试/qualification、模型创作、审批或迁移。README资格说明不当本次证据；与根桌面独立评价。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 362 | — | — | 6015 |
| .mjs | source | 7 | 2200 | 2042 | 37 | — |
| .ts | source | 22 | 13107 | 11177 | 1086 | — |
| .tsx | source | 3 | 2274 | 2095 | 84 | — |
| .ts | test | 38 | 10142 | 9255 | 21 | — |
| .tsx | test | 4 | 3333 | 3070 | 4 | — |
| .mjs | example | 4 | 1256 | 1190 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/EthanYoQ/Pagekin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 114](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=114&color=737b86&logo=github)](https://github.com/EthanYoQ/Pagekin/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 143](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=143&color=737b86&logo=github)](https://github.com/EthanYoQ/Pagekin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：辨别冻结子包的真实接线、审批/提案持久边界与采用代价，不继承桌面功能。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 冻结的DSH小说插件与桌面Pagekin有什么不同？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本组件是DSH Web的小说工作台bundle，固定0.1.0预览已冻结，README明确短期不开发、需新范围计划才恢复。根Pagekin独立桌面软件的批量和自动审稿、导入/备份不能算在本插件上；两者独有项目格式，插件不打开桌面项目。package具有bundle patch、Host、agent/agent-v2/client导出和Web接线，不能因为冻结而当作只有资源文档。

用户是已有兼容DSH Web、希望在同一会话围绕本地小说设定、架构、人物、蓝图和单章正文协作的作者。相对聊天后手工存文件，V1提供单资产审批保存，V2以结构化提案收件箱将模型建议与作者应用分开；合格结果是用户接受的项目状态与可回读receipt，而非生成文字。相对根桌面，本插件没有其批量流程或自动审稿，也无项目导出。

贡献在有限创作工具面和人审持久变更，而不是新模型、原生Agent loop或长篇质量突破。既有Preset和Host审批由DSH提供。冻结/旧rc依赖使新用户兼容负担显著，本次无真实宿主验收或作者时间收益。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-ai-novel-writer/README.md:1-11](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/README.md#L1-L11)

作者冻结、独立格式与Host条件。

<details>
<summary>查看原文（11行）</summary>

```text
# AI Novel Writer for DeepSeek Harness

The `0.1.0` plugin preview is frozen. No short-term feature work is planned. This README supports existing users and maintainers. Development can resume only under a new, explicitly scoped plan.

The plugin adds a local novel workspace to DeepSeek Harness Web. It has its own project format and release. It does not open desktop projects. The desktop app's `1.2.0-Preview` release does not change this plugin's version or maintenance status.

[Desktop app](../../README_en.md) · [npm package](https://www.npmjs.com/package/@ethanyoq/dsh-ai-novel-writer) · [Installation guide](docs/official-dsh-plugin-installation.md)

## Install the plugin

Use a working DeepSeek Harness installation. The published package requires Node.js `^22.19 || >=24`.
```

</details>

**依据 2 · 作者声明**：[plugins/dsh-ai-novel-writer/README.md:33-60](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/README.md#L33-L60)

单章工作台和Proposal非权威状态。

<details>
<summary>查看原文（28行）</summary>

```text
The repository's root package is a desktop application. Do not install it as a DSH plugin. For tarball installation, development setup, and the Windows path limitation, read the installation guide above.

## Write with the V2 workbench

V2 supports project settings, story architecture, characters, a whole-book outline, chapter blueprints, and prose. Work on one chapter at a time. It does not provide the desktop app's batch workflows or automated review process.

Use the workbench's project setup controls for an empty workspace. Complete the story architecture and characters before you prepare the outline and chapter blueprints.

For AI drafting, follow this sequence:

1. Select the stage or chapter you want to write.

2. Enter any instructions and request an AI draft in the selected session.

3. Inspect the generated values in the local editor.

4. Edit the values if needed and submit the revised proposal.

5. Review the Proposal inbox item.

6. Apply the proposal to update the project.

A Proposal is a pending change for human review. Receiving a proposal or seeing generated text in the editor does not save that text as project state. Editing the local form does not change the pending proposal until you submit the replacement.

The local form draft is not authoritative and does not become saved project state after a reload. Applied changes are stored in the project. The inbox retains pending proposals after restart.

If a proposal applies only partly, inspect its status before applying the remaining items. Failed items can be retried, discarded, or regenerated through the workbench. Do not assume that every item was saved because one item succeeded.

```

</details>

**依据 3 · 源码核查**：[plugins/dsh-ai-novel-writer/package.json:19-40](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/package.json#L19-L40)

Host/agent/client独立导出。

<details>
<summary>查看原文（22行）</summary>

```text
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./agent": {
      "types": "./lib/types/agent.d.ts",
      "default": "./lib/agent.js"
    },
    "./agent-v2": {
      "types": "./lib/types/agent-v2.d.ts",
      "default": "./lib/agent-v2.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-ai-novel-writer/package.json:59-83](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/package.json#L59-L83)

bundle、Web和Node条件。

<details>
<summary>查看原文（25行）</summary>

```text
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-settings-plugins",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ],
      "platform": "web"
    }
  },
  "engines": {
    "node": "^22.19 || >=24"
  },
  "scripts": {
    "build": "tsc -p tsconfig.build.json && tsdown && node scripts/link-self.mjs && node scripts/verify-built.mjs",
    "bundle": "tsdown",
    "test": "pnpm run build && vitest run",
    "typecheck": "tsc --noEmit",
    "qualify": "node scripts/qualify-release.mjs"
  },
  "dependencies": {
    "@deepseek-ai/dsh-atomic-write": "0.1.0-rc.6",
    "@deepseek-ai/dsh-home-paths": "0.1.0-rc.6",
    "@deepseek-ai/schemastery": "3.18.1"
  },
  "peerDependencies": {
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-ai-novel-writer/cordis.patch.yml:1-6](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/cordis.patch.yml#L1-L6)

Host bundle入口，工具不全局暴露。

```text
# Host entry for bundle discovery.
# Model-facing tools remain absent from the host catalog: the dedicated preset
# mounts the package's ./agent export into its own standing scope.
- insert:
    - id: ai-novel-writer
      name: '@ethanyoq/dsh-ai-novel-writer'
```

#### 缺口

- 冻结0.1.0与当前DSH版本兼容及真实创作价值未验。
  **影响**：不能把上游/桌面能力或旧测试宣传当当前可安装使用。
  **进一步探讨**：先在可丢弃兼容profile核包/两个Preset/工作台实际接线，禁止导入唯一作品。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · V1原生审批和V2人审提案如何真正写入？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

V1在专用Preset scope注册novel_read/novel_apply_change，并对后者tools/pre-execute返回ask；底层单资产替换在锁前和锁内重读revision，再writeFileAtomic返回新旧revision及bytes。会话允许启动或模型“已保存”都不是文件审批，必须看native批准后CommitReceipt。

V2专用Preset只装小说工具/指令，不装shell、通用文件写或Code Mode。模型调用novel_propose_change把payload存入非权威inbox，Host从真实exec取session/call和canonical hash，模型不能自行提供这些身份。applyV2不安装V1 mutation gate，而是模型没有直接apply工具；用户从workbench applySelectedProposal，按workspace UUID通过Host RPC调用store.applyProposal。

因此V2发出提案、在本地编辑表单和真正应用是三个状态。表单必须重新提交才替换待审提案，刷新未提交表单不成为项目事实；收件箱持久不代表内容已经接受。原生同源/loopback接线提供通道边界，本次未完整审计整个Host权限系统，不能把UI点击等同所有环境绝对授权保障。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-ai-novel-writer/src/agent.ts:429-442](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/agent.ts#L429-L442)

V1 ask gate。

<details>
<summary>查看原文（14行）</summary>

```text
 * Require native approval for the mutation tool and delegate every other tool decision.
 *
 * @param exec Tool execution identity.
 * @param next Remaining scoped approval listeners.
 * @returns An approval request for `novel_apply_change`, otherwise the delegated decision.
 */
export function novelApprovalGate(
  exec: Pick<{ name: string }, 'name'>,
  next: () => Promise<PreToolDecision>,
): Promise<PreToolDecision> {
  if (exec.name !== 'novel_apply_change') return next()
  return Promise.resolve({ kind: 'ask', reason: '批准后仅修改这一个小说资产。' })
}

```

</details>

**依据 2 · 源码核查**：[plugins/dsh-ai-novel-writer/src/agent.ts:598-616](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/agent.ts#L598-L616)

V1/V2 scope真实工具注册。

<details>
<summary>查看原文（19行）</summary>

```text
 * Register the two domain tools and their mandatory one-shot approval policy.
 *
 * @param ctx Agent preset scope that owns registrations and lifecycle cleanup.
 * @param config Deployment-specific read, write, working-set, and query limits.
 * @returns Nothing.
 */
export function apply(ctx: Context, config: Config = {}): void {
  for (const definition of createNovelToolDefinitions(config)) ctx.tools.register(definition)
  installDedicatedPresetSurface(ctx, NOVEL_PRESET_ID, NOVEL_TOOL_NAMES, 'AI 小说作家')
  ctx.on('tools/pre-execute', (exec, next) => novelApprovalGate(exec, next))
}

/** Register V2's read-and-proposal surface after its dedicated entry injects the Workspace registry. */
export function applyV2(ctx: Context, config: NovelV2Config = {}): void {
  const workspaces = ctx.get('workspaceRegistry') as NovelV2WorkspaceRegistry | undefined
  if (workspaces === undefined) throw new Error('AI 小说作家 V2 requires the Workspace registry')
  for (const definition of createNovelV2ToolDefinitions(config, workspaces)) ctx.tools.register(definition)
  installDedicatedPresetSurface(ctx, NOVEL_V2_PRESET_ID, NOVEL_V2_TOOL_NAMES, 'AI 小说作家 V2')
}
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-project.ts:455-495](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/novel-project.ts#L455-L495)

V1双重revision/lock和原子单资产保存receipt。

<details>
<summary>查看原文（41行）</summary>

```text
  ): Promise<CommitReceipt> {
    requireNonEmpty(request.summary, 'summary')
    if (request.baseRevision !== 'absent' && !/^[a-f0-9]{64}$/.test(request.baseRevision)) {
      throw new NovelProjectError('INVALID_CONTENT', 'baseRevision must be absent or a SHA-256 digest')
    }
    const manifest = await this.#readManifest(signal)
    const nextText = normalizeAssetContent(request.target, request.replacement, manifest)
    const bytes = Buffer.byteLength(nextText, 'utf8')
    if (bytes > this.#assetLimit) {
      throw new NovelProjectError('SIZE_LIMIT_EXCEEDED', `asset exceeds ${this.#assetLimit} bytes`)
    }
    const source = novelAssetSource(request.target)
    const filename = join(root, source)
    const parent = resolve(filename, '..')
    const beforeLock = await this.#readAsset(request.target, signal)
    if (!revisionMatches(beforeLock, request)) {
      throw new NovelProjectError('STALE_REVISION', `${source} changed since it was read`)
    }
    await this.#rejectSymlinkChain(parent)
    await mkdir(parent, { recursive: true, mode: 0o700 })
    await this.#rejectSymlinkChain(parent)

    try {
      return await withFileLock(filename, async () => {
        requireNotAborted(signal)
        const current = await this.#readAsset(request.target, signal)
        if (!revisionMatches(current, request)) {
          throw new NovelProjectError('STALE_REVISION', `${source} changed since it was read`)
        }
        requireNotAborted(signal)
        try {
          await writeFileAtomic(filename, nextText, { mode: 0o600, dirMode: 0o700 })
        } catch (cause) {
          throw new NovelProjectError('WRITE_FAILED', `failed to replace ${source}`, { cause })
        }
        return {
          projectId: manifest.projectId,
          target: request.target,
          oldRevision: current.revision,
          newRevision: revisionOf(nextText),
          bytes,
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-ai-novel-writer/src/agent.ts:555-583](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/agent.ts#L555-L583)

V2仅提交proposal、Host来源身份。

<details>
<summary>查看原文（29行）</summary>

```text
  const propose = defineTool({
    name: 'novel_propose_change',
    description: 'Persist one non-authoritative proposal bundle for user review. Changes may contain aggregate replacements or closed artifact version commands, but this tool never writes authoritative project state. Proposal session, call, and canonical args identity are supplied by the Host; only a later user-approved proposal apply can create versions or select a final.',
    parameters: v2ProposeParameters,
    output: {
      schema: { type: 'json' },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    },
    isConcurrencySafe: () => false,
    async execute(args, exec) {
      parseProposalArgs(args as Record<string, unknown>)
      const sessionId = exec.agent?.session.id
      if (sessionId === undefined) throw new ToolArgsError(['AI novel V2 tools require a session identity'])
      const workspace = await resolveWorkspace(exec)
      const store: NovelStore = await openNovelStore(workspace.path, workspace.id, options)
      try {
        return await store.submitProposal({
          sessionId: String(sessionId),
          callId: String(exec.callId),
          argsHash: novelProposalArgsHash(exec.arguments),
          payload: exec.arguments,
        }, exec.signal) as unknown as JsonValue
      } finally {
        await store.dispose()
      }
    },
    presentCall: args => ({
      card: 'generic',
      title: '提交小说修改建议',
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-ai-novel-writer/presets/ai-novel-writer-v2/agent.cordis.yml:1-19](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/presets/ai-novel-writer-v2/agent.cordis.yml#L1-L19)

专用V2组合与禁止通用写入指令。

<details>
<summary>查看原文（19行）</summary>

```text
# Dedicated V2 agent-plane composition. It intentionally mounts no shell,
# general filesystem tool, text replacement tool, or Code Mode transport.
- id: persona
  name: '@deepseek-ai/dsh-persona'
  config:
    text: |-
      You are AI 小说作家 V2, a collaborative fiction-writing agent working in {{cwd}}.

      The authoritative novel project lives in the Host-managed V2 store. Use novel_read to inspect its current state and revisions. When the user wants a project change, call novel_propose_change with exactly one typed change for the active stage. A proposal must contain exactly one typed change: one complete aggregate replacement or one permitted artifact/final-selection command. The Host records the session, call identity, and canonical argument hash; never attempt to supply or guess those values. A successful proposal is pending user review in the sidebar, not an authoritative write. Never claim that a proposal changed the project. If novel_read or novel_propose_change fails, stop this request; do not retry, probe, or substitute another write call. Never retry an unchanged proposal after receiving its pending receipt. If state changes while working, read again and reconcile base revisions before proposing a new proposal.

      After reading project settings, apply its creative strategy only to novel-writing workflow: auto：balance planning, drafting, and consistency checks; fluent-drafting：prefer continuous prose drafting with only the minimum plan needed; consistency-first：check established facts, character motives, and continuity before drafting; deep-planning：develop structure, causality, and chapter beats before drafting. These choices change planning order and writing emphasis only; they never select an LLM provider or reasoning parameter.

- id: agent-instructions
  name: '@deepseek-ai/dsh-agent-instructions'
  config:
    maxBytes: 65536

- id: novel-agent
  name: '@ethanyoq/dsh-ai-novel-writer/agent-v2'
```

</details>

**依据 6 · 源码核查**：[plugins/dsh-ai-novel-writer/src/client/workbench-v2.ts:820-841](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/client/workbench-v2.ts#L820-L841)

用户应用入口使用workspace/proposal identity。

<details>
<summary>查看原文（22行）</summary>

```text
  /** Ask the Host to apply the selected Proposal Bundle in its persisted item order. */
  public applySelectedProposal(): Promise<void> {
    if (this.#state.status !== 'ready') return Promise.resolve()
    const proposal = this.#state.proposals.items.find(item => item.proposalId === this.#state.proposals.selectedId)
    if (proposal === undefined) return Promise.resolve()
    if (proposal.status === 'stale') {
      return this.#proposalOperationUnavailable('这项创作建议与当前内容不一致；请先处理冲突后再应用。')
    }
    const workspaceId = this.#state.workspace.workspaceId
    const apply = this.port.applyProposal
    if (apply === undefined) return this.#proposalOperationUnavailable('当前无法应用这项创作建议。')
    const authoring = this.#state.authoring
    const draftToClear: LocalAuthoringTarget | undefined = authoring.stage === undefined
      ? undefined
      : { stage: authoring.stage, chapter: authoring.chapter }
    return this.#runProposalOperation(
      proposal.proposalId,
      '提案应用',
      signal => apply(workspaceId, proposal.proposalId, signal),
      draftToClear,
    )
  }
```

</details>

**依据 7 · 源码核查**：[plugins/dsh-ai-novel-writer/src/command-rpc.ts:621-630](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/command-rpc.ts#L621-L630)

Host RPC接store.apply/retry/discard。

<details>
<summary>查看原文（10行）</summary>

```text
      if (endpoint === 'proposal/apply') {
        return { ok: true, value: await store.applyProposal(proposalId!, signal) }
      }
      if (endpoint === 'proposal/retry') {
        return { ok: true, value: await store.retryProposalItem(proposalId!, itemId!, signal) }
      }
      if (endpoint === 'proposal/discard') {
        return { ok: true, value: await store.discardProposalItem(proposalId!, itemId!, signal) }
      }
      if (endpoint === 'proposal/regenerate') {
```

</details>

**依据 8 · 源码核查**：[plugins/dsh-ai-novel-writer/src/index.ts:312-329](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/index.ts#L312-L329)

loopback channel及dispose。

<details>
<summary>查看原文（18行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const presetRoot = config.presetRoot ?? dshHomePath('.agent-presets')
  const installer = createBundledPresetInstaller(templateRoot(), presetRoot)
  const connection = ctx.get('connection') as HostConnectionHandle
  const workspaces = ctx.get('workspaceRegistry') as NovelWorkspaceRegistry
  ctx.effect(
    () => {
      const lifecycle = createAiNovelHostRpcLifecycle(createAiNovelRpcHandler(
        installer,
        workspaces,
        error => { ctx.logger.error('dsh-ai-novel-writer: request failed: %o', error) },
      ))
      const unregister = connection.rpc.handle('/ai-novel', lifecycle.handler, { authority: 'loopback' })
      return async () => {
        await lifecycle.dispose()
        await unregister()
      }
    },
```

</details>

#### 缺口

- 未执行native审批拒绝/禁用、V2工作台和重启持久。
  **影响**：不能宣称真实宿主已隔离或人审一定防误写。
  **进一步探讨**：在独立profile分别拒批、源变化、刷新未提交表单、提案提交/应用/重启，回读权威状态和receipt。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 冲突、部分失败、锁和迁移意味着什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

V2 store维护global和aggregate revision，commit时核基线；提案应用按item顺序每项BEGIN IMMEDIATE，成功变更与item receipt同事务提交，失败项回滚并另记stale/failed，然后停止。已成功项保持applied，下次跳过。因此bundle可能partial，不是整包原子事务，成功一个不表示全部成功。模型指令要求每次只提一个typed change，存储仍能处理历史/多项payload，不能用提示词代替底层状态边界。

项目数据库绑定workspace UUID与canonical路径，打开时不匹配需显式恢复/克隆，持写锁失败会WRITE_LOCKED；工作台浏览器只传workspace ID而非任意路径。字段验证检查人物稳定ID和关系引用，只证明结构约束，不证明叙事事实正确。V1 SHA revision与V2整数/全局revision不是同一存储方式。

V1到V2转换是显式开发API：按预览fingerprint复核源、归档原资产、候选DB、发布前再核源，发布后检验。发布后检验错误不能假定DB未出现，代码保留published状态并报错；README也指出同盘/云同步和网络盘限制。它不是桌面导入或同步，重试前需检查既有DB与归档，不能直接再次迁移覆盖。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:2553-2623](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/novel-store.ts#L2553-L2623)

逐item事务、applied跳过、stale/failed停止和partial。

<details>
<summary>查看原文（71行）</summary>

```text
  #applyProposal(proposalId: string, signal: AbortSignal): NovelProposalApplyResult {
    const proposal = this.#proposalRow(proposalId)
    const appliedItemIds: string[] = []
    const items = this.#proposalItems(proposalId)
    const commands = items.map(item => this.#proposalCommand(item, proposal))
    const aggregateCommands = commands.filter(isAggregateProposalChange)
    const sharedSnapshotBaseGlobalRevision = aggregateCommands.length > 1
      && aggregateCommands.every(command => command.baseGlobalRevision === aggregateCommands[0]!.baseGlobalRevision)
      && new Set(aggregateCommands.map(command => aggregateKey(command.aggregate))).size === aggregateCommands.length
      ? aggregateCommands[0]!.baseGlobalRevision
      : undefined
    let previouslyAppliedAggregateItems = 0
    for (const [index, item] of items.entries()) {
      const command = commands[index]!
      if (item.status === 'applied' || item.status === 'discarded' || item.status === 'superseded') {
        if (item.status === 'applied' && isAggregateProposalChange(command)) previouslyAppliedAggregateItems += 1
        continue
      }
      if (item.status !== 'pending') {
        return { proposal: this.#proposalSummary(proposalId), appliedItemIds, stoppedItemId: item.item_id }
      }
      requireNotAborted(signal)
      try {
        this.#db.exec('BEGIN IMMEDIATE')
        const rebasedCommand = isAggregateProposalChange(command)
          && sharedSnapshotBaseGlobalRevision !== undefined
          && previouslyAppliedAggregateItems > 0
          && this.#currentRevisions(command.aggregate).global === sharedSnapshotBaseGlobalRevision + previouslyAppliedAggregateItems
          ? { ...command, baseGlobalRevision: sharedSnapshotBaseGlobalRevision + previouslyAppliedAggregateItems }
          : command
        const receipt = isAggregateProposalChange(rebasedCommand)
          ? this.#existingChange({
            ...rebasedCommand,
            operation: 'replace',
            provenance: { origin: 'model', sessionId: proposal.session_id, callId: proposal.call_id, argsHash: proposal.args_hash },
          } as NovelChangeSet) ?? this.#commitChangeInTransaction({
            ...rebasedCommand,
            operation: 'replace',
            provenance: { origin: 'model', sessionId: proposal.session_id, callId: proposal.call_id, argsHash: proposal.args_hash },
          } as NovelChangeSet)
          : this.#commitArtifactCommandInTransaction(rebasedCommand)
        const now = new Date().toISOString()
        this.#db.prepare(`UPDATE proposal_items SET status = 'applied', attempt_count = attempt_count + 1,
          failure_code = NULL, receipt = ?, updated_at = ? WHERE item_id = ?`)
          .run(stableJson(receipt), now, item.item_id)
        this.#setProposalStatus(proposalId, now)
        this.#db.exec('COMMIT')
        appliedItemIds.push(item.item_id)
        if (isAggregateProposalChange(command)) previouslyAppliedAggregateItems += 1
      } catch (error) {
        this.#rollback()
        if (error instanceof NovelStoreError && error.code === 'CANCELLED') throw error
        const code: NovelStoreErrorCode = error instanceof NovelStoreError ? error.code : 'WRITE_FAILED'
        const status: NovelProposalItemStatus = code === 'STALE_REVISION' ? 'stale' : 'failed'
        const now = new Date().toISOString()
        this.#db.exec('BEGIN IMMEDIATE')
        try {
          this.#db.prepare(`UPDATE proposal_items SET status = ?, attempt_count = attempt_count + 1,
            failure_code = ?, updated_at = ? WHERE item_id = ?`).run(status, code, now, item.item_id)
          this.#setProposalStatus(proposalId, now)
          this.#db.exec('COMMIT')
        } catch (recordFailure) {
          this.#rollback()
          if (recordFailure instanceof NovelStoreError) throw recordFailure
          throw new NovelStoreError('WRITE_FAILED', 'proposal item failure could not be recorded', { cause: recordFailure })
        }
        return { proposal: this.#proposalSummary(proposalId), appliedItemIds, stoppedItemId: item.item_id }
      }
    }
    return { proposal: this.#proposalSummary(proposalId), appliedItemIds }
  }
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:2844-2850](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/novel-store.ts#L2844-L2850)

global及aggregate revision核对。

```text
  /** Apply a checked replacement inside the caller's already-open SQLite transaction. */
  #commitChangeInTransaction(change: NovelChangeSet): NovelChangeReceipt {
      const current = this.#currentRevisions(change.aggregate)
      if (current.aggregate !== change.baseAggregateRevision || current.global !== change.baseGlobalRevision) {
        throw new NovelStoreError('STALE_REVISION', 'novel aggregate changed since it was read')
      }
      const nextGlobal = current.global + 1
```

**依据 3 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:3210-3239](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/novel-store.ts#L3210-L3239)

workspace/canonical绑定与锁错误。

<details>
<summary>查看原文（30行）</summary>

```text
    diagnostic = new sqlite.DatabaseSync(databasePath, { readOnly: true })
    configureReadConnection(diagnostic)
    const schemaVersion = Number((diagnostic.prepare('PRAGMA user_version').get() as { user_version: unknown }).user_version)
    if (schemaVersion === 2) {
      const binding = readMetaBinding(diagnostic)
      diagnostic.close()
      if (binding === undefined || binding.workspaceId !== workspaceId || binding.workspacePath !== canonicalRoot) {
        return openReadOnlyStore()
      }
      return openReadWriteStore()
    }
    requireStorage(diagnostic, true)
    const binding = readMetaBinding(diagnostic)
    if (binding === undefined) {
      if (hasProjectAggregate(diagnostic)) {
        diagnostic.close()
        throw new NovelStoreError('UNSUPPORTED_FORMAT', 'novel.db has a project without workspace binding metadata')
      }
      diagnostic.close()
      return openReadWriteStore()
    }
    diagnostic.close()
    if (binding.workspaceId !== workspaceId || binding.workspacePath !== canonicalRoot) {
      return openReadOnlyStore()
    }
    return openReadWriteStore()
  } catch (error) {
    if (diagnostic !== undefined && diagnostic.isOpen) diagnostic.close()
    if (error instanceof NovelStoreError) throw error
    throw new NovelStoreError('WRITE_LOCKED', 'novel.db is locked by another writer or cannot be opened', { cause: error })
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:1365-1407](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/novel-store.ts#L1365-L1407)

人物唯一稳定ID与关系引用验证。

<details>
<summary>查看原文（43行）</summary>

```text
  if (!Array.isArray(record.items) || !Array.isArray(record.relationships)) {
    throw new NovelStoreError('INVALID_CONTENT', 'characters items and relationships must be arrays')
  }
  const items = record.items.map(item => {
    const row = requireExactKeys(item, ['characterId', 'name', 'role', 'summary', 'goal', 'currentState', 'notes'], 'character')
    return {
      characterId: requireNonEmptyString(row.characterId, 'character.characterId'),
      name: requireNonEmptyString(row.name, 'character.name'),
      role: requireNonEmptyString(row.role, 'character.role'),
      summary: requireString(row.summary, 'character.summary'),
      goal: requireString(row.goal, 'character.goal'),
      currentState: requireString(row.currentState, 'character.currentState'),
      notes: requireString(row.notes, 'character.notes'),
    }
  })
  const ids = new Set(items.map(item => item.characterId))
  if (ids.size !== items.length) throw new NovelStoreError('INVALID_CONTENT', 'character.characterId must be unique')
  const relationships = record.relationships.map(item => {
    const row = requireExactKeys(item, ['fromCharacterId', 'toCharacterId', 'relation', 'notes'], 'relationship')
    const fromCharacterId = requireNonEmptyString(row.fromCharacterId, 'relationship.fromCharacterId')
    const toCharacterId = requireNonEmptyString(row.toCharacterId, 'relationship.toCharacterId')
    if (!ids.has(fromCharacterId) || !ids.has(toCharacterId)) {
      throw new NovelStoreError('INVALID_CONTENT', 'relationship references an unknown character')
    }
    return {
      fromCharacterId,
      toCharacterId,
      relation: requireNonEmptyString(row.relation, 'relationship.relation'),
      notes: requireString(row.notes, 'relationship.notes'),
    }
  })
  const relationshipKeys = new Set(relationships.map(item => `${item.fromCharacterId}\0${item.toCharacterId}\0${item.relation}`))
  if (relationshipKeys.size !== relationships.length) {
    throw new NovelStoreError('INVALID_CONTENT', 'relationship must be unique')
  }
  return { items, relationships }
}

function validateChapter(value: NovelChapterNextValue): NovelChapterNextValue {
  const record = requireExactKeys(value, [
    'chapter', 'title', 'purpose', 'plotBeats', 'characters', 'keyEvents', 'suspense', 'status',
  ], 'chapter nextValue')
  const validated = {
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-migration.ts:740-785](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/novel-migration.ts#L740-L785)

迁移归档/源复核、发布及发布后失败状态。

<details>
<summary>查看原文（46行）</summary>

```text
  const prepared = await prepare(await canonicalRoot(root))
  if (prepared.fingerprint !== previewFingerprint) {
    throw new NovelStoreError('STALE_REVISION', 'V1 sources changed since the preview shown to the user')
  }
  const archivePath = await archiveSources(prepared)
  const stagingPath = join(archivePath, '.novel.db.staging')
  await removeStaging(stagingPath)
  let published = false
  const databasePath = join(prepared.root, '.ai-novel', 'novel.db')
  try {
    const receipt = await createMigratedNovelStoreFile(stagingPath, prepared.root, {
      projectId: prepared.project.projectId,
      workspaceId,
      project: prepared.project.project,
      architecture: prepared.architecture,
      characters: prepared.characters,
      chapters: prepared.chapters,
      artifacts: prepared.artifacts,
      fingerprint: prepared.fingerprint,
      archivePath: `.ai-novel/v1-archive/${prepared.fingerprint}`,
      sourceCount: prepared.records.length,
      migratedAt: new Date().toISOString(),
    } satisfies NovelMigrationSeed)
    requireNotAborted(signal)
    await requireSourceSnapshotUnchanged(prepared)
    await publishStaging(stagingPath, databasePath)
    published = true
    let store: Awaited<ReturnType<typeof openNovelStore>> | undefined
    try {
      store = await openNovelStore(prepared.root, workspaceId)
      const state = await store.read(signal)
      if (state.migration === undefined || state.migration.fingerprint !== receipt.fingerprint) {
        throw new NovelStoreError('WRITE_FAILED', 'published migration database failed verification')
      }
      return state.migration
    } finally {
      await store?.dispose()
    }
  } catch (cause) {
    if (published) {
      if (cause instanceof NovelStoreError) throw cause
      throw new NovelStoreError('WRITE_FAILED', 'published migration database failed verification and remains published', {
        cause,
      })
    }
    await removeStaging(stagingPath)
```

</details>

**依据 6 · 作者声明**：[plugins/dsh-ai-novel-writer/README.md:83-99](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/README.md#L83-L99)

备份/格式/存储部署及迁移范围。

<details>
<summary>查看原文（17行）</summary>

```text
### Convert plugin V1 data for development

The exported `previewV1NovelMigration` and `migrateV1NovelProject` functions support an explicit plugin V1-to-V2 conversion. They are development APIs, not a desktop import feature.

Conversion archives the original five assets under `.ai-novel/v1-archive/<fingerprint>/` and checks the source again before publishing the staged database. It does not replace an existing database. A cross-device layout fails with `WRITE_FAILED`.

If validation fails after database publication, the error states that the database remains published. Inspect that state before retrying. The V1 archive is also excluded from Git, so keep an independent backup.

## Diagnose a blocked action

The workbench distinguishes client mounting, Host connection, Preset installation, workspace selection, and project initialization. Check the reported blocker before submitting another generation request.

If the saved revision changed while you edited a V1 file, the change fails with `STALE_REVISION`. Reload the saved version and reconcile your edits before submitting again.

If V1 native approval is disabled, the agent cannot save the change. Accepting a session prompt is not file approval. Wait for the native approval result and a `CommitReceipt` before treating the file as saved.

For V2, inspect the Proposal inbox and its item status. A model response alone does not prove that an application succeeded. Read back the project state after application.
```

</details>

#### 缺口

- 未验证锁竞争、部分应用重试、跨设备及发布后故障。
  **影响**：不能保证全包回滚、任意复制DB可打开或迁移无损。
  **进一步探讨**：用可丢弃V1副本测预览后改源、已有DB、发布后失败与partial重试，保留归档和完整目录备份。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 冻结维护下的安装、备份和退出是否值得？

**研究主题**：采用判断、效果与总成本、依赖、兼容与流程

#### 完整回答

首次需兼容DSH Web与子包Node^22.19或>=24，package peer固定0.1.0-rc.6，安装到同一Web profile再从设置安装两个Preset，新会话选择V2并选workspace。只装bundle并不会把旧会话自动切为V2。Preset installer先核两个目标内容，冲突拒绝覆盖，相同不变；逐目录安装不应推为整组原子事务，竞态/中断仍要核目标归属。

持续成本是作者逐提案审阅、冲突重读、模型使用与DB/sidecars备份，加上冻结旧依赖兼容维护；费用与耗时没有实测。V2 .ai-novel/novel.db及sidecars、迁移归档在Git忽略范围，Git commit不等作品备份，且插件不提供导出，用户须备份整个作品目录。Host若远端，所谓本地是Host存储不是浏览器机器；模型上下文由DSH调用，插件本地项目不等全链路离线。

当前建议观察：新用户先完成兼容与备份恢复验收再考虑使用；已有用户用独立副本核单章read→propose→human apply→read，核每item状态，保留原目录。退出需备份DB/sidecars与原文、移除对应profile/Preset并停会话；卸载不应擅自删作品，也不撤回模型已收内容。若无法恢复备份或只有当前DSH最新版环境，则先不导入真实作品。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-ai-novel-writer/package.json:78-105](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/package.json#L78-L105)

Node/构建与固定rc peer条件。

<details>
<summary>查看原文（28行）</summary>

```text
  "dependencies": {
    "@deepseek-ai/dsh-atomic-write": "0.1.0-rc.6",
    "@deepseek-ai/dsh-home-paths": "0.1.0-rc.6",
    "@deepseek-ai/schemastery": "3.18.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.1",
    "@deepseek-ai/dsh-agent": "0.1.0-rc.6",
    "@deepseek-ai/dsh-agent-instructions": "0.1.0-rc.6",
    "@deepseek-ai/dsh-agent-presets": "0.1.0-rc.6",
    "@deepseek-ai/dsh-brand": "0.1.0-rc.6",
    "@deepseek-ai/dsh-client-connection": "0.1.0-rc.6",
    "@deepseek-ai/dsh-client-runtime": "0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-layout": "0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-primitives": "0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-settings-plugins": "0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-sidebar": "0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-slots": "0.1.0-rc.6",
    "@deepseek-ai/dsh-llm": "0.1.0-rc.6",
    "@deepseek-ai/dsh-persona": "0.1.0-rc.6",
    "@deepseek-ai/dsh-scope": "0.1.0-rc.6",
    "@deepseek-ai/dsh-session": "0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": "0.1.0-rc.6",
    "@deepseek-ai/dsh-workspace": "0.1.0-rc.6",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
```

</details>

**依据 2 · 作者声明**：[plugins/dsh-ai-novel-writer/README.md:11-33](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/README.md#L11-L33)

同profile、安装Preset、新会话/工作区流程。

<details>
<summary>查看原文（23行）</summary>

````text
Use a working DeepSeek Harness installation. The published package requires Node.js `^22.19 || >=24`.

1. Add the plugin to the Web profile.

```sh
dsh plugin --profile web add @ethanyoq/dsh-ai-novel-writer
```

2. Start the same profile.

```sh
dsh --profile web
```

3. Open 小说工作台 from the Harness sidebar.

4. Use the Preset installation action to install the bundled presets.

5. Create a new session and choose AI 小说作家 V2.

6. Select the workspace for your novel.

The repository's root package is a desktop application. Do not install it as a DSH plugin. For tarball installation, development setup, and the Windows path limitation, read the installation guide above.
````

</details>

**依据 3 · 源码核查**：[plugins/dsh-ai-novel-writer/src/preset-installer.ts:94-122](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/preset-installer.ts#L94-L122)

冲突/同内容及逐目录安装。

<details>
<summary>查看原文（29行）</summary>

```text
  }
  const installers = BUNDLED_PRESET_DIRECTORIES.map(presetDirectory =>
    createDirectoryPresetInstaller(join(packagePresetRoot, presetDirectory), presetRoot, presetDirectory),
  )
  return {
    async status(signal) {
      let installed = 0
      for (const installer of installers) {
        const state = await installer.status(signal)
        if (state.status === 'conflict') return { status: 'conflict' as const }
        if (state.status === 'installed') installed += 1
      }
      return { status: installed === installers.length ? 'installed' as const : 'not-installed' as const }
    },
    async install(signal) {
      const initialStates = []
      for (const installer of installers) initialStates.push(await installer.status(signal))
      if (initialStates.some(state => state.status === 'conflict')) return { status: 'conflict', changed: false }
      if (initialStates.every(state => state.status === 'installed')) return { status: 'installed', changed: false }

      let changed = false
      for (const installer of installers) {
        const result = await installer.install(signal)
        if (result.status === 'conflict') return { status: 'conflict', changed: false }
        changed = changed || result.changed
      }
      return { status: 'installed', changed }
    },
  }
```

</details>

**依据 4 · 作者声明**：[plugins/dsh-ai-novel-writer/README.md:79-89](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/README.md#L79-L89)

DB/sidecars忽略、无导出、用户目录备份。

<details>
<summary>查看原文（11行）</summary>

```text
Back up the project folder yourself. The V2 database and its sidecars are excluded from Git by `.ai-novel/.gitignore`. A Git commit alone does not back up that database. Plugin project export is not provided.

Use a local workspace. Real-time cloud-synchronized folders and network drives are unsupported. The plugin does not import desktop `.vela` projects or synchronize them with desktop projects.

### Convert plugin V1 data for development

The exported `previewV1NovelMigration` and `migrateV1NovelProject` functions support an explicit plugin V1-to-V2 conversion. They are development APIs, not a desktop import feature.

Conversion archives the original five assets under `.ai-novel/v1-archive/<fingerprint>/` and checks the source again before publishing the staged database. It does not replace an existing database. A cross-device layout fails with `WRITE_FAILED`.

If validation fails after database publication, the error states that the database remains published. Inspect that state before retrying. The V1 archive is also excluded from Git, so keep an independent backup.
```

</details>

**依据 5 · 作者声明**：[plugins/dsh-ai-novel-writer/README.md:153-166](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/README.md#L153-L166)

作者qualification依赖精确DSH与浏览器，不是本次执行。

<details>
<summary>查看原文（14行）</summary>

````text
Set `DSH_SNAPSHOT=refresh` only when intentionally updating `tests/snapshots/complete-chapter.expected.json`. Review the resulting snapshot change.

## Release qualification

Qualification requires a clean DeepSeek Harness checkout at `47f943859bef60e4160492346772ded9b24f765a`, pnpm, tar, and locally installed Google Chrome. Supply the checkout's absolute path:

```powershell
pnpm run qualify -- --harness-root '<path-to-deepseek-harness>'
```

The command packs the plugin and installs those bytes into an isolated Web profile. It checks Preset installation, the exact V2 tools `novel_read` and `novel_propose_change`, human Proposal application, partial status, and durable state after restart. A browser skipped result is not qualified.

See [V2 development gates](docs/v2-development-gates.md) for evidence order and failure handling. Each run stores temporary logs, screenshots, and a machine-readable receipt under a task-owned `.runtime/.cache/` directory with `.vibe-owner.json` ownership and expiry.

````

</details>

#### 缺口

- 未在旧版Host安装、卸载/恢复备份或量化审阅净收益。
  **影响**：冻结兼容和无导出妨碍推荐当前新用户直接试用。
  **进一步探讨**：先可丢弃profile核安装/禁止通用写、read-propose-apply和目录备份恢复，记录模型与维护开销，再决定采用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验提案式创作的增量而不继承桌面结论？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

已有可复用机制是将模型建议作为带来源、基线和item状态的持久非权威提案，用户应用才生成项目事实。相对聊天复制可以减少“建议已采纳”的状态混淆，但结构校验、稳定ID、数据库事务并不能证明人物一致或作者更省事；不能把这一设计评成已验证文学质量改善。

未验证方向是在单章提案前展示基线差异和叙事约束冲突，并提供应用后按item的权威回读；仅从已有蓝图、角色和来源revision检验，不增加自动应用权限。相比当前generic提案/局部编辑，目标是帮助作者识别过时与角色关系冲突，代价是解析、误报和更重审阅，不能借用根桌面自动审稿。

最小实验以相同单章/模型/预算，对照现V2与冲突预览，注入人物改名但ID不变、蓝图变化、部分失败和过时提案，测错误接受、返工、审阅耗时与盲评质量。若只改善结构却不能降低错误接受，或误报耗时更大，则停止；本次未实现，不计当前贡献，也不解除冻结维护前提。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-ai-novel-writer/src/agent.ts:555-583](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/agent.ts#L555-L583)

当前提案边界。

<details>
<summary>查看原文（29行）</summary>

```text
  const propose = defineTool({
    name: 'novel_propose_change',
    description: 'Persist one non-authoritative proposal bundle for user review. Changes may contain aggregate replacements or closed artifact version commands, but this tool never writes authoritative project state. Proposal session, call, and canonical args identity are supplied by the Host; only a later user-approved proposal apply can create versions or select a final.',
    parameters: v2ProposeParameters,
    output: {
      schema: { type: 'json' },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    },
    isConcurrencySafe: () => false,
    async execute(args, exec) {
      parseProposalArgs(args as Record<string, unknown>)
      const sessionId = exec.agent?.session.id
      if (sessionId === undefined) throw new ToolArgsError(['AI novel V2 tools require a session identity'])
      const workspace = await resolveWorkspace(exec)
      const store: NovelStore = await openNovelStore(workspace.path, workspace.id, options)
      try {
        return await store.submitProposal({
          sessionId: String(sessionId),
          callId: String(exec.callId),
          argsHash: novelProposalArgsHash(exec.arguments),
          payload: exec.arguments,
        }, exec.signal) as unknown as JsonValue
      } finally {
        await store.dispose()
      }
    },
    presentCall: args => ({
      card: 'generic',
      title: '提交小说修改建议',
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:2553-2623](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/novel-store.ts#L2553-L2623)

item receipt与回读状态基础。

<details>
<summary>查看原文（71行）</summary>

```text
  #applyProposal(proposalId: string, signal: AbortSignal): NovelProposalApplyResult {
    const proposal = this.#proposalRow(proposalId)
    const appliedItemIds: string[] = []
    const items = this.#proposalItems(proposalId)
    const commands = items.map(item => this.#proposalCommand(item, proposal))
    const aggregateCommands = commands.filter(isAggregateProposalChange)
    const sharedSnapshotBaseGlobalRevision = aggregateCommands.length > 1
      && aggregateCommands.every(command => command.baseGlobalRevision === aggregateCommands[0]!.baseGlobalRevision)
      && new Set(aggregateCommands.map(command => aggregateKey(command.aggregate))).size === aggregateCommands.length
      ? aggregateCommands[0]!.baseGlobalRevision
      : undefined
    let previouslyAppliedAggregateItems = 0
    for (const [index, item] of items.entries()) {
      const command = commands[index]!
      if (item.status === 'applied' || item.status === 'discarded' || item.status === 'superseded') {
        if (item.status === 'applied' && isAggregateProposalChange(command)) previouslyAppliedAggregateItems += 1
        continue
      }
      if (item.status !== 'pending') {
        return { proposal: this.#proposalSummary(proposalId), appliedItemIds, stoppedItemId: item.item_id }
      }
      requireNotAborted(signal)
      try {
        this.#db.exec('BEGIN IMMEDIATE')
        const rebasedCommand = isAggregateProposalChange(command)
          && sharedSnapshotBaseGlobalRevision !== undefined
          && previouslyAppliedAggregateItems > 0
          && this.#currentRevisions(command.aggregate).global === sharedSnapshotBaseGlobalRevision + previouslyAppliedAggregateItems
          ? { ...command, baseGlobalRevision: sharedSnapshotBaseGlobalRevision + previouslyAppliedAggregateItems }
          : command
        const receipt = isAggregateProposalChange(rebasedCommand)
          ? this.#existingChange({
            ...rebasedCommand,
            operation: 'replace',
            provenance: { origin: 'model', sessionId: proposal.session_id, callId: proposal.call_id, argsHash: proposal.args_hash },
          } as NovelChangeSet) ?? this.#commitChangeInTransaction({
            ...rebasedCommand,
            operation: 'replace',
            provenance: { origin: 'model', sessionId: proposal.session_id, callId: proposal.call_id, argsHash: proposal.args_hash },
          } as NovelChangeSet)
          : this.#commitArtifactCommandInTransaction(rebasedCommand)
        const now = new Date().toISOString()
        this.#db.prepare(`UPDATE proposal_items SET status = 'applied', attempt_count = attempt_count + 1,
          failure_code = NULL, receipt = ?, updated_at = ? WHERE item_id = ?`)
          .run(stableJson(receipt), now, item.item_id)
        this.#setProposalStatus(proposalId, now)
        this.#db.exec('COMMIT')
        appliedItemIds.push(item.item_id)
        if (isAggregateProposalChange(command)) previouslyAppliedAggregateItems += 1
      } catch (error) {
        this.#rollback()
        if (error instanceof NovelStoreError && error.code === 'CANCELLED') throw error
        const code: NovelStoreErrorCode = error instanceof NovelStoreError ? error.code : 'WRITE_FAILED'
        const status: NovelProposalItemStatus = code === 'STALE_REVISION' ? 'stale' : 'failed'
        const now = new Date().toISOString()
        this.#db.exec('BEGIN IMMEDIATE')
        try {
          this.#db.prepare(`UPDATE proposal_items SET status = ?, attempt_count = attempt_count + 1,
            failure_code = ?, updated_at = ? WHERE item_id = ?`).run(status, code, now, item.item_id)
          this.#setProposalStatus(proposalId, now)
          this.#db.exec('COMMIT')
        } catch (recordFailure) {
          this.#rollback()
          if (recordFailure instanceof NovelStoreError) throw recordFailure
          throw new NovelStoreError('WRITE_FAILED', 'proposal item failure could not be recorded', { cause: recordFailure })
        }
        return { proposal: this.#proposalSummary(proposalId), appliedItemIds, stoppedItemId: item.item_id }
      }
    }
    return { proposal: this.#proposalSummary(proposalId), appliedItemIds }
  }
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:1365-1407](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/src/novel-store.ts#L1365-L1407)

结构人物关系约束不是叙事事实检验。

<details>
<summary>查看原文（43行）</summary>

```text
  if (!Array.isArray(record.items) || !Array.isArray(record.relationships)) {
    throw new NovelStoreError('INVALID_CONTENT', 'characters items and relationships must be arrays')
  }
  const items = record.items.map(item => {
    const row = requireExactKeys(item, ['characterId', 'name', 'role', 'summary', 'goal', 'currentState', 'notes'], 'character')
    return {
      characterId: requireNonEmptyString(row.characterId, 'character.characterId'),
      name: requireNonEmptyString(row.name, 'character.name'),
      role: requireNonEmptyString(row.role, 'character.role'),
      summary: requireString(row.summary, 'character.summary'),
      goal: requireString(row.goal, 'character.goal'),
      currentState: requireString(row.currentState, 'character.currentState'),
      notes: requireString(row.notes, 'character.notes'),
    }
  })
  const ids = new Set(items.map(item => item.characterId))
  if (ids.size !== items.length) throw new NovelStoreError('INVALID_CONTENT', 'character.characterId must be unique')
  const relationships = record.relationships.map(item => {
    const row = requireExactKeys(item, ['fromCharacterId', 'toCharacterId', 'relation', 'notes'], 'relationship')
    const fromCharacterId = requireNonEmptyString(row.fromCharacterId, 'relationship.fromCharacterId')
    const toCharacterId = requireNonEmptyString(row.toCharacterId, 'relationship.toCharacterId')
    if (!ids.has(fromCharacterId) || !ids.has(toCharacterId)) {
      throw new NovelStoreError('INVALID_CONTENT', 'relationship references an unknown character')
    }
    return {
      fromCharacterId,
      toCharacterId,
      relation: requireNonEmptyString(row.relation, 'relationship.relation'),
      notes: requireString(row.notes, 'relationship.notes'),
    }
  })
  const relationshipKeys = new Set(relationships.map(item => `${item.fromCharacterId}\0${item.toCharacterId}\0${item.relation}`))
  if (relationshipKeys.size !== relationships.length) {
    throw new NovelStoreError('INVALID_CONTENT', 'relationship must be unique')
  }
  return { items, relationships }
}

function validateChapter(value: NovelChapterNextValue): NovelChapterNextValue {
  const record = requireExactKeys(value, [
    'chapter', 'title', 'purpose', 'plotBeats', 'characters', 'keyEvents', 'suspense', 'status',
  ], 'chapter nextValue')
  const validated = {
```

</details>

**依据 4 · 作者声明**：[plugins/dsh-ai-novel-writer/README.md:35-37](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/README.md#L35-L37)

插件无桌面批量/自动审稿。

```text
## Write with the V2 workbench

V2 supports project settings, story architecture, characters, a whole-book outline, chapter blueprints, and prose. Work on one chapter at a time. It does not provide the desktop app's batch workflows or automated review process.
```

#### 缺口

- 叙事约束预览的误报率、净人审收益与维护可行性未知。
  **影响**：不能称未来方向已解决创作一致性或值得恢复开发。
  **进一步探讨**：预设错误接受/返工和时间阈值，同章对照；无净增益则不继续。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
