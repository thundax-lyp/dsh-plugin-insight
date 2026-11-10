# Clutch DSH Title

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4714f11](https://github.com/Cerbur/clutch-dsh/tree/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title)

<!-- BEGIN META -->
[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Cerbur/clutch-dsh) [![npm 30d 1,442](https://img.shields.io/static/v1?label=npm+30d&message=1%2C442&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cerbur/clutch-dsh-title) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cerbur/clutch-dsh-title)
<!-- END META -->

> **功能**：为 DSH 原生 Session 列表提供可配置标题模板、设置管理和生成统计。

> **亮点**：用同一模板合成确定字段与受约束模型字段，保留原生列表和刷新入口。单次结构化提取服务所有引用的模型字段，确定性模板不发模型请求。见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：关闭模板仍走共享模型执行器。结构化请求的包装消息和修复提示进入 Session 事件，诊断中的截断原始回复可能保留输入片段。见 [Q01](#research-q01) 与 [Q03](#research-q03)。

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
  - [Q01 · 安装后谁生成标题，哪些宿主行为仍可使用？](#detail-section-11)
  - [Q02 · 首条消息怎样变成结构化标题，在哪里产生模型成本？](#detail-section-12)
  - [Q03 · 设置、请求、统计和诊断如何流转，怎样识别隐私与可靠性边界？](#detail-section-13)
  - [Q04 · 谁适合在隔离 profile 试用，如何验收和退出？](#detail-section-14)
  - [Q05 · 怎样验证结构化标题是否值得增加调用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：频繁在 DSH 原生列表回找开发会话的用户，可能用统一日期、受控类别和首条提示摘要减少逐个点开检查。见 [Q01](#research-q01)。

DSH 原生首条提示模型标题及手动改名已经覆盖基础命名，失败还可回落首条提示截断。插件把格式、类别和重试策略变为可管理的配置。见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话命名 | 日期、类别及首条提示摘要 | 仅引用模型字段时走结构化调用 |
| 模板设置 | 预览、保存、激活与禁用 | 禁用模板转到纯文本模型路径 |
| 用量和诊断 | 查生成支出与失败 | 异步记录有界，输出片段可能含数据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Session、标题与 LLM 服务 | 主机接线必需 | 注册标题策略 | 查已加载提供者和服务 |
| Web 设置、Remote 与存储 | 完整面板需要 | 设置、统计和诊断 | 检查宿主连接和存储状态 |
| 已记录路由或成对模型配置 | 模型路径需要 | 决定标题模型 | 路由解析失败交宿主处理 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户在隔离 Web profile 安装并重启 | 核对当前提供者和设置入口 |
| 2 | 用户保存并激活模板，以合成提示新建或刷新 | 核对标题、事件和用量 |
| 3 | 用户比较查找结果并回到原 profile | 核对恢复后的提供者和行为 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 已有 DSH 环境，费用未知 | 安装、重启和核对路由 | 用时未测 |
| 持续 | 确定性模板无模型请求，混合模板最多四次派发 | 检查异常标题和用量 | 真实模型与账单未知 |
| 失败恢复 | 重试共享同一 deadline，诊断有界 | 读回事件、改名或换回原 profile | 旧日志删除与迁移待验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 统一命名 | 按创建时间、字段和首条提示渲染 | 能否缩短查找用时 |
| 原生界面衔接 | 设置区接入并保留宿主标题策略入口 | 用户所用宿主版本的实际表现 |
| 调用可查 | 统计来自流用量，另存失败诊断 | 真实账单、账务核对和可见范围 |

> **思考**：关闭模板仍走共享模型执行器。结构化请求的包装消息和修复提示进入 Session 事件，诊断中的截断原始回复可能保留输入片段。见 [Q01](#research-q01) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：用同一模板合成确定字段与受约束模型字段，保留原生列表和刷新入口。单次结构化提取服务所有引用的模型字段，确定性模板不发模型请求。见 [Q01](#research-q01) 与 [Q02](#research-q02)。

设置按宿主 revision 修改，生成链与统计、诊断落盘分离。诊断有界并可因存储故障丢弃，具体落盘与可见性需以宿主为准。见 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

关闭模板仍走共享模型执行器。结构化请求的包装消息和修复提示进入 Session 事件，诊断中的截断原始回复可能保留输入片段。见 [Q01](#research-q01) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议已有 DSH Web 且频繁查找会话的开发者在隔离 profile 用合成提示短试，验收原生、确定性与混合标题的查找和模型开销差异。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持宿主替换、标题生成分路、设置修订和数据记录边界。查找收益、目标宿主兼容和部署后的留痕可见性待验。

- 已检查：作者 README、包清单、源码路径 packages/clutch-dsh-title/README.md、packages/clutch-dsh-title/cordis.patch.yml、packages/clutch-dsh-title/package.json、packages/clutch-dsh-title/src/client/entry.ts、packages/clutch-dsh-title/src/config.ts、packages/clutch-dsh-title/src/diagnostics.ts、packages/clutch-dsh-title/src/extractor.ts、packages/clutch-dsh-title/src/host/remote.ts、packages/clutch-dsh-title/src/index.ts、packages/clutch-dsh-title/src/input.ts、packages/clutch-dsh-title/src/plain-title.ts、packages/clutch-dsh-title/src/presets/default.ts、packages/clutch-dsh-title/src/provider.ts、packages/clutch-dsh-title/src/settings.ts、packages/clutch-dsh-title/src/storage.ts、packages/clutch-dsh-title/src/templates.ts、packages/clutch-dsh-title/src/types.ts、packages/clutch-dsh-title/test/composition.test.mjs 及固定范围 inventory；组件：packages/clutch-dsh-title。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：限固定提交 Title 子包的接线、模板、模型路径、设置、统计、诊断与代表性测试源码。未运行包、DSH、测试或模型。
- 下一步：固定工件、DSH 版本与模型，在隔离 profile 使用合成提示，验证启停、缺路由、修复、日志保留和查找对照。

**分析版本**

- **仓库**：[Cerbur/clutch-dsh](https://github.com/Cerbur/clutch-dsh)
- **版本号**：0.1.7（[固定提交 4714f11](https://github.com/Cerbur/clutch-dsh/tree/4714f11b634e13ea8f128692eae68a29bf3d6a6d)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

日期与受控类别可能改善在密集列表中找回任务的速度。以同任务对比原生标题、确定性模板和混合模板，并同时量取错误、修正与调用成本。见 [Q05](#research-q05)。

固定工件、DSH 版本与模型，在隔离 profile 使用合成提示，验证启停、缺路由、修复、日志保留和查找对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 3146 | — | — | 25331 |
| .mjs | source | 3 | 479 | 461 | 0 | — |
| .ts | source | 21 | 4389 | 4007 | 123 | — |
| .tsx | source | 3 | 824 | 814 | 1 | — |
| .tsx | test | 1 | 42 | 40 | 1 | — |
| .mjs | test | 22 | 5801 | 5448 | 29 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Cerbur/clutch-dsh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/Cerbur/clutch-dsh/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Cerbur/clutch-dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：经常从 DSH 原生 Session 列表找回开发任务的人，怎样用可扫描的命名规则缩短查找时间，并把额外调用与留痕控制在可接受范围？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 安装后谁生成标题，哪些宿主行为仍可使用？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程

#### 完整回答

在原生 Session 列表中查找多条历史开发会话时，日期、受控类别和短摘要可以形成稳定的扫描线索。子包 @cerbur/clutch-dsh-title 0.1.7 导出主机和 Web 客户端，DSH bundle patch 禁用 session-title-llm 行，再插入自己的提供者。主机注入 sessionTitle、llm 和 sessions，以 first-prompt 注册。界面挂在原生 settings.section，列表继续由宿主管理。设置关闭模板后，已注册的 Clutch 提供者转到纯文本路径，使用共享模型执行器，传首条消息且限制输出为 64 tokens。模板生成出错则由提供者抛给宿主，组合测试源码断言宿主回落为首条提示截断标题。源码还编写了手动改名固定和显式刷新用例。作者报告的 rc.1 和 rc.2 矩阵是作者材料，peer 下限和 package 版本不代表任意后续 DSH 构建的安装结果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/clutch-dsh-title/package.json:2-9](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/package.json#L2-L9)

子包身份和版本。

```text
  "name": "@cerbur/clutch-dsh-title",
  "version": "0.1.7",
  "description": "Configurable deterministic session titles for DeepSeek Harness.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Cerbur/clutch-dsh.git",
    "directory": "packages/clutch-dsh-title"
```

**依据 2 · 源码核查**：[packages/clutch-dsh-title/package.json:21-44](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/package.json#L21-L44)

主机、客户端和 Remote 导出。

<details>
<summary>查看原文（24行）</summary>

```text
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "import": "./lib/index.js",
      "default": "./lib/index.js"
    },
    "./types": {
      "types": "./lib/types.d.ts",
      "import": "./lib/types.js",
      "default": "./lib/types.js"
    },
    "./package.json": "./package.json",
    "./client": {
      "types": "./lib/client/entry.d.ts",
      "default": "./lib/client.js"
    },
    "./typert": {
      "types": "./lib/typert.host.d.ts",
      "default": "./lib/typert.host.js"
    },
    "./remote": {
      "types": "./lib/typert.remote-client.d.ts",
      "default": "./lib/typert.remote-client.js"
    }
```

</details>

**依据 3 · 源码核查**：[packages/clutch-dsh-title/package.json:63-75](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/package.json#L63-L75)

Web 注入与 bundle 声明。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-api-remotes"
      ],
      "platform": "web"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
```

</details>

**依据 4 · 源码核查**：[packages/clutch-dsh-title/package.json:86-102](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/package.json#L86-L102)

DSH peer 与 Cordis 范围。

<details>
<summary>查看原文（17行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-client-connection": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-settings": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-storage-domain": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-typert-protocol": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-api-remotes": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-client-locale": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-client-ui-settings": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.2.1-rc.1",
    "@deepseek-ai/cordis": "^4.0.5",
    "@deepseek-ai/dsh-llm": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-session": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-session-title": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-session-title-llm": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-timeout": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-util-values": ">=0.2.1-rc.1"
```

</details>

**依据 5 · 源码核查**：[packages/clutch-dsh-title/cordis.patch.yml:1-12](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/cordis.patch.yml#L1-L12)

禁用原生模型提供者后插入插件。

<details>
<summary>查看原文（12行）</summary>

```text
- id: session-title-llm
  name: '@deepseek-ai/dsh-session-title-first-prompt-llm'
  disabled: true

- insert:
    - id: clutch-dsh-title
      name: '@cerbur/clutch-dsh-title'
      config:
        preset: default
        templates:
          # Keep aligned with EMOJI_TEMPLATE in src/templates.ts.
          emoji: |-
```

</details>

**依据 6 · 源码核查**：[packages/clutch-dsh-title/src/index.ts:13-59](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/index.ts#L13-L59)

注册标题提供者，按设置选择模板或纯文本。

<details>
<summary>查看原文（47行）</summary>

```text
export const name = 'clutch-dsh-title';
export const inject = ['sessionTitle', 'llm', 'sessions'];

export type Config = TitleConfig;
export const Config: z<Config> = TitleConfigSchema;

export function apply(ctx: Context, config: Config): void {
  const statsStore = createTitleStatsStore(ctx);
  const recordGeneration = installTitleTokenStatsRecorder(ctx, statsStore);
  const diagnosticsStore = createTitleDiagnosticsStore(ctx);
  new TitleRemoteService(ctx, statsStore, diagnosticsStore);

  const initial = resolveTitleConfig(config);
  const unmanaged = () => ({ enabled: true, config: resolveTitleConfig(config) });
  let read = unmanaged;
  // Retain the host-only composition path when no settings provider is composed.
  ctx.inject(['settings'], (settingsCtx) => {
    const next = registerTemplateSettings(settingsCtx, config, ctx.fiber);
    read = next;
    settingsCtx.effect(() => () => {
      read = unmanaged;
    });
  });
  const native = createPlainTitleGenerator(ctx, initial);
  ctx.sessionTitle.register({
    id: SessionTitleProviderId('clutch-dsh-title'),
    automatic: 'first-prompt',
    generate(request) {
      return recordGeneration(async () => {
        const state = read();
        if (!state.enabled) {
          return native(request);
        }
        const selected = {
          ...state.config,
          maxInputBytes: initial.maxInputBytes,
          maxOutputTokens: initial.maxOutputTokens,
          reasoningEffort: initial.reasoningEffort,
          timeoutMs: initial.timeoutMs,
          ...(initial.provider === undefined
            ? {}
            : { provider: initial.provider, model: initial.model }),
        };
        return createTitleProvider(ctx, selected, diagnosticsStore).generate(request);
      }, request.signal);
    },
  });
```

</details>

**依据 7 · 源码核查**：[packages/clutch-dsh-title/src/plain-title.ts:11-42](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/plain-title.ts#L11-L42)

共享执行器、首条输入和 64-token 上限。

<details>
<summary>查看原文（32行）</summary>

```text
/** Plain first-prompt policy using the same executor as DSH's native providers. */
export function createPlainTitleGenerator(ctx: Context, config: ResolvedTitleConfig) {
  const execution = resolveSessionTitleLlmConfig({
    maxInputBytes: config.maxInputBytes,
    maxOutputTokens: 64,
    timeoutMs: config.timeoutMs,
    ...(config.provider === undefined ? {} : { provider: config.provider, model: config.model }),
  });
  return async (request: SessionTitleProviderRequest) => {
    const first = request.messages[0];
    if (first === undefined) throw new Error('clutch-dsh-title requires one human message');
    const response = await executeSessionTitleLlm(
      ctx,
      execution,
      request,
      SessionTitleProviderId('clutch-dsh-title'),
      {
        system: [
          'Create a concise title for an AI coding-assistant session from the supplied human messages.',
          'Return only the title on one line, in plain text of natural language, with no quotes, prefix, explanation, Markdown, XML, or terminal control codes. No code is allowed.',
          'Use the language of the messages.',
          'Aim for about 5 words in non-CJK languages or 10 CJK characters.',
          'If the messages give little to name, still return a short best-effort title, such as Greeting, instead of explaining.',
        ].join('\n'),
        input: frameBoundedInput(
          [first],
          config.maxInputBytes,
          'Generate the session title from this JSON array of human messages:\n',
        ),
        messageSeqs: [first.seq],
        selectReasoningEffort: (model) => model.reasoning?.efforts[0]?.id,
      },
```

</details>

**依据 8 · 源码核查**：[packages/clutch-dsh-title/src/client/entry.ts:130-140](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/client/entry.ts#L130-L140)

挂接原生设置区。

<details>
<summary>查看原文（11行）</summary>

```text
  ctx.slots.inject('settings.section', () =>
    ctx.slots.register(
      {
        name: 'settings.section',
        id: TITLE_NAMESPACE,
        order: 35,
        label: () => t('nav'),
        inject: () => ({ controller, t }),
      },
      TemplateSection,
    ),
```

</details>

**依据 9 · 源码核查**：[packages/clutch-dsh-title/test/composition.test.mjs:351-377](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/test/composition.test.mjs#L351-L377)

测试源码覆盖宿主截断回退及手动标题固定。

<details>
<summary>查看原文（27行）</summary>

```text
test('falls back through native SessionTitleService when extraction fails', async () => {
  const { ctx, adapter } = await makeContext();
  adapter.response = '{invalid-json}';
  const { session } = appendSession(ctx, 'invalid-json', 'fallback words remain visible');
  await settle();

  assert.equal(ctx.sessionTitle.get(session)?.source.kind, 'fallback');
  await assert.rejects(ctx.sessionTitle.refresh(session), /JSON|structured extraction/i);
  assert.equal(ctx.sessionTitle.get(session)?.source.kind, 'fallback');
  assert.equal(ctx.sessionTitle.get(session)?.title, 'fallback words remain visible');
});

test('keeps native rename pin semantics and uses refresh as the explicit re-derivation', async () => {
  const { ctx, adapter } = await makeContext();
  const { session } = appendSession(ctx, 'rename-pin', 'first prompt');
  await settle();
  ctx.sessionTitle.rename(session, 'Pinned by hand');

  session.append(
    'user/message',
    createUserMessage({
      content: [{ type: 'text', text: 'later prompt' }],
      source: { kind: 'user' },
    }),
    { surfaceOp: 'append' },
  );
  session.append('request/header', {
```

</details>

**依据 10 · 作者声明**：[packages/clutch-dsh-title/README.md:252-261](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/README.md#L252-L261)

作者兼容性声明。

<details>
<summary>查看原文（10行）</summary>

```text
### Compatibility

This package requires DSH `dsh-v0.2.1-rc.1` or later and has passed the automated
regression matrix on both `dsh-v0.2.1-rc.1` and `dsh-v0.2.1-rc.2`; older releases
need a compatible plugin release. DSH now separates title execution from each provider's prompt and
output policy. Invalid model routes, unsupported reasoning effort, and model-metadata failures
fall back before a title-model request is recorded or dispatched. Custom extraction and repair
record the resolved reasoning effort actually sent to the model. Turning templates off uses a
plain-text first-prompt policy with a 64-token output cap and the model's least supported reasoning
effort. It remains attributed to `clutch-dsh-title`, the registered provider.
```

</details>

#### 缺口

- 未在所用 DSH profile 重跑安装、手动改名和刷新。
  **影响**：不能确认目标版本或与其他标题提供者的实际兼容。
  **进一步探讨**：在隔离 profile 固定工件和宿主，检查注册冲突及成功、失败和刷新三路。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 首条消息怎样变成结构化标题，在哪里产生模型成本？

**研究主题**：功能与机制、贡献与相对优势、效果与总成本

#### 完整回答

提供者只取宿主交付的第一条消息，确定字段从 Session 创建时间和模板字面量解析，只对引用中的 llm-enum 或 llm-text 发起提取。日期和字面量模板可以不发模型请求。内置 default 包含上海时区 MMDD、受控类别和最多 32 字符的模型短描述，因而会用模型。输入按含包装指令的 UTF-8 字节计量，长提示保留按码点处理的首尾及省略标记，系统提示和传输不计入这一上限。路由取显式成对配置的 provider/model，否则使用已记录的请求路由，缺路由会报错。模型输出经 JSON 和字段规则验证后合成原生标题。每次初提取与修复共享一个 60 秒默认 deadline，512 输出 tokens 默认上限逐次应用。默认可追加一次，允许 0–3 次追加，最多四次派发。格式失败会保留原用户包装，在修复系统提示中加入有界的前次输出和拒绝原因。传输异常与取消结束该轮。输入字节、输出 tokens 和调用次数各有不同计量单位，实际费用仍取决于模型路由、实际使用量和服务计费。

#### 证据与依据

**依据 1 · 源码核查**：[packages/clutch-dsh-title/src/presets/default.ts:3-35](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/presets/default.ts#L3-L35)

默认日期、枚举和短描述。

<details>
<summary>查看原文（33行）</summary>

```text
export const DEFAULT_PRESET = {
  preset: 'default',
  template: '${daytime}|${type}|${desc}',
  fields: {
    daytime: {
      kind: 'datetime',
      source: 'session.createdAt',
      format: 'MMDD',
      timezone: 'Asia/Shanghai',
    },
    type: {
      kind: 'llm-enum',
      instruction: '判断这个 session 的任务类型',
      values: [
        { value: '设计', description: '明确需求、制定实现方案，或设计架构、接口和交互时使用' },
        {
          value: '探索',
          description: '理解代码、调研技术、分析问题或验证可行性，主要目标是获得结论时使用',
        },
        { value: '功能', description: '新增此前不存在的能力，或扩展现有功能的使用场景时使用' },
        { value: '修复', description: '纠正缺陷、排查并解决故障，或恢复预期行为时使用' },
        {
          value: '优化',
          description: '在保持现有功能含义的基础上，改善性能、体验、结构或可维护性时使用',
        },
        { value: '发布', description: '准备版本、编写发布说明、打包、部署或执行上线流程时使用' },
      ],
    },
    desc: {
      kind: 'llm-text',
      instruction: '总结首次 prompt，保留具体任务含义',
      maxCharacters: 32,
    },
```

</details>

**依据 2 · 源码核查**：[packages/clutch-dsh-title/src/provider.ts:65-90](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/provider.ts#L65-L90)

仅首条提示、仅引用字段和确定性路径。

<details>
<summary>查看原文（26行）</summary>

```text
  const titleProvider = SessionTitleProviderId('clutch-dsh-title');
  const fields = selectReferencedFields(config);
  return {
    id: titleProvider,
    automatic: 'first-prompt',
    async generate(request: SessionTitleProviderRequest) {
      const first = request.messages[0];
      if (first === undefined) {
        throw new Error('clutch-dsh-title requires one human message');
      }
      const deterministic = resolveDeterministicFields(fields, request.session.header.createdAt);
      const extracted = hasLlmFields(fields)
        ? await extractLlmFields(ctx, config, request, [first], titleProvider, diagnostics)
        : undefined;
      const values = mergeFieldValues(deterministic, extracted?.values);
      assertTemplateValues(config, values);
      const rendered = renderTemplate(config.compiledTemplate, values);
      const title = normalizeSessionTitle(rendered, Number.MAX_SAFE_INTEGER);
      if (title.length === 0) {
        throw new Error('clutch-dsh-title renderer produced an empty title');
      }
      return deepFreeze({
        title,
        messageSeqs: [first.seq],
        ...(extracted === undefined ? {} : { model: extracted.model }),
      });
```

</details>

**依据 3 · 源码核查**：[packages/clutch-dsh-title/src/input.ts:35-71](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/input.ts#L35-L71)

完整包装的字节边界及首尾保留。

<details>
<summary>查看原文（37行）</summary>

```text
/** maxInputBytes covers the complete framed user input, excluding system/transport. */
export function frameBoundedInput(
  messages: readonly SessionTitleUserMessage[],
  maxInputBytes: number,
  instruction = FRAME,
): string {
  const frame = (items: readonly SessionTitleUserMessage[]) => instruction + JSON.stringify(items);
  const original = frame(messages);
  if (Buffer.byteLength(original, 'utf8') <= maxInputBytes) return original;

  const fail = () =>
    new Error(
      `clutch-dsh-title: maxInputBytes ${maxInputBytes} cannot fit a marked input with both source ends`,
    );
  // The provider selects exactly the first eligible prompt, never later messages.
  const first = messages[0];
  if (messages.length !== 1 || first === undefined) throw fail();
  const text = first.text.trim();
  const entry = { seq: first.seq, text: OMISSION, truncated: true };
  const available = maxInputBytes - Buffer.byteLength(frame([entry]), 'utf8');
  const firstPoint = String.fromCodePoint(text.codePointAt(0) ?? 0);
  const firstCost = escapedBytes(firstPoint);
  const lastPoint = takeEdge(text, 6, true).text;
  // A JSON-escaped code point takes at most six bytes. Keep only its last point.
  const lastCost = escapedBytes(Array.from(lastPoint).at(-1) ?? '');
  if (text.length === 0 || available < firstCost + lastCost) throw fail();

  const headBudget = Math.max(firstCost, Math.min(Math.floor(available / 2), available - lastCost));
  let head = takeEdge(text, headBudget);
  const tail = takeEdge(text.slice(head.text.length), available - head.bytes, true);
  // Reuse any spare bytes without overlapping the retained source spans.
  head = takeEdge(text.slice(0, text.length - tail.text.length), available - tail.bytes);
  if (!head.text.trim() || !tail.text.trim()) throw fail();
  entry.text = head.text + OMISSION + tail.text;
  const clipped = frame([entry]);
  if (Buffer.byteLength(clipped, 'utf8') > maxInputBytes) throw fail();
  return clipped;
```

</details>

**依据 4 · 源码核查**：[packages/clutch-dsh-title/src/config.ts:55-67](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/config.ts#L55-L67)

结构提取默认预算。

<details>
<summary>查看原文（13行）</summary>

```text
/** Upper bound for repairAttempts so one failure cannot fan out into many calls. */
export const MAX_REPAIR_ATTEMPTS = 3;

export const TitleConfigSchema = z.object({
  preset: z.string().default('default'),
  template: z.string(),
  fields: z.dict(FieldConfig),
  maxInputBytes: z.number().step(1).min(1).default(4096),
  maxOutputTokens: z.number().step(1).min(1).default(512),
  reasoningEffort: z.union([z.string(), z.const(null)]),
  timeoutMs: z.number().step(1).min(1).max(MAX_TIMER_DELAY_MS).default(60000),
  repairAttempts: z.number().step(1).min(0).max(MAX_REPAIR_ATTEMPTS).default(1).volatile(),
  provider: z.string(),
```

</details>

**依据 5 · 源码核查**：[packages/clutch-dsh-title/src/extractor.ts:150-167](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/extractor.ts#L150-L167)

路由选择与缺失检查。

<details>
<summary>查看原文（18行）</summary>

```text
function resolveRoute(
  config: ResolvedTitleConfig,
  request: SessionTitleProviderRequest,
): ExtractedLlmFields['model'] {
  const hasProvider = config.provider !== undefined;
  const hasModel = config.model !== undefined;
  if (hasProvider !== hasModel) {
    throw new Error('clutch-dsh-title: provider and model must be supplied together');
  }
  if (hasProvider && hasModel) {
    return deepFreeze({ provider: config.provider, model: config.model });
  }
  if (request.route === undefined) {
    throw new Error(
      'clutch-dsh-title: no logged request route is available; configure provider and model together',
    );
  }
  return deepFreeze({ provider: request.route.provider, model: request.route.model });
```

</details>

**依据 6 · 源码核查**：[packages/clutch-dsh-title/src/extractor.ts:265-274](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/extractor.ts#L265-L274)

修复上下文放入系统提示。

<details>
<summary>查看原文（10行）</summary>

```text
/** Keep repair context out of the single user message required by Session V4. */
function repairSystem(
  baseSystem: string,
  previousOutput: string,
  rejectionMessage: string,
  fields: Readonly<Record<string, TitleFieldConfig>>,
): string {
  const quoted = previousOutput.slice(0, MAX_REPAIR_OUTPUT_CHARS);
  return baseSystem + '\n\n' + repairPrompt(fields, quoted, rejectionMessage);
}
```

</details>

**依据 7 · 源码核查**：[packages/clutch-dsh-title/src/extractor.ts:319-370](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/extractor.ts#L319-L370)

共享 deadline 和逐次预算、事件及派发。

<details>
<summary>查看原文（52行）</summary>

```text
  const framedInput = frameBoundedInput(sourceMessages, config.maxInputBytes);

  const route = resolveRoute(config, request);
  const baseSystem = systemPrompt(fields);
  const messageSeqs = sourceMessages.map((message) => message.seq);
  const baseMessages: Message[] = [
    createUserMessage({ content: [textBlock(framedInput)], source: TITLE_MESSAGE_SOURCE }),
  ];
  using callDeadline = deadline(request.signal, config.timeoutMs, SESSION_TITLE_TIMEOUT_CODE);

  const attempts: TitleExtractionAttemptRecord[] = [];
  const dispatches = 1 + config.repairAttempts;
  let system = baseSystem;
  const messages: Message[] = baseMessages;
  let result: ExtractedLlmFields | undefined;
  let failure: Error | undefined;
  let dispatched = 0;

  try {
    for (let attempt = 1; attempt <= dispatches; attempt += 1) {
      callDeadline.signal.throwIfAborted();
      const call = await ctx.llm.prepareCall(
        { ...route, maxTokens: config.maxOutputTokens },
        callDeadline.signal,
        (controls, model) => {
          const effort = selectReasoningEffort(config, model);
          return { ...controls, ...(effort === undefined ? {} : { reasoningEffort: effort }) };
        },
      );
      const options: GenerateOptions = deepFreeze({
        ...call.config,
        system,
        messages,
        sessionId: request.session.id,
        purpose: 'session-title',
        signal: callDeadline.signal,
      });
      const event: SessionTitleLlmRequestEventData = deepFreeze({
        titleProvider,
        messageSeqs,
        route,
        system,
        messages,
        maxTokens: options.maxTokens!,
        ...(options.reasoningEffort === undefined
          ? {}
          : { reasoningEffort: options.reasoningEffort }),
      });
      request.session.append('session/title-llm-request', event);
      callDeadline.signal.throwIfAborted();

      dispatched = attempt;
```

</details>

**依据 8 · 源码核查**：[packages/clutch-dsh-title/src/extractor.ts:370-417](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/extractor.ts#L370-L417)

输出验证、修复与失败收束。

<details>
<summary>查看原文（48行）</summary>

```text
      dispatched = attempt;
      const response = await streamResponse(call, options, callDeadline.signal);

      try {
        if (response.outputError !== undefined) throw response.outputError;
        const candidate = JSON.parse(response.text) as unknown;
        const values = validateExtractedFields(fields, candidate);
        result = deepFreeze({
          values,
          model: route,
          ...(response.usage !== undefined ? { usage: deepFreeze(response.usage) } : {}),
        });
        break;
      } catch (error) {
        const outputError =
          error instanceof SyntaxError
            ? new TitleOutputError('clutch-dsh-title: structured extraction was not valid JSON', {
                cause: error,
              })
            : asOutputError(error);
        attempts.push({
          attempt,
          error: outputError.message,
          output: truncateDiagnosticOutput(response.text),
        });
        failure = outputError;
        if (attempt >= dispatches) break;
        system = repairSystem(baseSystem, response.text, outputError.message, fields);
      }
    }
  } catch (error) {
    failure = error instanceof Error ? error : new Error(String(error));
  }

  if (failure !== undefined && !request.signal.aborted) {
    reportIncident(ctx, diagnostics, {
      timestamp: Date.now(),
      provider: route.provider,
      model: route.model,
      messageSeqs,
      attempts,
      repairAttempts: Math.max(dispatched - 1, 0),
      recovered: result !== undefined,
      error: result !== undefined ? '' : failure.message.slice(0, MAX_DIAGNOSTIC_ERROR_CHARS),
    });
  }
  if (result !== undefined) return result;
  throw failure ?? new Error('clutch-dsh-title: structured extraction did not produce a title');
```

</details>

#### 缺口

- 没有固定路由下的模型误分类、回复截断或每次生成成本数据。
  **影响**：结构合格仅表示满足模板约束，类别和短摘要仍可能误导检索。
  **进一步探讨**：对短提示、超长提示和刻意含误导文本的提示，记录首轮有效率、补救率、耗时和用量。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 设置、请求、统计和诊断如何流转，怎样识别隐私与可靠性边界？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

旧式 settings 服务走命名空间 register，支持 configure 的新版路径关闭自动表单并使用当前描述器的 base/user 数据。客户端读 revision 并传给宿主 mutate，invalid 或缺失 active 回到 default。统计与诊断通过 titleStats Remote 各自读写和重置。结构提取每次派发前把 route、system、包装消息和消息序号加入 Session 请求事件，因此首条提示正文或其首尾片段会进入事件，修复系统提示还可能带上被拒响应。日志及诊断另存模型路由、消息序号、错误和被拒响应片段。截断控制长度，片段仍可能复述输入。诊断最新保留十条，原始响应按 2000 个 JS 字符位置截取并可附标记，存储异常时内存缓冲至 64 条再丢最旧。用量来自宿主流事件，带正 token 的调用会计入，生成成功且最后调用没有正用量也可记一次成功；没有实际调用的确定性模板不计。统计与诊断异步尽力持久化。面板数字适合解释开销趋势，账单、事件保留周期和 Remote 的实际访问权限需要各自查证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/clutch-dsh-title/src/settings.ts:77-97](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/settings.ts#L77-L97)

选择旧注册和新配置分支，读取实际设置层。

<details>
<summary>查看原文（21行）</summary>

```text
export function registerTemplateSettings(
  ctx: Context,
  config: TitleConfig,
  owner: Context['fiber'] = ctx.fiber,
): () => ReturnType<typeof decodeTemplates> {
  const base = managedSettingsBase(config);
  const settings = (ctx as unknown as { settings?: CompatibleSettingsService }).settings;
  if (typeof settings?.register === 'function') {
    // DSH through 0.1.6 exposes a namespaced settings provider.
    settings.register(TITLE_NAMESPACE, TemplateSettingsSchema, { base, applies: 'live' });
  } else if (typeof settings?.configure === 'function') {
    // DSH 0.1.7 stores volatile settings on the profile's plugin Config entry.
    const dispose = settings.configure({ auto: false }, owner);
    ctx.effect(() => dispose);
  }
  return () => {
    const descriptor = settings?.describe?.().find((item) => item.ns === TITLE_NAMESPACE);
    // Read current base/user layers so external profile edits are immediately repairable.
    const layeredBase = settingsBaseDocument(base, descriptor?.base);
    return decodeTemplates(settingsDocument(layeredBase, descriptor?.user));
  };
```

</details>

**依据 2 · 源码核查**：[packages/clutch-dsh-title/src/templates.ts:123-140](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/templates.ts#L123-L140)

无效选中项回到 default。

<details>
<summary>查看原文（18行）</summary>

```text
    } catch (error) {
      row.error = message(error);
    }
    rows.push(row);
  }
  const active = typeof data.active === 'string' ? data.active : 'default';
  const effective = configs.has(active) ? active : 'default';
  if (active !== effective)
    errors.push(
      `Selected template ${JSON.stringify(active)} is invalid or missing; using default.`,
    );
  return {
    enabled: data.enabled !== false,
    active,
    effective,
    rows,
    errors,
    config: { ...configs.get(effective)!, repairAttempts },
```

</details>

**依据 3 · 源码核查**：[packages/clutch-dsh-title/src/client/entry.ts:70-113](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/client/entry.ts#L70-L113)

设置按 revision 修改，统计和诊断分别调用。

<details>
<summary>查看原文（44行）</summary>

```text
  const operations: TemplateOperations = {
    resetStatsAvailable: false,
    async read() {
      const result = await ctx.remote.settings.describe();
      if (!result.ok) throw new Error(result.error.message);
      const view = result.value.namespaces.find((item) => item.ns === TITLE_NAMESPACE);
      if (!view) throw new Error('Session title settings are unavailable on this host.');
      return {
        writable: result.value.writable,
        revision: view.revision,
        raw: settingsDocument(view.base, view.user),
      };
    },
    async write(ops, revision) {
      const result = await ctx.remote.settings.mutate(TITLE_NAMESPACE, ops, revision);
      if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
    },
    async getStats(): Promise<TitleTokenStats> {
      const result = await withStatsDeadline('read', (signal) =>
        ctx.remote.titleStats.getStats(signal),
      );
      if (!result.ok) throw new Error(result.error?.message ?? 'Failed to get title stats');
      return parseStats(result.value);
    },
    async getDiagnostics() {
      const result = await withStatsDeadline('diagnostics read', (signal) =>
        ctx.remote.titleStats.getDiagnostics(signal),
      );
      if (!result.ok) throw new Error(result.error?.message ?? 'Failed to get title diagnostics');
      return parseDiagnostics(result.value);
    },
    async resetStats() {
      const result = await withStatsDeadline('reset', (signal) =>
        ctx.remote.titleStats.resetStats(signal),
      );
      if (!result.ok) throw new Error(result.error?.message ?? 'Failed to reset title stats');
      return parseStats(result.value);
    },
    async resetDiagnostics() {
      const result = await withStatsDeadline('diagnostics reset', (signal) =>
        ctx.remote.titleStats.resetDiagnostics(signal),
      );
      if (!result.ok) throw new Error(result.error?.message ?? 'Failed to reset title diagnostics');
      return parseDiagnostics(result.value);
```

</details>

**依据 4 · 源码核查**：[packages/clutch-dsh-title/src/extractor.ts:286-302](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/extractor.ts#L286-L302)

有界 incident 异步持久化并写 warning。

<details>
<summary>查看原文（17行）</summary>

```text
/** Log and persist one incident without delaying or failing the title path. */
function reportIncident(
  ctx: Context,
  diagnostics: TitleDiagnosticsRecorder | undefined,
  incident: TitleExtractionIncident,
): void {
  warn(
    ctx,
    `clutch-dsh-title: title extraction ${incident.recovered ? 'repaired' : 'gave up'} ${JSON.stringify(incident)}`,
  );
  if (diagnostics === undefined) return;
  void Promise.resolve()
    .then(() => diagnostics.record(incident))
    .catch(() => {
      // Diagnostics are ancillary and must never fail the model call.
    });
}
```

</details>

**依据 5 · 源码核查**：[packages/clutch-dsh-title/src/extractor.ts:348-367](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/extractor.ts#L348-L367)

Session 请求事件的字段及写入时序。

<details>
<summary>查看原文（20行）</summary>

```text
      const options: GenerateOptions = deepFreeze({
        ...call.config,
        system,
        messages,
        sessionId: request.session.id,
        purpose: 'session-title',
        signal: callDeadline.signal,
      });
      const event: SessionTitleLlmRequestEventData = deepFreeze({
        titleProvider,
        messageSeqs,
        route,
        system,
        messages,
        maxTokens: options.maxTokens!,
        ...(options.reasoningEffort === undefined
          ? {}
          : { reasoningEffort: options.reasoningEffort }),
      });
      request.session.append('session/title-llm-request', event);
```

</details>

**依据 6 · 源码核查**：[packages/clutch-dsh-title/src/extractor.ts:383-414](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/extractor.ts#L383-L414)

诊断保留被拒响应和路由。

<details>
<summary>查看原文（32行）</summary>

```text
      } catch (error) {
        const outputError =
          error instanceof SyntaxError
            ? new TitleOutputError('clutch-dsh-title: structured extraction was not valid JSON', {
                cause: error,
              })
            : asOutputError(error);
        attempts.push({
          attempt,
          error: outputError.message,
          output: truncateDiagnosticOutput(response.text),
        });
        failure = outputError;
        if (attempt >= dispatches) break;
        system = repairSystem(baseSystem, response.text, outputError.message, fields);
      }
    }
  } catch (error) {
    failure = error instanceof Error ? error : new Error(String(error));
  }

  if (failure !== undefined && !request.signal.aborted) {
    reportIncident(ctx, diagnostics, {
      timestamp: Date.now(),
      provider: route.provider,
      model: route.model,
      messageSeqs,
      attempts,
      repairAttempts: Math.max(dispatched - 1, 0),
      recovered: result !== undefined,
      error: result !== undefined ? '' : failure.message.slice(0, MAX_DIAGNOSTIC_ERROR_CHARS),
    });
```

</details>

**依据 7 · 源码核查**：[packages/clutch-dsh-title/src/types.ts:123-129](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/types.ts#L123-L129)

持久化的数量及字符限制常量。

```text
export const MAX_DIAGNOSTIC_OUTPUT_CHARS = 2_000;
/** Attempts kept per incident when an incident is recorded. */
export const MAX_DIAGNOSTIC_ATTEMPTS = 4;
export const MAX_RECENT_INCIDENTS = 10;
export const MAX_DIAGNOSTIC_ERROR_CHARS = 2_000;
export const MAX_DIAGNOSTIC_ROUTE_CHARS = 256;
export const MAX_DIAGNOSTIC_MESSAGE_SEQS = 64;
```

**依据 8 · 源码核查**：[packages/clutch-dsh-title/src/types.ts:184-192](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/types.ts#L184-L192)

原始输出截断和标记。

```text
/**
 * Bound one raw model response before it is persisted or replayed.
 * @param text - raw response text.
 * @returns the text, truncated with an explicit marker when it exceeds the budget.
 */
export function truncateDiagnosticOutput(text: string): string {
  if (text.length <= MAX_DIAGNOSTIC_OUTPUT_CHARS) return text;
  return `${text.slice(0, MAX_DIAGNOSTIC_OUTPUT_CHARS)}…[truncated]`;
}
```

**依据 9 · 源码核查**：[packages/clutch-dsh-title/src/diagnostics.ts:250-269](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/diagnostics.ts#L250-L269)

异步缓冲及重置边界。

<details>
<summary>查看原文（20行）</summary>

```text
  async record(incident: TitleExtractionIncident): Promise<void> {
    this.assertActive();
    // Enforce bounds at the storage boundary, including callers other than the extractor.
    const normalized = parseDiagnostics({ recentIncidents: [incident] }).recentIncidents[0];
    if (normalized === undefined) throw new Error('clutch-dsh-title: invalid diagnostic incident');
    // Bound records before any asynchronous storage work. Reuse one flush task;
    // never capture an incident in one queued closure per generation.
    this.pushPending(normalized);
    return this.scheduleFlush();
  }

  async reset(): Promise<TitleDiagnostics> {
    this.assertActive();
    // Establish the reset boundary now so later records survive a queued reset.
    this.pending = [];
    this.resetPending = true;
    this.resetRevision += 1;
    const run = async (): Promise<TitleDiagnostics> => {
      await this.flushPending();
      return { ...DEFAULT_TITLE_DIAGNOSTICS };
```

</details>

**依据 10 · 源码核查**：[packages/clutch-dsh-title/src/diagnostics.ts:289-297](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/diagnostics.ts#L289-L297)

超出上限后丢最旧。

```text
    })();
    return this.closePromise;
  }

  private pushPending(incident: TitleExtractionIncident): void {
    this.pending.push(incident);
    if (this.pending.length > MAX_PENDING_INCIDENTS) {
      this.pending.splice(0, this.pending.length - MAX_PENDING_INCIDENTS);
    }
```

**依据 11 · 源码核查**：[packages/clutch-dsh-title/src/storage.ts:150-205](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/storage.ts#L150-L205)

流用量与生成成功的计数规则。

<details>
<summary>查看原文（56行）</summary>

```text
  ctx.effect(() => () => generations.disable(), 'clutch-dsh-title: usage scopes cleanup');
  ctx.on(
    'llm/stream',
    (options, next) => {
      if (options.purpose !== 'session-title') return next();
      const call = { counted: false };
      const generation = generations.getStore();
      if (generation !== undefined) generation.lastCall = call;
      return recordTitleStream(next(), store, call);
    },
    { global: true },
  );

  return <T>(generate: () => Promise<T>, signal: AbortSignal): Promise<T> => {
    const generation: TitleGenerationUsage = {};
    return generations.run(generation, async () => {
      const result = await generate();
      if (!signal.aborted && generation.lastCall !== undefined && !generation.lastCall.counted) {
        recordWithoutBlocking(() => store.recordSuccess());
      }
      return result;
    });
  };
}

function recordWithoutBlocking(write: () => Promise<void>): void {
  void Promise.resolve()
    .then(write)
    .catch(() => {
      // Statistics must never delay or fail the title, even during a storage outage.
    });
}

async function* recordTitleStream(
  source: AsyncIterable<StreamChunk>,
  store: StatsRecorder,
  call: TitleCallUsage,
): AsyncGenerator<StreamChunk> {
  let usage: TitleTokenUsage | undefined;
  try {
    for await (const chunk of source) {
      if (chunk.type === 'usage') {
        const normalized = normalizeTokenUsage(chunk.usage);
        if (normalized !== undefined && (normalized.totalTokens > 0 || usage === undefined)) {
          usage = normalized;
        }
      }
      yield chunk;
    }
  } finally {
    if (usage !== undefined) {
      const recordedUsage = usage;
      call.counted = recordedUsage.totalTokens > 0;
      recordWithoutBlocking(() => store.record(recordedUsage));
    }
  }
```

</details>

**依据 12 · 源码核查**：[packages/clutch-dsh-title/src/host/remote.ts:16-46](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/host/remote.ts#L16-L46)

统计和诊断 Remote 方法。

<details>
<summary>查看原文（31行）</summary>

```text
    super(ctx, 'titleRemote', { namespace: 'titleStats' });
  }

  @Remote
  getStats(signal: AbortSignal): Promise<TitleTokenStats> {
    signal.throwIfAborted();
    return this.statsStore.get();
  }

  @Remote
  resetStats(signal: AbortSignal): Promise<TitleTokenStats> {
    signal.throwIfAborted();
    return this.statsStore.reset();
  }

  @Remote
  getDiagnostics(signal: AbortSignal): Promise<TitleDiagnostics> {
    signal.throwIfAborted();
    if (this.diagnosticsStore === undefined) {
      throw new Error('clutch-dsh-title: diagnostics storage is not composed');
    }
    return this.diagnosticsStore.get();
  }

  @Remote
  resetDiagnostics(signal: AbortSignal): Promise<TitleDiagnostics> {
    signal.throwIfAborted();
    if (this.diagnosticsStore === undefined) {
      throw new Error('clutch-dsh-title: diagnostics storage is not composed');
    }
    return this.diagnosticsStore.reset();
```

</details>

#### 缺口

- 未检查部署后谁能读 Session 文件、宿主日志和 Remote，也未测重启时的保留。
  **影响**：仅从包的截断和远程方法不能确定组织数据边界，也不能用面板复原账单。
  **进一步探讨**：先用合成提示在目标宿主检查落盘、日志、删除和访问控制，再决定哪些会话可走模型。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁适合在隔离 profile 试用，如何验收和退出？

**研究主题**：采用判断、依赖、兼容与流程、效果与总成本

#### 完整回答

适合已有 DSH Web、频繁在原生列表翻找编码会话、允许所选模型处理试验提示的开发者。按作者说明加入隔离 Web profile 后重启宿主，以相同提示比较原生标题与自定义模板，先用 date/literal 模板确认零模型路径和激活，再用可外发的合成提示比较类别与短摘要。可从复制模板开始，保存与激活是不同动作。检验日期、类别、主题和列表可扫读性，并检查主动刷新与手动命名。删除当前自定义模板会切回内置 default。关闭模板会继续用共享模型执行器。退出时恢复未加载 Clutch 的 profile，核对原生提供者回到活动状态。若需要停止该附加生成或避免诊断留痕，应核查完整 profile 和已写事件，不能只操作模板开关。首次需装包、重启和确认路由，持续成本主要是模型、人工纠正分类和状态检查。

#### 证据与依据

**依据 1 · 作者声明**：[packages/clutch-dsh-title/README.md:15-29](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/README.md#L15-L29)

作者安装流程与重启要求。

<details>
<summary>查看原文（15行）</summary>

````text
### Install from npm

With an installed DSH CLI, add the package to the Web profile and start DSH Web:

```bash
dsh plugin --profile web add @cerbur/clutch-dsh-title
dsh web
```

When using a DeepSeek Harness source checkout without a standalone dsh command, use the equivalent
pnpm dsh form.

If DSH is already running, restart DSH Desktop, or restart the DSH Web server and refresh the
browser page, after installation. Refreshing the page alone does not apply the host changes.
When the plugin's client loads before its host service is available, a native toast reminds you
````

</details>

**依据 2 · 作者声明**：[packages/clutch-dsh-title/README.md:64-85](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/README.md#L64-L85)

作者的激活、保存和示例流程。

<details>
<summary>查看原文（22行）</summary>

```text
### Choose a title template

1. Start DSH Web with dsh web.
2. Open Settings → Session Title.
3. Keep Use title templates enabled, choose a row, and select Activate.
4. Create a new Session, or use DSH's native title refresh action for an existing Session.

The read-only default template is selected in a fresh settings file. A newly selected format does
not rewrite existing titles until DSH explicitly generates or refreshes one.

### Manage templates

Fresh settings include an editable emoji template with a description limit of 64 Unicode characters
while the built-in default template remains selected. The emoji template can be edited or deleted;
deleting it does not recreate it on a later settings registration.

- Duplicate any row, including default, to open an editable copy.
- Give a copy a unique name, edit its YAML, and select Save. Saving does not activate it.
- Select Activate when a saved template should become effective.
- View or select default, but do not edit or delete it.
- Deleting the active custom template selects default.
- Each row shows an illustrative example while editing. Examples do not call a model.
```

</details>

**依据 3 · 源码核查**：[packages/clutch-dsh-title/src/templates.ts:145-175](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/templates.ts#L145-L175)

激活、删除和保存分别写入。

<details>
<summary>查看原文（31行）</summary>

```text
/** Build minimal native settings operations, leaving unrelated broken entries intact. */
export function templateMutation(state: TemplateState, action: TemplateAction): TemplateOp[] {
  if (action.kind === 'enabled') return [{ op: 'set', path: ['enabled'], value: action.enabled }];
  if (action.kind === 'repairAttempts') {
    if (!Number.isInteger(action.value) || action.value < 0 || action.value > MAX_REPAIR_ATTEMPTS)
      throw new Error('repairAttempts must be an integer from 0 through 3.');
    return [{ op: 'set', path: ['repairAttempts'], value: action.value }];
  }
  const row = state.rows.find((item) => item.id === action.id);
  if (action.kind === 'activate') {
    if (!row || row.error) throw new Error('Cannot activate an invalid or missing template.');
    return [{ op: 'set', path: ['active'], value: action.id }];
  }
  if (action.id === 'default') throw new Error('default is read-only.');
  const sources = { ...state.sources };
  if (action.kind === 'delete') {
    if (!row) throw new Error('Template no longer exists.');
    delete sources[action.id];
    return [
      { op: 'set', path: ['templates'], value: sources },
      ...(state.active === action.id
        ? [{ op: 'set' as const, path: ['active'], value: 'default' }]
        : []),
    ];
  }
  validateId(action.id);
  if (action.kind === 'create' && row) throw new Error('Template name already exists.');
  if (action.kind === 'save' && !row) throw new Error('Template no longer exists.');
  validateTemplate(action.source);
  sources[action.id] = action.source;
  return [{ op: 'set', path: ['templates'], value: sources }];
```

</details>

**依据 4 · 源码核查**：[packages/clutch-dsh-title/src/index.ts:36-57](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/index.ts#L36-L57)

关闭模板仍调用纯文本生成路径。

<details>
<summary>查看原文（22行）</summary>

```text
  const native = createPlainTitleGenerator(ctx, initial);
  ctx.sessionTitle.register({
    id: SessionTitleProviderId('clutch-dsh-title'),
    automatic: 'first-prompt',
    generate(request) {
      return recordGeneration(async () => {
        const state = read();
        if (!state.enabled) {
          return native(request);
        }
        const selected = {
          ...state.config,
          maxInputBytes: initial.maxInputBytes,
          maxOutputTokens: initial.maxOutputTokens,
          reasoningEffort: initial.reasoningEffort,
          timeoutMs: initial.timeoutMs,
          ...(initial.provider === undefined
            ? {}
            : { provider: initial.provider, model: initial.model }),
        };
        return createTitleProvider(ctx, selected, diagnosticsStore).generate(request);
      }, request.signal);
```

</details>

**依据 5 · 源码核查**：[packages/clutch-dsh-title/cordis.patch.yml:1-7](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/cordis.patch.yml#L1-L7)

退出核查需涉及宿主被禁用的提供者行。

```text
- id: session-title-llm
  name: '@deepseek-ai/dsh-session-title-first-prompt-llm'
  disabled: true

- insert:
    - id: clutch-dsh-title
      name: '@cerbur/clutch-dsh-title'
```

**依据 6 · 源码核查**：[packages/clutch-dsh-title/test/composition.test.mjs:236-267](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/test/composition.test.mjs#L236-L267)

测试源码覆盖确定性模板的零调用。

<details>
<summary>查看原文（32行）</summary>

```text
test('deterministic templates ignore inherited LLM fields without calls or request events', async () => {
  for (const [template, expected] of [
    ['${daytime}|${label}', '0904|固定'],
    ['Literal title', 'Literal title'],
  ]) {
    const { ctx, adapter } = await makeContext({
      config: {
        template,
        fields: { label: { kind: 'literal', value: '固定' } },
      },
    });
    const { session } = appendSession(ctx, `deterministic-${template}`, 'first prompt');
    await settle();
    assert.equal(ctx.sessionTitle.get(session).title, expected);
    assert.equal(ctx.sessionTitle.get(session).source.kind, 'provider');
    assert.equal(adapter.requests.length, 0);
    assert.equal(
      session.snapshotEvents().filter((e) => e.type === 'session/title-llm-request').length,
      0,
    );
    const withoutRoute = appendSession(ctx, `no-route-${template}`, 'first prompt', {
      route: false,
    });
    await ctx.sessionTitle.refresh(withoutRoute.session);
    assert.equal(ctx.sessionTitle.get(withoutRoute.session).title, expected);
    assert.equal(adapter.requests.length, 0);
    assert.equal(
      withoutRoute.session.snapshotEvents().filter((e) => e.type === 'session/title-llm-request')
        .length,
      0,
    );
  }
```

</details>

**依据 7 · 源码核查**：[packages/clutch-dsh-title/test/composition.test.mjs:363-390](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/test/composition.test.mjs#L363-L390)

测试源码覆盖固定手动标题和显式刷新。

<details>
<summary>查看原文（28行）</summary>

```text
test('keeps native rename pin semantics and uses refresh as the explicit re-derivation', async () => {
  const { ctx, adapter } = await makeContext();
  const { session } = appendSession(ctx, 'rename-pin', 'first prompt');
  await settle();
  ctx.sessionTitle.rename(session, 'Pinned by hand');

  session.append(
    'user/message',
    createUserMessage({
      content: [{ type: 'text', text: 'later prompt' }],
      source: { kind: 'user' },
    }),
    { surfaceOp: 'append' },
  );
  session.append('request/header', {
    header: { config: { provider: 'title-route', model: 'title-model' } },
    reason: 'change',
  });
  await settle();
  assert.equal(adapter.requests.length, 1);
  assert.equal(ctx.sessionTitle.get(session)?.title, 'Pinned by hand');

  await ctx.sessionTitle.refresh(session);
  assert.equal(adapter.requests.length, 2);
  assert.notEqual(ctx.sessionTitle.get(session)?.title, 'Pinned by hand');
  assert.equal(ctx.sessionTitle.get(session)?.source.kind, 'provider');
});

```

</details>

#### 缺口

- 未验收目标宿主的卸载恢复、设置迁移和旧日志清理。
  **影响**：推荐只覆盖隔离且使用合成材料的短试。
  **进一步探讨**：分别记录启用前、启用、关闭模板及回到原 profile 后的提供者、标题、调用和事件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证结构化标题是否值得增加调用？

**研究主题**：新假设与验证、效果与总成本

#### 完整回答

假设固定日期加受控类别，比原生自由文本更能帮同一人从密集列表找到目标会话。对同一组合成或获准任务，固定宿主、模型、语言、提示集合与创建时间，比较原生标题、确定性日期和字面量、日期加模型类别与描述三组。采用随机列表顺序及盲化目标任务查找，记录首次找对会话用秒、找错率、类别错判率、需人工改名数、每个合格标题派发数与服务报告 tokens。设置相同候选规模，用异步诊断记录辅助解释失败，同时按会话请求事件区分已记录、实际派发和宿主回退。只有在相同分类质量门槛下减少查找用时与错找，且额外模型与排障成本可接受，才支持继续。若在原生标题或确定性组相比无优势，或误分类抵消速度收益，则推翻该场景中的采用假设。

#### 证据与依据

**依据 1 · 源码核查**：[packages/clutch-dsh-title/src/provider.ts:65-90](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/provider.ts#L65-L90)

三组中的确定性和混合路径可区分。

<details>
<summary>查看原文（26行）</summary>

```text
  const titleProvider = SessionTitleProviderId('clutch-dsh-title');
  const fields = selectReferencedFields(config);
  return {
    id: titleProvider,
    automatic: 'first-prompt',
    async generate(request: SessionTitleProviderRequest) {
      const first = request.messages[0];
      if (first === undefined) {
        throw new Error('clutch-dsh-title requires one human message');
      }
      const deterministic = resolveDeterministicFields(fields, request.session.header.createdAt);
      const extracted = hasLlmFields(fields)
        ? await extractLlmFields(ctx, config, request, [first], titleProvider, diagnostics)
        : undefined;
      const values = mergeFieldValues(deterministic, extracted?.values);
      assertTemplateValues(config, values);
      const rendered = renderTemplate(config.compiledTemplate, values);
      const title = normalizeSessionTitle(rendered, Number.MAX_SAFE_INTEGER);
      if (title.length === 0) {
        throw new Error('clutch-dsh-title renderer produced an empty title');
      }
      return deepFreeze({
        title,
        messageSeqs: [first.seq],
        ...(extracted === undefined ? {} : { model: extracted.model }),
      });
```

</details>

**依据 2 · 源码核查**：[packages/clutch-dsh-title/src/extractor.ts:337-376](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/extractor.ts#L337-L376)

请求事件先于派发，输出另行验证。

<details>
<summary>查看原文（40行）</summary>

```text
  try {
    for (let attempt = 1; attempt <= dispatches; attempt += 1) {
      callDeadline.signal.throwIfAborted();
      const call = await ctx.llm.prepareCall(
        { ...route, maxTokens: config.maxOutputTokens },
        callDeadline.signal,
        (controls, model) => {
          const effort = selectReasoningEffort(config, model);
          return { ...controls, ...(effort === undefined ? {} : { reasoningEffort: effort }) };
        },
      );
      const options: GenerateOptions = deepFreeze({
        ...call.config,
        system,
        messages,
        sessionId: request.session.id,
        purpose: 'session-title',
        signal: callDeadline.signal,
      });
      const event: SessionTitleLlmRequestEventData = deepFreeze({
        titleProvider,
        messageSeqs,
        route,
        system,
        messages,
        maxTokens: options.maxTokens!,
        ...(options.reasoningEffort === undefined
          ? {}
          : { reasoningEffort: options.reasoningEffort }),
      });
      request.session.append('session/title-llm-request', event);
      callDeadline.signal.throwIfAborted();

      dispatched = attempt;
      const response = await streamResponse(call, options, callDeadline.signal);

      try {
        if (response.outputError !== undefined) throw response.outputError;
        const candidate = JSON.parse(response.text) as unknown;
        const values = validateExtractedFields(fields, candidate);
```

</details>

**依据 3 · 源码核查**：[packages/clutch-dsh-title/src/storage.ts:163-205](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/src/storage.ts#L163-L205)

计数规则与流用量来源。

<details>
<summary>查看原文（43行）</summary>

```text
  return <T>(generate: () => Promise<T>, signal: AbortSignal): Promise<T> => {
    const generation: TitleGenerationUsage = {};
    return generations.run(generation, async () => {
      const result = await generate();
      if (!signal.aborted && generation.lastCall !== undefined && !generation.lastCall.counted) {
        recordWithoutBlocking(() => store.recordSuccess());
      }
      return result;
    });
  };
}

function recordWithoutBlocking(write: () => Promise<void>): void {
  void Promise.resolve()
    .then(write)
    .catch(() => {
      // Statistics must never delay or fail the title, even during a storage outage.
    });
}

async function* recordTitleStream(
  source: AsyncIterable<StreamChunk>,
  store: StatsRecorder,
  call: TitleCallUsage,
): AsyncGenerator<StreamChunk> {
  let usage: TitleTokenUsage | undefined;
  try {
    for await (const chunk of source) {
      if (chunk.type === 'usage') {
        const normalized = normalizeTokenUsage(chunk.usage);
        if (normalized !== undefined && (normalized.totalTokens > 0 || usage === undefined)) {
          usage = normalized;
        }
      }
      yield chunk;
    }
  } finally {
    if (usage !== undefined) {
      const recordedUsage = usage;
      call.counted = recordedUsage.totalTokens > 0;
      recordWithoutBlocking(() => store.record(recordedUsage));
    }
  }
```

</details>

**依据 4 · 源码核查**：[packages/clutch-dsh-title/test/composition.test.mjs:351-361](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-title/test/composition.test.mjs#L351-L361)

测试源码展示宿主回退场景。

<details>
<summary>查看原文（11行）</summary>

```text
test('falls back through native SessionTitleService when extraction fails', async () => {
  const { ctx, adapter } = await makeContext();
  adapter.response = '{invalid-json}';
  const { session } = appendSession(ctx, 'invalid-json', 'fallback words remain visible');
  await settle();

  assert.equal(ctx.sessionTitle.get(session)?.source.kind, 'fallback');
  await assert.rejects(ctx.sessionTitle.refresh(session), /JSON|structured extraction/i);
  assert.equal(ctx.sessionTitle.get(session)?.source.kind, 'fallback');
  assert.equal(ctx.sessionTitle.get(session)?.title, 'fallback words remain visible');
});
```

</details>

#### 缺口

- 没有同任务对照及参与者查找用时。
  **影响**：当前能说明实验可分辨的事件，不能给出收益幅度。
  **进一步探讨**：以同一用户多组交错顺序试验，先确定目标耗时与误判阈值，再观察是否值得继续。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
