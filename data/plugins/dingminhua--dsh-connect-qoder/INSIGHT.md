# DSH Connect Qoder

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[a5a5823](https://github.com/dingminhua/dsh-connect-qoder/tree/a5a58238473b71c181943edb60fb317dc1448201)

<!-- BEGIN META -->
[![GitHub ★ 51](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=51&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dingminhua/dsh-connect-qoder) [![npm 30d 11,478](https://img.shields.io/static/v1?label=npm+30d&message=11%2C478&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dmh2002/dsh-connect-qoder) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dmh2002/dsh-connect-qoder)
<!-- END META -->

> **功能**：将 Qoder 国内和国际凭据接入 DSH 的模型供应商插件，支持按区域发现模型和管理账号。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 核对了区域注册、凭据选择与模型调用，已有账号可以在同一 DSH 宿主管理和选择地区。

> **主要限制**：[Q03](#research-q03) 预览脱敏与导出包含真实 PAT 是不同阶段。区域导入只校验文件标签，账号失配还会走其他来源。[Q04](#research-q04) 清除 vault 不能替代移除设置和环境凭据。

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
  - [Q01 · Qoder 账户放进 DSH 增加哪些可回查操作？](#detail-section-11)
  - [Q02 · 区域 PAT 怎样进入模型调用？](#detail-section-12)
  - [Q03 · 凭据保存、转移和错误恢复有什么边界？](#detail-section-13)
  - [Q04 · 采用前提和退出条件是什么？](#detail-section-14)
  - [Q05 · 能否验证区域和凭据隔离？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 Qoder PAT 并使用 DSH 的用户，需要按地区选择一条模型线路并核对实际服务身份。

继续使用官方客户端，按地区和账号管理模型并人工切换工作环境。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Host 路由**：模型供应商和账号转移
- **界面**：双区域模型与账号设置
- **用户命令**：dsh-connect-qoder 诊断 CLI

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node ^22.19 或 ≥24 及 DSH/Cordis 相应 peer | 启动必需 | 加载供应商和设置 | Host 安装或注册可能失败 |
| 有效区域 PAT 和上游网络 | 模型调用必需 | 交换会话凭据及调用模型 | 无法发现或聊天 |
| 本地 vault | 可选 | 保存多个账号 | 使用设置或环境来源 |
| 独立 profile 与可撤销凭据 | 试用条件 | 验证及退出 | 无法辨认账户边界时停止 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对地区、凭据来源和隔离配置 | 能识别目标账号 |
| 加载 | Host 注册两区供应商 | 选定地区出现预期模型 |
| 执行 | 用户发短文本并核对身份 | 无意外回退或额外调用 |
| 退出 | 用户关区、清理对应来源、复查 | 区域不可再调用，任务可回原入口 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 兼容 Host、网络及区域凭据 | 配置模型与账户，核对来源 | 有效性和配置人时未测 |
| 持续使用 | 上游调用及可能积分、浏览器设置 | 复核来源变更、导出和计费 | 请求量及费用待核 |
| 失败恢复 | 原客户端、可撤销凭据、备份副本 | 关区、移除多处来源并复查 | 上游撤销和恢复耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 区域模型选择 | 固定 Host 两条供应商与发现入口 | 真实网关响应和模型结果 |
| 多来源凭据管理 | 有优先级、区域文件与转移接线 | 最终平台权限和真实归属 |
| 失败及退出 | 有换号、区域撤回和局部清理 | 上游积分及关区后实际状态 |

> **思考**：[Q03](#research-q03) 预览脱敏与导出包含真实 PAT 是不同阶段。区域导入只校验文件标签，账号失配还会走其他来源。[Q04](#research-q04) 清除 vault 不能替代移除设置和环境凭据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 核对了区域注册、凭据选择与模型调用，已有账号可以在同一 DSH 宿主管理和选择地区。

区域目录与凭据按栈处理，显式选择会自动回退。导出和导入使用相同模型，但导入中的区域字段属于文件声明，文件模式及账号归属需另查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 预览脱敏与导出包含真实 PAT 是不同阶段。区域导入只校验文件标签，账号失配还会走其他来源。[Q04](#research-q04) 清除 vault 不能替代移除设置和环境凭据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q01](#research-q01) 已有授权凭据的用户可在隔离 profile 观察单一区域的模型入口与短回复。[Q03](#research-q03) 避免把导出文件当脱敏结果，确认使用账号和地区。[Q04](#research-q04) 出现意外归属或无法关闭时，停止使用，清理对应来源后回原客户端。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认根 DSH 插件、两条区域路径及 PAT 保存和退出。实际网关访问、模型效果、账单与宿主验证未知。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/accounts.ts、src/upstream.ts、src/transfer.ts、src/web-status.ts、src/shim.ts、src/bin.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根 DSH 插件的区域模型、PAT、转移及退出。所有上游私有协议、活动签到、远程条款与完整安全性未审计。
- 下一步：固定源码。下一步用模拟 PAT 对照地区发现、当前账号失配、错误域导入、区域关闭和 CLI 清理，记录两边请求、归属及被清理的文件。

**分析版本**

- **仓库**：[dingminhua/dsh-connect-qoder](https://github.com/dingminhua/dsh-connect-qoder)
- **版本号**：1.23.0（[固定提交 a5a5823](https://github.com/dingminhua/dsh-connect-qoder/tree/a5a58238473b71c181943edb60fb317dc1448201)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 用两个模拟区域和多来源假凭据对照可验证账户归属、区域撤回、退出和转移边界。

固定源码。下一步用模拟 PAT 对照地区发现、当前账号失配、错误域导入、区域关闭和 CLI 清理，记录两边请求、归属及被清理的文件。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 20 | 8757 | — | — | 168722 |
| .tsx | source | 15 | 7213 | 4683 | 2380 | — |
| .mjs | source | 5 | 610 | 424 | 127 | — |
| .ts | source | 50 | 19354 | 9830 | 8555 | — |
| .ts | test | 42 | 15533 | 11186 | 3036 | — |
| .tsx | test | 21 | 8864 | 6460 | 1792 | — |
| .ts | example | 1 | 243 | 168 | 55 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-qoder/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 26](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=26&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-qoder/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 26](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=26&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-qoder/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断已有 Qoder 凭据的 DSH 用户，能否从一个地区安全识别并使用目标模型，且能分清凭据管理、调用失败和可行退出。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Qoder 账户放进 DSH 增加哪些可回查操作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 Qoder 账号并日常使用 DSH 的人，可在同一宿主查模型目录、选择地区和配置服务账号。README 描述双区接入与 PAT 方式，根包声明 bundle，实际按区域注册 adapter 和目录。相对在官方客户端单独选模型或人工切账号，这里新增的是统一模型入口与账号配置。合格结果是指定账号与模型完成可用答复，并可说明是谁在服务。若单一区域或现有客户端已够用，接入必要性下降。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-39](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/README.md#L31-L39)

作者描述协议、PAT 和双区用途

```text
> Qoder 官方不提供 OpenAI 兼容端点（其官方 SDK 只是 agent 启动器），因此本插件直连 Qoder 的 cosy 网关，实现了协议的最小客户端，无需在 Qoder 桌面端登录——只需一个 PAT（Personal Access Token）。

## 功能特性

- **双供应商并行接入（国内版 + 国际版）** —— 国内版注册为 `qoder` provider（`gateway.qoder.com.cn`），国际版注册为 `qoder-global` provider（`api1.qoder.sh`）。**配置了 PAT 的区域其模型会出现在 DSH 模型选择器里**：两个区域都有 PAT 时两组同时可选，不同会话可以各选一边，互不干扰。**没有 PAT 的区域不列出任何模型**（一个请求也发不出去，列出来只会点到就失败）；配置 PAT 后「刷新模型」即可让模型自动出现——provider 本身始终注册着，配置入口在「设置 → Qoder」。模型名内嵌上游积分倍率（如 `Qwen3.8-Flash · x0.00`），与 Qoder 自身模型菜单一致。

  <img src="docs/assets/dsh-connect-qoder-model-picker.png" width="360" alt="DSH 模型选择器：Qoder 与 Qoder Global 两个分组，模型名带积分倍率" />
- **设置页自成一处** —— 配置界面是 DSH 设置面板左侧导航里的独立一页（**设置 → Qoder**），与「账号与余额 / 通用设置 / 模型 / 插件」并列，不再藏在插件市场的插件详情页里。页面自上而下是：标题 → 一句话总述 → 三条核心用途 → 正文。
- **双 tab 切换** —— 页面顶部为「国内版 / 国际版」两个 tab，各含独立的 PAT、模型管理与用量概览；每个 tab 的目录、勾选与状态完全隔离。
```

**依据 2 · 源码核查**：[package.json:74-86](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/package.json#L74-L86)

根 bundle 及 Web 注入

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings-plugins",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:10-12](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/cordis.patch.yml#L10-L12)

装载 scoped 包及稳定 entry ID

```text
- insert:
    - id: dsh-connect-qoder
      name: '@dmh2002/dsh-connect-qoder'
```

**依据 4 · 源码核查**：[src/index.ts:2254-2279](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/index.ts#L2254-L2279)

实际双区注册及失败释放

<details>
<summary>查看原文（26行）</summary>

```text
        const releaseAdapter = {} as Record<QoderRegion, (() => void) | undefined>
        let releaseDirectory: (() => void) | undefined
        try {
          for (const region of QODER_REGIONS) {
            releaseAdapter[region] = registration[region].adapter = ctx.llm.registerAdapter([QODER_PROVIDERS[region]], adapters[region].adapter)
          }
          // registerConfigurableProviders 一次登记**两个区域**的 provider 条目
          // （map 遍历 QODER_REGIONS），所以这里只有**一个**句柄。它沿用
          // `registration.cn.directory` 这个槽位只是为了不新增字段：整个目录
          // 条目集由这一个句柄持有，并按区域整体 replace（见 syncRegionRegistration）。
          // 不要读成「global 漏了 directory 句柄」。
          releaseDirectory = registration.cn.directory = ctx.llm.registerConfigurableProviders(
            QODER_REGIONS.map(region => ({
              provider: QODER_PROVIDERS[region],
              displayName: QODER_PROVIDER_DISPLAY_NAMES[region],
              settingsNs,
              settingsPath: [],
              declared: false,
            })),
          )
        } finally {
          const missing = QODER_REGIONS.some(region => releaseAdapter[region] === undefined) || releaseDirectory === undefined
          if (missing) {
            for (const region of QODER_REGIONS) releaseAdapter[region]?.()
            releaseDirectory?.()
          }
```

</details>

#### 缺口

- 无同任务原客户端或独立直连对照。
  **影响**：不能量化账号选择、完成时延或切换摩擦。
  **进一步探讨**：用一个明确区域的文本任务分别走原客户端和 DSH，比较成功及归属核对。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 区域 PAT 怎样进入模型调用？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

每区创建各自上游实例、目录、凭据存储和回环 shim。发现回调按 provider 分区，区域关闭时不列模型，异常同样可表现为空列表。凭据选择先尝试已选 ID，失配后自动从设置、环境和 vault 依次取。真实调用先按凭据建立区域 jobToken 会话，聊天再使用独立的会话签名与请求。外部调用的身份及模式依据上游反馈，区域配置成立也不等于网关接受。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1074-1079](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/index.ts#L1074-L1079)

每区域独立运行栈

```text
  // 每个区域：上游客户端 + 回环 shim + vault store + 池运行期。
  for (const region of QODER_REGIONS) {
    const upstream = new QoderUpstreamClient(region, { logger: log })
    const catalog = new QoderCatalog(QODER_FALLBACK_MODELS.map(fallbackModelInfo))
    const store = new QoderAccountStore(region)
    let poolRuntime: Record<string, QoderPoolProbe> = {}
```

**依据 2 · 源码核查**：[src/index.ts:1099-1118](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/index.ts#L1099-L1118)

区域 shim 与凭据解析接线

<details>
<summary>查看原文（20行）</summary>

```text
    const shim = createQoderShim({
      upstream,
      credential: () => resolveServingPat(region),
      modelKeyOf: selector => catalog.keyOf(selector),
      supportsImagesOf: selector => catalog.supportsImagesOf(selector),
      // 设置里为这个模型保存的思考强度（模型选择器名 → 档位名）。目录换代后
      // 旧 key 自然失配（返回 undefined），请求退回模型默认档，不需要额外清理。
      reasoningEffortOf: selector => {
        const key = catalog.keyOf(selector)
        if (key === undefined) return undefined
        return thinkingEffortsOf(config, region)[key]
      },
      logger: log,
      resolveServing: async () => {
        const serving = await resolveServing(region)
        return serving === undefined
          ? undefined
          : { accountId: serving.id, accountName: serving.accountName, pat: serving.pat }
      },
      failoverAccount: async tried => nextFailoverCredential(region, tried),
```

</details>

**依据 3 · 源码核查**：[src/index.ts:2289-2305](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/index.ts#L2289-L2305)

模型发现、关闭与异常空列表

<details>
<summary>查看原文（17行）</summary>

```text
        ctx.llm.registerModelDiscovery(settingsNs, async (request, signal) => {
          const region = regionOfProvider(request.provider ?? '')
          if (region === undefined) return []
          if (!regionEnabled(config, region)) return []
          try {
            const models = await discoverModels(region, signal)
            const saved = new Set(enabledModelKeysOf(config, region))
            return deriveCatalog(models, saved.size > 0 ? saved : initialEnabledKeys(models)).map(model => ({
              id: model.key,
              name: modelDisplayName(model),
              contextWindow: model.contextWindow,
              maxTokens: model.maxOutputTokens,
              inputModalities: model.supportsImages ? ['text', 'image'] : ['text'],
            }))
          } catch {
            return []
          }
```

</details>

**依据 4 · 源码核查**：[src/accounts.ts:188-203](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/accounts.ts#L188-L203)

明确账号失配回退及三源优先级

<details>
<summary>查看原文（16行）</summary>

```text
  async resolve(
    sources: { settingsPat?: string | undefined, envPat?: string | undefined },
    selectedId?: string,
  ): Promise<QoderResolvedCredential | undefined> {
    if (selectedId !== undefined && selectedId !== '') {
      const chosen = await this.credentialFor(selectedId, sources)
      if (chosen !== undefined) return chosen
    }
    const settingsPat = sources.settingsPat?.trim()
    if (settingsPat) return { id: qoderAccountId(settingsPat), accountName: '', source: 'settings', pat: settingsPat }
    const envPat = sources.envPat?.trim()
    if (envPat) return { id: qoderAccountId(envPat), accountName: '', source: 'env', pat: envPat }
    const first = (await this.vaultAccounts())[0]
    return first === undefined
      ? undefined
      : { id: first.id, accountName: first.accountName, source: 'vault', pat: first.pat }
```

</details>

**依据 5 · 源码核查**：[src/upstream.ts:517-543](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/upstream.ts#L517-L543)

jobToken 请求发送选定凭据

<details>
<summary>查看原文（27行）</summary>

```text
  async exchangeJobToken(credential: string): Promise<QoderJobToken> {
    const fingerprint = deriveFingerprint('', credential, this.installSalt)
    const body = jobTokenBody(credential)
    const date = currentRfc1123Date()
    const sig = signLegacy(date)

    const headers: Record<string, string> = {
      'cosy-machinetoken': fingerprint.machineToken,
      'cosy-machinetype': fingerprint.machineType,
      'login-version': 'v2',
      appcode: 'cosy',
      accept: 'application/json',
      'accept-encoding': 'identity',
      'cosy-version': COSY_VERSION_HEADER,
      'cosy-clienttype': COSY_CLIENT_TYPE,
      date,
      signature: sig,
      'content-type': 'application/json',
      'cosy-machineid': fingerprint.machineId,
      'user-agent': 'Go-http-client/2.0',
    }

    const url = `${this.region.gateway}${this.region.jobTokenPath}`
    const resp = await this.fetchImpl(url, { method: 'POST', headers, body })
    const text = await resp.text()
    if (resp.status !== 200) {
      throw new QoderUpstreamError(classifyFailure(resp.status, text), `jobToken 交换失败: HTTP ${resp.status} ${truncate(text, 200)}`, resp.status, deepestBusinessCode(text))
```

</details>

**依据 6 · 源码核查**：[src/upstream.ts:756-787](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/upstream.ts#L756-L787)

聊天请求与签名

<details>
<summary>查看原文（32行）</summary>

```text
    const body = JSON.stringify(template)
    const url = `${this.region.gateway}${this.region.chatPath}`
    const pathSig = pathSigFrom(url)

    const encoded = cosyEncode(new TextEncoder().encode(body))
    const date = String(Math.floor(Date.now() / 1000))
    const payloadB64 = buildPayloadB64(holder.session.info)
    const sig = signRequest(payloadB64, holder.session.cosyKey, date, encoded, pathSig)
    const bearer = composeBearer(payloadB64, sig)

    const headers: Record<string, string> = {
      ...DEFAULT_HEADERS,
      'cosy-machinetype': holder.session.machineType,
      'cosy-date': date,
      'cosy-user': holder.session.identity.uid,
      'cosy-key': holder.session.cosyKey,
      'cache-control': 'no-cache',
      accept: 'text/event-stream',
      authorization: bearer,
      'cosy-version': COSY_VERSION_HEADER,
      'cosy-machineid': holder.session.machineId,
      'cosy-machinetoken': holder.session.machineToken,
      'x-model-key': modelKey,
      'x-model-source': 'system',
    }

    const resp = await this.fetchImpl(url, {
      method: 'POST',
      headers,
      body: encoded,
      ...(options.signal === undefined ? {} : { signal: options.signal }),
    })
```

</details>

#### 缺口

- 真实区域 PAT 和模型可用性未验证。
  **影响**：空目录可能来自关区或发现失败，模型可见也不能证明已授权调用。
  **进一步探讨**：在单一区域用可撤销凭据确认身份、发现及短聊天。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 凭据保存、转移和错误恢复有什么边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

vault 使用锁和原子替换，文件模式请求 0600，内容仍为包含 PAT 的 JSON。预览只给是否存在 token，但实际导出在 transfer 路由返回含 `access_token` 的记录。导入只认可文件中声明的区域域名，该字段来自文件，并无对 PAT 所属地区的上游验证，随后逐条落入 vault。已选账户找不到可退回其他凭据，遇到特定上游错误还能换候选。凭据来源、真实调用和积分应分别核对，不能由一个会话答复推断单次计费。

#### 证据与依据

**依据 1 · 源码核查**：[src/accounts.ts:210-224](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/accounts.ts#L210-L224)

保存记录直接携带 PAT

<details>
<summary>查看原文（15行）</summary>

```text
  async add(pat: string, accountName: string): Promise<QoderStoredAccount> {
    const entry: QoderStoredAccount = {
      id: qoderAccountId(pat),
      accountName,
      pat,
      addedAtMs: Date.now(),
    }
    await this.mutate(accounts => {
      const index = accounts.findIndex(account => account.id === entry.id)
      if (index === -1) return [...accounts, entry]
      const next = [...accounts]
      next[index] = { ...next[index]!, accountName: entry.accountName, pat: entry.pat }
      return next
    })
    return entry
```

</details>

**依据 2 · 源码核查**：[src/accounts.ts:257-267](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/accounts.ts#L257-L267)

原子 JSON 与权限模式

<details>
<summary>查看原文（11行）</summary>

```text
  /** One locked read-modify-write of the vault document. */
  private async mutate(edit: (accounts: QoderStoredAccount[]) => QoderStoredAccount[]): Promise<void> {
    const path = qoderAccountsPath(this.region)
    await withFileLock(path, async () => {
      const accounts = edit(await this.vaultAccounts())
      const document: VaultDocument = { version: VAULT_FORMAT_VERSION, accounts }
      await writeFileAtomic(path, `${JSON.stringify(document, null, 2)}\n`, {
        mode: 0o600,
        dirMode: 0o700,
      })
    })
```

</details>

**依据 3 · 源码核查**：[src/transfer.ts:77-109](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/transfer.ts#L77-L109)

预览与导出 payload 的差异

<details>
<summary>查看原文（33行）</summary>

```text
export function previewTransferFile(text: string): QoderTransferPreview {
  const records = parseTransferFile(text)
  const accounts: QoderTransferPreviewEntry[] = records.map((record, index) => ({
    index,
    uid: displayString(record['uid']),
    nickname: displayString(record['nickname']),
    email: displayString(record['email']),
    hasToken: hasToken(record),
  }))
  return { accounts, total: records.length }
}

/**
 * Project one stored vault account into the shared transfer record shape.
 *
 * `regionDomain` is the target region's login domain (`qoder.com.cn` for cn,
 * `qoder.sh` for global); the export caller passes it so the imported file
 * self-describes which region each record belongs to. `uid` is the PAT-derived
 * account id so a re-import converges on the SAME vault key. `nickname` is
 * dropped — never set to empty/undefined — when the account has no name, and
 * `access_token` carries the PAT itself.
 */
export function transferRecordOf(
  account: QoderStoredAccount,
  regionDomain: string,
): QoderTransferRecord {
  const record: QoderTransferRecord = {
    access_token: account.pat,
    uid: account.id,
    ...(account.accountName !== '' ? { nickname: account.accountName } : {}),
    domain: regionDomain,
  }
  return record
```

</details>

**依据 4 · 源码核查**：[src/transfer.ts:162-194](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/transfer.ts#L162-L194)

按声明域名分类而非验证 token

<details>
<summary>查看原文（33行）</summary>

```text
export function mergeTransferRecords(
  region: QoderWebRegion,
  text: string,
  indexes: readonly number[],
): { changes: Map<string, { pat: string, accountName: string }>, imported: number, skipped: number } {
  const records = parseTransferFile(text)
  const changes = new Map<string, { pat: string, accountName: string }>()
  let imported = 0
  let skipped = 0
  for (const index of indexes) {
    const record = records[index]
    if (record === undefined) {
      skipped += 1
      continue
    }
    const accessToken = record['access_token']
    if (typeof accessToken !== 'string' || accessToken === '') {
      skipped += 1
      continue
    }
    // Region gate: the record's OWN domain decides, and the decision must be
    // a POSITIVE match. An empty, unrecognised, or provably other region's
    // domain is skipped, so a rejected import reports `skipped` instead of
    // pretending to have stored a foreign credential.
    if (knownRegionOfDomain(record['domain']) !== region) {
      skipped += 1
      continue
    }
    const id = qoderAccountId(accessToken)
    changes.set(id, { pat: accessToken, accountName: displayString(record['nickname']) })
    imported += 1
  }
  return { changes, imported, skipped }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1960-1972](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/index.ts#L1960-L1972)

实际接到导出、预览与逐条导入

<details>
<summary>查看原文（13行）</summary>

```text
      const { transferRecordsFor } = await import('./transfer.ts')
      const vault = await stacks[region].store.vaultAccounts()
      return { accounts: transferRecordsFor(region, vault) }
    },
    previewImport: async (_region, text) => {
      const { previewTransferFile } = await import('./transfer.ts')
      return previewTransferFile(text)
    },
    importAccounts: async (region, text, indexes) => {
      const { mergeTransferRecords } = await import('./transfer.ts')
      const { changes, imported, skipped } = mergeTransferRecords(region, text, indexes)
      for (const entry of changes.values()) await stacks[region].store.add(entry.pat, entry.accountName)
      return { imported, skipped }
```

</details>

**依据 6 · 源码核查**：[src/web-status.ts:749-781](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/web-status.ts#L749-L781)

转移路由的请求边界和导出响应

<details>
<summary>查看原文（33行）</summary>

```text
  mount(QODER_TRANSFER_PATH, async (req, res) => {
    if (!loopbackOrigin(req)) return json(res, 403, { error: 'forbidden' })
    if (req.method !== 'POST') return json(res, 405, { error: 'method not allowed' })
    const region = regionOf(res, req.url ?? '')
    if (region === undefined) return
    const action = transferActionOf(req.url ?? '')
    if (action === undefined) return json(res, 400, { error: 'action is required (export|preview|import)' })
    if (deps.transfer === undefined) return json(res, 503, { reason: 'transfer-unavailable', error: 'transfer unavailable' })
    const transfer = deps.transfer
    const body = await readBody(req)
    let parsed: { text?: unknown, indexes?: unknown } = {}
    try {
      parsed = JSON.parse(body || '{}') as { text?: unknown, indexes?: unknown }
    } catch {
      return json(res, 400, { error: 'invalid JSON body' })
    }

    if (action === 'export') {
      const answer = await transfer.exportAccounts(region)
      return json(res, 200, answer)
    }
    if (action === 'preview') {
      const text = typeof parsed.text === 'string' ? parsed.text : ''
      const answer = await transfer.previewImport(region, text)
      return json(res, 200, answer)
    }
    // import
    const text = typeof parsed.text === 'string' ? parsed.text : ''
    const indexes = Array.isArray(parsed.indexes)
      ? (parsed.indexes as unknown[]).filter((i): i is number => typeof i === 'number' && Number.isFinite(i))
      : []
    const answer = await transfer.importAccounts(region, text, indexes)
    return json(res, 200, answer)
```

</details>

**依据 7 · 源码核查**：[src/shim.ts:791-827](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/shim.ts#L791-L827)

失败测量及换号条件

<details>
<summary>查看原文（37行）</summary>

```text
        if (isQoderUpstreamError(error) && isFailoverEligible(error.kind) && !controller.signal.aborted) {
          // 每一次失败尝试都记测量，包括没有后继可试的最后一次——那正是下一个
          // 请求最该避开的账号。客户端已断开时不记：断开不是账号的错。
          options.onServingFailure?.(serving.accountId, error.kind, error.message, {
            status: error.status,
            code: error.code,
            // issue #26：上游申报的等待时长与排队证据一并递过去。此前两者都
            // 没递，于是真实请求撞到排队时，池子把它记成「连不上上游」。
            ...error.retryAfterMs === undefined ? {} : { retryAfterMs: error.retryAfterMs },
            ...error.queue === undefined ? {} : { queue: error.queue },
          })
          tried.push(serving.accountId)
          let next: QoderServingAccount | undefined
          try {
            next = options.failoverAccount ? await options.failoverAccount(tried) : undefined
          } catch {
            next = undefined
          }
          // 宿主已知「这个号今天已经用尽」时，别再拿同一个请求去撞一次墙。
          //
          // 这条守卫只在**有过候选**（`next !== undefined`）时才有意义：那说明
          // 宿主愿意换号，只是候选恰好又被池标记为排除。没有候选时什么都不改变，
          // 失败照常按原路径回给宿主。等待放在守卫**之后**——过去这里先睡 2 秒
          // 再重试，一个用尽的日子 = 每轮白等 2 秒 + 一次必然失败的上游调用。
          if (next !== undefined && options.isAccountExcluded?.(next.accountId) === true) {
            logger(`shim: failover candidate ${next.accountId} is already excluded; not retrying it`)
            next = undefined
          }
          // 策略层被要求跳过已试账号，但 shim 不依赖这一点：候选若重复，同一
          // 请求体会对同一账号无限重发、空烧额度。`tried` 是唯一刹车，shim 侧
          // 也查一遍。
          if (next !== undefined && !tried.includes(next.accountId)) {
            logger(`shim failover: ${serving.accountId} → ${next.accountId} (${error.kind})`)
            // 用户选中的账号失败了，这事必须让用户看见——否则他看到一段正常
            // 回答，既不知道换过号，也不知道自己选的账号已经出问题。
            // 文案正文由配置项提供（宿主据此决定是否提示、怎么措辞），shim 只
            // 负责「何时放进去」：首帧之前。
```

</details>

#### 缺口

- 宿主认证、文件最终权限及账单未运行验证。
  **影响**：无法断言所有环境的导出可访问范围或换号真实成本。
  **进一步探讨**：先用假凭据、隔离本地目录和受控上游验证导出保护、回退和请求次数。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用前提和退出条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需声明版本的 Node、Cordis 和 DSH 模型、客户端等服务，以及可访问所选区域的有效凭据。关闭区域尝试撤回 adapter 和目录，但异常只记日志，应读回模型列表复查。CLI logout 仅删除 vault 和池测量文件，设置或环境变量凭据仍有独立读取路径。适合拥有授权可撤销凭据的人在副本观察。若出现身份非预期、导出留存或区域仍能调用，应停用该区、移除每种来源并回原客户端。服务侧撤销属于独立操作。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:23-29](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/package.json#L23-L29)

Node 与 CLI 发行

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "bin": {
    "dsh-connect-qoder": "lib/bin.js"
```

**依据 2 · 源码核查**：[package.json:96-113](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/package.json#L96-L113)

宿主依赖范围

<details>
<summary>查看原文（18行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.1-rc.1 <5.0.0 || >=4.0.2 <5.0.0",
    "@deepseek-ai/dsh-atomic-write": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-rc.1 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-attachment": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-rc.1 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-locale": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-rc.1 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-rc.1 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-renderer": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-rc.1 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-settings": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-rc.1 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-settings-plugins": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-rc.1 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-rc.1 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-home-paths": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-rc.1 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-host-webserver": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-rc.1 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-llm": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-rc.1 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-llm-pi-ai": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-rc.1 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-settings": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-rc.1 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0",
    "@deepseek-ai/schemastery": ">=3.18.1-rc.1 <4.0.0 || >=3.18.2 <4.0.0",
    "@earendil-works/pi-ai": ">=0.85.0 <0.88.0 || >=1.0.0 <2.0.0",
    "react": "^18.2.0"
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1772-1797](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/index.ts#L1772-L1797)

区域撤出及失败日志

<details>
<summary>查看原文（26行）</summary>

```text
  const syncRegionRegistration = (value: Config): void => {
    for (const region of QODER_REGIONS) {
      const enabled = regionEnabled(value, region)
      const handle = registration[region].adapter
      if (handle === undefined) continue
      try {
        handle.replace(enabled ? [QODER_PROVIDERS[region]] : [])
      } catch (error: unknown) {
        log(`region ${region} adapter sync failed: ${String((error as Error)?.message ?? error)}`)
      }
    }
    const dirHandle = registration.cn.directory
    if (dirHandle === undefined) return
    try {
      dirHandle.replace(QODER_REGIONS
        .filter(region => regionEnabled(value, region))
        .map(region => ({
          provider: QODER_PROVIDERS[region],
          displayName: QODER_PROVIDER_DISPLAY_NAMES[region],
          settingsNs,
          settingsPath: [],
          declared: false,
        })))
    } catch (error: unknown) {
      log(`provider directory sync failed: ${String((error as Error)?.message ?? error)}`)
    }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1195-1218](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/index.ts#L1195-L1218)

设置、环境和 vault 是不同来源

<details>
<summary>查看原文（24行）</summary>

```text
  /** The region's source PATs (settings + env). */
  function sourcesOf(region: QoderRegion): { settingsPat?: string | undefined, envPat?: string | undefined } {
    const state = regionStateOf(config, region)
    const settingsPat = typeof state.pat === 'string' ? (state.pat as string).trim() : ''
    const envPat = patFromEnv(region)
    return {
      ...settingsPat === '' ? {} : { settingsPat },
      ...envPat === undefined ? {} : { envPat },
    }
  }

  /** The region's auto-resolved serving PAT (settings → env). Vault is async. */
  function resolveServingPat(region: QoderRegion): string | undefined {
    const sources = sourcesOf(region)
    if (sources.settingsPat) return sources.settingsPat
    if (sources.envPat) return sources.envPat
    return undefined
  }

  /** Full serving credential via the store (honors selection + vault). */
  async function resolveServing(region: QoderRegion): Promise<
    { id: string, pat: string, accountName: string, source: 'settings' | 'env' | 'vault' } | undefined
  > {
    return stacks[region].store.resolve(sourcesOf(region), selectedAccountId(config, region))
```

</details>

**依据 5 · 源码核查**：[src/bin.ts:234-253](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/bin.ts#L234-L253)

CLI logout 的删除范围

<details>
<summary>查看原文（20行）</summary>

```text
async function logout(): Promise<void> {
  const regions = regionArg()
  const cleared: string[] = []
  for (const region of regions) {
    for (const path of [qoderAccountsPath(region), qoderPoolStorePath(region)]) {
      try {
        await rm(path, { force: true })
        cleared.push(path)
      } catch {
        // 已删除或不可达：继续。
      }
    }
  }
  if (process.argv.includes('--json')) {
    printJson({ schemaVersion: JSON_SCHEMA_VERSION, cleared })
    return
  }
  process.stdout.write(cleared.length === 0
    ? 'Nothing to clear (no vault files present).\n'
    : `Cleared:\n${cleared.map(path => `  ${path}\n`).join('')}`)
```

</details>

#### 缺口

- 未取得真实退出或费用数据。
  **影响**：区域退出的时延、配置留存和上游 token 状态无法从文件删除推出。
  **进一步探讨**：关闭测试区域再确认 adapter、环境来源和原客户端使用情况。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否验证区域和凭据隔离？

**研究主题**：新假设与验证

#### 完整回答

在隔离 profile 分别配置两个模拟区域和不同来源的假凭据，测试显式账号失配、非法区域导入、关闭一个地区以及 logout。记录目录、模拟上游交换目标、实际身份、导出文件和两次请求计数。若关区后仍出现该区模型、读取到另一区来源或错域文件未被拒绝，就推翻预期隔离。实际凭据有效性与计费需要另有授权环境。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1772-1797](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/index.ts#L1772-L1797)

区域开关观测入口

<details>
<summary>查看原文（26行）</summary>

```text
  const syncRegionRegistration = (value: Config): void => {
    for (const region of QODER_REGIONS) {
      const enabled = regionEnabled(value, region)
      const handle = registration[region].adapter
      if (handle === undefined) continue
      try {
        handle.replace(enabled ? [QODER_PROVIDERS[region]] : [])
      } catch (error: unknown) {
        log(`region ${region} adapter sync failed: ${String((error as Error)?.message ?? error)}`)
      }
    }
    const dirHandle = registration.cn.directory
    if (dirHandle === undefined) return
    try {
      dirHandle.replace(QODER_REGIONS
        .filter(region => regionEnabled(value, region))
        .map(region => ({
          provider: QODER_PROVIDERS[region],
          displayName: QODER_PROVIDER_DISPLAY_NAMES[region],
          settingsNs,
          settingsPath: [],
          declared: false,
        })))
    } catch (error: unknown) {
      log(`provider directory sync failed: ${String((error as Error)?.message ?? error)}`)
    }
```

</details>

**依据 2 · 源码核查**：[src/accounts.ts:188-203](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/accounts.ts#L188-L203)

失配回退观测点

<details>
<summary>查看原文（16行）</summary>

```text
  async resolve(
    sources: { settingsPat?: string | undefined, envPat?: string | undefined },
    selectedId?: string,
  ): Promise<QoderResolvedCredential | undefined> {
    if (selectedId !== undefined && selectedId !== '') {
      const chosen = await this.credentialFor(selectedId, sources)
      if (chosen !== undefined) return chosen
    }
    const settingsPat = sources.settingsPat?.trim()
    if (settingsPat) return { id: qoderAccountId(settingsPat), accountName: '', source: 'settings', pat: settingsPat }
    const envPat = sources.envPat?.trim()
    if (envPat) return { id: qoderAccountId(envPat), accountName: '', source: 'env', pat: envPat }
    const first = (await this.vaultAccounts())[0]
    return first === undefined
      ? undefined
      : { id: first.id, accountName: first.accountName, source: 'vault', pat: first.pat }
```

</details>

**依据 3 · 源码核查**：[src/transfer.ts:177-194](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/transfer.ts#L177-L194)

导入域名的反例点

<details>
<summary>查看原文（18行）</summary>

```text
    const accessToken = record['access_token']
    if (typeof accessToken !== 'string' || accessToken === '') {
      skipped += 1
      continue
    }
    // Region gate: the record's OWN domain decides, and the decision must be
    // a POSITIVE match. An empty, unrecognised, or provably other region's
    // domain is skipped, so a rejected import reports `skipped` instead of
    // pretending to have stored a foreign credential.
    if (knownRegionOfDomain(record['domain']) !== region) {
      skipped += 1
      continue
    }
    const id = qoderAccountId(accessToken)
    changes.set(id, { pat: accessToken, accountName: displayString(record['nickname']) })
    imported += 1
  }
  return { changes, imported, skipped }
```

</details>

**依据 4 · 源码核查**：[src/bin.ts:234-253](https://github.com/dingminhua/dsh-connect-qoder/blob/a5a58238473b71c181943edb60fb317dc1448201/src/bin.ts#L234-L253)

退出后文件范围

<details>
<summary>查看原文（20行）</summary>

```text
async function logout(): Promise<void> {
  const regions = regionArg()
  const cleared: string[] = []
  for (const region of regions) {
    for (const path of [qoderAccountsPath(region), qoderPoolStorePath(region)]) {
      try {
        await rm(path, { force: true })
        cleared.push(path)
      } catch {
        // 已删除或不可达：继续。
      }
    }
  }
  if (process.argv.includes('--json')) {
    printJson({ schemaVersion: JSON_SCHEMA_VERSION, cleared })
    return
  }
  process.stdout.write(cleared.length === 0
    ? 'Nothing to clear (no vault files present).\n'
    : `Cleared:\n${cleared.map(path => `  ${path}\n`).join('')}`)
```

</details>

#### 缺口

- 当前没有隔离对照。
  **影响**：不能将设计的分区视为宿主版本均有效。
  **进一步探讨**：用不含真实 PAT 的 fixture 对比两区目录和请求日志。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
