# dsh-plugin-adapter

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[a0a716f](https://github.com/1624318455/dsh-plugin-adapter/tree/a0a716f3b3c5e8b6df90b00a0d5b40330a257503)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1624318455/dsh-plugin-adapter)
<!-- END META -->

> **功能**：以原生provider接入匿名Zen模型，含目录、消息/工具流适配及可选relay/IP池；根产物绑定待核。

> **亮点**：将匿名目录、消息/工具事件、预算夹紧和故障终态接到宿主模型契约；首交付后不再重放有可检查边界，但不是插件独立实现Agent循环或已验证服务保障。见[Q02](#research-q02)。

> **主要限制**：根^0.3.4未锁定到所审子包0.6.0；入口池开时relay句柄未接Zen，池关仍受fetch owner与失败ambient回落约束，installer在setter返回void时没有保存/恢复旧slot。条件源码缺口未作为真实宿主故障，产物、实际出口与退出仍是采用门槛。见[Q01](#research-q01)、[Q03](#research-q03)。

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
  - [Q01 · 根安装入口与所审源码是什么关系，适合解决哪种真实任务？](#detail-section-11)
  - [Q02 · 模型目录、消息/工具、SDK与流终态是否真的串联？](#detail-section-12)
  - [Q03 · relay、IP池和设置桥接分别控制什么，停用是否完整恢复？](#detail-section-13)
  - [Q04 · 安装、使用、维护和退出分别需要什么，哪些效果有证据？](#detail-section-14)
  - [Q05 · 现有诊断之外还剩什么可验证增量，最强反例是什么？](#detail-section-15)
  - [Q06 · 目前应该怎样采用，最低验收和停止条件是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有DSH用户在同一会话进行匿名文本/工具任务，验收应看真实产物、结果续接与终态；目录及ready不是任务成功。见[Q01](#research-q01)。

对照另开OpenCode搬上下文及已有兼容provider，增量在原生会话/流边界；fork、pi-ai/OpenAI SDK与DSH工具执行应归相应依赖。现有provider可满足时，它未证明更省维护。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 原生模型适配 | 匿名文本、工具事件/结果续接与终态 | 实际包与本源码需绑定，工具执行/循环属于宿主 |
| 目录与预算 | 免费判定、静态fallback和输出夹紧 | 标签/目录不证明活模型或长期免费 |
| 分层传输 | Bun relay、Node与可选池 | 池开入口未接relay，池关需槽owner允许且可fallback ambient；严格策略另验 |
| 池设置/诊断 | Web卡、状态/模型/探测POST和live apply | 本机/同源guard，probe有副作用；状态不是任务就绪 |

**流程与依赖**

实际产物、宿主注册接口和匿名上游是前提，Bun/代理/池与sing-box按真实路径分支判断。子包源码不能替代npm包或当前宿主兼容验收；完整条件表见[Q04](#research-q04)。

先绑定产物，再在隔离profile用一项工具任务验证结果/终态，最后核传输和完整退出；失败先查在途，不以换出口或新会话绕过不确定结果。步骤见[Q04](#research-q04)。

**效果与成本**

维护负担取决于匿名协议/目录漂移、真实出口和共享网络退出，而非只取决于模型名价格；内部重试与后台probe可能增加请求。四阶段明细集中于[Q04](#research-q04)，没有可报告的净节省实测。

当前价值在会话接入与故障边界可检查；是否胜过现成provider，应按完成的工具任务和纠错工时检验。效果表及不能确定项见[Q04](#research-q04)，真实路径反例见[Q05](#research-q05)。

> **思考**：根^0.3.4未锁定到所审子包0.6.0；入口池开时relay句柄未接Zen，池关仍受fetch owner与失败ambient回落约束，installer在setter返回void时没有保存/恢复旧slot。条件源码缺口未作为真实宿主故障，产物、实际出口与退出仍是采用门槛。见[Q01](#research-q01)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将匿名目录、消息/工具事件、预算夹紧和故障终态接到宿主模型契约；首交付后不再重放有可检查边界，但不是插件独立实现Agent循环或已验证服务保障。见[Q02](#research-q02)。

可借鉴输出预算、工具ID/别名、无终态报错和首交付后不重放；不能照搬CLI指纹、将watchdog当上游取消，或以状态卡/恢复日志代替真实路径和owner恢复。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

根^0.3.4未锁定到所审子包0.6.0；入口池开时relay句柄未接Zen，池关仍受fetch owner与失败ambient回落约束，installer在setter返回void时没有保存/恢复旧slot。条件源码缺口未作为真实宿主故障，产物、实际出口与退出仍是采用门槛。见[Q01](#research-q01)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察：先核根真实包和退出恢复，再做一项可验文本/工具任务；严格出站、结果归属或共享网络未达标即停新请求并回退，见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持核心适配和条件失败边界；实际根安装物未绑定、上游/任务/退出未运行验收。观察，不把目录、作者实测或清理日志当交付。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、packages/plugin/package.json、packages/plugin/src/adapter/catalog.ts、packages/plugin/src/adapter/events.ts、packages/plugin/src/adapter/fingerprint.ts、packages/plugin/src/adapter/messages.ts、packages/plugin/src/adapter/transport.ts、packages/plugin/src/adapter/zen-adapter.ts、packages/plugin/src/adapter/zen-relay.ts、packages/plugin/src/client/IpPoolCard.tsx、packages/plugin/src/client/index.ts、packages/plugin/src/config.ts、packages/plugin/src/index.ts、packages/plugin/src/ip-pool-settings/apply.ts、packages/plugin/src/ip-pool-settings/bridge.ts、packages/plugin/src/ip-pool.ts、packages/plugin/src/pool/dispatcher.ts、packages/plugin/src/pool/installer.ts、packages/plugin/src/provider.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核根/实现子包manifest与补丁、原生入口、transport真实caller/owner/fallback、目录判定、消息/工具/请求形状、chat/responses SDK调用、预算/首交付/终态/watchdog、relay、IP池装配/installer、设置桥与客户端调用。未全审池全部协议解析器/节点/准入分支、legacy Go sidecar、所有UI、外部SDK实现及实际宿主/发布包；未执行目标代码或网络探测。
- 下一步：只读固定源码/原件及研究装配校验；未安装、构建、执行目标测试/Bun/模型/代理/探测/业务。后续验真实包绑定、工具续接/半段与缺终态、实际出站、取消在途及卸载共存，再比较总工时/资源；见[Q06](#research-q06)。

**分析版本**

- **仓库**：[1624318455/dsh-plugin-adapter](https://github.com/1624318455/dsh-plugin-adapter)
- **版本号**：未声明（[固定提交 a0a716f](https://github.com/1624318455/dsh-plugin-adapter/tree/a0a716f3b3c5e8b6df90b00a0d5b40330a257503)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在已有诊断上绑定一次调用的真实产物/路径、首交付、终态与释放确认，先用匿名失败任务对照原生日志和简单修补；无定位/纠错收益就不产品化。尚未实现或验证，见[Q05](#research-q05)。

只读固定源码/原件及研究装配校验；未安装、构建、执行目标测试/Bun/模型/代理/探测/业务。后续验真实包绑定、工具续接/半段与缺终态、实际出站、取消在途及卸载共存，再比较总工时/资源；见[Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 2707 | — | — | 42436 |
| .ts | source | 31 | 8873 | 6234 | 2128 | — |
| .tsx | source | 1 | 1138 | 994 | 84 | — |
| .ts | test | 28 | 5470 | 4568 | 644 | — |
| .mts | test | 4 | 383 | 278 | 74 | — |
| .mjs | source | 1 | 21 | 10 | 9 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/1624318455/dsh-plugin-adapter/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/1624318455/dsh-plugin-adapter/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1624318455/dsh-plugin-adapter/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核固定根分发与子包实现的绑定、匿名模型原生工具会话及真实传输/终态/退出边界，以一项任务而非目录决定采用与候选方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根安装入口与所审源码是什么关系，适合解决哪种真实任务？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

根条目是DSH插件的私有分发包装：package.json名为dsh-plugin-adapter，没有自身version，依赖@memef1f1y/dsh-plugin-adapter的^0.3.4，根补丁按该npm包名装载。仓库内packages/plugin则是同名实现子包0.6.0，Node>=20，入口指向未随Git提交的lib/index.js和lib/client.js。源码打包通过prepack先清理lib、分别构建服务端/客户端再准备包；本轮没有构建或安装，也未核npm tarball及实际宿主解析结果。根没有将这次子包源码锁为实际安装产物的workspace/锁文件关系，因此根版本记未声明，不能把子包0.6.0当作GitHub根安装已运行的版本，也不能反向断言宿主一定解析到0.3.4。

它面向已经使用DSH、希望在原生会话中接匿名Zen文本模型并保留工具事件的人。可验收的任务是一个获准工具会话完成文本回答或实际工具调用并正确续接、结束；模型列表出现、免费名称、注册成功和作者成功率都不算完成。相比另开OpenCode再搬上下文，它增加原生provider/消息与流事件适配；相比已有可用的兼容provider配置，是否省事取决于匿名通道、模型协议和传输维护，而非天然更稳定。

子包明确注明fork of FishBottle7/opencode2dsh，底层模型传输借pi-ai/OpenAI SDK，DSH承担实际工具执行与自主循环。新增组合价值应归到目录判定、协议/请求形状、流终态和分层传输的接线，不把依赖的Agent能力、匿名服务或SDK当成插件原创。README的无需额外进程与重试归宿主表述不足以覆盖本次实现：默认可构造延迟启动的Bun relay，源码也有首内容前重试，具体见Q02/Q03。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-13](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/package.json#L1-L13)

根private、无版本、npm范围依赖。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "dsh-plugin-adapter",
  "private": true,
  "description": "Free OpenCode Zen models for DeepSeek Harness (DSH): native dsh-llm adapter plugin, no API key.",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
      "@memef1f1y/dsh-plugin-adapter": "^0.3.4"
    }
}
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-15](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/cordis.patch.yml#L1-L15)

根补丁以npm包名加载，不是源码workspace绑定。

<details>
<summary>查看原文（15行）</summary>

```text
# dsh-plugin-adapter DSH plugin — bundle patch: insert the plugin row (deployment-global).
#
# The plugin itself is distributed as the npm package @memef1f1y/dsh-plugin-adapter
# (declared in dependencies); this patch only inserts its loader row.
# Defaults need no edits: the adapter registers into llm-pi-ai with no key and
# no extra process. Override any option via the config object (src/config.ts).
#
# 0.4.0: the row id changed from `opencode2dsh` to `dsh-plugin-adapter`. The
# id is how DSH attaches the config object to the plugin, so a live
# cordis.patch.yml must be renamed in the same commit as the upgrade or the
# config (e.g. a pinned gatewaySession) is silently dropped.
- insert:
    - id: dsh-plugin-adapter
      name: '@memef1f1y/dsh-plugin-adapter'
      config: {}
```

</details>

**依据 3 · 作者声明**：[packages/plugin/package.json:1-36](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/package.json#L1-L36)

实现子包版本、lib入口、作者归属与Node要求。

<details>
<summary>查看原文（36行）</summary>

```text
{
  "name": "@memef1f1y/dsh-plugin-adapter",
  "version": "0.6.0",
  "description": "Free OpenCode Zen models for DeepSeek Harness (DSH): native dsh-llm adapter plugin, no API key.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json",
    "./client": "./lib/client.js"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "README.zh-CN.md",
    "LICENSE",
    "tsdown.client.config.ts"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/1624318455/dsh-plugin-adapter.git"
  },
  "homepage": "https://github.com/1624318455/dsh-plugin-adapter#readme",
  "bugs": "https://github.com/1624318455/dsh-plugin-adapter/issues",
  "author": "1624318455 (fork of FishBottle7/opencode2dsh)",
  "engines": {
    "node": ">=20"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
```

</details>

**依据 4 · 源码核查**：[packages/plugin/package.json:44-49](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/package.json#L44-L49)

prepack真实构建步骤。

```text
  "scripts": {
    "build": "tsdown src/index.ts --format esm --dts --out-dir lib --no-clean",
    "prepack": "node -e \"require('fs').rmSync('lib',{recursive:true,force:true})\" && pnpm build && pnpm build:client && node ../../scripts/prepare-package.mjs",
    "typecheck": "tsc --noEmit",
    "test": "node --test \"test/*.test.ts\"",
    "build:client": "tsdown -c tsdown.client.config.ts"
```

**依据 5 · 作者声明**：[README.md:28-46](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/README.md#L28-L46)

作者的原生/免费/进程与重试定位，须对照实现。

<details>
<summary>查看原文（19行）</summary>

```text
dsh-plugin-adapter registers a native DSH `LlmAdapter` that streams directly from
[OpenCode Zen](https://opencode.ai/zen)'s **anonymous free lane** — the same
models OpenCode's own CLI uses without an account, served to your DSH model
picker as a regular provider called `zen-free` (`opencode2dsh` stays
registered as a legacy alias so old sessions keep working).

Requests leave your machine looking exactly like traffic from the OpenCode
CLI (same user agent, same correlation headers), and the model catalog stays
fresh through a three-tier fallback chain. There is nothing to log into and
nothing to host.

## Highlights

- **Zero credential, zero setup** — the anonymous lane needs no key; install, restart, chat
- **Native adapter, no sidecar** — one npm package, no child process, no binary, no local port (the legacy Go sidecar is not part of the published package; see `legacy/`)
- **CLI-identical disguise** — requests carry the OpenCode CLI user agent and its session/request/project header set, derived per conversation
- **Selectable thinking levels** — reasoning-capable free models expose an effort picker in DSH's model selector (declared ladders where the model metadata provides them, Off/Minimal/Low/Medium/High otherwise); Off sends `reasoning_effort: "none"` upstream to actually stop thinking, and no selection keeps the provider default
- **Live catalog with a fallback chain** — live upstream list ∩ free verdict (models.dev price 0, or a `-free` id the lane itself serves free), falling back to offline cache and a verified static list
- **Self-healing** — fast startup retries, periodic refresh, and a written health snapshot for diagnostics
```

</details>

#### 缺口

- 根安装解析结果及发布tarball未取得，所审0.6.0源码与实际GitHub根安装产物没有锁定证明。
  **影响**：不能将子包源码能力、版本和修复保证给实际根安装。
  **进一步探讨**：在隔离profile核最终包版本、tarball及入口哈希与本固定源码的对应关系；不匹配就按实际产物重新研究。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型目录、消息/工具、SDK与流终态是否真的串联？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

applyAdapter向llm注册zen-free及legacy别名，模型目录后台刷新，注册本身并不等上游就绪。目录先按成本/弃用元数据判定，缺信息可按free名称放行；ModelCatalog.decision又允许静态列表覆盖弃用判定，list在live Zen目录为空时直接回静态列表。static_verified是代码/作者维护标签，不是本轮活体验证，不能把它描述为严格实时交集或持续免费承诺。

prepareCall/stream把宿主消息转pi-ai Context，重建assistant工具调用及对应toolResult，工具结果保留callId、名称和错误标记；非法JSON参数转为raw对象，不是原始字符串无损回放。实现以文本为主，assistant图像回放明确报错，不能由宿主多模态能力推断本适配无损支持。SDK的onPayload实际调用指纹整形：补env、read/shell声明，冲突时别名并在流事件还原调用方名称，还会强制stream并移除tool_choice=none。占位工具有提示词警告，仍不是宿主新获得了文件/命令权限；这些变形也不能称完全透明。真正选工具、执行和根据结果再调用模型属于DSH循环，本插件只提供模型适配。

chat和responses两个分支实际调用对应provider.streamSimple，传匿名占位key、会话头、宿主signal、超时及限制后的maxTokens，SDK maxRetries设0。maxTokens不仅是展示元数据：limits/outputLimit把输出夹到上下文的四分之一等约束，再夹宿主请求值。插件自身在首个非start事件前缓存尚未交付事件，可做协议自愈、会话重置和出口轮换；错误/错误终态先单独分类；其他开始交付的非start事件，包括reasoning/tool-call开始，使其进入交付流，不再重放该次内容。此边界降低重复工具风险，但不等已运行证明工具恰好执行一次。

toStreamChunks实际映射文本、reasoning、工具增量/结束，done/error均产usage和finish；aborted/error/空完成各自归类，迭代结束却没有done/error会抛错。因此不能把缺终态当成功。first-event/idle watchdog通过race让消费方得到错误，所读SDK调用仍只传宿主options.signal，没有watchdog自建abort/iterator.return；诊断超时不证明旧网络计算已停止，重试时在途资源仍需另验。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/index.ts:133-175](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/index.ts#L133-L175)

原生adapter构造与注册链。

<details>
<summary>查看原文（43行）</summary>

```text
  }
  const transport = cfg.ipPool?.enabled === true
    ? null
    : createZenTransport({
      proxyUrl: cfg.transport?.proxyUrl,
      noReuse: cfg.transport?.noReuse,
      relay,
    })
  if (transport) {
    logger.info(`dsh-plugin-adapter: ${transport.describe()}`)
  } else if (cfg.transport?.proxyUrl) {
    logger.warn(`dsh-plugin-adapter: transport.proxyUrl "${cfg.transport.proxyUrl}" is not a usable http(s) proxy URI; Zen traffic keeps the ambient dispatcher`)
  }

  // Watchdog windows (config.watchdog): the first-event gate is a
  // time-to-first-token budget, tiered for reasoning models.
  const adapter = new ZenAdapter(catalog, {
    sessionOverride: cfg.gatewaySession,
    firstEventMs: cfg.watchdog?.firstEventMs,
    reasoningFirstEventMs: cfg.watchdog?.reasoningFirstEventMs,
    bodyIdleMs: cfg.watchdog?.bodyIdleMs,
    contextWindowCap: cfg.contextWindow,
    transport,
  })

  // IP-pool exit routing (docs/ip-pool.md IP-1..IP-5): manual proxies,
  // pinned, free sources, subscriptions, and (IP-5) the settings namespace
  // with live apply + the /status /models /probe bridge. Opt-in via settings
  // page or cordis.patch.yml; disabled keeps the process byte-for-byte on
  // direct. Lifecycle (assembly on first enable, live reconfigure, dispose) is
  // owned by applyIpPoolSettings through the plugin fiber. The probe-model
  // dropdown rows include the live catalog, so this must run after the
  // catalog instance exists.
  applyIpPoolSettings(ctx, config, logger, { listLiveModels: () => catalog.list() })

  // Register immediately: the provider must appear in the selector right
  // away, even while the catalog is still warming up (listModels is read
  // live at selector time, so models appear as refreshes land).
  ctx.llm.registerAdapter([PROVIDER_ID, LEGACY_PROVIDER_ID], adapter)
  logger.info(`dsh-plugin-adapter: adapter registered for "${PROVIDER_ID}" (legacy alias "${LEGACY_PROVIDER_ID}", catalog warms up in background)`)
  void catalog.start().catch((err) => {
    logger.error(`dsh-plugin-adapter: catalog start failed: ${err instanceof Error ? err.message : String(err)}`)
  })
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:135-158](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/catalog.ts#L135-L158)

免费元数据与名称降级判定。

<details>
<summary>查看原文（24行）</summary>

```text
export function decide(model: string, prices: Map<string, ModelPrice>, ready: boolean): AnonymousDecision {
  const nameFree = isFreeModel(model)
  const fallback = (source: string): AnonymousDecision => {
    if (nameFree) return { allowed: true, source: 'name_free', known: false }
    return { allowed: false, source, known: false }
  }
  if (!ready || prices.size === 0) return fallback('metadata_pending')
  const price = prices.get(model)
  if (!price) return fallback('metadata_model_missing')
  if (price.deprecated) return { allowed: false, source: 'metadata_deprecated', known: true }
  const metadataFree = price.input === 0 && price.output === 0
  if (metadataFree) {
    return { allowed: true, source: nameFree ? 'name_and_metadata_free' : 'metadata_free', known: true }
  }
  if (price.input === undefined || price.output === undefined) {
    // Metadata cannot state a cost for one side. That is not evidence of
    // payment, and a Zen-listed id whose name marks it free is served for
    // free by the lane itself — let it through and let the lane decide
    // (0.4.0). A positive paid verdict and a deprecation still win: those
    // are statements about the model, not missing data.
    if (nameFree) return { allowed: true, source: 'name_free', known: false }
    return { allowed: false, source: 'metadata_cost_unknown', known: false }
  }
  return { allowed: false, source: 'metadata_paid', known: true }
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:401-425](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/catalog.ts#L401-L425)

静态覆盖与live缺失回退。

<details>
<summary>查看原文（25行）</summary>

```text
  decision(model: string): AnonymousDecision {
    const metadata = decide(model, this.#prices, this.#pricesReady)
    // The S3 vouch only covers ids metadata cannot speak for. A metadata
    // verdict of deprecated is Known, but S3 entries are compile-time verified
    // against the live lane, so an S3 id stays vouched even when stale
    // metadata claims deprecation (hy3-free case: works after models.dev
    // flags it, dies only when it leaves the Zen catalog).
    if (!metadata.allowed && metadata.source === 'metadata_deprecated' && staticFreeModels.includes(model)) {
      return { allowed: true, source: 'static_verified', known: false }
    }
    if (!metadata.allowed && !metadata.known && staticFreeModels.includes(model)) {
      return { allowed: true, source: 'static_verified', known: false }
    }
    return metadata
  }

  /** ids exposed to DSH: S1 ∩ allowed (minus dead ids), or S3 while the live catalog is pending. */
  list(): string[] {
    if (this.#zen.size === 0) return [...staticFreeModels]
    const out: string[] = []
    for (const model of this.#zen) {
      if (deadModels.has(model)) continue
      if (this.decision(model).allowed) out.push(model)
    }
    return out.sort()
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/adapter/messages.ts:95-123](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/messages.ts#L95-L123)

参数fallback及assistant图像拒绝。

<details>
<summary>查看原文（29行）</summary>

```text
function parseArguments(raw: string): Record<string, unknown> {
  if (typeof raw !== 'string' || raw.length === 0) return {}
  try {
    const parsed = JSON.parse(raw) as unknown
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : { value: parsed }
  } catch {
    return { raw }
  }
}

function toPiAssistant(message: HarnessMessage, providerId: string): Extract<PiMessage, { role: 'assistant' }> {
  const content: PiAssistantBlock[] = []
  for (const block of message.content) {
    switch (block.type) {
      case 'text':
        content.push({ type: 'text', text: block.text })
        break
      case 'reasoning':
        content.push({ type: 'thinking', thinking: block.text })
        break
      case 'tool-call':
        content.push({ type: 'toolCall', id: block.id, name: block.name, arguments: parseArguments(block.arguments) })
        break
      case 'image':
        throw new Error('dsh-plugin-adapter: assistant image output cannot be replayed to a text-only model')
      default:
        break
    }
  }
```

</details>

**依据 5 · 源码核查**：[packages/plugin/src/adapter/messages.ts:156-196](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/messages.ts#L156-L196)

工具结果及工具定义进入Context。

<details>
<summary>查看原文（41行）</summary>

```text
  const providerId = options.provider
  const toolNames = new Map<string, string>()
  const messages: PiMessage[] = []
  for (const message of options.messages) {
    if (message.role === 'system') {
      const text = flattenText(message)
      if (text.length > 0) messages.push({ role: 'user', content: text, timestamp: 0 })
      continue
    }
    if (message.role === 'assistant') {
      const assistant = toPiAssistant(message, providerId)
      for (const block of assistant.content) {
        if (block.type === 'toolCall') toolNames.set(block.id, block.name)
      }
      messages.push(assistant)
      continue
    }
    const text = flattenText(message)
    const results = message.content.filter((block) => block.type === 'tool-result') as Array<
      Extract<HarnessBlock, { type: 'tool-result' }>
    >
    if (text.length > 0 || results.length === 0) {
      messages.push({ role: 'user', content: text, timestamp: 0 })
    }
    for (const result of results) {
      messages.push({
        role: 'toolResult',
        toolCallId: result.toolCallId,
        toolName: toolNames.get(result.toolCallId) ?? 'unknown',
        content: [{ type: 'text', text: toolResultText(result.content) || '(no output)' }],
        isError: result.isError ?? false,
        timestamp: 0,
      })
    }
  }
  const context: PiContext = { messages }
  if (typeof options.system === 'string' && options.system.length > 0) context.systemPrompt = options.system
  const tools = options.tools?.map((tool) => ({ name: tool.name, description: tool.description, parameters: tool.parameters }))
  if (tools && tools.length > 0) context.tools = tools
  return context
}
```

</details>

**依据 6 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:67-90](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/zen-adapter.ts#L67-L90)

上下文与输出四分之一的限制计算。

<details>
<summary>查看原文（24行）</summary>

```text
 * positive even with the host's 64K headroom) and matches what the free
 * models actually produce (32K output).
 */
export function outputLimitFor(limits: ModelLimits): number {
  const quarter = Math.floor(limits.contextWindow / 4)
  return Math.max(1, Math.min(limits.maxTokens, quarter))
}

/**
 * Resolve the advertised limits: per-model metadata/static first, generic
 * defaults last. `contextWindowCap` (config.contextWindow) trims the
 * advertised window: DSH compacts against the window the adapter reports, so
 * a 1M-token model never triggers compaction and every turn re-sends the
 * whole (growing) surface — the single biggest latency and quota lever.
 *
 * The output limit is then clamped into that window (see
 * {@link outputLimitFor}): an output limit that does not fit the window
 * breaks the host's compaction envelope.
 */
function limitsFor(catalog: CatalogLike, model: string, contextWindowCap?: number): ModelLimits {
  const limits = catalog.modelLimits?.(model) ?? { contextWindow: DEFAULT_CONTEXT_WINDOW, maxTokens: DEFAULT_MAX_TOKENS }
  const contextWindow =
    contextWindowCap === undefined || contextWindowCap <= 0 ? limits.contextWindow : Math.min(limits.contextWindow, contextWindowCap)
  return { contextWindow, maxTokens: outputLimitFor({ contextWindow, maxTokens: limits.maxTokens }) }
```

</details>

**依据 7 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:469-477](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/zen-adapter.ts#L469-L477)

实际请求输出值夹紧。

```text
    const reasoning = this.#catalog.reasoningCapability(options.model)?.reasoning === true
    const limits = limitsFor(this.#catalog, options.model, this.#contextWindowCap)
    const model = toPiModel(options.model, reasoning, options.provider ?? PROVIDER_ID, limits)
    // The wire asks for at most what we advertise: the host's request
    // `maxTokens` is our advertised default, and the upstream charges the
    // requested output against the same window as the prompt. A host that
    // asks for more (a per-session override) must not widen the envelope the
    // host's own compaction math depends on.
    const requestMaxTokens = Math.max(1, Math.min(options.maxTokens ?? limits.maxTokens, limits.maxTokens))
```

**依据 8 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:499-504](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/zen-adapter.ts#L499-L504)

恢复调用方工具名的实际传递。

```text
    const rotateStory: string[] = []
    // Tool names the request side had to alias (the free-tier gate owns
    // `read`/`shell`); the response side restores the caller's own names.
    const aliasedNames = { current: new Map<string, string>() }
    const mapToolName = (name: string): string => restoreToolName(name, aliasedNames.current)
    // Capacity-class self-heal: the gateway pins a model instance per session
```

**依据 9 · 源码核查**：[packages/plugin/src/adapter/fingerprint.ts:421-437](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/fingerprint.ts#L421-L437)

真正请求整形及tool_choice变更。

<details>
<summary>查看原文（17行）</summary>

```text
  const plan = planFingerprintTools(body.tools as unknown[] | undefined, { platform, flat: false })
  const next: Record<string, unknown> = { ...body }
  next.tools = plan.tools
  // A body without `stream: true` is refused with the same 429 quota body
  // (measured 2026-10-26: identical fingerprint, stream false 0/2 vs true 2/2).
  // pi-ai only ever streams, so pinning it can never change the wire shape the
  // SDK expects — it just stops a non-streaming caller from reading as "quota".
  next.stream = true
  // `tool_choice: 'none'` is refused outright by the gate; dropping it keeps the
  // caller's tools callable and the placeholders cold (the prompt note covers them).
  if (next.tool_choice === 'none') delete next.tool_choice
  const messages = (Array.isArray(body.messages) ? [...(body.messages as unknown[])] : []) as unknown[]
  ensureChatEnvBlock(messages, options)
  if (plan.appended.length > 0 && !plan.renamed.size) noteInChatMessages(messages, placeholderNote(plan.appended))
  aliasChatHistory(messages, plan.renamed)
  next.messages = messages
  return { body: next, renamed: plan.renamed }
```

</details>

**依据 10 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:724-778](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/zen-adapter.ts#L724-L778)

两个实际SDK调用及signal/maxRetries/maxTokens。

<details>
<summary>查看原文（55行）</summary>

```text
    context: ReturnType<typeof toPiContext>,
    ids: ReturnType<typeof deriveRequestIDs>,
    model: ReturnType<typeof toPiModel>,
    sdkTimeoutMs: number,
    requestMaxTokens: number,
    aliasedNames: { current: Map<string, string> },
  ): unknown {
    // Structural boundary: PiContext (own types, unit-tested) -> pi-ai Context.
    // Responses-only models (muse-spark-*) must hit /responses, not
    // /chat/completions. Both paths carry the free-tier fingerprint
    // (adapter/fingerprint.ts): without the `<env>` marker, the `read`/`shell`
    // declarations and the v2 UA the lane answers 429 `FreeUsageLimitError`.
    if (this.#usesResponsesPath(model.id) && this.#responsesProvider) {
      const onResponsesPayload = (payload: unknown): unknown => {
        const shaped = shapeResponsesBody(payload)
        if (!shaped) return undefined
        aliasedNames.current = shaped.renamed
        return shaped.body
      }
      return this.#responsesProvider.streamSimple(model, context as unknown as Context, {
        apiKey: ANONYMOUS_KEY,
        sessionId: ids.session,
        headers: disguiseHeaders(ids),
        onPayload: onResponsesPayload,
        signal: options.signal,
        maxRetries: 0,
        timeoutMs: sdkTimeoutMs,
        temperature: options.temperature,
        maxTokens: requestMaxTokens,
      })
    }
    // onPayload rewrites the serialized body right before dispatch (the only
    // seam pi-ai offers): the free-tier fingerprint rides it, and so does the
    // selected reasoning effort — pi-ai has no option with the wire semantics
    // this lane needs (a selected "off" must SEND `none`, not omit).
    const effortWire = reasoningEffortWireFor(options.model, options.reasoningEffort)
    const onPayload = (payload: unknown): unknown => {
      const shaped = shapeChatBody(payload)
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) return undefined
      const body = (shaped?.body ?? payload) as Record<string, unknown>
      if (shaped) aliasedNames.current = shaped.renamed
      if (effortWire === undefined) return shaped?.body
      return { ...body, reasoning_effort: effortWire }
    }
    return this.#provider.streamSimple(model, context as unknown as Context, {
      apiKey: ANONYMOUS_KEY,
      sessionId: ids.session,
      headers: disguiseHeaders(ids),
      onPayload,
      signal: options.signal,
      maxRetries: 0,
      timeoutMs: sdkTimeoutMs,
      temperature: options.temperature,
      maxTokens: requestMaxTokens,
    })
```

</details>

**依据 11 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:602-637](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/zen-adapter.ts#L602-L637)

首内容前判定及不重放边界。

<details>
<summary>查看原文（36行）</summary>

```text
        } catch (err) {
          // pre-content silence: synthesize the terminal error pi-ai never
          // delivered so the rotate decision sees a transport failure
          preContentFailure = { message: err instanceof Error ? err.message : String(err) }
          buffered.push(terminalErrorEvent(preContentFailure.message, model))
          break
        }
        if (next.done) break
        const event = next.value as PiEvent
        lastEventAt = Date.now()
        sawAnyEvent = true
        if (event.type === 'error') {
          preContentFailure = { message: event.error.errorMessage ?? 'pi-ai stream error' }
          // the event still flows to the consumer unless we rotate
          buffered.push(event)
          break
        }
        if (event.type === 'done') {
          // pi-ai can also deliver the failure on done (stopReason: error)
          if (event.message.stopReason === 'error' && !deliveredContent) {
            preContentFailure = { message: event.message.errorMessage ?? 'pi-ai stream error' }
          }
          buffered.push(event)
          break
        }
        buffered.push(event)
        if (event.type !== 'start') deliveredContent = true
        if (deliveredContent) {
          // first content event: flush everything buffered and go live
          flushed = true
          break
        }
      }
      // peek phase over: whatever path exited the loop, this attempt's
      // deadline timer is spent (pumpLive re-arms its own per pull)
      clearTimeout(deadlineTimer)
```

</details>

**依据 12 · 源码核查**：[packages/plugin/src/adapter/events.ts:233-255](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/events.ts#L233-L255)

工具结束、usage/finish和无终态抛错。

<details>
<summary>查看原文（23行）</summary>

```text
      case 'toolcall_end':
        yield {
          type: 'block-end',
          index: event.contentIndex,
          block: {
            type: 'tool-call',
            id: event.toolCall.id,
            name: mapToolName(event.toolCall.name),
            arguments: JSON.stringify(event.toolCall.arguments),
          },
        }
        break
      case 'done':
        yield { type: 'usage', usage: mapUsage(event.message.usage) }
        yield { type: 'finish', reason: mapStopReason(event.message, contextWindow) }
        return
      case 'error':
        yield { type: 'usage', usage: mapUsage(event.error.usage) }
        yield { type: 'finish', reason: mapStopReason(event.error, contextWindow) }
        return
    }
  }
  throw new Error('dsh-plugin-adapter: pi-ai event stream ended without done/error')
```

</details>

**依据 13 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:540-566](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/zen-adapter.ts#L540-L566)

watchdog的race消费边界。

<details>
<summary>查看原文（27行）</summary>

```text
      // Peek events until the stream proves itself one way or the other:
      // content -> flush and stream through; error before content -> maybe
      // rotate. Content flushes IMMEDIATELY (only the pre-content events are
      // buffered): holding every token hostage to a failure that may never
      // come would also kill streaming for the UI.
      let flushed = false
      let sawAnyEvent = false
      let lastEventAt = Date.now()
      // One deadline timer at a time, re-armed per pull (a timer per pull
      // would accumulate thousands over a long token stream). While no event
      // has arrived at all, the FIRST-EVENT window applies (stricter — the
      // tunnel/connect stage should answer within seconds); once ANY event
      // has landed (start, or content directly), the looser BODY-IDLE
      // window applies so slow TTFT pacing on healthy exits is not misread
      // as a dead tunnel.
      let deadlineTimer: NodeJS.Timeout | undefined
      const raceDeadline = (): Promise<never> => {
        clearTimeout(deadlineTimer)
        const idleWindow = sawAnyEvent ? bodyIdleMs : firstEventWindowMs
        const message = sawAnyEvent ? WATCHDOG_IDLE_MESSAGE : WATCHDOG_FIRST_MESSAGE
        const ms = Math.max(0, idleWindow - (Date.now() - lastEventAt))
        return new Promise<never>((_, reject) => {
          deadlineTimer = setTimeout(() => reject(new Error(message)), ms)
          deadlineTimer.unref?.()
        })
      }
      // The pump the consumer sees after flush: buffered events first, then
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · relay、IP池和设置桥接分别控制什么，停用是否完整恢复？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

入口只要transport.relay不为off就尝试创建Bun relay句柄，但创建不等实际接入请求。当入口当时cfg.ipPool.enabled为true，index明确把transport设null，ZenAdapter仅保存该transport并在stream时可选ensure；SDK provider构造没有另接relay。全src唯一relay.forward调用在transport的hardened fetch中，因此这条池开分支没有把所创建relay接到Zen请求，index声称“池开Zen仍走relay出口”的日志不能作为机制证据。SDK此时使用ambient/global fetch，能否经池取决于installer、匹配主机及其他owner，不能反向说所有池开请求必走池。

池关分支才把relay交给createZenTransport；但也不是一定走relay。transport捕获构造时globalThis.fetch，ensure只有共享槽仍等于捕获值时才安装hardened fetch，外来owner可阻止，后续槽变化也影响实际请求。安装成功且请求匹配Zen主机后，才先relay.forward：它ensure时延迟启动回环127.0.0.1随机端口Bun子进程；relay失效可回退专用proxy dispatcher，再失败回构造时ambient，没有专用dispatcher则直接回ambient。ambient可能由其他代理控制或直连；缺Bun、relay关闭、无有效proxy等也按这些条件降级，不能从句柄/日志承诺固定路径。

relay脚本固定上游origin再拼路径/查询，不按HTTP入参选任意上游，非通用开放代理；使用时按transport代理轮换，连接失败/429可切换且默认最后允许直连。helper有allowDirect，但index没传；DSH_ZEN_DIRECT=0仅影响Bun脚本，不能统一约束Node/ambient/IP池。IP池空也会暂留直连。dispose有杀relay子进程/关闭专用Agent代码，但创建闲置句柄不能算已启动进程，本轮没有运行验证具体生命周期。

IP池会安装共享undici dispatcher并可能替换globalThis.fetch；检测到部分外来dispatcher时会延期，状态卡暴露deferredReason，这些是已有正向共存机制。仍有具体恢复缺口：installer只在setGlobalDispatcher返回对象时保存previous，代码注释也承认可能返回void；若返回void，disable不恢复slot却销毁本router，日志仍说已恢复。这里是源码可推出的条件分支，不是本轮真实宿主故障复现，也未取得实际依赖返回值原件。另在返回对象分支，disable恢复fetch/dispatcher前没有再核当前slot是否仍由自己占用，需验其他插件后装/先卸载顺序，不能按日志承诺无干扰退出。

设置命名空间保存后live apply，桥接/status、/models、/probe均POST并先检查loopback socket、规范loopback Host及同源标记，非任意远程公开探测接口。状态有池数量、冷却、模型ban、探测/补池进度，probe实际触发探测/补池，不能当无副作用读取。该本机信任边界不等账号/会话隔离；真实远程UI/反代兼容及本机多主体范围另验。卸载会停订阅/补池、清rotate delegate、dispose installer，入口还会主动移除llm-pi-ai旧provider路由；迁移前要备份受影响设置，不能假设卸载自动回滚这次迁移。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/index.ts:101-155](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/index.ts#L101-L155)

创建句柄与实际transport分支分离；池开传null，日志不证明活动relay。

<details>
<summary>查看原文（55行）</summary>

```text
      writeStatus(status, lastError)
      if (lastError) logger.warn(`dsh-plugin-adapter: catalog refresh issue: ${lastError}`)
    },
  })
  // Zen-lane transport (adapter/transport.ts + adapter/zen-relay.ts).
  //
  // Two jobs: (1) the free tier refuses Node's own HTTP client whatever the
  // request looks like (measured 2026-10-26: identical body, Node 0/6 vs Bun
  // 5/5), so the lane is re-originated by a loopback relay run by bun;
  // (2) the ambient proxy dispatcher reuses CONNECT tunnels that Clash/v2rayN
  // silently close, so a direct proxy path still pins pipelining: 0.
  // The IP pool owns the dispatcher when it is enabled (and already pins
  // pipelining: 0), so this seam stays off then.
  // The relay is the only client the free-tier gate answers when the host runs
  // on Node, so it stays on unless explicitly disabled — including when the IP
  // pool is enabled (the pool owns the Node dispatcher, which the Zen lane no
  // longer uses). Exit rotation for the Zen lane is the relay's own lever:
  // the free tier meters a daily quota per exit IP.
  const relay = cfg.transport?.relay === 'off'
    ? null
    : createZenRelay({
      bunPath: cfg.transport?.bunPath,
      proxyUrls: cfg.transport?.proxyUrls,
      proxyUrl: cfg.transport?.proxyUrl,
      proxyCooldownMs: cfg.transport?.proxyCooldownMs,
      log: (message) => logger.info(`dsh-plugin-adapter: ${message}`),
    })
  if (cfg.ipPool?.enabled === true && relay !== null) {
    logger.info('dsh-plugin-adapter: ipPool is enabled, but the Zen lane egresses through the relay exits (transport.proxyUrls), not the pool')
  }
  if (relay === null && cfg.transport?.relay !== 'off') {
    logger.warn('dsh-plugin-adapter: bun was not found, so the Zen lane keeps the Node HTTP stack; the free tier currently answers that stack with 429 FreeUsageLimitError (install bun, or set transport.bunPath)')
  }
  const transport = cfg.ipPool?.enabled === true
    ? null
    : createZenTransport({
      proxyUrl: cfg.transport?.proxyUrl,
      noReuse: cfg.transport?.noReuse,
      relay,
    })
  if (transport) {
    logger.info(`dsh-plugin-adapter: ${transport.describe()}`)
  } else if (cfg.transport?.proxyUrl) {
    logger.warn(`dsh-plugin-adapter: transport.proxyUrl "${cfg.transport.proxyUrl}" is not a usable http(s) proxy URI; Zen traffic keeps the ambient dispatcher`)
  }

  // Watchdog windows (config.watchdog): the first-event gate is a
  // time-to-first-token budget, tiered for reasoning models.
  const adapter = new ZenAdapter(catalog, {
    sessionOverride: cfg.gatewaySession,
    firstEventMs: cfg.watchdog?.firstEventMs,
    reasoningFirstEventMs: cfg.watchdog?.reasoningFirstEventMs,
    bodyIdleMs: cfg.watchdog?.bodyIdleMs,
    contextWindowCap: cfg.contextWindow,
    transport,
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:332-341](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/zen-adapter.ts#L332-L341)

构造实际只保存transport。

<details>
<summary>查看原文（10行）</summary>

```text
    this.#reasoningFirstEventMs = options.reasoningFirstEventMs ?? options.firstEventMs ?? DEFAULT_REASONING_FIRST_EVENT_MS
    this.#bodyIdleMs = options.bodyIdleMs ?? DEFAULT_BODY_IDLE_MS
    this.#firstEventPinned = options.firstEventMs !== undefined || options.reasoningFirstEventMs !== undefined
    this.#contextWindowCap = options.contextWindowCap
    this.#transport = options.transport ?? null
    if (options.providerOverride !== undefined) {
      this.#provider = options.providerOverride as never
      this.#responsesProvider = (options.responsesProviderOverride ?? null) as never
      return
    }
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:478-482](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/zen-adapter.ts#L478-L482)

请求前仅可选ensure transport。

```text
    // The Zen lane's own dispatcher seam (adapter/transport.ts): install the
    // hardened fetch before the request leaves, so a hostile proxy that
    // silently closed the previous CONNECT tunnel cannot kill this turn.
    this.#transport?.ensure()
    // IP-pool routing context (docs/ip-pool.md 3.3): pi-ai builds the request
```

**依据 4 · 源码核查**：[packages/plugin/src/adapter/transport.ts:110-178](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/transport.ts#L110-L178)

唯一relay.forward caller及relay/专用proxy/ambient回退完整链。

<details>
<summary>查看原文（69行）</summary>

```text
 * Build the Zen-lane transport. Returns null when there is nothing to do
 * (no proxy URL, or an unsupported scheme) so the caller can keep the
 * ambient behaviour untouched.
 */
export function createZenTransport(options: ZenTransportOptions = {}): ZenTransport | null {
  const proxyUrl = normalizeProxyUrl(options.proxyUrl)
  const relay = options.relay ?? null
  if (proxyUrl === null && relay === null) return null
  const noReuse = options.noReuse ?? true
  const host = normalizeHost(options.host)

  // Same shape as the IP-pool dispatcher (pool/dispatcher.ts:168-174): the
  // proxy agent's client factory pins pipelining to 0, so every request
  // opens a fresh CONNECT tunnel instead of inheriting a dead one.
  const dispatcher: Dispatcher | null = proxyUrl === null
    ? null
    : noReuse
      ? new ProxyAgent({
        uri: proxyUrl,
        clientFactory: (origin: URL | string, opts?: unknown) =>
          new Agent({ ...(opts as object), pipelining: 0 }),
      })
      : new ProxyAgent({ uri: proxyUrl })

  const ambient = options.ambientFetch ?? globalThis.fetch
  /** What the global slot held when this transport was built. */
  const slot = globalThis.fetch
  let installed = false

  const hardened: typeof globalThis.fetch = async (input: unknown, init?: unknown) => {
    const url = requestUrl(input)
    if (url === null || url.host !== host) {
      return (ambient as (i: unknown, n?: unknown) => Promise<Response>)(input, init)
    }
    // 1) Bun relay: the only client the free-tier gate answers when the host
    //    runs on Node. It owns the upstream call (and the proxy, if any).
    if (relay !== null) {
      try {
        return await relay.forward(input, init as Record<string, unknown> | undefined)
      } catch (err) {
        if (dispatcher === null) {
          return (ambient as (i: unknown, n?: unknown) => Promise<Response>)(input, init)
        }
        // fall through to the hardened proxy path below
        void err
      }
    }
    // 2) Hardened proxy path (fresh CONNECT tunnel per request).
    if (dispatcher !== null) {
      try {
        return await (undiciFetch as unknown as (i: unknown, n?: unknown) => Promise<Response>)(
          input,
          { ...(init as object), dispatcher },
        )
      } catch (err) {
        // Never let the hardened path be the reason the lane dies: retry once
        // through the ambient dispatcher (it may route through another proxy
        // or go direct).
        try {
          return await (ambient as (i: unknown, n?: unknown) => Promise<Response>)(input, init)
        } catch {
          throw err
        }
      }
    }
    return (ambient as (i: unknown, n?: unknown) => Promise<Response>)(input, init)
  }

  return {
```

</details>

**依据 5 · 源码核查**：[packages/plugin/src/adapter/transport.ts:185-207](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/transport.ts#L185-L207)

安装和恢复均核共享fetch槽所有权。

<details>
<summary>查看原文（23行）</summary>

```text
    ensure() {
      const current = globalThis.fetch
      if (current === (hardened as unknown as typeof globalThis.fetch)) {
        installed = true
        return
      }
      // Only take the slot when it still holds the fetch we captured at
      // build time: another plugin that swapped the global fetch (the IP
      // pool does) keeps ownership — clobbering it would break its routing.
      if (installed) return
      if (current !== slot) return
      ;(globalThis as { fetch: unknown }).fetch = hardened
      installed = true
    },
    restore() {
      if (!installed) return
      if (globalThis.fetch === (hardened as unknown as typeof globalThis.fetch)) {
        ;(globalThis as { fetch: unknown }).fetch = slot
      }
      installed = false
      if (dispatcher !== null) void dispatcher.close().catch(() => {})
    },
  }
```

</details>

**依据 6 · 源码核查**：[packages/plugin/src/adapter/zen-relay.ts:89-114](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/zen-relay.ts#L89-L114)

回环、固定origin、出口和默认直连。

<details>
<summary>查看原文（26行）</summary>

```text
const server = Bun.serve({
  hostname: '127.0.0.1',
  port: 0,
  idleTimeout: 255,
  async fetch(req) {
    const url = new URL(req.url)
    const target = upstream + url.pathname + url.search
    const headers = new Headers(req.headers)
    headers.delete('host')
    headers.delete('accept-encoding')
    const init = { method: req.method, headers }
    if (keepAlive) init.keepalive = true
    let payload
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      // Read once: a retry through the next exit must send the same bytes.
      payload = await req.arrayBuffer()
      init.body = payload
    }

    // Order: usable exits in rotation order, then direct (unless forbidden).
    const order = candidates()
    if (directAllowed) order.push(null)
    if (order.length === 0) {
      return relayError(502, 'dsh-plugin-adapter relay: every configured exit is benched and direct is disabled')
    }

```

</details>

**依据 7 · 源码核查**：[packages/plugin/src/adapter/zen-relay.ts:325-347](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/zen-relay.ts#L325-L347)

延迟ensure、forward和dispose。

<details>
<summary>查看原文（23行）</summary>

```text

  return {
    isReady: () => port > 0,
    async ensure() {
      if (disposed) return false
      if (port > 0) return true
      if (attempts >= 3) return false
      attempts += 1
      return start()
    },
    async forward(input, init) {
      const ok = await this.ensure()
      if (!ok) throw new Error('dsh-plugin-adapter: zen relay is not running')
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : String((input as { url?: string })?.url ?? '')
      const parsed = new URL(url)
      const local = `http://127.0.0.1:${port}${parsed.pathname}${parsed.search}`
      return (await undiciFetch(local, { ...(init as object), dispatcher: loopback })) as unknown as Response
    },
    dispose() {
      disposed = true
      stop()
      void loopback.close().catch(() => {})
    },
```

</details>

**依据 8 · 源码核查**：[packages/plugin/src/ip-pool.ts:250-259](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/ip-pool.ts#L250-L259)

空池直连，而非严格失败。

<details>
<summary>查看原文（10行）</summary>

```text
  }

  let fetcherActive = false
  if (pool.snapshot().total > 0) {
    installer.install()
  } else {
    logger.warn('dsh-plugin-adapter: ipPool enabled but no exits configured; staying direct until settings add exits')
  }
  applyConfig()

```

</details>

**依据 9 · 源码核查**：[packages/plugin/src/pool/installer.ts:108-160](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/pool/installer.ts#L108-L160)

保存旧slot依赖setter返回值及无当前owner检查的恢复。

<details>
<summary>查看原文（53行）</summary>

```text
    })
    const previous = this.#deps.undici.setGlobalDispatcher(router as unknown as InstallableDispatcher)
    // undici's setter returns the replaced dispatcher (void on some hosts)
    if (previous instanceof Object) this.#previous = previous as Dispatcher
    const old = this.#current
    this.#current = router
    this.#enabled = true
    if (old !== null) void old.destroy().catch(() => {})
    // Global-fetch capture (R2, live-observed 2026-09-09): Node's built-in
    // fetch reads the BUILT-IN undici's dispatcher slot — a different module
    // instance than the npm undici this seam routes through — so
    // setGlobalDispatcher alone never routes the OpenAI SDK's requests
    // (it captures globalThis.fetch at call time). Swap the global fetch to
    // the module's own (which honors OUR dispatcher slot) while routing is
    // enabled; restore on disable. Only when the module actually exposes a
    // distinct fetch — a same-instance host needs nothing.
    const moduleFetch = this.#deps.undici.fetch
    if (typeof moduleFetch === 'function' && globalThis.fetch !== moduleFetch) {
      this.#savedGlobalFetch = globalThis.fetch
      ;(globalThis as { fetch: unknown }).fetch = moduleFetch
      this.#deps.logger?.info('dsh-plugin-adapter: globalThis.fetch -> undici module fetch (built-in fetch bypasses the pool dispatcher otherwise)')
    }
    this.#deps.logger?.info('dsh-plugin-adapter: global dispatcher -> PoolRoutingDispatcher (exit routing enabled)')
  }

  /** Restore the pre-install dispatcher and close ours. */
  disable(): void {
    if (!this.#enabled) return
    this.#enabled = false
    if (this.#savedGlobalFetch !== null) {
      ;(globalThis as { fetch: unknown }).fetch = this.#savedGlobalFetch
      this.#savedGlobalFetch = null
    }
    if (this.#previous !== null) {
      try {
        this.#deps.undici.setGlobalDispatcher(this.#previous)
      } catch {
        // the saved dispatcher may already be gone (host teardown) — our
        // uninstall still succeeded for our own layer
      }
      this.#previous = null
    }
    const dying = this.#current
    this.#current = null
    if (dying !== null) void dying.destroy().catch(() => {})
    this.#deps.logger?.info('dsh-plugin-adapter: exit routing disabled; previous global dispatcher restored')
  }

  /** Full teardown (plugin dispose): same as disable. */
  dispose(): void {
    this.disable()
  }
}
```

</details>

**依据 10 · 源码核查**：[packages/plugin/src/ip-pool-settings/bridge.ts:190-216](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/ip-pool-settings/bridge.ts#L190-L216)

本机和同源信任判断。

<details>
<summary>查看原文（27行）</summary>

```text
/** Browser same-origin marker (loopback hosts are always same-origin here). */
function isSameOriginRequest(request: { headers: Record<string, string | string[] | undefined> }, hostUrl: URL): boolean {
  const headers = request.headers
  const site = headers['sec-fetch-site']
  if (site === 'cross-site') return false
  const origin = headers.origin
  if (origin === undefined) return true
  try {
    return new URL(String(origin)).host === hostUrl.host
  } catch {
    return false
  }
}

/** Hot-path trust decision: loopback socket + canonical Host + same-origin. */
export function isTrustedBridgeRequest(request: {
  socket?: { remoteAddress?: unknown }
  headers: Record<string, string | string[] | undefined>
}): boolean {
  if (!isLoopbackAddress(request.socket?.remoteAddress)) return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  const parsed = parseAuthority(host)
  if (parsed === undefined || parsed.url.host.toLowerCase() !== host.toLowerCase()) return false
  if (!isSameOriginRequest(request, parsed.url)) return false
  return isLoopbackHostname(parsed.url.hostname)
}
```

</details>

**依据 11 · 源码核查**：[packages/plugin/src/ip-pool-settings/bridge.ts:319-371](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/ip-pool-settings/bridge.ts#L319-L371)

所有桥接动作先过guard与POST。

<details>
<summary>查看原文（53行）</summary>

```text
  deps: {
    guard?: (req: unknown) => boolean
  } = {},
): Array<{ kind: 'exact'; path: string; handler: (req: never, res: never) => void | Promise<void> }> {
  const guard = deps.guard ?? isTrustedBridgeRequest
  const check = (req: { method?: string } & Parameters<typeof isTrustedBridgeRequest>[0], res: { writeHead(status: number, headers: Record<string, string>): void; end(body: string): void }): boolean => {
    if (!guard(req)) {
      writeJson(res, 403, { error: 'forbidden' })
      return false
    }
    if (req.method !== 'POST') {
      writeJson(res, 405, { error: 'method not allowed: ' + (req.method ?? '') })
      return false
    }
    return true
  }
  return [
    {
      kind: 'exact',
      path: `${IP_POOL_BRIDGE_PREFIX}/status`,
      handler: async (req, res) => {
        if (!check(req as never, res as never)) return
        const result = await handlers.status()
        writeJson(res as never, 200, result)
      },
    },
    {
      kind: 'exact',
      path: `${IP_POOL_BRIDGE_PREFIX}/models`,
      handler: async (req, res) => {
        if (!check(req as never, res as never)) return
        const result = await handlers.models()
        writeJson(res as never, 200, result)
      },
    },
    {
      kind: 'exact',
      path: `${IP_POOL_BRIDGE_PREFIX}/probe`,
      handler: async (req, res) => {
        if (!check(req as never, res as never)) return
        let body: unknown
        try {
          body = await readJsonBody(req as never)
        } catch {
          body = undefined
        }
        if (body === undefined || typeof body !== 'object' || body === null) {
          writeJson(res as never, 400, { ok: false, code: 'settings-rejected', message: 'unreadable JSON body' })
          return
        }
        const result = await handlers.probe(body as { scope?: unknown; exitId?: unknown })
        writeJson(res as never, 200, result)
      },
```

</details>

**依据 12 · 源码核查**：[packages/plugin/src/ip-pool.ts:378-389](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/ip-pool.ts#L378-L389)

实际后台与installer退出链。

<details>
<summary>查看原文（12行）</summary>

```text
    },
    async refreshSubscriptions() {
      await subscriptions?.refreshNow()
    },
    async dispose() {
      setRotateDelegate(null)
      subscriptions?.stop()
      refill?.stop()
      installer.dispose()
    },
  }
}
```

</details>

**依据 13 · 源码核查**：[packages/plugin/src/provider.ts:44-58](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/provider.ts#L44-L58)

主动删除旧provider设置，不是只读诊断。

<details>
<summary>查看原文（15行）</summary>

```text
export async function removeProviderRoute(
  seams: Pick<DshSeams, 'settings'>,
  providerId: string,
  extraProviderIds: readonly string[] = [],
): Promise<boolean> {
  const namespace = seams.settings.get('llm-pi-ai') as { providers?: Record<string, unknown> } | undefined
  if (!namespace?.providers) return false
  const stale = [providerId, ...extraProviderIds].filter((id) => id in namespace.providers!)
  if (stale.length === 0) return false
  await seams.settings.mutate(
    'llm-pi-ai',
    stale.map((id) => ({ op: 'unset' as const, path: ['providers', id] })),
  )
  return true
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、使用、维护和退出分别需要什么，哪些效果有证据？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

应先解决产物绑定，再比较一项真实任务；不要先开公共代理池再用“免费”解释总成本。根安装与源码子包打包是不同路径，以下是所审源码的条件说明，未实际安装。IP池默认关闭；开启后free补池默认可开启，定期拉源、准入和模型smoke探测都会消耗网络/上游容量，不能计作零。加密订阅节点可用sing-box supervisor，属于条件性外部二进制/进程，不是所有用户必装；本轮未全审其所有解析器与子进程边界。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH llm及兼容注册接口 | 必需 | 原生provider及宿主工具循环 | 无llm时不形成模型服务；ready不等模型可用 |
| 实际包/固定源码对应关系 | 必需核实 | 根npm范围依赖与子包构建绑定 | 当前未知，不能把0.6.0能力保证给根安装 |
| Node>=20、源码打包工具及pi-ai/undici等 | 源码路线必需 | 构建未提交lib、SDK和网络 | 不以src存在当可直接装载；真实发布物另核 |
| Zen与模型元数据网络 | 核心/目录降级 | 模型请求及免费判定 | 静态/名称fallback可有目录，未证明模型存活或永久免费 |
| Bun及transport代理 | 活动relay条件 | 另进程转发及指定出口 | 接线依入口transport/fetch owner；缺Bun或失败可回ambient，池空可能直连 |
| IP池来源/订阅、可选sing-box | 仅开启对应分支 | 采集、探测和节点转换 | 增加后台网络/进程/信任及维护，入口池开时relay未接Zen；池实际安装/其他owner仍需核实 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 确认产物 | 操作者比对实际包版本/入口哈希与固定源码 | 未对应就停止引用本实现能力并复核真实包 |
| 隔离注册 | 在独立DSH profile保留旧配置后接provider | 同时核模型/错误状态，不以ready或目录成功结案 |
| 跑一项文本/工具任务 | 操作者授权测试数据和工具；宿主执行/续接 | 核工具ID/结果、真实产物、finish与上游错误 |
| 定向核传输 | 记录Bun/Node、实际出口与直连，按需才开池 | 阻断及重试不能重放已交付工具；探测不等任务通过 |
| 退出/回退 | 停新请求、核在途、卸载后台/relay并检查全局网络及设置 | 原生provider/其他插件仍可用；有未决先核结果再重试 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次接入 | 包/构建、目录网络、可选Bun及代理资源 | 查产物/配置、隔离验工具与出口 | 未取得实际工时、服务条款/费用及运行回执 |
| 日常使用 | 模型/出口网络、子进程；重试及probe可能额外请求 | 核错误和不确定结果 | anonymous key/零价元数据不是账单或长期免费保证 |
| 持续维护 | 上游指纹/模型/SDK变化、池补源/订阅/节点进程 | 重测协议与代理、更新依赖和排障 | 无稳定可用率、任务质量、维护频率或净节省实测 |
| 停用/迁移 | 在途请求、备份/清理及恢复资源 | 核dispatcher/fetch、进程、路由设置及未决任务 | 已有清理代码但恢复分支有条件缺口，不能按日志计零 |

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 原生接入 | provider注册到真实SDK、工具事件与终态有源码链 | 根部署加载本源码、真实模型/完整工具任务通过率 |
| 免费模型暴露 | 元数据/名称/静态判定和降级可检查 | 目录实时存活、真实费用、配额和可持续性 |
| 错误/恢复 | 首内容前重试、分类、无终态报错、已有状态卡 | 实际延迟/重复/取消停止资源及全局网络恢复 |
| 工作流收益 | 可省另开CLI搬上下文的步骤 | 比现有provider的正确率、总工时和净成本优势 |

本轮只读固定源码及材料，没有执行目标构建、测试、安装、模型、Bun、代理、探测或业务写操作；没有将作者测试、注释日期/成功率或脚本存在当独立验证。

#### 证据与依据

**依据 1 · 作者声明**：[packages/plugin/package.json:1-17](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/package.json#L1-L17)

入口和构建产物范围。

<details>
<summary>查看原文（17行）</summary>

```text
{
  "name": "@memef1f1y/dsh-plugin-adapter",
  "version": "0.6.0",
  "description": "Free OpenCode Zen models for DeepSeek Harness (DSH): native dsh-llm adapter plugin, no API key.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json",
    "./client": "./lib/client.js"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "README.zh-CN.md",
```

</details>

**依据 2 · 源码核查**：[packages/plugin/package.json:44-49](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/package.json#L44-L49)

构建/打包要求。

```text
  "scripts": {
    "build": "tsdown src/index.ts --format esm --dts --out-dir lib --no-clean",
    "prepack": "node -e \"require('fs').rmSync('lib',{recursive:true,force:true})\" && pnpm build && pnpm build:client && node ../../scripts/prepare-package.mjs",
    "typecheck": "tsc --noEmit",
    "test": "node --test \"test/*.test.ts\"",
    "build:client": "tsdown -c tsdown.client.config.ts"
```

**依据 3 · 源码核查**：[packages/plugin/src/ip-pool-settings/apply.ts:28-52](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/ip-pool-settings/apply.ts#L28-L52)

IP池及free默认条件。

<details>
<summary>查看原文（25行）</summary>

```text

/** Extract the ip-pool settings value with defaults filled (schema-independent). */
function withDefaults(value: AnyIpPoolSection | undefined): IpPoolSettings {
  const raw = value ?? {}
  const urls = raw.subscription?.urls ?? raw.subscriptions ?? []
  return {
    enabled: raw.enabled ?? false,
    probeModels: raw.probeModels ?? [],
    maxConcurrentProbes: raw.maxConcurrentProbes ?? 3,
    free: {
      enabled: raw.free?.enabled ?? true,
      targetSize: raw.free?.targetSize ?? 20,
      blockedCountries: raw.free?.blockedCountries ?? ['CN'],
    },
    manual: raw.manual ?? [],
    subscription: {
      urls,
      refreshMs: raw.subscription?.refreshMs ?? 30 * 60_000,
    },
    singbox: { path: raw.singbox?.path ?? 'sing-box' },
    pinnedExitId: raw.pinnedExitId ?? '',
    pinnedStrict: raw.pinnedStrict ?? false,
    proxyHosts: raw.proxyHosts ?? [],
    maxRotateAttempts: raw.maxRotateAttempts ?? 3,
  }
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/index.ts:133-155](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/index.ts#L133-L155)

安装/资源条件需按实际transport分支判断。

<details>
<summary>查看原文（23行）</summary>

```text
  }
  const transport = cfg.ipPool?.enabled === true
    ? null
    : createZenTransport({
      proxyUrl: cfg.transport?.proxyUrl,
      noReuse: cfg.transport?.noReuse,
      relay,
    })
  if (transport) {
    logger.info(`dsh-plugin-adapter: ${transport.describe()}`)
  } else if (cfg.transport?.proxyUrl) {
    logger.warn(`dsh-plugin-adapter: transport.proxyUrl "${cfg.transport.proxyUrl}" is not a usable http(s) proxy URI; Zen traffic keeps the ambient dispatcher`)
  }

  // Watchdog windows (config.watchdog): the first-event gate is a
  // time-to-first-token budget, tiered for reasoning models.
  const adapter = new ZenAdapter(catalog, {
    sessionOverride: cfg.gatewaySession,
    firstEventMs: cfg.watchdog?.firstEventMs,
    reasoningFirstEventMs: cfg.watchdog?.reasoningFirstEventMs,
    bodyIdleMs: cfg.watchdog?.bodyIdleMs,
    contextWindowCap: cfg.contextWindow,
    transport,
```

</details>

**依据 5 · 源码核查**：[packages/plugin/src/adapter/transport.ts:138-178](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/transport.ts#L138-L178)

失败可降至捕获ambient，不能许严格路径。

<details>
<summary>查看原文（41行）</summary>

```text

  const hardened: typeof globalThis.fetch = async (input: unknown, init?: unknown) => {
    const url = requestUrl(input)
    if (url === null || url.host !== host) {
      return (ambient as (i: unknown, n?: unknown) => Promise<Response>)(input, init)
    }
    // 1) Bun relay: the only client the free-tier gate answers when the host
    //    runs on Node. It owns the upstream call (and the proxy, if any).
    if (relay !== null) {
      try {
        return await relay.forward(input, init as Record<string, unknown> | undefined)
      } catch (err) {
        if (dispatcher === null) {
          return (ambient as (i: unknown, n?: unknown) => Promise<Response>)(input, init)
        }
        // fall through to the hardened proxy path below
        void err
      }
    }
    // 2) Hardened proxy path (fresh CONNECT tunnel per request).
    if (dispatcher !== null) {
      try {
        return await (undiciFetch as unknown as (i: unknown, n?: unknown) => Promise<Response>)(
          input,
          { ...(init as object), dispatcher },
        )
      } catch (err) {
        // Never let the hardened path be the reason the lane dies: retry once
        // through the ambient dispatcher (it may route through another proxy
        // or go direct).
        try {
          return await (ambient as (i: unknown, n?: unknown) => Promise<Response>)(input, init)
        } catch {
          throw err
        }
      }
    }
    return (ambient as (i: unknown, n?: unknown) => Promise<Response>)(input, init)
  }

  return {
```

</details>

**依据 6 · 源码核查**：[packages/plugin/src/ip-pool.ts:180-207](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/ip-pool.ts#L180-L207)

订阅与条件sing-box supervisor。

<details>
<summary>查看原文（28行）</summary>

```text
    const singboxPath = config.ipPool?.singbox?.path
    if (typeof singboxPath !== 'string' || singboxPath.length === 0) return undefined
    if (supervisor === undefined) {
      supervisor = new SingBoxSupervisor({
        binPath: singboxPath,
        dataDir: join(dataDir(), 'singbox'),
        logger,
      })
    } else {
      supervisor.setBinPath(singboxPath)
    }
    return supervisor
  }

  const ensureSubscriptions = (urls: string[]): SubscriptionFetcher | null => {
    if (urls.length === 0) return null
    if (subscriptions === null) {
      subscriptions = new SubscriptionFetcher(
        { ...admissionDeps, prober, supervisor: ensureSupervisor() },
        { logger },
      )
    }
    subscriptions.setUrls(urls)
    return subscriptions
  }

  /** Apply the config to the live objects (initial start + reconfigure). */
  const applyConfig = (): void => {
```

</details>

**依据 7 · 源码核查**：[packages/plugin/src/ip-pool.ts:214-247](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/ip-pool.ts#L214-L247)

真实周期补池/订阅启动。

<details>
<summary>查看原文（34行）</summary>

```text

    // Free loop on/off + restart on target change (interval fixed 10min).
    const wantRefill = (current.free?.enabled ?? true) && current.enabled !== false
    if (wantRefill && refill === null) {
      refill = new RefillScheduler(pool, { ...admissionDeps, prober })
      // Auto-install when the first refill lands exits (live-observed
      // 2026-09-09): the free-source pool starts EMPTY, so the initial
      // install() below stays deferred ("no exits configured") and nothing
      // ever retried it — the pool filled up but routing never engaged
      // until the user touched settings (reconfigure). Watch the pool and
      // engage routing the moment the first exit is admitted.
      refill.onAdmitted(() => {
        if (!installer.enabled && current.enabled !== false && pool.snapshot().total > 0) {
          installer.install()
          if (installer.enabled) {
            logger.info('dsh-plugin-adapter: first free exits admitted — exit routing engaged')
          }
        }
      })
      refill.start()
    } else if (!wantRefill && refill !== null) {
      refill.stop()
      refill = null
    }

    // Subscription layer: (re)create on URL change, keep the fetcher across
    // refresh-interval edits.
    const urls = current.subscriptions ?? []
    const fetcher = ensureSubscriptions(urls)
    if (fetcher !== null) {
      fetcher.setIntervalMs(current.subscription?.refreshMs ?? 30 * 60_000)
      if (fetcher === subscriptions && !fetcherActive) {
        fetcher.start()
        fetcherActive = true
```

</details>

**依据 8 · 源码核查**：[packages/plugin/src/ip-pool.ts:260-282](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/ip-pool.ts#L260-L282)

模型探测会发实际smoke，不是纯展示。

<details>
<summary>查看原文（23行）</summary>

```text
  const probeAll = async (): Promise<number> => {
    const models = probeModels.length > 0 ? probeModels : ['big-pickle']
    const { admitCandidate, admitTrusted } = await import('./pool/admission.ts')
    const tasks = pool.list().map((entry): import('./pool/prober.ts').ProbeTask => ({
      exitId: entry.id,
      kind: 'probe-all',
      run: async () => {
        for (const model of models) {
          // The smoke rides the shared admission deps; point its model at the
          // current probe-model before each pass (per-exit serial, §4.1).
          admissionDeps.smokeModel = model
          // Free exits re-run the full candidate chain (echo→tunnel→smoke) —
          // their facts may have drifted; trusted exits run the smoke only
          // (docs §4.5 manual/subscription path). Pinned rides the trusted
          // path so a blocked echo endpoint never evicts the user's line.
          const verdict = entry.source === 'free'
            ? await admitCandidate(admissionDeps, {
              address: entry.id,
              protocol: entry.protocol,
              source: 'free',
            })
            : await admitTrusted(admissionDeps, {
              address: entry.id,
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 现有诊断之外还剩什么可验证增量，最强反例是什么？

**研究主题**：新假设与验证、贡献与相对优势、工程质量与复用

#### 完整回答

目录快照、lastError、池状态、deferredReason、探测队列/补池进度以及错误分类已在实现中，因此“再做一个健康状态页/探活按钮”不是新方向。剩余缺口是这些状态与单次任务实际走的传输、出口/直连、首段交付边界和最终资源释放之间没有形成可核对的统一记录；index日志宣称池开仍走relay，但其下分支把transport设null；这个日志与caller不一致就是直接反例。池的健康状态也不能代替核实际dispatcher安装、匹配主机、共享fetch owner与fallback。

候选增量是在现有错误与状态接口之上形成一次调用的最小执行凭据：实际加载的包/代码、传输层、被尝试出口及允许直连策略、首次交付点、最终finish/未决、取消与退出确认。优先让策略与实际路径一致并修具体恢复缺口，而不是扩充免费节点数量。不得把完整提示词/工具结果或含凭据代理URL当必收日志；最小标识和必要统计是否足够，应按隐私与定位需求验证。

这仍是未实现/未验证假设，不是本插件现有成果，也不天然值得独立收费插件。最强替代是修root打包/dispatcher恢复，加几条原生日志，再用固定provider或另开现有CLI；如果少量配置/修补就能同样定位故障，新增产品应停止。先取得脱敏真实失败任务，比较误判“可用”、不确定结果重试、定位/纠错工时及日志负担；只有现有状态和简单修补仍解决不了、实际路径凭据稳定减轻负担，才考虑提炼跨provider能力。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/index.ts:82-102](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/index.ts#L82-L102)

现有目录诊断写入，不应再包装为新能力。

<details>
<summary>查看原文（21行）</summary>

```text
  // Lifecycle (assembly on first enable, live reconfigure, dispose) is owned
  // by applyIpPoolSettings through the plugin fiber.
  // 0.4.0 rename: the data directory moved from ~/.opencode2dsh to
  // ~/.dsh-plugin-adapter; the legacy directory is copied over and parked
  // as a rollback path (data-dir.ts).
  const dataDir = resolveDataDir({ logger }).dir
  const statusPath = join(dataDir, 'adapter-status.json')
  const writeStatus = (status: CatalogSnapshot, lastError: string): void => {
    void writeFile(
      statusPath,
      JSON.stringify({ ...status, lastError, writtenAt: new Date().toISOString() }, null, 2),
      'utf8',
    ).catch(() => {})
  }

  const catalog = new ModelCatalog({
    refreshSeconds: cfg.refreshSeconds,
    cachePath: defaultCachePath(dataDir),
    onRefresh: (status, lastError) => {
      writeStatus(status, lastError)
      if (lastError) logger.warn(`dsh-plugin-adapter: catalog refresh issue: ${lastError}`)
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/ip-pool-settings/bridge.ts:118-146](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/ip-pool-settings/bridge.ts#L118-L146)

已有deferred/队列/补池/订阅状态。

<details>
<summary>查看原文（29行）</summary>

```text
      passive: runtime.pool.passiveStats(entry.id),
    }))
    : []
  return {
    enabled: runtime !== null && runtime.installer.enabled,
    deferredReason: runtime !== null && !runtime.installer.enabled
      ? (runtime.installer as unknown as { deferredReason?: string }).deferredReason ?? ''
      : '',
    state: snapshot.state,
    total: snapshot.total,
    bySource: snapshot.bySource,
    availableFree: snapshot.availableFree,
    targetSize: runtime ? runtime.pool.targetSize : 20,
    pinned: snapshot.pinned !== ''
      ? { id: snapshot.pinned, strict: pinnedStrict }
      : null,
    proxyHosts,
    exits,
    prober: runtime
      ? runtime.prober.stats
      : { queued: 0, inFlight: 0, enqueued: 0, completed: 0 },
    refill: runtime?.refill
      ? { ...runtime.refill.lastRound, progress: runtime.refill.progress }
      : null,
    subscription: runtime?.subscriptions
      ? {
        urlCount: runtime.subscriptions.urlCount,
        pendingConversion: runtime.subscriptions.state.pendingConversion.length,
        convertedAdmitted: runtime.subscriptions.state.convertedAdmitted,
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/index.ts:109-155](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/index.ts#L109-L155)

日志声称relay而实际transport=null的反证。

<details>
<summary>查看原文（47行）</summary>

```text
  // 5/5), so the lane is re-originated by a loopback relay run by bun;
  // (2) the ambient proxy dispatcher reuses CONNECT tunnels that Clash/v2rayN
  // silently close, so a direct proxy path still pins pipelining: 0.
  // The IP pool owns the dispatcher when it is enabled (and already pins
  // pipelining: 0), so this seam stays off then.
  // The relay is the only client the free-tier gate answers when the host runs
  // on Node, so it stays on unless explicitly disabled — including when the IP
  // pool is enabled (the pool owns the Node dispatcher, which the Zen lane no
  // longer uses). Exit rotation for the Zen lane is the relay's own lever:
  // the free tier meters a daily quota per exit IP.
  const relay = cfg.transport?.relay === 'off'
    ? null
    : createZenRelay({
      bunPath: cfg.transport?.bunPath,
      proxyUrls: cfg.transport?.proxyUrls,
      proxyUrl: cfg.transport?.proxyUrl,
      proxyCooldownMs: cfg.transport?.proxyCooldownMs,
      log: (message) => logger.info(`dsh-plugin-adapter: ${message}`),
    })
  if (cfg.ipPool?.enabled === true && relay !== null) {
    logger.info('dsh-plugin-adapter: ipPool is enabled, but the Zen lane egresses through the relay exits (transport.proxyUrls), not the pool')
  }
  if (relay === null && cfg.transport?.relay !== 'off') {
    logger.warn('dsh-plugin-adapter: bun was not found, so the Zen lane keeps the Node HTTP stack; the free tier currently answers that stack with 429 FreeUsageLimitError (install bun, or set transport.bunPath)')
  }
  const transport = cfg.ipPool?.enabled === true
    ? null
    : createZenTransport({
      proxyUrl: cfg.transport?.proxyUrl,
      noReuse: cfg.transport?.noReuse,
      relay,
    })
  if (transport) {
    logger.info(`dsh-plugin-adapter: ${transport.describe()}`)
  } else if (cfg.transport?.proxyUrl) {
    logger.warn(`dsh-plugin-adapter: transport.proxyUrl "${cfg.transport.proxyUrl}" is not a usable http(s) proxy URI; Zen traffic keeps the ambient dispatcher`)
  }

  // Watchdog windows (config.watchdog): the first-event gate is a
  // time-to-first-token budget, tiered for reasoning models.
  const adapter = new ZenAdapter(catalog, {
    sessionOverride: cfg.gatewaySession,
    firstEventMs: cfg.watchdog?.firstEventMs,
    reasoningFirstEventMs: cfg.watchdog?.reasoningFirstEventMs,
    bodyIdleMs: cfg.watchdog?.bodyIdleMs,
    contextWindowCap: cfg.contextWindow,
    transport,
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/adapter/transport.ts:138-178](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/transport.ts#L138-L178)

relay唯一caller、专用proxy及ambient失败回退。

<details>
<summary>查看原文（41行）</summary>

```text

  const hardened: typeof globalThis.fetch = async (input: unknown, init?: unknown) => {
    const url = requestUrl(input)
    if (url === null || url.host !== host) {
      return (ambient as (i: unknown, n?: unknown) => Promise<Response>)(input, init)
    }
    // 1) Bun relay: the only client the free-tier gate answers when the host
    //    runs on Node. It owns the upstream call (and the proxy, if any).
    if (relay !== null) {
      try {
        return await relay.forward(input, init as Record<string, unknown> | undefined)
      } catch (err) {
        if (dispatcher === null) {
          return (ambient as (i: unknown, n?: unknown) => Promise<Response>)(input, init)
        }
        // fall through to the hardened proxy path below
        void err
      }
    }
    // 2) Hardened proxy path (fresh CONNECT tunnel per request).
    if (dispatcher !== null) {
      try {
        return await (undiciFetch as unknown as (i: unknown, n?: unknown) => Promise<Response>)(
          input,
          { ...(init as object), dispatcher },
        )
      } catch (err) {
        // Never let the hardened path be the reason the lane dies: retry once
        // through the ambient dispatcher (it may route through another proxy
        // or go direct).
        try {
          return await (ambient as (i: unknown, n?: unknown) => Promise<Response>)(input, init)
        } catch {
          throw err
        }
      }
    }
    return (ambient as (i: unknown, n?: unknown) => Promise<Response>)(input, init)
  }

  return {
```

</details>

**依据 5 · 源码核查**：[packages/plugin/src/adapter/transport.ts:185-202](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/transport.ts#L185-L202)

外来fetch owner可阻止接入，状态不等实际路径。

<details>
<summary>查看原文（18行）</summary>

```text
    ensure() {
      const current = globalThis.fetch
      if (current === (hardened as unknown as typeof globalThis.fetch)) {
        installed = true
        return
      }
      // Only take the slot when it still holds the fetch we captured at
      // build time: another plugin that swapped the global fetch (the IP
      // pool does) keeps ownership — clobbering it would break its routing.
      if (installed) return
      if (current !== slot) return
      ;(globalThis as { fetch: unknown }).fetch = hardened
      installed = true
    },
    restore() {
      if (!installed) return
      if (globalThis.fetch === (hardened as unknown as typeof globalThis.fetch)) {
        ;(globalThis as { fetch: unknown }).fetch = slot
```

</details>

**依据 6 · 源码核查**：[packages/plugin/src/pool/installer.ts:133-160](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/pool/installer.ts#L133-L160)

退出凭据不能仅依赖恢复日志。

<details>
<summary>查看原文（28行）</summary>

```text
  /** Restore the pre-install dispatcher and close ours. */
  disable(): void {
    if (!this.#enabled) return
    this.#enabled = false
    if (this.#savedGlobalFetch !== null) {
      ;(globalThis as { fetch: unknown }).fetch = this.#savedGlobalFetch
      this.#savedGlobalFetch = null
    }
    if (this.#previous !== null) {
      try {
        this.#deps.undici.setGlobalDispatcher(this.#previous)
      } catch {
        // the saved dispatcher may already be gone (host teardown) — our
        // uninstall still succeeded for our own layer
      }
      this.#previous = null
    }
    const dying = this.#current
    this.#current = null
    if (dying !== null) void dying.destroy().catch(() => {})
    this.#deps.logger?.info('dsh-plugin-adapter: exit routing disabled; previous global dispatcher restored')
  }

  /** Full teardown (plugin dispose): same as disable. */
  dispose(): void {
    this.disable()
  }
}
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 目前应该怎样采用，最低验收和停止条件是什么？

**研究主题**：采用判断、效果与总成本

#### 完整回答

建议观察，适合能核产物、传输和退出的DSH使用者在独立profile评估原生匿名文本/工具会话；不把当前根入口当已验证0.6.0或长期主力免费服务。先解决根实际包版本/入口绑定，再用一个有明确验收结果的授权任务测文本、工具别名/占位声明、工具结果续接、usage/finish与错误；仅目录或一次纯文本回复不足以验收自主工具任务。

传输按实际Bun/Node、直连/代理及池路径逐条核，不用状态页推断出口。特别核无内容/半段错误、空完成/缺终态、协议自愈和429切换，确认首交付后不会重放工具；取消/超时需查旧请求是否真正停止，卸载后核共享dispatcher/fetch、后台和路由配置，而不是只看成功日志。根产物对应不明、严格出站要求不满足、工具/结果归属错位或退出影响其他provider，均应停新请求并查在途结果后回退。

采用判断按具体工作流、比较增量、证据与成本分别评，不按上游热度、代码量或免费名称评分。源码对事件与故障边界的实现有可迁移经验，但fork、成熟SDK和DSH自主循环应正确归因；复杂指纹、额外进程、动态出口及恢复责任又抵消部分简化。三句具体使用建议见顶层采用理由，四阶段明细只在Q04，避免用重复表格代替判断。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-13](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/package.json#L1-L13)

当前根产物绑定问题仍是采用前提。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "dsh-plugin-adapter",
  "private": true,
  "description": "Free OpenCode Zen models for DeepSeek Harness (DSH): native dsh-llm adapter plugin, no API key.",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
      "@memef1f1y/dsh-plugin-adapter": "^0.3.4"
    }
}
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/adapter/events.ts:145-161](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/events.ts#L145-L161)

实际终态分类与空完成。

<details>
<summary>查看原文（17行）</summary>

```text
  }
  switch (message.stopReason) {
    case 'stop':
      if (message.content.length === 0) {
        return {
          kind: 'error',
          failure: { message: `model "${message.model}" returned a completed response with no content`, code: EMPTY_RESPONSE },
        }
      }
      return { kind: 'stop' }
    case 'toolUse':
      return { kind: 'tool-calls' }
    case 'aborted':
      return { kind: 'aborted', failure: { message: message.errorMessage ?? 'pi-ai stream aborted', code: 'ABORTED' } }
    case 'error':
      return {
        kind: 'error',
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:637-674](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/adapter/zen-adapter.ts#L637-L674)

协议/会话首内容前自愈不是业务成功。

<details>
<summary>查看原文（38行）</summary>

```text
      clearTimeout(deadlineTimer)
      if (preContentFailure === null && deliveredContent) {
        yield* toStreamChunks(pumpLive(), model.contextWindow, mapToolName)
        return
      }
      if (preContentFailure === null && !deliveredContent) {
        // stream ended cleanly with no content and no error: pass through
        // (pi-ai's empty-response classification owns this case)
        yield* toStreamChunks((async function* pumped() { for (const e of buffered) yield e })(), model.contextWindow, mapToolName)
        return
      }
      // Exit-shaped failure before content: ask the pool whether rotating is
      // worth another attempt; otherwise surface the buffered events as-is.
      const failureMessage = (preContentFailure as { message: string }).message
      // A model that refuses the chat protocol is not an exit problem and not
      // a quota problem: the same model answers on /responses. Switching the
      // path and re-running the turn is the only useful reaction — the user
      // must not see a 400 they cannot act on (measured 2026-10-22 with
      // jev-1.13-free, which the lane refuses on /chat/completions).
      if (
        !responsesPath
        && this.#responsesProvider
        && !responsesSwitched
        && isProtocolUnsupported(failureMessage)
      ) {
        responsesSwitched = true
        this.#responsesOnlyModels.add(options.model)
        buffered.length = 0
        preContentFailure = null
        deliveredContent = false
        sawAnyEvent = false
        rotateStory.push(`#${attempt + 1} protocol: switched to /responses`)
        continue
      }
      const failure = classifyStreamFailure(failureMessage)
      const deterministic = isRegionBlocked(failureMessage)
      // Capacity class ("Endpoint is unavailable"): the gateway's backing
      // instance is down and the lane pins one instance per session, so the
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/pool/installer.ts:133-160](https://github.com/1624318455/dsh-plugin-adapter/blob/a0a716f3b3c5e8b6df90b00a0d5b40330a257503/packages/plugin/src/pool/installer.ts#L133-L160)

退出条件与停止验收依据。

<details>
<summary>查看原文（28行）</summary>

```text
  /** Restore the pre-install dispatcher and close ours. */
  disable(): void {
    if (!this.#enabled) return
    this.#enabled = false
    if (this.#savedGlobalFetch !== null) {
      ;(globalThis as { fetch: unknown }).fetch = this.#savedGlobalFetch
      this.#savedGlobalFetch = null
    }
    if (this.#previous !== null) {
      try {
        this.#deps.undici.setGlobalDispatcher(this.#previous)
      } catch {
        // the saved dispatcher may already be gone (host teardown) — our
        // uninstall still succeeded for our own layer
      }
      this.#previous = null
    }
    const dying = this.#current
    this.#current = null
    if (dying !== null) void dying.destroy().catch(() => {})
    this.#deps.logger?.info('dsh-plugin-adapter: exit routing disabled; previous global dispatcher restored')
  }

  /** Full teardown (plugin dispose): same as disable. */
  dispose(): void {
    this.disable()
  }
}
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
