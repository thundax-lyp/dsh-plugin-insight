# billion-context

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[be611a8](https://github.com/ranxianglei/billion-context/tree/be611a8566c22ee0a65fb5765365671d47e810d5)

<!-- BEGIN META -->
[![GitHub ★ 4,113](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C113&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ranxianglei/billion-context) [![npm 30d 2,889,440](https://img.shields.io/static/v1?label=npm+30d&message=2%2C889%2C440&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context)
<!-- END META -->

> **功能**：为多种 Agent 提供分层上下文压缩、按需恢复与搜索，并通过代理和原生插件接入长期会话。

> **亮点**：把可定位范围块/one-full缓存恢复与DSH工具/代理/压缩门禁及partial/no-op收据接成链，便于保留摘要同时有条件回读，而非每次整段重总结，见 [Q02](#research-q02)/[Q03](#research-q03)。

> **主要限制**：来源缺失可退回摘要而非原文，代理直连/门禁失配可能失去预期保护，HTTP取消未证服务端中止且工具成功未await落盘；5倍倍率不等当前任务保真/净费用，见 [Q03](#research-q03)至 [Q05](#research-q05)。

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
  - [Q01 · 根项目与DSH适配是什么关系，实际任务是什么？](#detail-section-11)
  - [Q02 · DSH压缩调用如何进入当前会话并产生可区分结果？](#detail-section-12)
  - [Q03 · decompress能总是恢复原文吗，会不会写文件？](#detail-section-13)
  - [Q04 · 代理、原生压缩、持久与取消的故障边界是什么？](#detail-section-14)
  - [Q05 · 什么条件下能低风险试用，如何退出？](#detail-section-15)
  - [Q06 · 可迁移的贡献与下一步假设是什么，怎样推翻？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长编码任务需要保留历史决定与细节，可在脱敏独立profile核一个范围的压缩后恢复；成功是任务保真，不是token累计，见 [Q01](#research-q01)。

DSH原生整段摘要、人工换窗和保留原日志。范围块与按需回读更细，但仍有模型语义损失、复杂状态与恢复缺口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| compress | 范围摘要替换 | 保护区/net shrink非语义保真 |
| decompress | one/full有条件取回 | 可回退summary/归档失败/文件写出 |
| 代理 | 模型请求改写/状态 | 实际流量须核，其他传输未全验 |
| 门禁 | 协调原生自动压缩 | 内部hook敏感、整bundle退出 |
| 状态 | 区分partial/refused/no-op | HTTP200非效果/持久保证 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 缺失或边界 |
| --- | --- | --- |
| Node>=20/含dist包 | 导出与CLI | 声明不等发布产物一致验收 |
| DSH tools/commands/agents/llm | 注册/归属/路由 | 实际Host版本需核 |
| native+独立gate整bundle | 工具和原生压缩协调 | internal/config版本敏感 |
| 本机代理/模型供应商 | 请求与摘要 | 代理失败可直连未压缩 |
| 可写状态/原文缓存/临时目录 | 持久与回读 | 成功响应不等已持久 |
| 可选externalSummary | 独立摘要 | 新费用/隐私目的地 |

#### 步骤

| 步骤 | 操作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 独立profile/目录、备份原日志 | 不用唯一生产会话 |
| 接线 | 核工具、/acp、真实代理流量 | 加载不等已压缩 |
| 门禁 | 核原生checkpoint是否停 | 只改顶层auto不够 |
| 一范围 | 压缩已完成片段并full读取事实 | item数/内容核原文 |
| 异常 | 查块/落盘/路由再重试 | 取消不等未提交 |
| 退出 | 移除整bundle/重启 | 核原生压缩和配置恢复 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工 | 限制 |
| --- | --- | --- | --- |
| 首次 | 包/代理/可写状态 | profile/路由/门禁/备份 | 未测时长 |
| 持续 | 摘要、取回、缓存变化与存储 | 事实核对/版本维护 | 倍率非净费 |
| 失败 | 部分状态/可能服务端继续 | 查块/磁盘/日志和重试 | 成功非durable |
| 退出 | 原文缓存/临时导出残留 | 整体卸载/配置与清理核验 | installer全量未审 |

#### 效果

| 项目 | 当前支持 | 未确认 |
| --- | --- | --- |
| 细范围管理 | kernel块/保护区/工具收据 | 摘要事实保真 |
| 按需恢复 | 缓存/当前来源/full模式 | 缺失/归档无条件还原 |
| 长会话 | 代理替换与门禁接线 | 月长生产任务成功率 |
| 成本 | 作者倍率主张/减少输入机制 | 当前DSH单位任务净账单 |

> **思考**：来源缺失可退回摘要而非原文，代理直连/门禁失配可能失去预期保护，HTTP取消未证服务端中止且工具成功未await落盘；5倍倍率不等当前任务保真/净费用，见 [Q03](#research-q03)至 [Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把可定位范围块/one-full缓存恢复与DSH工具/代理/压缩门禁及partial/no-op收据接成链，便于保留摘要同时有条件回读，而非每次整段重总结，见 [Q02](#research-q02)/[Q03](#research-q03)。

范围/保护区、最近会话绑定、partial收据和独立gate有实际实现；核心边界是进程内锁非跨实例、markDirty非落盘确认、HTTP取消链缺signal，恢复来源可退化，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

来源缺失可退回摘要而非原文，代理直连/门禁失配可能失去预期保护，HTTP取消未证服务端中止且工具成功未await落盘；5倍倍率不等当前任务保真/净费用，见 [Q03](#research-q03)至 [Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只在独立脱敏profile对一个已完成范围试压缩/全文回读，核真实代理与原生门禁；若来源退摘要、持续直连或checkpoint冲突，停扩用并移除整bundle回原生与原日志，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定0.1.212根含原生DSH与多宿主CLI；本轮仅定向核DSH工具→代理锁→kernel/缓存恢复及门禁/持久/取消代表链。没有执行目标、Host、模型或基准；其他宿主/完整传输/安装更新/所有搜索与存储不在已验范围。

- 已检查：作者 README、包清单、源码路径 README.md、dsh.bundle.patch.yml、kernel/src/compress.ts、kernel/src/decompress.ts、package.json、src/agent/dsh-compaction-disable.ts、src/agent/dsh-compaction-gate.ts、src/agent/dsh-native-client.ts、src/agent/dsh-native.ts、src/agent/native-intercept.ts、src/agent/shared.ts、src/decompress-shared.ts、src/external-summary-compress.ts、src/loop/core.ts、src/persist.ts、src/plugin.ts、src/preflight.ts、src/server/admin.ts、src/session.ts、src/stream.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根package/bundle、DSH动态工具/启动/代表fetch/归属、代理管理门禁与tool dispatch、kernel clone/保护区和stream提交/cache、decompress one/full/回退/临时文件、externalSummary取消/partial、scheduleSave代表故障/flush；未跑/未全审其他宿主/协议/WS/installer自更新/所有search-range-image及索引GC。
- 下一步：- 下一步独立profile验证一范围压缩、精确事实回读和原生日志对照。
- 代理断开、取消后查状态、写失败分别核结果与持久。
- 三种来源故障盲答测试和全费记录尚未执行。

**分析版本**

- **仓库**：[ranxianglei/billion-context](https://github.com/ranxianglei/billion-context)
- **版本号**：0.1.212（[固定提交 be611a8](https://github.com/ranxianglei/billion-context/tree/be611a8566c22ee0a65fb5765365671d47e810d5)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

恢复结果显式区分缓存原文/当前来源/仅摘要，并用三种来源故障的事实盲答对照；若现有item数与失败已足够、误用不降或成本抵消，则放弃，见 [Q06](#research-q06)。

- 下一步独立profile验证一范围压缩、精确事实回读和原生日志对照。
- 代理断开、取消后查状态、写失败分别核结果与持久。
- 三种来源故障盲答测试和全费记录尚未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 146 | 20673 | — | — | 404235 |
| .ts | source | 413 | 192185 | 129544 | 54158 | — |
| .mjs | source | 32 | 6873 | 4813 | 1656 | — |
| .ts | test | 1294 | 368756 | 307138 | 42273 | — |
| .mjs | test | 5 | 835 | 636 | 186 | — |
| .md | test | 1 | 359 | — | — | 2707 |
| .mts | example | 2 | 85 | 71 | 16 | — |
| .mjs | example | 1 | 21 | 16 | 4 | — |
| .ts | example | 1 | 67 | 48 | 16 | — |
| .md | example | 1 | 34 | — | — | 545 |
| .js | source | 1 | 606 | 590 | 26 | — |

</details>

**活跃度**

[![Issue 未关闭 464](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=464&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1,724](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1%2C724&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 1,311](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1%2C311&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：定向核DSH原生接线、范围压缩/原文恢复与代理/门禁/取消/持久故障，分清技术贡献和未验任务效果。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目与DSH适配是什么关系，实际任务是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

固定版本0.1.212根项目既提供bili/bili-proxy CLI、多宿主入口，也以默认exports指向DSH Host入口并声明Web/client和bundle，是包含原生DSH适配的上下文压缩插件产品，不能把根仓全部CLI能力都算DSH已验。面向长期编码任务，想在有限窗口继续使用历史决策与细节；成功应是任务正确完成和必要事实可取回，不是累计十亿token本身。参照DSH原生整段摘要和人工换窗，本项提供可定位范围块/分层摘要与按需读取材料，细粒度不同，但不是无损压缩。

README的100K足够、5倍少token、月长会话是作者定位/效果主张；本轮不跑基准，不把其倍率当当前DSH端到端结果。kernel位于同仓，是产品实现的一部分，不能把DSH接线归因为重新发明整个压缩方法，亦未做新颖性穷尽检索。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-25](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/package.json#L1-L25)

0.1.212与默认DSH、server、client及CLI出口。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "name": "billion-context",
  "version": "0.1.212",
  "description": "A context-compression plugin \u2014 small context windows (a 100K context is enough), 5x fewer tokens, month-long single sessions (billions of tokens), and compression quality \u2014 for all agents: pi, OpenCode, Codex, Claude Code, and more. billion-context is all you need.",
  "type": "module",
  "main": "dist/index.js",
  "exports": {
    ".": "./dist/agent/dsh-native.js",
    "./server": "./dist/agent/opencode-native.js",
    "./dsh": "./dist/agent/dsh-native.js",
    "./dsh-compaction-gate": "./dist/agent/dsh-compaction-gate.js",
    "./package.json": "./package.json",
    "./dsh/package.json": "./package.json",
    "./client": "./dist/agent/dsh-native-client.js"
  },
  "bin": {
    "bili": "./dist/index.js",
    "bili-proxy": "./dist/index.js"
  },
  "scripts": {
    "build": "npm --prefix kernel run build && npm --prefix pi-subagents run build && tsup && node scripts/write-build-info.mjs && node scripts/check-dist-import-annotations.mjs && node scripts/check-dist-external.mjs",
    "prepare": "node scripts/check-dist-ready.mjs",
    "registry:snapshot": "node scripts/update-registry-snapshot.mjs",
    "codex-models:snapshot": "node scripts/update-codex-models-snapshot.mjs",
    "pretypecheck": "npm --prefix kernel run build && npm --prefix pi-subagents run build",
```

</details>

**依据 2 · 源码核查**：[package.json:95-129](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/package.json#L95-L129)

Node和发布文件/DSH声明。

<details>
<summary>查看原文（35行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "files": [
    "LICENSE",
    "README.md",
    "CONFIGURATION.md",
    "CONFIGURATION.zh-CN.md",
    "dist",
    "dsh.bundle.patch.yml",
    "hermes-plugin",
    "paper/*.md",
    "paper/figures/*.png",
    "website/articles.json",
    "website/blog/posts"
  ],
  "pi": {
    "image": "https://raw.githubusercontent.com/ranxianglei/billion-context/master/docs/logo.png",
    "extensions": [
      "./dist/agent/pi-native.js"
    ]
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org"
  },
  "dsh": {
    "bundle": {
      "patch": "./dsh.bundle.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  }
}
```

</details>

**依据 3 · 源码核查**：[src/agent/dsh-native-client.ts:1106-1113](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/agent/dsh-native-client.ts#L1106-L1113)

Web真实settings与bundle配置slot注册。

```text
    ctx.slots.inject(
        "settings.section",
        () => ctx.slots.register({ name: "settings.section", id: "bili", order: 100, label: () => t("nav"), locale: NS }, panel(true)),
    );
    ctx.slots.inject(
        "plugins.bundle.config",
        () => ctx.slots.register({ name: "plugins.bundle.config", key: "billion-context", locale: NS }, panel(false)),
    );
```

**依据 4 · 源码核查**：[dsh.bundle.patch.yml:20-38](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/dsh.bundle.patch.yml#L20-L38)

真实Host双入口与compaction/preset接线。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh.profile.bundles instead.
- insert:
    - id: bili-native
      name: billion-context
    - id: bili-compaction-gate
      name: billion-context/dsh-compaction-gate
- id: compaction-basic
  config:
    auto: false
# #3354: keep in sync with writeDshAcpPatch in src/launcher.ts — entry inject
# lists are REPLACED by patches, not concatenated; if a future dsh ships its
# own inject list on these entries, merge manually in BOTH layers.
- id: preset-standard
  inject: [biliBasicCompactionPolicy]
- id: preset-ptc
  inject: [biliBasicCompactionPolicy]
- id: preset-minimal
  inject: [biliBasicCompactionPolicy]
- id: preset-cordis
```

</details>

**依据 5 · 作者声明**：[README.md:1-7](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/README.md#L1-L7)

作者压缩/倍率定位。

```text
# billion-context

<p align="center"><a href="./README.md">English</a> | <a href="./README.zh-CN.md">中文</a></p>

<p align="center"><strong>Context-compression plugin</strong> — <em>billion-context is all you need.</em></p>

<p align="center"><sub>small context windows (100K is enough) · <em>5× fewer tokens</em> · month-long single sessions (billions of tokens) · high compression quality</sub></p>
```

#### 缺口

- 未独立比较原生摘要保真、当前版本倍率及其他宿主。
  **影响**：不能仅因长会话宣传推荐所有长任务。
  **进一步探讨**：选一个脱敏长期任务，在相同模型/验收题下比较原生摘要、人工换窗和本插件。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH压缩调用如何进入当前会话并产生可区分结果？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

native从代理manifest动态注册真实Host工具，execute读取当前活base，取exec.agent.session.id且必须非空，forwardTool用其作为conversationId而非信模型参数，附nativeCaller；代理端据会话/见证等路由，不能由此声称公开API存在加密身份认证。管理入口本身有隧道标记拒绝、loopback和Host/Origin可信名门禁，这是本机信任边界，非多用户租户隔离。

handlePluginTool在同会话锁内读取remembered processed/original快照，compressMessages另传原始历史，executeProxyToolAsync分派compress到applyConfiguredCompression、decompress到共享恢复。默认压缩用模型已提交的summary/range；配置externalSummary时才另调摘要plan，取消/状态revision变化后拒绝提交，并能返回只成功部分范围的partial。applyRanges调用kernel：kernel先clone状态并计算保护区，再处理范围；Host还有覆盖不丢与net shrink等提交前门禁，之后换session.state并缓存新块原文。摘要短并不证明摘要正确，门禁不是语义验收或可信人工审批。

传输ok=true只表示工具执行，另有outcome/blocksCreated；forwardTool将failure/refused标failed，DSH execute抛错让宿主显示失败；partial附文本说明。无错误但无可折范围可返回applied且blocksCreated0的no-op，不能由success统计说有效压缩已发生。

#### 证据与依据

**依据 1 · 源码核查**：[src/agent/dsh-native.ts:982-1013](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/agent/dsh-native.ts#L982-L1013)

manifest到真实注册和状态。

<details>
<summary>查看原文（32行）</summary>

```text
async function registerTools(ctx: PluginContext): Promise<void> {
    if (register.pending !== undefined) return register.pending;
    const base = register.base;
    if (register.toolsReady || base === undefined) return;
    register.pending = (async () => {
        const tools = await fetchManifest(base, "anthropic");
        // #2082: land on the CURRENT context, not the one that started this
        // flight — a re-activation mid-fetch must not register into (or die
        // on) the deactivated context captured at call time.
        const target = activeCtx ?? ctx;
        let adopted = 0;
        for (const tool of tools) {
            try {
                target.tools.register(toolDefinition(tool));
            } catch (err) {
                // #3380: idempotent adoption — a name this process ALREADY
                // holds in the host tool layer throws "already registered";
                // that registration is exactly what we want, so skip it and
                // register the rest (also converges a partial registration
                // left by an earlier interrupted flight).
                if (!errMessage(err).includes("already registered")) throw err;
                adopted += 1;
            }
        }
        if (adopted > 0 && !regAdoptLogged) {
            regAdoptLogged = true;
            persistClientEvent(`tool registration adopted ${adopted} pre-existing registration(s) from this process — continuing`);
        }
        register.toolsReady = true;
        register.failStreak = 0;
        register.lastRegistrationError = undefined;
    })()
```

</details>

**依据 2 · 源码核查**：[src/agent/dsh-native.ts:917-944](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/agent/dsh-native.ts#L917-L944)

session取自Host、活base、失败抛错。

<details>
<summary>查看原文（28行）</summary>

```text
function toolDefinition(tool: ManifestTool): ToolDefinition {
    return {
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
        output: {
            schema: { type: "string" },
            render: (_args, value) => [{ type: "text", text: typeof value === "string" ? value : String(value ?? "") }],
        },
        execute: async (args, exec) => {
            // #983: read the LIVE base — a respawn after a proxy death moves
            // the origin, and a captured base would keep firing at a dead port.
            const base = register.base;
            if (base === undefined) {
                throw new Error("bili: proxy is down — recovery in progress, retry shortly");
            }
            const sid = exec.agent?.session?.id;
            if (typeof sid !== "string" || sid.length === 0) {
                throw new Error(`bili tool ${tool.name} requires an owning agent session`);
            }
            const out = await forwardTool(base, sid, tool.name, args, exec.signal, true);
            // #2204: dsh tool results are plain strings — a business failure
            // throws so the host renders an error, not success text.
            if (out.failed) throw new Error(out.text);
            return out.text;
        },
    };
}
```

</details>

**依据 3 · 源码核查**：[src/agent/shared.ts:379-407](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/agent/shared.ts#L379-L407)

真实POST/nativeCaller和outcome/partial转换。

<details>
<summary>查看原文（29行）</summary>

```text
export async function forwardTool(proxyBase: string, conversationId: string, tool: string, args: unknown, signal?: AbortSignal, nativeCaller: boolean = false, toolCallId?: string): Promise<ForwardedToolResult> {
    const body: { conversationId: string; tool: string; args: unknown; nativeCaller?: boolean; toolCallId?: string } = { conversationId, tool, args: args ?? {} };
    if (toolCallId !== undefined) body.toolCallId = toolCallId;
    // #2072: host-native agents (pi / dsh / opencode) stamp a per-call id minted
    // by the host's own session manager — declare it so a stale sibling witness
    // can neither redirect nor fail-closed the call (ladder rung 0, #2024/#2016).
    // Truthiness guard (not .length): a host passing a non-string id degrades to
    // the legacy id-less wire instead of throwing (same shape as src/mcp.ts).
    if (nativeCaller && conversationId) body.nativeCaller = true;
    const { ok, status, json } = await fetchJson(`${proxyBase}/__bili/plugin/tool`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    }, effectiveToolTimeoutMs(proxyBase, tool), signal);
    const data = json as { ok?: boolean; result?: string; error?: string; outcome?: unknown; blocksCreated?: unknown } | undefined;
    if (!ok || !data?.ok) {
        throw new Error(`bili proxy tool ${tool} failed (${status}): ${data?.error ?? "unknown error"}`);
    }
    const outcome = parseToolOutcome(data.outcome);
    const blocksCreated = parseBlocksCreated(data.blocksCreated);
    let text = data.result ?? "";
    // #2752: a partial fold must stay distinguishable on lanes whose host shape
    // carries no structured state — the note rides the text. Applied/refused/
    // failure envelopes keep their exact historical bytes (no note).
    if (outcome === "partial") text += `\n${partialOutcomeNote(blocksCreated)}`;
    const out: ForwardedToolResult = { text, failed: outcome === "failure" || outcome === "refused" };
    if (outcome !== undefined) out.outcome = outcome;
    if (blocksCreated !== undefined) out.blocksCreated = blocksCreated;
    return out;
```

</details>

**依据 4 · 源码核查**：[src/server/admin.ts:208-235](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/server/admin.ts#L208-L235)

管理面隧道、回环与可信Origin/Host门禁。

<details>
<summary>查看原文（28行）</summary>

```text
    // gates below always judge a path, never a full URL.
    const isAdminPath = isManagementPath(req.url);
    // #409: management must never be reachable THROUGH the bili tunnel, not
    // even from a loopback client: the tunnel's inner connection originates
    // from the proxy itself, so the remoteAddress gate alone is satisfied and
    // a `--host 0.0.0.0` peer could otherwise PUT /__bili/config over the
    // tunnel. forward() stamps this marker on every /bili/ absolute-URL
    // forward; clients have no legitimate reason to send it, and a spoofed
    // value only locks the spoofer out of admin paths.
    if (isAdminPath && headerValue(req, BILI_TUNNEL_HEADER) !== undefined) {
        res.writeHead(403, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "management endpoints are not reachable through the bili tunnel" }));
        return;
    }
    if (isAdminPath && !isLoopbackAddress(req.socket.remoteAddress)) {
        res.writeHead(403, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "management endpoints are loopback-only; access denied for " + (req.socket.remoteAddress ?? "unknown") }));
        return;
    }
    // localPort, not opts.port: when listening on port 0 (dynamic assignment,
    // programmatic embedding, tests) the real port differs from opts.port and
    // pinning to the configured value would 403 every admin request.
    if (isAdminPath && !isTrustedAdminOrigin(req.headers.origin, req.headers.host, adminTrustedHostnames(opts.host))) {
        res.writeHead(403, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "management request origin does not match the local bili UI" }));
        return;
    }
    if (req.method === "GET" && req.url === "/__bili/stats") return sendStats(res);
```

</details>

**依据 5 · 源码核查**：[src/plugin.ts:2210-2253](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/plugin.ts#L2210-L2253)

同会话锁、原始快照与实际工具执行。

<details>
<summary>查看原文（44行）</summary>

```text
    delete args.conversation_id;
    const callId = typeof parsed.toolCallId === "string" ? parsed.toolCallId : `${PLUGIN_FOLD_CALLID_PREFIX}${Date.now().toString(36)}`;
    acquireInFlight(session);
    let result: ProxyToolResult | undefined;
    let retrievalExport: RetrievalExport | undefined;
    try {
        result = await withSessionLock(session, async () => {
            if (parsed.expectedRevision !== undefined) {
                try {
                    if (sessionRevisionOf(session) !== parsed.expectedRevision) {
                        forkReply(res, 409, { ok: false, code: "PARENT_REVISION_CONFLICT", error: "session revision changed" });
                        return undefined;
                    }
                } catch (err) {
                    forkReply(res, 409, { ok: false, status: "unavailable", code: "SNAPSHOT_UNAVAILABLE", error: String(err) });
                    return undefined;
                }
            }
            // Read the remembered snapshot UNDER the session lock: the model
            // request rewrites remembered atomically under this same lock
            // (rememberPluginMessages), so a racing tool call sees a consistent
            // state instead of a stale/empty window.
            const mem = session.transient?.pluginMessages;
            const messages = mem ? (mem.processed.length > 0 ? mem.processed : mem.original) : (session.pluginSnapshot ?? []);
            const before = currentContextObservation(session);
            const creditBefore = session.stats.compressCreditTokens ?? 0;
            const compressBefore = session.lastCompress;
            const pendingBefore = new Set(session.pendingRetrievals.map((p) => p.ref));
            const toolResult = await executeProxyToolAsync(tool, args, {
                core: deps.core,
                // #833: run proxy tools under the session's last resolved Config
                // (same values the wire path used), not the base kernelConfig.
                config: effectiveConfig(session, deps.config),
                messages,
                // #2627: compress against the RAW history, not the processed
                // outbound view — on the Responses wire that view carries the
                // synthetic acp_turn_sep_* ordering separators, which would be
                // registered into new blocks' coverage and read back as
                // permanent drift against the client's unchanged history
                // (same split as the relay loop ctx).
                compressMessages: mem && mem.original.length > 0 ? mem.original : undefined,
                session,
                log: (m) => deps.log("info", `[${session.id}] [plugin] ${m}`),
            }, callId, undefined, deps.signal);
```

</details>

**依据 6 · 源码核查**：[src/loop/core.ts:389-424](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/loop/core.ts#L389-L424)

compress/decompress真实分派。

<details>
<summary>查看原文（36行）</summary>

```text
export async function executeProxyToolAsync(
    toolName: string, args: Record<string, unknown>, ctx: LoopCtx,
    callId?: string, rawArguments?: string, signal?: AbortSignal,
): Promise<ProxyToolResult> {
    // #3400: async because it reads the spilled original from disk. The result
    // carries the image bytes; the loop attaches them as an ephemeral carrier
    // message (see proxyResults below).
    if (toolName === READ_ORIGINAL_IMAGE_TOOL_NAME) return executeReadOriginalImage(args, ctx.session, (lvl, msg) => ctx.log(`[${lvl}] ${msg}`));
    if (toolName !== "compress") return executeProxyTool(toolName, args, ctx, callId, rawArguments);
    const input = typeof rawArguments === "string" && rawArguments.length > 0 ? rawArguments : args;
    return applyConfiguredCompression(input, ctx, callId, signal);
}

export function executeProxyTool(
    toolName: string,
    args: Record<string, unknown>,
    ctx: LoopCtx,
    callId?: string,
    rawArguments?: string,
): ProxyToolResult {
    if (toolName === "compress") {
        // #1502: on strict-JSON.parse failure the caller passes the raw argument
        // string here — the kernel's lenient parser salvages fence/trailing-
        // comma/single-quote/truncated inputs that the degraded {} would drop.
        const input = typeof rawArguments === "string" && rawArguments.length > 0 ? rawArguments : args;
        return applyRanges(parseCompressInput(input, callId), ctx);
    }
    if (toolName === "decompress") {
        return resolveDecompress(args, ctx);
    }
    if (toolName === "search_context") {
        return executeSearchContextTarget(args, ctx.core, ctx.session.id, ctx.session.state, ctx);
    }
    if (toolName === "acp_status") {
        return handleAcpStatus(args, ctx);
    }
```

</details>

**依据 7 · 源码核查**：[src/external-summary-compress.ts:37-60](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/external-summary-compress.ts#L37-L60)

外部摘要可选及取消初检。

<details>
<summary>查看原文（24行）</summary>

```text
export async function applyConfiguredCompression(input: unknown, ctx: RewriteCtx, callId?: string, signal?: AbortSignal): Promise<ProxyToolResult> {
    if (signal?.aborted) return compressResult("[Compression FAILED: cancelled. Nothing compressed.]", "refused", 0);
    // The plan rides the request Config rail (#833: ctx.config is the
    // session's effective Config — same cascade that produced the wire).
    let plan;
    try { plan = configuredSummaryPlan((ctx.config as ResolvedKernelConfig).externalSummary, ctx.session.id); }
    catch { return compressResult("[Compression FAILED: external summary configuration is invalid. Nothing compressed.]", "refused", 0); }
    if (!plan) return applyRanges(parseCompressInput(input, callId), ctx);
    const parsed = parseCompressInput(withOptionalSummaries(input), callId);
    if (parsed.ranges.length === 0) return applyRanges(parsed, ctx);
    normalizeRangeOrder(parsed.ranges);
    recoverEvictedView(ctx);
    const noView = noVisibleContextRefusal(ctx, parsed.ranges);
    if (noView) return noView;
    // #5558: resolve superseded refs BEFORE the probe preview — the preview
    // judges foldability while applyRanges re-resolves refs on every entry, so
    // judging on untranslated refs lets an unanchorable stale cite read as "no
    // change" here yet translate and fold under a synthetic probe summary in
    // there, committing content without the configured external summarizer.
    // One projection for judgment AND execution (#3236 discipline).
    const resolved = supersededRefRejection(parsed.ranges, ctx.session);
    if (resolved.rejection !== null) return applyRanges({ ...parsed, ranges: resolved.translatedRanges }, ctx);
    const state = ctx.session.state;
    const revision = ctx.session.revisionEpoch;
```

</details>

**依据 8 · 源码核查**：[src/external-summary-compress.ts:116-138](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/external-summary-compress.ts#L116-L138)

摘要后revision/取消门禁与partial。

<details>
<summary>查看原文（23行）</summary>

```text
    const batch = await plan.summarize(work, signal);
    if (signal?.aborted || ctx.session.state !== state || ctx.session.revisionEpoch !== revision) return compressResult("[Compression FAILED: cancelled or session changed while generating external summaries. Nothing compressed.]", "refused", 0);
    const successful: ParsedRange[] = [];
    for (const [index, result] of batch.results.entries()) {
        if (result.status === "success") successful.push({ ...valid[index], summary: result.summary, compressCallId: newExternalCallId() });
    }
    // #3635: full failure description (parity with the preflight log line) so
    // an over-cap rejection is visible with its length reason, not bare "batch=finished".
    ctx.log(`[external-summary] completed ${successful.length}/${parsed.ranges.length} range(s); ${describeExternalSummaryFailure(batch)}`);
    // #4833: the bounded attempt diagnostics (source + budgets + outcomes) ride
    // the tool result too — enums and numbers only, never payload bytes.
    if (successful.length === 0) return compressResult(`[Compression FAILED: all configured external summary candidates failed or exceeded their budget. Nothing compressed; do not retry unchanged configuration — summaries longer than the configured cap are rejected whole, so raise compress.maxSummaryLength or request less via per-range summaryMaxChars.] [${describeExternalSummaryFailure(batch)}]`, "refused", 0);
    const applied = applyRanges({ ...parsed, ranges: successful }, ctx);
    // Client call arguments carry only an optional hint, never the generated summary.
    // In-place refolds retain their old call id in the kernel; keep their anchor too.
    for (const block of ctx.session.state.blocks) {
        if (before.get(block.blockId)?.restoredInline && !block.restoredInline) block.compressCallId = newExternalCallId();
    }
    if (successful.length < parsed.ranges.length && (applied.blocksCreated ?? 0) > 0) return {
        ...applied, outcome: "partial", text: `${applied.text}\n[External summary: ${parsed.ranges.length - successful.length} selected range(s) were not compressed.]`,
    };
    return applied;
}
```

</details>

**依据 9 · 源码核查**：[kernel/src/compress.ts:326-363](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/kernel/src/compress.ts#L326-L363)

clone状态与保护区。

<details>
<summary>查看原文（38行）</summary>

```text
  function applyCompression(
    input: ApplyCompressionInput,
  ): ApplyCompressionResult {
    const state: CompressionState = cloneState(input.state);
    // #816 family: a model-authored summary can carry an unpaired surrogate
    // half — e.g. the model copies a literal \uXXXX escape out of tool output
    // into the tool-call argument, and JSON.parse of that argument yields a
    // real lone code unit. Stored verbatim, it poisons every later request
    // body that re-serializes the state (strict upstreams reject the whole
    // body, non-retryable). Scrub at ingest so state never carries one. The
    // wire layer (loop fetchUpstream / relay forward) scrubs again as the
    // belt-and-braces for already-poisoned persisted state.
    for (const spec of input.ranges) {
      if (spec.summary) spec.summary = scrubLoneSurrogates(spec.summary);
    }
    // Lazy run-id allocation (#2370): never advance nextRunId on a no-op
    // failure — the host forkSnapshot fingerprint hashes full state, so a bump
    // here would churn contextGeneration on every failed manual tool.
    let allocatedRunId: string | null = null;
    const runIdOf = (): string => (allocatedRunId ??= allocateRunId(state));
    let blocksCreated = 0;
    let tokensCompressed = 0;
    const errors: string[] = [];
    const warnings: string[] = [];
    const notes: string[] = [];

    // Default to the soft-protected zone (recent-N + last user message) when the
    // caller doesn't pass an explicit set. This makes applyCompression safe by
    // default; applySingleRange enforces it as a hard backstop.
    const protectedMessageIds =
      input.protectedMessageIds ??
      computeProtectedRefs(
        input.messages,
        input.state,
        input.config,
        countTokens,
      );

```

</details>

**依据 10 · 源码核查**：[src/stream.ts:1268-1287](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/stream.ts#L1268-L1287)

无net shrink拒绝后实际提交状态。

<details>
<summary>查看原文（20行）</summary>

```text
        }
        if (r.blocksCreated > 0 && touchedBlocks > 0 && netDelta <= 0) {
            const detail = ranges.map((rg) => `${rg.startRef}–${rg.endRef}`).join(", ");
            const revNote = revs.length > 0
                ? ` Note: startId > endId in range(s) ${revs.map((rg) => `${rg.startRef}→${rg.endRef}`).join(", ")} — your refs were reversed and normalized to ascending order before evaluation.`
                : "";
            const netDesc = netDelta < 0
                ? `committing it would grow the context by ${-netDelta} token(s)`
                : `committing it leaves the context size unchanged`;
            // #847 repeat-guard: re-issuing the SAME bloated range escalates
            // advice; deliberately NOT fed into the #2146 circuit breaker — a
            // too-long summary is recoverable (write a shorter one), so arming
            // "stop calling compress entirely" would wrongly kill legit folds.
            const specKey = normalizedSpecKey(ranges);
            const repeatGuard = recordCompressFailure(ctx.session, specKey);
            ctx.log(`[acp-proxy: compress REFUSED ${detail} — no net shrink (net delta=${netDelta} tok across ${touchedBlocks} touched block(s)); state left uncommitted, prefix cache untouched]`);
            const receipt = `[Compression refused: no net shrink — the summary you supplied is not smaller than the range it replaces (${netDesc}). Nothing was folded: no block was created and the context prefix/cache were left untouched.${revNote} Do not re-issue this same range and summary; supply a much shorter summary for the range, target a larger span so the summary shrinks it, or continue your task without compressing.${repeatGuard !== "" ? " " + repeatGuard : ""}]`;
            return compressResult(receipt, "refused", 0, "gate:no-net-shrink");
        }
        ctx.session.state = res.state;
```

</details>

**依据 11 · 源码核查**：[src/stream.ts:1302-1322](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/stream.ts#L1302-L1322)

新块缓存one/full原文。

<details>
<summary>查看原文（21行）</summary>

```text
        // decompress/range-restore. Storing the text here lets decompress work
        // in later rounds where neither carries the originals.
        // Two views are cached so decompress can honor the `full` flag: `one`
        // (direct messages + nested child summaries) and `full` (all originals).
        // Leaf blocks have no active nested children, so both kernel paths
        // emit byte-identical text — persist a single copy in that case
        // (#401: the duplicate was 50% of blockContents bytes on disk).
        const contentSource = ctx.messages.length > 0 ? ctx.messages : (ctx.compressMessages ?? ctx.messages);
        for (const b of res.state.blocks) {
            if (beforeIds.has(b.blockId)) continue;
            const full = collectBlockContent(res.state, b, contentSource, { full: true });
            const one = collectBlockContent(res.state, b, contentSource, { full: false });
            if (full.count > 0 || one.count > 0) {
                const sameView = one.text === full.text && one.count === full.count;
                cacheBlockContent(ctx.session, b.blockId, {
                    one: sameView ? null : { text: one.text, count: one.count },
                    full: { text: full.text, count: full.count },
                });
            }
        }
        // #1179 CCR v2 (fold-time storing): the moment a fold lands, its covered
```

</details>

**依据 12 · 源码核查**：[src/stream.ts:1204-1226](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/stream.ts#L1204-L1226)

提交前覆盖回退真实门禁。

<details>
<summary>查看原文（23行）</summary>

```text
        {
            const coveredAfter = new Set<string>();
            for (const b of res.state.blocks) {
                if (!b.active) continue;
                for (const id of b.effectiveMessageIds) coveredAfter.add(id);
            }
            const lostCoverage = new Set<string>();
            for (const b of ctx.session.state.blocks) {
                if (!b.active) continue;
                for (const id of b.effectiveMessageIds) {
                    if (!coveredAfter.has(id)) lostCoverage.add(id);
                }
            }
            if (lostCoverage.size > 0) {
                const detail = ranges.map((rg) => `${rg.startRef}–${rg.endRef}`).join(", ");
                const sample = [...lostCoverage].slice(0, 5).map((id) => saltedMsgIdForLog(id)).join(", ");
                const specKey = normalizedSpecKey(ranges);
                const repeatGuard = recordCompressFailure(ctx.session, specKey);
                ctx.log(`[acp-proxy: compress REFUSED ${detail} — coverage regression: ${lostCoverage.size} previously-folded message(s) would lose ALL covering block(s) (${sample}); committing it grows the live view and can push the local estimate past the model window (#3322). State left uncommitted, prefix cache untouched.]`);
                const receipt = `[Compression refused: coverage regression — folding these ranges would leave ${lostCoverage.size} already-folded message(s) without any covering block, so the live context view would GROW instead of shrink (and the size estimate can blow past the model window, bricking the session behind permanent preflight rejections). Nothing was folded: no block was created and the context prefix/cache were left untouched. Retry with ranges aligned to whole turns (do not cut through a reasoning/tool-call/result group), target fewer blocks, or continue your task without compressing.${repeatGuard !== "" ? " " + repeatGuard : ""}]`;
                return compressResult(receipt, "refused", 0, "gate:coverage-regression");
            }
        }
```

</details>

**依据 13 · 源码核查**：[kernel/src/compress.ts:1259-1271](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/kernel/src/compress.ts#L1259-L1271)

pipeline实际以prune生成消息视图。

<details>
<summary>查看原文（13行）</summary>

```text
const pruneNode: PipelineNode = {
  name: "prune",
  run(io, ctx) {
    return {
      ...io,
      messages: prune(io.messages, io.state, {
        isCompressTool: ctx.config.isCompressTool,
      }),
      // #2663: keep the pre-prune resent array reachable so recommend can
      // judge foldability on the same input class applyCompression sees.
      effects: { ...io.effects, originalMessages: io.messages },
    };
  },
```

</details>

**依据 14 · 源码核查**：[src/preflight.ts:2105-2122](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/preflight.ts#L2105-L2122)

压缩后重新processTurn/更新状态和有界视图。

<details>
<summary>查看原文（18行）</summary>

```text
        await yieldToEventLoop();
        // Re-run the pipeline each round: a successful compress hides its
        // range behind a new block, changing the visible view; refs stay
        // stable per-session snapshots (#387), but which ranges are
        // compressible under them does not.
        const turn = deps.core.processTurn({
            messages,
            state: deps.session.state,
            config: noEmergencyTruncate(ccrLoopConfig(deps.session, activeConfig)),
            tokenCount: currentTokens,
            renderTags: "text-only",
            contentStore: contentStoreOf(deps.session),
        });
        deps.session.state = turn.state;
        adoptContentStore(deps.session, turn.contentStore);
        // Absorbed pairs are hidden on the wire, so the fit check must see the
        // same reduced payload prepare* will actually forward.
        turn.messages = applyAbsorbView(turn.messages, turn.state, activeConfig, currentTokens);
```

</details>

**依据 15 · 源码核查**：[src/plugin.ts:2298-2310](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/plugin.ts#L2298-L2310)

transport ok与outcome分离。

<details>
<summary>查看原文（13行）</summary>

```text
    // #1875: ok stays the transport/execution signal (200 = the tool ran); the
    // business effect rides additive fields so clients can distinguish an
    // accepted fold from a kernel refusal without parsing the receipt text.
    const body: Record<string, unknown> = { ok: true, tool, conversationId };
    if (result.outcome !== undefined) body.outcome = result.outcome;
    if (result.blocksCreated !== undefined) body.blocksCreated = result.blocksCreated;
    body.result = sentResult;
    if (retrievalExport !== undefined) body.retrievalExport = retrievalExport;
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
}

// creationTokens = Anthropic cache-write segment (cache_creation_input_tokens):
```

</details>

**依据 16 · 源码核查**：[src/stream.ts:1343-1363](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/stream.ts#L1343-L1363)

无错误零块no-op仍applied。

<details>
<summary>查看原文（21行）</summary>

```text

        if (r.blocksCreated === 0) {
            // #4521: the idempotent no-op class — kernel folded nothing because
            // there was nothing left to fold (every range already covered, or
            // entirely inside the protected zone), and that is NOT a failure:
            // no breaker arm, no loop-guard streak, success-shaped receipt.
            // This was the dominant "compression FAILED, retry, FAILED again"
            // driver on long sessions (live incident: session 01a18a4d, 4
            // consecutive refusals 20:09 over ranges that were 100% legal).
            if (r.errors.length === 0) {
                const warnText = r.warnings.length > 0 ? r.warnings.join(" ") : "every requested range was already folded or protected.";
                ctx.log(`[acp-proxy: compress no-op ${detail} → 0 blocks (nothing left to fold; nothing failed)]`);
                // Reuse the failure-path recovery hint verbatim: a model that
                // keeps aiming at covered/protected ranges needs the live
                // pointer (eligible ranges, distillation target, or the explicit
                // stop wording) — without it the no-op receipt says "do not
                // resend" but never says what TO do, which is how the retry
                // loops persisted (#4521). eligibilityFailure stays guarded by
                // compressionRecovery itself (never a guessed span).
                const recovery = compressionRecovery(ctx);
                return compressResult(`[Compression no-op: nothing was folded and nothing failed — ${warnText}${recovery.hint} Continue your current task.]`, "applied", 0, "noop");
```

</details>

#### 缺口

- 未全文审路由见证阶梯、全部kernel范围门禁及Host权限实现。
  **影响**：只能确认当前DSH核心链，不保证所有并发分支/用户身份均安全正确。
  **进一步探讨**：副本中两会话近似内容并发压缩，核实际sid、block范围、partial/refused/no-op各结果，不用HTTP200代替验收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · decompress能总是恢复原文吗，会不会写文件？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

整块恢复先找kernel块；已归档/原生compaction前内容明确失败。找到块后默认full=false取直接消息和嵌套子摘要，full=true才全层原消息。优先blockContents缓存one/full，缺缓存则从compressMessages或当前messages收集；收不到时body=block.summary、count可为0，所以即使返回内容也不代表原文真的在手。kernel.decompress自身只是block查找，不能凭名称说已完成原文还原。

普通整块读取保持折叠摘要在主历史；返回文本进入工具结果，active块会标restoredInline以便以后原位重新概括，而不是取消所有压缩。toFile有独立路径；超过10000字符会在临时目录创建0600文本，返回路径让read工具读取，写失败返回明确失败收据，不能把恢复一概称纯只读或无敏感数据副本。模型是否会主动读回、后续是否正确使用仍未知。范围恢复、图片、派生会话祖先读取与search有额外路径，本轮不全文验其全部权限/召回/覆盖语义，不外推“所有历史都可搜且无损”。

#### 证据与依据

**依据 1 · 源码核查**：[src/decompress-shared.ts:171-234](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/decompress-shared.ts#L171-L234)

模式、归档拒绝、缓存优先与summary回退。

<details>
<summary>查看原文（64行）</summary>

```text
export function resolveDecompress(
    args: Record<string, unknown>,
    ctx: ProxyToolCtx,
): ProxyToolResult {
    // #1995: image recovery is a distinct mode selected by a VALID imageRef — a
    // non-blank string (mNNNNN ref or "list"), independent of blockId/range,
    // intercepted first so an image-ref call never trips the blockId gate below.
    // #2626: key on a NON-BLANK VALUE, not field presence — hosts/models emit
    // ""/whitespace/null for optional fields, and presence-based dispatch hijacked
    // the text path (valid blockId + imageRef:"" returned the image-list receipt
    // instead of restoring the block). Blank/null/undefined ⇒ unspecified → fall
    // through to block/range restore; a non-string non-null value is a loud param
    // error, not a silent default to the image list.
    const ir = args.imageRef;
    if (ir != null && typeof ir !== "string") {
        return toolFail('[decompress FAILED: imageRef must be a string (an mNNNNN ref or "list") — omit it to restore a text block]');
    }
    if (typeof ir === "string" && ir.trim() !== "") {
        return resolveImageRestore(args, ctx);
    }
    const rawBlockId = args.blockId;
    if (typeof rawBlockId !== "string" || rawBlockId.length === 0) {
        return toolFail("[decompress FAILED: blockId is required]");
    }
    const blockId = rawBlockId.trim();
    const block = ctx.core.decompress(blockId, ctx.session.state);
    if (!block) {
        // Removed-from-state blocks (the #2695 reap path, or a future archive
        // that drops blocks) still carry their preCompactionArchive entry: fail
        // with the real reason instead of the misleading "not found" — the
        // model got here by citing a ref from a summary it legitimately saw.
        const selfArchived = preCompactionArchiveOf(ctx.session)[blockId];
        if (selfArchived !== undefined) {
            return toolFail(`[decompress FAILED: block ${blockId} is an archived block (${selfArchived.reason}) — it was removed from live state along with its covered substrate and cannot be restored.]`);
        }
        return resolveDerivedDecompress(args, ctx, blockId);
    }
    const archived = preCompactionArchiveOf(ctx.session);
    if (archived[blockId] !== undefined) {
        return toolFail(`[decompress FAILED: block ${blockId} is a pre-compaction archive — its content was in the history BEFORE the client's native compaction and is no longer reachable (replaced by the client's compaction summary). decompress is unavailable for archived blocks.]`);
    }
    // #1712: blank/whitespace range fields mean "unspecified" — hosts and models
    // emit "" for optional fields, and treating that as a range request produced
    // an unsatisfiable retry loop (fill in a real range → refused in plugin mode).
    if (hasRangeArgs(args)) {
        return resolveDecompressRange(args, ctx, block);
    }

    const full = args.full === true || args.full === "true";
    const cached = ctx.session.blockContents.get(blockId);
    let body: string;
    let count: number;
    if (cached) {
        // Honor the full flag: `one` = direct msgs + nested child summaries,
        // `full` = all original messages. Returning the cached full text
        // unconditionally would break the default one-level semantics.
        // `one === null` means the two views were byte-identical at cache
        // time and deduped to one copy (#401).
        const view = full ? cached.full : (cached.one ?? cached.full);
        body = view.text;
        count = view.count;
    } else {
        const collected = collectBlockContent(ctx.session.state, block, ctx.compressMessages ?? ctx.messages, { full });
        body = collected.text || block.summary;
```

</details>

**依据 2 · 源码核查**：[src/decompress-shared.ts:246-285](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/decompress-shared.ts#L246-L285)

文件阈值/0600/失败及restoredInline实际写状态。

<details>
<summary>查看原文（40行）</summary>

```text
    const header = `[Block ${blockId} content — ${count} item(s)${full ? ", full" : ""}]`;
    const toFileOut = toFilePointer(args, ctx, header, body);
    if (toFileOut !== null) return toFileOut;
    const safeBlockId = blockId.replace(/[^a-zA-Z0-9_-]/g, "-");
    const outPath = body.length > 10000 ? join(tmpdir(), `acp-decompress-${safeBlockId}-${Date.now()}.txt`) : null;
    if (outPath) {
        try {
            mkdirSync(dirname(outPath), { recursive: true });
            writeFileSync(outPath, body, { encoding: "utf8", mode: 0o600 });
            trackedTempFiles.push({ path: outPath, mtimeMs: Date.now() });
            reapTempFiles();
            return toolOk(`${header}\nContent (${body.length} chars) written to: ${outPath}\nUse the read tool to access it.`);
        } catch (e) {
            return exportFailureReceipt(outPath, e, body);
        }
    }
    // #398/#403 + #1294 P2 wiring (dedup of #1316 × #1298): a successful INLINE
    // whole-block restore hands the block's re-summarization material back to
    // the model via this tool result, and the client keeps tool results in its
    // re-sent history — flag restoredInline so a later compress refolds the
    // block in place (kernel K2) instead of bouncing off "already
    // compressed". The toFile path above returns BEFORE this point and stays
    // byte-identical to pre-refold behavior (no flag, no hint — the material
    // lives in a temp file, not the conversation). Range restores
    // (startId/endId) return partial content and never reach here; inactive
    // blocks can never refold.
    if (!block.active) return toolOk(`${header}\n${body}`);
    // The kernel result is idempotent — a repeat restore recomputes the same
    // span, so the hint stays byte-identical across repeats (old contract:
    // repeat decompress returns identical content). Only the FIRST restore
    // pays the state write + persist.
    const marked = markBlockRestoredInline(ctx.session.state, blockId);
    if (block.restoredInline !== true) {
        ctx.session.state = marked.state;
        markDirty(ctx.session);
        ctx.log(`[acp-decompress-inline] ${blockId}: flagged restoredInline${marked.result?.restoredStartRef ? ` (${marked.result.restoredStartRef}–${marked.result.restoredEndRef})` : ""}`);
    }
    return toolOk(`${header}\n${body}\n\n${refoldHint(blockId, marked.result)}`);
}

```

</details>

**依据 3 · 源码核查**：[kernel/src/compress.ts:1018-1020](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/kernel/src/compress.ts#L1018-L1020)

kernel该方法只查块。

```text
  function decompress(blockId: string, state: CompressionState) {
    return blockById(state, blockId);
  }
```

**依据 4 · 源码核查**：[kernel/src/decompress.ts:154-177](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/kernel/src/decompress.ts#L154-L177)

one/full与保持折叠的读取设计。

<details>
<summary>查看原文（24行）</summary>

```text
  /** When true, recurse through all nested tiers to original messages. Default: false (one tier up — nested active children stay folded, their summaries shown). */
  full?: boolean;
}

/**
 * Collect a block's content as a readable string WITHOUT modifying state.
 *
 * This is the cache-safe decompress primitive: the block stays compressed
 * (folded), its summary stays in place, and the full content is returned as
 * text for the caller to surface (e.g. as a tool result appended to the
 * conversation). Unlike deactivateBlock + prune, this does not mutate the
 * message-array prefix, so prompt cache is preserved.
 *
 * full=false (default): one tier up. Nested ACTIVE children of this block
 *   stay folded; their summaries are rendered in place of their messages.
 *   The block's own direct messages (not covered by any active child) are
 *   rendered in full.
 * full=true: recurse through all nested tiers; every effective message is
 *   rendered in full.
 *
 * Returns { text: "", count: 0 } when the block covers no messages.
 */
export function collectBlockContent(
  state: CompressionState,
```

</details>

#### 缺口

- 未验缓存损坏/原消息缺失、多层语义保真、全文搜索/图片/祖先边界。
  **影响**：不得承诺无损取回/永不遗忘；敏感内容可落临时文件。
  **进一步探讨**：埋入独特原文事实，分别正常/删缓存且删来源/原生compact后full读取，核item数、逐字内容和残留文件，不以成功标题当取回。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 代理、原生压缩、持久与取消的故障边界是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

plan可off/attach/spawn，kill-switch优先；启动代理失败记录直连未压缩并arm恢复timer，故插件加载和工具注册不等所有模型请求已被压缩。实际全局fetch拦截将符合条件的上游改为loopback /bili/ URL，并保持session归属；本轮只核代表DSH fetch路径，不保证所有WS/签名/其他传输都被接管。

bundle独立挂无依赖compaction-gate及native，在native非off声明active后，gate在Cordis internal/config树中结构匹配嵌套compaction并改配置，随后provide服务。它针对真实preset而不只顶层auto:false；但依赖内部hook，当前active声明也不证明代理健康。加载失败/门禁缺口与代理直连同时发生时不能假设原生保护自动恢复，须看/acp及真实checkpoint/流量。卸载应移除整个bundle，不能只关gate导致preset缺服务。

withSessionLock确是进程内Promise串行，不是跨进程锁。markDirty调用scheduleSave，并不await落盘；持久层存在writerOff coalesced及debouncedwrite路径，前者失败记录、后者catch标lastSaveLanded=false，flushAll再排空，但工具HTTP成功没有等待该flush。不能承诺工具返回就断电持久。原始日志与block/content store均须备份，底层索引/跨实例/GC全量机制未审。

DSH将exec.signal交给HTTP fetch；但本项实际admin /plugin/tool调用未传signal进deps，而执行层只是读取deps.signal，因此本条HTTP接线没有证明客户端取消能中止服务端压缩/外部摘要。响应超时或取消后，应查状态再重试，不能假定没改；已提交状态也无自动回滚承诺。

#### 证据与依据

**依据 1 · 源码核查**：[src/agent/dsh-native.ts:195-214](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/agent/dsh-native.ts#L195-L214)

off/attach/spawn决策。

<details>
<summary>查看原文（20行）</summary>

```text
export function shouldBootstrapNativeDsh(env: NodeJS.ProcessEnv): boolean {
    return nativeBootstrapGate(env, "BILI_NATIVE_DSH");
}

/** Native posture (#809 precedence, opencode plan shape): kill-switches >
 *  attach (BILLION_CONTEXT_ATTACH ?? BILLION_CONTEXT_PROXY) > spawn. A preset
 *  BILLION_CONTEXT_PROXY is the `bili dsh` launcher (or a user attach):
 *  routing is already owned (proxy envs / settings overlay), so we attach —
 *  probe first (#983), stamp plugin headers, rewrite raw model URLs like
 *  spawn mode, and fall back to spawning when the attach target is dead
 *  (at startup, #983, or at runtime, #1130). */
export function planNativeDsh(env: NodeJS.ProcessEnv): { mode: "off" | "attach" | "spawn"; attachOrigin?: string } {
    if (env.BILLION_CONTEXT_PLUGIN === "0" || env.BILI_NATIVE_DSH === "0") return { mode: "off" };
    if (env.BILI_PROVIDER_REWRITES !== undefined) return { mode: "off" };
    const attachOrigin = nativeAttachOrigin(env) ?? proxyEnvOrigin(env);
    if (attachOrigin !== undefined) return { mode: "attach", attachOrigin };
    return { mode: "spawn" };
}

const state: NativeInterceptState = { origin: undefined, ready: Promise.resolve(undefined) };
```

</details>

**依据 2 · 源码核查**：[src/agent/dsh-native.ts:712-739](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/agent/dsh-native.ts#L712-L739)

bootstrap失败直连并arm恢复。

<details>
<summary>查看原文（28行）</summary>

```text
async function bootstrap(): Promise<string | undefined> {
    // #3616: superseded flights must not bind the newer world's origin plane.
    const gen = originGen;
    try {
        const handle = await ensureProxyRunning(
            { host: LAUNCHER_DEFAULT_HOST, port: 0, passthrough: false, debug: false, lane: "dsh" },
            { scriptPath: nativeProxyScriptPath() },
        );
        if (gen !== originGen) return handle.origin;
        state.origin = handle.origin;
        register.base = handle.origin;
        // #983: do NOT write BILLION_CONTEXT_PROXY — dsh has no reader for it
        // here (tools use register.base, /acp uses it too), and a frozen env
        // turns a later same-process re-apply (cordis deactivate/reactivate)
        // into an unverified attach to a possibly-dead origin. Reuse across
        // lifecycles goes through ensureProxyRunning's instance discovery.
        return handle.origin;
    } catch (err) {
        const msg = `proxy bootstrap failed — model traffic goes direct (uncompressed): ${errMessage(err)}`;
        persistClientEvent(msg);
        // #4811: a one-shot bootstrap failure must not become permanent. Plan-time
        // arming normally covers this, but this is where the failure IS KNOWN —
        // arm the recovery driver here so a base-less register always has a
        // re-spawn loop behind it. Idempotent; the timer clears itself once
        // healthy again (#4755 clear condition).
        armRecoveryTimer();
        return undefined;
    }
```

</details>

**依据 3 · 源码核查**：[src/agent/dsh-native.ts:2718-2732](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/agent/dsh-native.ts#L2718-L2732)

真实acp/acp-cache命令及fetch interceptor安装。

<details>
<summary>查看原文（15行）</summary>

```text
    ctx.commands.register({
        name: "acp",
        description: "Show bili context-compression status",
        handler: (invocation) => statusOutcome(ctx, invocation),
    });
    ctx.commands.register({
        name: "acp-cache",
        description: "Prompt-cache reconciliation (same report as the acp_cache tool)",
        handler: (invocation) => cacheOutcome(ctx, invocation),
    });

    // node:test drives apply() directly with a mock ctx — never patch
    // globalThis.fetch from inside a test run.
    if (process.env.NODE_TEST_CONTEXT === undefined) installNativeFetchIntercept(state);
}
```

</details>

**依据 4 · 源码核查**：[src/agent/native-intercept.ts:1745-1793](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/agent/native-intercept.ts#L1745-L1793)

真实loopback改写/工具gate/发送。

<details>
<summary>查看原文（49行）</summary>

```text
        }
        state.lastUnavailableReason = undefined;
        everHeldOrigin = true;
        // Attach mode rewrites exactly like spawn mode (#809 semantics —
        // opencode's attach probe+rewrite; the V1 fetch patch relies on it to
        // catch providers without an explicit baseURL). For dsh under the
        // `bili dsh` launcher this is doubly safe: settings-overlay URLs are
        // already `/bili/`-shaped and take the routed branch above, and
        // rewriting a raw upstream URL to the loopback proxy bypasses the
        // MITM envs entirely (an http loopback target is never proxied).
        if (url.startsWith(`${origin}/`)) {
            state.onDispatch?.(url, "self");
            // #5418: hosts that dial the proxy directly (dsh profile bundles,
            // #809 attach probes) land here already addressed — stamp + learn
            // here or their watermark channel silently never seeds.
            const selfStamp = withHeaders(input, init, pfChannel.pfRequestHeaders(outgoingHeadersOf(input, init) ?? {}));
            const resp = await send(selfStamp.input, selfStamp.init);
            pfChannel.pfLearnStamp(outgoingHeadersOf(selfStamp.input, selfStamp.init) ?? {}, resp.status, resp.headers);
            noteDispatchMode("proxy");
            return resp;
        }
        await waitToolsGate();
        if (state.beforeSend !== undefined) {
            try {
                await state.beforeSend(url, init);
            } catch (err) {
                logHostEvent("error", "[native-client]", `bili-native: beforeSend hook failed (${err instanceof Error ? err.message : String(err)}) — request continues (#2399)`);
            }
        }
        const first = makeTarget(`${origin}/bili/${url}`);
        state.onDispatch?.(`${origin}/bili/${url}`, "rewrite");
        // #5403/#5418: same single chokepoint as the routed branch — the
        // rewrite path is where attach-mode hosts (and the V1 fetch patch)
        // ride the proxy without a settings overlay.
        const branchExtra = { ...(state.headersFor?.(url) ?? {}), ...pfChannel.pfRequestHeaders(outgoingHeadersOf(input, init) ?? {}), ...(resignExtra ?? {}) };
        try {
            const stamped = withHeaders(first, init, branchExtra);
            const resp = await send(stamped.input, stamped.init);
            try {
                pfChannel.pfLearnStamp(outgoingHeadersOf(stamped.input, stamped.init) ?? {}, resp.status, resp.headers);
                state.onResponse?.(url, resp, outgoingHeadersOf(stamped.input, stamped.init));
            } catch {
                // observability hook only — never break the response
            }
            noteDispatchMode("proxy");
            return resp;
        } catch (err) {
            // The proxy can die mid-session (its parent watchdog fires when
            // the FIRST owner exits while later sessions still ride it —
```

</details>

**依据 5 · 源码核查**：[src/agent/dsh-native.ts:1789-1807](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/agent/dsh-native.ts#L1789-L1807)

非off声明active。

<details>
<summary>查看原文（19行）</summary>

```text
export function apply(ctx: PluginContext): void {
    const plan = planNativeDsh(process.env);
    if (plan.mode === "off") return;
    // #3616: a fresh activation is a fresh origin world — in-flight recoveries
    // from the previous world are superseded here (their late landings must not
    // write this world's register/state). Off-mode arms nothing and bumps
    // nothing: invalidating recoveries on a kill-switch could strand the lane.
    originGen += 1;

    // #3354/#3662: declare that THIS process owns compression so the always-on
    // gate entry's load-time overlay (#3354) actually disables the web-profile
    // preset instances no patch layer can address by id (#1772/#2360). The
    // declaration — not the registration — is what's gated on plan.mode: a
    // kill-switched or disabled bili-native never declares, and the gate then
    // leaves every row stock while its service still lets the presets boot
    // (disabling the plugin must not brick session creation, #3662).
    declareDshCompactionActive();

    // #2082: a fresh activation invalidates the "host tearing down" verdict.
```

</details>

**依据 6 · 源码核查**：[src/agent/dsh-compaction-gate.ts:11-19](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/agent/dsh-compaction-gate.ts#L11-L19)

独立无依赖入口。

```text
import { registerCompactionDisable, type CompactionDisableHost } from "./dsh-compaction-disable.js";

type PluginContext = CompactionDisableHost;

export const name = "bili-compaction-gate";
export const inject: string[] = [];

export function apply(ctx: PluginContext): void {
    registerCompactionDisable(ctx);
```

**依据 7 · 源码核查**：[src/agent/dsh-compaction-disable.ts:183-210](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/agent/dsh-compaction-disable.ts#L183-L210)

internal/config结构变换后provide。

<details>
<summary>查看原文（28行）</summary>

```text
export function registerCompactionDisable(ctx: CompactionDisableHost): void {
    if (typeof ctx.on === "function") {
        // Preset entries must carry the gate: sibling imports may finish out of order.
        ctx.on("internal/config", function (this: MiddlewareSelf, _raw: unknown, next: () => unknown): unknown {
            const resolved = next();
            // #3662: honor the process verdict — without an active declaration
            // from bili-native every row passes through stock.
            if (!isDshCompactionActive()) return resolved;
            // #4147: match STRUCTURALLY, not by entry name — custom presets run
            // their compaction inside nested rows under their own entry, and a
            // name filter leaves exactly those armed. Rewrite only when the
            // tree actually nests a compaction row, so unrelated entries keep
            // their resolved config object identity.
            const config = (resolved ?? {}) as { plugins?: unknown };
            if (!Array.isArray(config.plugins)) return resolved;
            const compactionRows = countCompactionRows(config.plugins);
            if (compactionRows === 0) return resolved;
            const rawName = this?.entry?.options?.name;
            const entryName = typeof rawName === "string" ? rawName : "unnamed-entry";
            noteGateCoverage(entryName.slice(0, 120), compactionRows, entryName === DSH_AGENT_PRESET_PACKAGE);
            return { ...config, plugins: disableBasicCompaction(config.plugins) };
        }, { global: true });
    }
    // Publish only after the middleware is registered; the host owns both lifetimes.
    ctx.reflect?.provide?.(BILI_COMPACTION_DISABLE_SERVICE, Object.freeze({ owner: "billion-context", issue: "#3354" }));
}

type CompactionOverlayGap = "no-config-hook" | "no-service-provide";
```

</details>

**依据 8 · 源码核查**：[src/session.ts:1459-1470](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/session.ts#L1459-L1470)

真实进程内串行锁。

<details>
<summary>查看原文（12行）</summary>

```text
export async function withSessionLock<T>(session: Session, fn: () => T | Promise<T>): Promise<T> {
    const prev = session.lockChain ?? Promise.resolve();
    let release!: () => void;
    const done = new Promise<void>((resolve) => { release = resolve; });
    session.lockChain = prev.then(() => done);
    await prev;
    try {
        return await fn();
    } finally {
        release();
    }
}
```

</details>

**依据 9 · 源码核查**：[src/session.ts:1612-1615](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/session.ts#L1612-L1615)

markDirty仅scheduleSave。

```text
export function markDirty(session: Session): void {
    session.revisionEpoch = (session.revisionEpoch ?? 0) + 1;
    getStore().scheduleSave(session);
}
```

**依据 10 · 源码核查**：[src/persist.ts:2973-2993](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/persist.ts#L2973-L2993)

coalesced失败捕获与下次重试。

<details>
<summary>查看原文（21行）</summary>

```text
                    settledOk = true;
                    // #3818 writerOff safety valve REMOVED (#4216/#4242):
                    // the orphan/reap shape is now representable — its
                    // contents ride sessions.orphans_json in the same
                    // transaction as everything else, so writerOff's contract
                    // ("the index can represent everything I write") holds
                    // without a JSON-envelope escape hatch.
                } catch (err) {
                    // Kernel-store never-throw save discipline: an uncaughtException
                    // escaping this microtask is fatal in embedded/plugin hosts
                    // without process-level handlers; the next markDirty retries.
                    this.log("error", `[persist] writerOff coalesced build failed for ${session.id}: ${String(err)}`);
                } finally {
                    this.drainFlushWaiters(session.id, settledOk);
                }
            };
            this.writerOffPending.set(session.id, run);
            queueMicrotask(() => {
                if (this.writerOffPending.get(session.id) === run) run();
            });
            return;
```

</details>

**依据 11 · 源码核查**：[src/persist.ts:2995-3045](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/persist.ts#L2995-L3045)

debounced实际write与失败标记。

<details>
<summary>查看原文（51行）</summary>

```text
        if (!this.enabled) return;
        this.tryRecoverSidecar(); // #5188: dirty activity is the "still wanted" signal for a lost sidecar
        const id = session.id;
        // #5506: wrap so the settle handler can fingerprint what THIS armed
        // save built (the builder runs inside the kernel chain, out of reach
        // of the .then — only this slot observes its output).
        const guarded = this.guardedBuild(session);
        const armed: { build: () => PersistedSession; rec: PersistedSession | null } = {
            build: () => { const r = guarded(); armed.rec = r; return r; },
            rec: null,
        };
        this.saveBuilders.set(id, armed);
        const existing = this.saveTimers.get(id);
        if (existing) return;
        const timer = setTimeout(() => {
            this.saveTimers.delete(id);
            const armed = this.saveBuilders.get(id);
            this.saveBuilders.delete(id);
            if (!armed) return;
            // #4788 D2: prove what THIS write covers BEFORE the chain starts
            // building (the closure reads live state at chain-run time; newer
            // mutations can only ride along — the spill gate's equality check
            // against the CURRENT epoch stays conservative). peekSession: the
            // debounced path does not keep the Session object itself.
            const proofRevision = peekSession(id)?.revisionEpoch;
            // Errors are logged inside the kernel write chain; swallowing here
            // keeps a failed timer write from becoming an unhandledRejection.
            this.saveWritesInFlight.add(id);
            void this.store.writeNow(id, armed.build).then(() => {
                this.stampOwnWrite(id); // #3406: the write LANDED — prove our bytes are on disk
                if (armed.rec) this.committedMetaFp.set(id, this.metaFingerprint(armed.rec.metadata ?? {})); // #5506: debounced save landed
                this.noteDurable(id, proofRevision);
                this.lastSaveLanded.set(id, true);
                // #4788 D2: discharge the droppable fields once the debounced
                // save has actually settled — before this PR the trio sat on
                // landed writes that fired MID-request (#4788), where it saw
                // inFlight>0 and skipped everything. Each drop re-checks
                // inFlight itself; the request-end boundary (spillBetweenTurns)
                // gives the same discharge at every turn edge.
                this.runIdleSpillIfIdle(id);
            }).catch(() => {
                this.lastSaveLanded.set(id, false);
            }).finally(() => {
                this.saveWritesInFlight.delete(id);
                // #5155/#4788 D2: settle waiters even on failure — waiting on a
                // flush must never wedge a caller past a failed write (the next
                // turn re-arms the whole path anyway). The verdict tells spill
                // callers whether a landing proof actually exists.
                this.drainFlushWaiters(id, this.lastSaveLanded.get(id) === true);
            });
        }, this.debounceMs);
```

</details>

**依据 12 · 源码核查**：[src/persist.ts:3576-3585](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/persist.ts#L3576-L3585)

flushAll排空及关闭。

<details>
<summary>查看原文（10行）</summary>

```text
    async flushAll(sessions: Iterable<Session> = []): Promise<void> {
        // #3133: run armed writerOff builds BEFORE the sidecar closes below —
        // a stray microtask would build against a closed store and burn a
        // 3-strike disable for no reason.
        this.drainWriterOffPending();
        for (const session of sessions) this.saveContentStore(session);
        await this.flushScheduledSaves();
        await this.store.flushAll();
        this.shadow?.close();
    }
```

</details>

**依据 13 · 源码核查**：[src/server/admin.ts:797-806](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/server/admin.ts#L797-L806)

实际HTTP调用没有传取消signal。

<details>
<summary>查看原文（10行）</summary>

```text
    if (req.method === "POST" && req.url === "/__bili/plugin/tool") {
        try {
            const body = await readBody(req);
            const webOrigin = `http://${opts.host === "0.0.0.0" ? "localhost" : opts.host}:${req.socket?.localPort ?? opts.port}`;
            return await handlePluginTool(body.toString("utf8"), res, { core, config, log, webOrigin, inlineLane: opts.inlineLane === true });
        } catch (err) {
            res.writeHead(err instanceof BodyTooLargeError ? 413 : 400, { "content-type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: String(err) }));
            return;
        }
```

</details>

**依据 14 · 源码核查**：[src/plugin.ts:2238-2253](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/plugin.ts#L2238-L2253)

执行将deps.signal传到工具。

<details>
<summary>查看原文（16行）</summary>

```text
            const toolResult = await executeProxyToolAsync(tool, args, {
                core: deps.core,
                // #833: run proxy tools under the session's last resolved Config
                // (same values the wire path used), not the base kernelConfig.
                config: effectiveConfig(session, deps.config),
                messages,
                // #2627: compress against the RAW history, not the processed
                // outbound view — on the Responses wire that view carries the
                // synthetic acp_turn_sep_* ordering separators, which would be
                // registered into new blocks' coverage and read back as
                // permanent drift against the client's unchanged history
                // (same split as the relay loop ctx).
                compressMessages: mem && mem.original.length > 0 ? mem.original : undefined,
                session,
                log: (m) => deps.log("info", `[${session.id}] [plugin] ${m}`),
            }, callId, undefined, deps.signal);
```

</details>

#### 缺口

- 未运行Host门禁/全部传输、持久断电/跨实例、取消后服务端是否已提交。
  **影响**：生产长会话不能只凭加载或成功响应判断保护/持久/回滚。
  **进一步探讨**：隔离profile测代理断开、Host compact、写失败及取消后查询块状态；分别记录路由/门禁/状态/落盘，异常退出bundle回原生日志。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件下能低风险试用，如何退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

已有DSH且有可丢弃脱敏长任务的开发者，可在单独profile试用含dist的0.1.212包（Node>=20声明，不等所有Node/Host版本已验）；先备份profile和原日志，只启一个独立状态目录实例，核真实工具清单、/acp会话绑定、模型流量到代理与原生compaction门禁，再压缩一个已完成范围，问一个必须恢复细节的问题并核原文。不要直接换生产长期唯一会话。

必需Host tools/commands/agents和相关llm接线、本机代理、兼容Web client/gate、模型调用链、可写状态/临时目录；代理可见模型请求/原文，外部摘要开启时又多一个生成与隐私目的地。省输入不等净账单降低：原模型生成摘要、可选externalSummary、取回重新注入、缓存命中变化、代理/磁盘及人工查摘要都要算；所有倍率/现金/节时未知。首次配置/备份/路由诊断，持续核语义与更新兼容，失败查部分结果/重试/日志，退出移除整个bundle并重启，核原生自动压缩恢复、代理/环境覆盖撤除，按策略处理原文缓存和临时导出。作者写remove渠道不等本轮验证干净清理，自动更新/全部installer修改面未全审。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:95-129](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/package.json#L95-L129)

Node>=20/发布文件和原生DSH。

<details>
<summary>查看原文（35行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "files": [
    "LICENSE",
    "README.md",
    "CONFIGURATION.md",
    "CONFIGURATION.zh-CN.md",
    "dist",
    "dsh.bundle.patch.yml",
    "hermes-plugin",
    "paper/*.md",
    "paper/figures/*.png",
    "website/articles.json",
    "website/blog/posts"
  ],
  "pi": {
    "image": "https://raw.githubusercontent.com/ranxianglei/billion-context/master/docs/logo.png",
    "extensions": [
      "./dist/agent/pi-native.js"
    ]
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org"
  },
  "dsh": {
    "bundle": {
      "patch": "./dsh.bundle.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  }
}
```

</details>

**依据 2 · 源码核查**：[src/agent/dsh-native.ts:77-78](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/agent/dsh-native.ts#L77-L78)

Host必需tools/commands/agents。

```text
export const name = "bili-native";
export const inject = ["tools", "commands", "agents"];
```

**依据 3 · 作者声明**：[README.md:191-208](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/README.md#L191-L208)

作者原生安装/卸载通道。

<details>
<summary>查看原文（18行）</summary>

````text
### Option 1 — Native plugin (`bili plugin install pi` / `omp` / `opencode` / `dsh` / `kimi` / `hermes` / `zcode`)

The proxy lives inside the client: install once, then start the client
exactly as you always do — no launcher command, no env vars, no fixed port,
no URL edits. Supported today for **pi**, **omp**, **opencode** (1.x and
2.x), **dsh**, **kimi**, **hermes** and **zcode**:

```bash
bili plugin install pi          # registers a "billion-context" entry in pi's settings (npm form when bili itself was npm-installed)
bili plugin install omp         # registers an extensions entry in omp's config.yml (~/.omp/agent/config.yml)
bili plugin install opencode    # registers the plugin in opencode's real config + disables native auto-compaction
bili plugin install dsh         # runs 'dsh plugin --profile <name> add billion-context' for every existing profile
bili plugin install kimi        # writes $KIMI_CODE_HOME/plugins/managed/billion-context/kimi.plugin.json (+ installed.json record); per-session routing block lands in config.toml on first start (Kimi Code >= 2.0.0)
bili plugin install hermes      # copies the Python plugin into ~/.hermes/plugins/billion-context/ (+ machine-owned bili.json sidecar) and enables it via `hermes plugins enable billion-context`
bili plugin install zcode       # writes hooks.enabled + a SessionStart hook + mcp.servers.bili into ~/.zcode/cli/config.json; per-session routing lands in the bigmodel provider store on first start
bili plugin remove <client>     # undo (dsh removes through the same channel; config snapshots go to .bili-bak)
```

````

</details>

**依据 4 · 源码核查**：[dsh.bundle.patch.yml:14-38](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/dsh.bundle.patch.yml#L14-L38)

bundle整体卸载与preset依赖接线。

<details>
<summary>查看原文（25行）</summary>

```text
# #3662: the gate lives in its OWN always-on entry, not in bili-native —
# disabling or kill-switching bili-native must leave the gate service alive so
# the presets fall back to STOCK dsh compaction instead of pending forever
# (the old wiring bricked session creation on exactly that path). Do NOT
# disable the bili-compaction-gate entry itself: it carries the service the
# presets wait on; to uninstall, remove billion-context from
# dsh.profile.bundles instead.
- insert:
    - id: bili-native
      name: billion-context
    - id: bili-compaction-gate
      name: billion-context/dsh-compaction-gate
- id: compaction-basic
  config:
    auto: false
# #3354: keep in sync with writeDshAcpPatch in src/launcher.ts — entry inject
# lists are REPLACED by patches, not concatenated; if a future dsh ships its
# own inject list on these entries, merge manually in BOTH layers.
- id: preset-standard
  inject: [biliBasicCompactionPolicy]
- id: preset-ptc
  inject: [biliBasicCompactionPolicy]
- id: preset-minimal
  inject: [biliBasicCompactionPolicy]
- id: preset-cordis
```

</details>

**依据 5 · 源码核查**：[src/external-summary-compress.ts:116-128](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/external-summary-compress.ts#L116-L128)

额外摘要生成和部分失败。

<details>
<summary>查看原文（13行）</summary>

```text
    const batch = await plan.summarize(work, signal);
    if (signal?.aborted || ctx.session.state !== state || ctx.session.revisionEpoch !== revision) return compressResult("[Compression FAILED: cancelled or session changed while generating external summaries. Nothing compressed.]", "refused", 0);
    const successful: ParsedRange[] = [];
    for (const [index, result] of batch.results.entries()) {
        if (result.status === "success") successful.push({ ...valid[index], summary: result.summary, compressCallId: newExternalCallId() });
    }
    // #3635: full failure description (parity with the preflight log line) so
    // an over-cap rejection is visible with its length reason, not bare "batch=finished".
    ctx.log(`[external-summary] completed ${successful.length}/${parsed.ranges.length} range(s); ${describeExternalSummaryFailure(batch)}`);
    // #4833: the bounded attempt diagnostics (source + budgets + outcomes) ride
    // the tool result too — enums and numbers only, never payload bytes.
    if (successful.length === 0) return compressResult(`[Compression FAILED: all configured external summary candidates failed or exceeded their budget. Nothing compressed; do not retry unchanged configuration — summaries longer than the configured cap are rejected whole, so raise compress.maxSummaryLength or request less via per-range summaryMaxChars.] [${describeExternalSummaryFailure(batch)}]`, "refused", 0);
    const applied = applyRanges({ ...parsed, ranges: successful }, ctx);
```

</details>

**依据 6 · 源码核查**：[src/decompress-shared.ts:246-262](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/decompress-shared.ts#L246-L262)

原文临时文件与失败处理。

<details>
<summary>查看原文（17行）</summary>

```text
    const header = `[Block ${blockId} content — ${count} item(s)${full ? ", full" : ""}]`;
    const toFileOut = toFilePointer(args, ctx, header, body);
    if (toFileOut !== null) return toFileOut;
    const safeBlockId = blockId.replace(/[^a-zA-Z0-9_-]/g, "-");
    const outPath = body.length > 10000 ? join(tmpdir(), `acp-decompress-${safeBlockId}-${Date.now()}.txt`) : null;
    if (outPath) {
        try {
            mkdirSync(dirname(outPath), { recursive: true });
            writeFileSync(outPath, body, { encoding: "utf8", mode: 0o600 });
            trackedTempFiles.push({ path: outPath, mtimeMs: Date.now() });
            reapTempFiles();
            return toolOk(`${header}\nContent (${body.length} chars) written to: ${outPath}\nUse the read tool to access it.`);
        } catch (e) {
            return exportFailureReceipt(outPath, e, body);
        }
    }
    // #398/#403 + #1294 P2 wiring (dedup of #1316 × #1298): a successful INLINE
```

</details>

#### 缺口

- 未核npm发布包/dist一致性、完整installer/自动更新、真实费用和清理。
  **影响**：仅隔离观察试用，不推荐直接接唯一生产会话或所有宿主。
  **进一步探讨**：固定发布包/Host版本后查路由及门禁，跑一个脱敏恢复任务并记录总usage/人工核对，再决定是否扩大；异常完整卸载并核原生能力。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 可迁移的贡献与下一步假设是什么，怎样推翻？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

贡献是将范围摘要块、one/full原文缓存与恢复、工具效果收据和原生DSH代理/压缩门禁接起来，技术上把一次大摘要替换改为可定位范围与按需回读；no-op/partial/refused和“已恢复正文”分开，可以形成可核状态。它仍不保证摘要包含关键决定，不保证模型看到回读需求，亦可能以缓存/索引/外部摘要复杂度换少输入；没有证据证明新用户群体或工作分工改变。

候选假设是为恢复返回加清晰的来源等级：缓存原文/当前消息收集/仅summary回退，禁止把count0摘要回退显示成等价原文。对同一脱敏长任务埋入精确事实，覆盖缓存正常、来源缺失、原生compact归档三种样本，比现有回复和来源等级提示的事实答对率、错误自信、额外取回调用与总费；若现有item数/失败信息已足够，提示不减少误用或增加的token/人工盖过收益，就推翻。不把该假设记成本版已实现质量保证，也不继承旧版评分。

#### 证据与依据

**依据 1 · 源码核查**：[src/decompress-shared.ts:220-245](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/decompress-shared.ts#L220-L245)

缓存与收集/summary回退、count不同来源。

<details>
<summary>查看原文（26行）</summary>

```text
    const cached = ctx.session.blockContents.get(blockId);
    let body: string;
    let count: number;
    if (cached) {
        // Honor the full flag: `one` = direct msgs + nested child summaries,
        // `full` = all original messages. Returning the cached full text
        // unconditionally would break the default one-level semantics.
        // `one === null` means the two views were byte-identical at cache
        // time and deduped to one copy (#401).
        const view = full ? cached.full : (cached.one ?? cached.full);
        body = view.text;
        count = view.count;
    } else {
        const collected = collectBlockContent(ctx.session.state, block, ctx.compressMessages ?? ctx.messages, { full });
        body = collected.text || block.summary;
        count = collected.count;
    }
    // #1336: retrieve-quality proxy — a whole-block restore where a precise
    // path existed (per-message coverage recorded AND CCR armed ⇒ range-restore
    // or targeted acp_retrieve would have sufficed) is the failure shape plan-
    // aware search steering exists to prevent.
    ctx.session.stats.wholeBlockRestores = (ctx.session.stats.wholeBlockRestores ?? 0) + 1;
    if (coveredRefSpan(ctx.session.state, block) !== null && ccrEnabled(ctx.session)) {
        ctx.session.stats.wholeBlockRestoresPreciseAvailable = (ctx.session.stats.wholeBlockRestoresPreciseAvailable ?? 0) + 1;
    }

```

</details>

**依据 2 · 源码核查**：[src/decompress-shared.ts:199-210](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/decompress-shared.ts#L199-L210)

归档不可恢复的真实反例。

<details>
<summary>查看原文（12行）</summary>

```text
        // that drops blocks) still carry their preCompactionArchive entry: fail
        // with the real reason instead of the misleading "not found" — the
        // model got here by citing a ref from a summary it legitimately saw.
        const selfArchived = preCompactionArchiveOf(ctx.session)[blockId];
        if (selfArchived !== undefined) {
            return toolFail(`[decompress FAILED: block ${blockId} is an archived block (${selfArchived.reason}) — it was removed from live state along with its covered substrate and cannot be restored.]`);
        }
        return resolveDerivedDecompress(args, ctx, blockId);
    }
    const archived = preCompactionArchiveOf(ctx.session);
    if (archived[blockId] !== undefined) {
        return toolFail(`[decompress FAILED: block ${blockId} is a pre-compaction archive — its content was in the history BEFORE the client's native compaction and is no longer reachable (replaced by the client's compaction summary). decompress is unavailable for archived blocks.]`);
```

</details>

**依据 3 · 源码核查**：[src/stream.ts:1343-1363](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/stream.ts#L1343-L1363)

no-op与块数并存。

<details>
<summary>查看原文（21行）</summary>

```text

        if (r.blocksCreated === 0) {
            // #4521: the idempotent no-op class — kernel folded nothing because
            // there was nothing left to fold (every range already covered, or
            // entirely inside the protected zone), and that is NOT a failure:
            // no breaker arm, no loop-guard streak, success-shaped receipt.
            // This was the dominant "compression FAILED, retry, FAILED again"
            // driver on long sessions (live incident: session 01a18a4d, 4
            // consecutive refusals 20:09 over ranges that were 100% legal).
            if (r.errors.length === 0) {
                const warnText = r.warnings.length > 0 ? r.warnings.join(" ") : "every requested range was already folded or protected.";
                ctx.log(`[acp-proxy: compress no-op ${detail} → 0 blocks (nothing left to fold; nothing failed)]`);
                // Reuse the failure-path recovery hint verbatim: a model that
                // keeps aiming at covered/protected ranges needs the live
                // pointer (eligible ranges, distillation target, or the explicit
                // stop wording) — without it the no-op receipt says "do not
                // resend" but never says what TO do, which is how the retry
                // loops persisted (#4521). eligibilityFailure stays guarded by
                // compressionRecovery itself (never a guessed span).
                const recovery = compressionRecovery(ctx);
                return compressResult(`[Compression no-op: nothing was folded and nothing failed — ${warnText}${recovery.hint} Continue your current task.]`, "applied", 0, "noop");
```

</details>

**依据 4 · 源码核查**：[src/external-summary-compress.ts:116-138](https://github.com/ranxianglei/billion-context/blob/be611a8566c22ee0a65fb5765365671d47e810d5/src/external-summary-compress.ts#L116-L138)

外部摘要资源/取消与partial。

<details>
<summary>查看原文（23行）</summary>

```text
    const batch = await plan.summarize(work, signal);
    if (signal?.aborted || ctx.session.state !== state || ctx.session.revisionEpoch !== revision) return compressResult("[Compression FAILED: cancelled or session changed while generating external summaries. Nothing compressed.]", "refused", 0);
    const successful: ParsedRange[] = [];
    for (const [index, result] of batch.results.entries()) {
        if (result.status === "success") successful.push({ ...valid[index], summary: result.summary, compressCallId: newExternalCallId() });
    }
    // #3635: full failure description (parity with the preflight log line) so
    // an over-cap rejection is visible with its length reason, not bare "batch=finished".
    ctx.log(`[external-summary] completed ${successful.length}/${parsed.ranges.length} range(s); ${describeExternalSummaryFailure(batch)}`);
    // #4833: the bounded attempt diagnostics (source + budgets + outcomes) ride
    // the tool result too — enums and numbers only, never payload bytes.
    if (successful.length === 0) return compressResult(`[Compression FAILED: all configured external summary candidates failed or exceeded their budget. Nothing compressed; do not retry unchanged configuration — summaries longer than the configured cap are rejected whole, so raise compress.maxSummaryLength or request less via per-range summaryMaxChars.] [${describeExternalSummaryFailure(batch)}]`, "refused", 0);
    const applied = applyRanges({ ...parsed, ranges: successful }, ctx);
    // Client call arguments carry only an optional hint, never the generated summary.
    // In-place refolds retain their old call id in the kernel; keep their anchor too.
    for (const block of ctx.session.state.blocks) {
        if (before.get(block.blockId)?.restoredInline && !block.restoredInline) block.compressCallId = newExternalCallId();
    }
    if (successful.length < parsed.ranges.length && (applied.blocksCreated ?? 0) > 0) return {
        ...applied, outcome: "partial", text: `${applied.text}\n[External summary: ${parsed.ranges.length - successful.length} selected range(s) were not compressed.]`,
    };
    return applied;
}
```

</details>

#### 缺口

- 未开展同质量对照、来源提示可用性和单位任务费用试验。
  **影响**：只能提出有边界生产方向，不宣称已改善任务保真。
  **进一步探讨**：先执行三类固定事实样本的盲答比较，公开失败例与完整资源成本，观察不到差异就不做此新功能。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
