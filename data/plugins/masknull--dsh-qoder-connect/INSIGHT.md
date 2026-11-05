# DSH Qoder Connect

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[2db6c5b](https://github.com/masknull/dsh-qoder-connect/tree/2db6c5b4a06fe1d35d83602f50f79898e3f05571)

<!-- BEGIN META -->
[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/masknull/dsh-qoder-connect) [![npm 30d 4,737](https://img.shields.io/static/v1?label=npm+30d&message=4%2C737&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-qoder-connect) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-qoder-connect)
<!-- END META -->

> **功能**：通过个人访问令牌，将 Qoder 国内版与国际版模型及账号状态接入 DSH。

> **亮点**：它把双区域的凭证、模型目录和调用转换整合成DSH provider，并用账号/generation约束目录与探测结果落地；这比只填API地址更明确地组织身份和降级来源。该贡献不等于实时接口可用、模型能力增强或订阅收益保证，见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：当前账号卡片与正在执行请求可能不同步，清文件还可能重新启用env凭证。普通迭代错误已有错误帧，但shim在部分body I/O报错后补DONE的分支仍需完整性验证；正常封包、零成本元数据或本地abort都不能替代真实结果与额度核对，见 [Q03](#research-q03)。

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
  - [Q01 · 谁需要把订阅模型接入 DSH，哪些能力继承自宿主和上游？](#detail-section-11)
  - [Q02 · 双区域、账号与模型目录如何连接到实际流式请求？](#detail-section-12)
  - [Q03 · 保存、切换凭证、排队、重试和推理探测有哪些关键边界？](#detail-section-13)
  - [Q04 · 采用、维护、计费与退出的负担如何判断？](#detail-section-14)
  - [Q05 · 怎样验证账号与请求身份绑定的可复核假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有自有Qoder账号、希望在DSH保留原生Agent循环的个人用户，提供双区域模型供应商接入与账号目录管理。

参照是Qoder原产品或手动通用API接入。插件新增供应商适配、账号/目录和失败提示，模型与额度来自Qoder，Agent循环与权限来自DSH；骨架和传输移植归属见作者说明，不声称首创或已省钱，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 双区域provider | Qoder模型进入DSH原生循环 | 自有区域PAT、兼容peer及可用上游，非完整CLI嵌入 |
| 多PAT保存与切换 | 选择活动账号并保留区域独立文件 | 校验后保存，clear后env可能重新生效，不撤上游PAT |
| 目录三级降级 | 显示live/saved/fallback来源 | 账号/generation约束落地，缓存不证明实时可用 |
| 流式错误与排队转换 | 保留Retry-After、阻止损坏工具参数 | 普通异常有错误帧，部分body I/O结束另需完整性核验 |
| 推理档位探测 | 在未声明时取得被接受的参数集合 | 需同意且消耗额度；参数接受不证明推理效果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH >=0.2.1-rc.1、Node ^22.19.0或>=24 | 必需，包声明 | provider与Host运行 | peer不满足时仅显示不可用状态；本轮未验证兼容 |
| DSH llm/pi-ai与Cordis | 必需 | provider、模型及流转换 | 注册失败释放已落地半边，不能只看卡片 |
| 自有Qoder账号和对应区域PAT | 该区域调用必需 | 交换真实凭据并访问模型 | 中国/国际区不混用；无凭据隐藏目录 |
| loopback端口与内存共享secret | 内部链路必需 | adapter到shim认证 | Host/Origin/Bearer不匹配拒绝，不是公开通用代理 |
| attachments服务 | 图片请求特定条件 | 读取/转换图片 | 缺服务的图片请求不能成立，文本不等同全附件支持 |
| Web/Desktop界面或CLI | 配置入口二选一 | 卡片/额度或终端保存PAT | 卡片与侧栏依赖浏览器，TUI走CLI |
| 上游网络、订阅及额度 | 效果必需 | 模型生成、目录和探测 | 可限流/排队/失效；实时条件本轮未知 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对profile、区域、依赖和PAT来源 | 不把令牌贴对话或仓库，备份现有设置 |
| 保存与注册 | Host按区域校验后落盘，建立shim并注册provider | 拒绝与网络不可达分开；模型组显示不等于请求成功 |
| 目录与任务 | 用户辨明live/saved/fallback、活动账号，Host执行转换 | 核对真实会话、失败与额度，不用NO_COST作账单 |
| 恢复与退出 | 用户查在途请求，停provider/签到并清文件及env | 上游PAT按需另撤；本地abort/关闭不证明未扣费 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次接入 | 已有订阅、网络与构建资源，金额未知 | profile/peer/区域核对，生成并保存PAT | 本轮未安装或验证当前账户条件 |
| 持续使用 | 真实额度、排队、目录/探测与网络资源未知 | 协议升级、账号切换及目录来源维护 | 宿主成本字段0是未知定价占位，非免费 |
| 失败恢复 | 失败/重试可能消耗额度，金额未知 | 分辨凭证/限流/部分流，查实际账户和会话 | 不以abort推断未执行或未扣费 |
| 退出 | 已耗额度和上游请求不撤销 | 关provider/签到，清保存文件与env，按需撤PAT | clear删失败可被吞，须回读状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 双区模型接入 | provider、独立存储和流转换实际接线 | 当前服务可用及各模型完整兼容 |
| 目录状态 | 身份/generation检查与来源显示 | saved/fallback模型此刻的权限和有效性 |
| 失败处理 | 鉴权前校验、Retry-After恢复、损坏工具拒绝 | 部分body故障后的完整性、全部中断副作用 |
| 账户收益 | 无真实对账或合格任务对照 | 签到当前活动、现金节约、成功率与总耗时 |

> **思考**：当前账号卡片与正在执行请求可能不同步，清文件还可能重新启用env凭证。普通迭代错误已有错误帧，但shim在部分body I/O报错后补DONE的分支仍需完整性验证；正常封包、零成本元数据或本地abort都不能替代真实结果与额度核对，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把双区域的凭证、模型目录和调用转换整合成DSH provider，并用账号/generation约束目录与探测结果落地；这比只填API地址更明确地组织身份和降级来源。该贡献不等于实时接口可用、模型能力增强或订阅收益保证，见 [Q01](#research-q01)、[Q02](#research-q02)。

可借鉴的是双变体描述符共享工厂、loopback随机secret与真实PAT分离，以及账号/generation约束目录和探测写回；输出后不重放的鉴权自愈也收窄重复内容风险。代价是双向流转换、元数据占位和多层排队/取消更难解释，故必须把目录成功、传输结束、任务成功和用量核对分开，见 [Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

当前账号卡片与正在执行请求可能不同步，清文件还可能重新启用env凭证。普通迭代错误已有错误帧，但shim在部分body I/O报错后补DONE的分支仍需完整性验证；正常封包、零成本元数据或本地abort都不能替代真实结果与额度核对，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前先观察。若另行决定验证，使用隔离profile、自有授权账号和非敏感样本，先核对区域/账号来源，再检查正文、工具、限流与部分流中断及额度流水；切账号前结束在途请求。无法确认输出完整性、身份或退出状态时，退回官方产品或已验证供应商，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定源码的provider接入、账号保存与目录fencing、代表流转换及失败处理。实时Qoder可用性、账户条件、计费及完整性故障样本未验证；采用结论为观察，未来请求归属设计未实现。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/variants.ts、src/adapter.ts、src/auth.ts、src/auth-route.ts、src/shim.ts、src/upstream.ts、src/qoder/transport/default-transport.ts、src/probe-service.ts、src/checkin-scheduler.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码级核查Host/provider、凭证与目录、代表传输及失败/关闭；未安装、运行目标测试、调用Qoder、读取真实凭据或验证现行费用/条款。来源移植声明按作者材料保留，不独立认证全上游等价。
- 下一步：后续在明确授权的隔离profile检查双区身份、PAT拒绝/网络错误、slow目录切卡、正常/损坏工具、排队取消和部分body断流，并对照账户额度与真实输出；本轮未执行。

**分析版本**

- **仓库**：[masknull/dsh-qoder-connect](https://github.com/masknull/dsh-qoder-connect)
- **版本号**：0.2.12（[固定提交 2db6c5b](https://github.com/masknull/dsh-qoder-connect/tree/2db6c5b4a06fe1d35d83602f50f79898e3f05571)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可为请求保留不含PAT的区域/账号指纹及配置代数，关联排队、接受、终态和用量未知，在切账号时显式标出旧身份请求。用慢目录、切卡、自愈、取消和部分流故障比较错归属与重复生成；泄露凭证或把abort当未扣费即否定相应保证。该方向未验证，见 [Q05](#research-q05)。

后续在明确授权的隔离profile检查双区身份、PAT拒绝/网络错误、slow目录切卡、正常/损坏工具、排队取消和部分body断流，并对照账户额度与真实输出；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 405 | — | — | 5576 |
| .mjs | source | 3 | 312 | 227 | 57 | — |
| .ts | source | 61 | 14946 | 10628 | 3320 | — |
| .tsx | source | 5 | 4135 | 3300 | 665 | — |
| .ts | test | 52 | 17951 | 14869 | 1610 | — |
| .cjs | test | 1 | 10 | 10 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/masknull/dsh-qoder-connect/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Qoder个人订阅模型怎样接入DSH，并维持双区域、账号、目录和失败结果的可解释边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要把订阅模型接入 DSH，哪些能力继承自宿主和上游？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对象是同时拥有自己的Qoder账号/PAT、又希望保留DSH会话和工具循环的个人用户。它是原生模型供应商插件，不是把Qoder完整IDE或CLI嵌入DSH：一条中国区provider和一条国际区provider共用工厂，凭证、目录和路由按变体分开。合格任务应是选中正确区域/账号模型后，DSH能解释地获得正文、推理和工具调用事件，失败不被误作成功，用户可核对实际额度与身份。

相对使用Qoder原产品，本组件改变的是模型入口：让现有订阅模型参加DSH自己的对话循环、压缩和权限流程。相对手填通用OpenAI地址，它还组织PAT交换、双区目录、错误/排队提示以及账号状态。模型本身、订阅额度和推理能力来自Qoder，宿主的Agent循环与工具执行来自DSH，不能归为插件原创。README明确骨架来自dsh-workbuddy-connect、传输移植自dsh-provider-qoder，本轮不将移植写成首创。

这项集成有条件价值，但并不证明订阅可无限使用、比API便宜或代码任务更好。非官方协议、区域、权限和账号条件会影响可用性；本轮只检查固定源码，不验证实时服务、现行条款或费用。只用Qoder原生工作流且无DSH需求的人，不一定值得多维护一层适配。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-13](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/README.md#L5-L13)

作者界定两产品线与宿主循环归属。

```text
把 **Qoder 订阅**的模型以个人访问令牌（PAT）接入 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）的社区插件。一个插件同时服务两条 Qoder 产品线，各自一张设置卡片、一个 provider、一套凭证与模型目录，互不混用：

| 变体 | provider id | 卡片标题（中文界面） | PAT 生成站点 |
|---|---|---|---|
| 国内版 | `qoder` | Qoder（国内版） | qoder.com.cn |
| 国际版 | `qoder-global` | Qoder Global（国际版） | qoder.com |

只需要哪一版就只配哪一版：未保存 PAT 的变体不显示模型分组，另一版完全不受影响。流式输出、推理内容、工具调用走插件内置的 Qoder 传输层；对话循环、压缩与权限始终由 DSH 本体掌控。

```

**依据 2 · 作者声明**：[README.md:190-202](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/README.md#L190-L202)

作者标明双上游移植及社区/接口风险范围。

<details>
<summary>查看原文（13行）</summary>

```text
Qoder 传输层的上游 `node:test` 用例已移植进 `tests/qoder/`（用 `pnpm run test:qoder` 跑，原件 `reference-qoder-tests/` 已移除）；命令以 `package.json` scripts 为准。

## 出处与许可

- 骨架与 connect 机制改造自 [masknull/dsh-workbuddy-connect](https://github.com/masknull/dsh-workbuddy-connect)（MIT）；
- Qoder 传输层移植自 [mo-n/dsh-provider-qoder](https://github.com/mo-n/dsh-provider-qoder)（MIT）。

本项目按 [MIT](./LICENSE) 许可发布，双上游出处详见 [NOTICE](./NOTICE)。本仓库与 Qoder、DeepSeek 官方均无关联，是社区适配器——非官方实现。

## 免责声明

- Qoder 的接口来自上游仓库：上游随时可能改动、限流或封禁调用方，导致本插件部分或全部功能失效；届时可能只有等社区跟进，不保证兼容窗口。
- 本工具仅供个人学习研究，用于驱动**使用者自己的** Qoder 账号；请勿用于商业转售或任何超出个人合理使用的场景。使用即表示你自行承担账号被限制、额度损失、服务中断等一切后果，并遵守 Qoder 的服务条款。
```

</details>

**依据 3 · 源码核查**：[src/variants.ts:55-87](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/variants.ts#L55-L87)

两个变体的provider、区域、凭证和目录文件分离。

<details>
<summary>查看原文（33行）</summary>

```text
  {
    id: 'qoder',
    displayName: 'Qoder',
    appName: 'Qoder',
    region: 'china',
    ownFilename: '.qoder-auth.json',
    probeFilename: '.qoder-probe.json',
    catalogFilename: '.qoder-catalog.json',
    statusPath: QODER_STATUS_PATH,
    probePath: QODER_PROBE_PATH,
    authPath: QODER_AUTH_PATH,
  },
  {
    id: 'qoder-global',
    displayName: 'Qoder Global',
    appName: 'Qoder Global',
    region: 'global',
    ownFilename: '.qoder-global-auth.json',
    probeFilename: '.qoder-global-probe.json',
    catalogFilename: '.qoder-global-catalog.json',
    statusPath: QODER_GLOBAL_STATUS_PATH,
    probePath: QODER_GLOBAL_PROBE_PATH,
    authPath: QODER_GLOBAL_AUTH_PATH,
  },
]

/** The China variant; the plugin's default and compatibility anchor. */
export const CHINA_VARIANT: QoderVariant = QODER_VARIANTS[0]!

/** The international variant. */
export const GLOBAL_VARIANT: QoderVariant = QODER_VARIANTS[1]!

/** Look up a variant by provider id. */
```

</details>

**依据 4 · 源码核查**：[src/index.ts:848-881](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/index.ts#L848-L881)

真实adapter/provider注册，不是完整外部CLI接入。

<details>
<summary>查看原文（34行）</summary>

```text
    const qoder = createQoderAdapter({
      providerId: variant.id,
      displayName: variant.displayName,
      shim,
      store,
      catalog,
      resolveAttachments: () => ctx.get('attachments'),
      observe: modelId => probeService.recordFor(modelId),
      queueBudgetMs: runtime.queueBudgetMs,
    })
    runtime.invalidate = () => {
      qoder.invalidate()
      ctx.emit('llm/adapters-updated')
    }

    let releaseAdapter: (() => void) | undefined
    let releaseDirectory: (() => void) | undefined
    try {
      releaseAdapter = ctx.llm.registerAdapter([variant.id], qoder.adapter)
      // The row must name the settings form THIS host serves: the host keys one form
      // per profile entry (`entry.options.id`), so a missing id falls back to
      // `variant.id` rather than to the unserved package name.
      const entryId = (ctx as unknown as { fiber?: { entry?: { options?: { id?: string } } } }).fiber?.entry?.options?.id
      const settingsNs = (entryId ?? variant.id) as SettingsNamespace
      releaseDirectory = ctx.llm.registerConfigurableProviders([{
        provider: variant.id,
        displayName: variant.displayName,
        // Each variant's entry joins its own form; the Models page resolves
        // `settingsNs` against the forms THIS host serves.
        settingsNs,
        settingsPath: [],
        declared: false,
      }])
    } finally {
```

</details>

#### 缺口

- 没有真实订阅任务、独立用户反馈及与原生产品/通用API的同条件结果。
  **影响**：不能证明迁移必要性、代码质量改善或现金节约。
  **进一步探讨**：在另行授权的自有账号上比较一组非敏感任务的合格结果、额度变化与全部人工维护。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 双区域、账号与模型目录如何连接到实际流式请求？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

package提供Host、Client、CLI及bundle入口，apply先确定profile数据路径并检查peer版本；不合要求时仅注册不可用状态说明，不继续建立provider。每个variant创建独立CredentialStore、catalog、transport和probe。startVariant先等loopback shim拿到随机端口，再注册PiAiAdapter和可配置provider，失败释放已注册半边并关闭shim。

adapter把当前目录转为pi-ai模型，baseURL指向shim的/v1；pi-ai只收到内存随机共享secret作为apiKey，不直接拿真实PAT。shim监听127.0.0.1，验证Host/Origin与Bearer、内容类型和路由，收到chat后读取CredentialStore并把DSH session/purpose传给client.chatStream。实际Qoder transport在generate开始读取PAT、取得交换凭据、转换附件/消息，再streamChat；该调用局部捕获的PAT不因界面切卡直接变成新PAT，但这不是对所有附属请求或上游效果的隔离证明。

transport产生DSH StreamChunk，UpstreamClient转换为OpenAI兼容SSE，供loopback一侧pi-ai重新转回宿主事件；生成器抛错可转成abortFrames，adapter另拒绝损坏工具参数，并在普通stream与prepareCall().stream两入口恢复providerRetryAfterMs。因此需要检查双向转换而不是看到SSE就当协议无损。模型能力仍受上游目录、宿主附件服务和具体模型约束。

目录采用当前账号live、该账号saved、编译fallback逐级选择，来源和采集时间独立显示。身份变更递增catalogGeneration并abort旧目录请求，fetch返回后检查停止/代数才改当前目录；这能阻止已切走账号的慢目录覆盖新账号。目录可见性与凭证状态分开，无可用凭证时隐藏分组；saved/fallback并非本轮上游有效性证明。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:15-24](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/package.json#L15-L24)

Node/DSH要求和Host/CLI入口。

<details>
<summary>查看原文（10行）</summary>

```text
  "type": "module",
  "engines": {
    "dsh": ">=0.2.1-rc.1",
    "node": "^22.19.0 || >=24.0.0"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "bin": {
    "dsh-qoder-connect": "lib/bin.js"
  },
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-6](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/cordis.patch.yml#L1-L6)

bundle实际注册llm-qoder。

```text
# Register the Qoder provider without changing the profile's current
# default model. Credentials are Personal Access Tokens (PATs) the user
# pastes into the plugin's card; no OAuth or device flow is started.
- insert:
    - id: llm-qoder
      name: dsh-qoder-connect
```

**依据 3 · 源码核查**：[src/index.ts:1474-1508](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/index.ts#L1474-L1508)

profile路径、peer门禁与不可用状态。

<details>
<summary>查看原文（35行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  // A refused load still has to explain itself, and the browser half is loaded
  // from the manifest regardless of whether this half started. Registering one
  // status route that carries the refusal lets the card show the real message
  // and stop offering controls whose machinery never exists; throwing instead
  // would leave that card rendering actions that can only answer 404.
  // Before anything reads a path: every store built below freezes what it gets.
  // `ctx.get` rather than `inject` — a profile context is absent in compositions
  // booted without a profile, and this plugin still has to load there.
  const profileContext = ctx.get('profileContext') as { dir?: string } | undefined
  configurePluginPaths({
    profileDir: profileContext?.dir,
    diagnostics: ctx.logger,
  })
  const peerCheck = peerVersionFailure(
    peerExpectations(),
    message => { ctx.logger.warn(message) },
  )
  if (peerCheck.failure !== undefined) {
    const message = `dsh-qoder-connect: ${peerCheck.failure}`
    ctx.logger.warn(message)
    ctx.inject(['webServer'], webCtx => {
      for (const variant of QODER_VARIANTS) registerInactiveStatusRoute(webCtx, variant.statusPath, message)
    })
    return
  }
  // Unverified peers are a blind spot, not a pass: say so on the card.
  const peerCheckSkipped = peerCheck.unverified.length === 0
    ? undefined
    : `could not determine the version of ${peerCheck.unverified.join(', ')}`
  if (peerCheckSkipped !== undefined) ctx.logger.warn(`dsh-qoder-connect: ${peerCheckSkipped}`)

  // Live configuration source: the composition entry (read through the volatile
  // indirection) with the plugin-owned settings file layered on top. The entry
  // stays as the fallback layer so a hand-edited profile row still seeds a fresh
```

</details>

**依据 4 · 源码核查**：[src/index.ts:830-900](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/index.ts#L830-L900)

等待shim端口后注册adapter/provider与失败释放。

<details>
<summary>查看原文（71行）</summary>

```text
  const shim = createQoderShim({
    store,
    client,
    catalog,
    providerId: variant.id,
    logger: ctx.logger,
    // Same hand-back log as the queue decisions: the loopback hop's lifecycle is
    // what tells a client-side clock apart from an upstream stall.
    onDiag: runtime.diag,
  })
  try {
    await shim.ready
  } catch (error: unknown) {
    ctx.logger.error(`dsh-qoder-connect: ${variant.displayName} loopback endpoint failed to start`, error)
    return false
  }

  try {
    const qoder = createQoderAdapter({
      providerId: variant.id,
      displayName: variant.displayName,
      shim,
      store,
      catalog,
      resolveAttachments: () => ctx.get('attachments'),
      observe: modelId => probeService.recordFor(modelId),
      queueBudgetMs: runtime.queueBudgetMs,
    })
    runtime.invalidate = () => {
      qoder.invalidate()
      ctx.emit('llm/adapters-updated')
    }

    let releaseAdapter: (() => void) | undefined
    let releaseDirectory: (() => void) | undefined
    try {
      releaseAdapter = ctx.llm.registerAdapter([variant.id], qoder.adapter)
      // The row must name the settings form THIS host serves: the host keys one form
      // per profile entry (`entry.options.id`), so a missing id falls back to
      // `variant.id` rather than to the unserved package name.
      const entryId = (ctx as unknown as { fiber?: { entry?: { options?: { id?: string } } } }).fiber?.entry?.options?.id
      const settingsNs = (entryId ?? variant.id) as SettingsNamespace
      releaseDirectory = ctx.llm.registerConfigurableProviders([{
        provider: variant.id,
        displayName: variant.displayName,
        // Each variant's entry joins its own form; the Models page resolves
        // `settingsNs` against the forms THIS host serves.
        settingsNs,
        settingsPath: [],
        declared: false,
      }])
    } finally {
      if (releaseAdapter === undefined || releaseDirectory === undefined) {
        // Registration threw; release whichever half landed.
        releaseAdapter?.()
        releaseDirectory?.()
      }
    }
    try {
      ctx.effect(() => () => {
        releaseAdapter?.()
        releaseDirectory?.()
        detach(ctx, shim.close(), 'loopback endpoint close')
      })
    } catch {
      // Disposed during registration: release immediately — the plugin-level
      // disposer already closed every shim.
      releaseAdapter?.()
      releaseDirectory?.()
      detach(ctx, shim.close(), 'loopback endpoint close')
    }
```

</details>

**依据 5 · 源码核查**：[src/adapter.ts:227-265](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/adapter.ts#L227-L265)

loopback模型baseURL与pi-ai provider。

<details>
<summary>查看原文（39行）</summary>

```text
  const { shim, store, catalog, resolveAttachments, observe } = options
  const providerId = options.providerId ?? QODER_PROVIDER
  const displayName = options.displayName ?? 'Qoder'

  const buildModels = (): Model<Api>[] => {
    // The OpenAI SDK pi-ai drives appends `/chat/completions` to baseURL,
    // so the shim's routes line up with the `/v1` prefix in place.
    const baseUrl = `${shim.baseUrl()}/v1`
    return catalog.current().map(info => toPiModel(info, baseUrl, observe?.(info.id), providerId))
  }

  const api = openAICompletionsApi()
  const base = createProvider({
    id: providerId,
    name: displayName,
    auth: {
      apiKey: {
        name: 'Qoder shim shared secret',
        async resolve({ credential }) {
          const apiKey = credential?.key
          return apiKey === undefined || apiKey.length === 0
            ? undefined
            : { auth: { apiKey }, source: displayName }
        },
      },
    },
    models: buildModels(),
    // pi-ai receives the host session per call, but OpenAI's body omits it.
    // Carry it explicitly to our loopback shim for both dispatch entry points.
    api: {
      ...api,
      stream: (model, context, request) => api.stream(model, context, {
        ...request,
        headers: qoderSessionHeaders(request?.sessionId, request?.headers),
      }),
      streamSimple: (model, context, request) => api.streamSimple(model, context, {
        ...request,
        headers: qoderSessionHeaders(request?.sessionId, request?.headers),
      }),
```

</details>

**依据 6 · 源码核查**：[src/adapter.ts:297-307](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/adapter.ts#L297-L307)

仅共享secret交给pi-ai，真实PAT由shim解析。

<details>
<summary>查看原文（11行）</summary>

```text
  let profiles = new Map<string, ResolvedPiAiProviderProfile>([[providerId, profile]])

  const adapter = new QoderPiAiAdapter(catalog, {
    profiles: () => profiles,
    auth: INERT_AUTH,
    // Resolve the shim's per-process shared secret as the OpenAI apiKey so
    // pi-ai sends it as `Authorization: Bearer <shared-secret>`. The shim
    // validates this before forwarding and resolves the real Qoder credential
    // itself via the store, so the secret never reaches upstream.
    resolveApiKey: async () => shim.token(),
    ...resolveAttachments === undefined ? {} : { resolveAttachments },
```

</details>

**依据 7 · 源码核查**：[src/shim.ts:300-365](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/shim.ts#L300-L365)

随机secret、loopback监听及Host/Origin/Bearer检查。

<details>
<summary>查看原文（66行）</summary>

```text
  // Per-process shared secret. Lives only in memory; the adapter resolves it as
  // the OpenAI apiKey, which pi-ai sends as `Authorization: Bearer ...`. It is
  // never forwarded upstream — the real credential comes from the store.
  const SHARED_SECRET = randomBytes(32).toString('base64url')

  /** Constant-time bearer check; absent or mismatched bearers are rejected. */
  function bearerOk(req: IncomingMessage): boolean {
    const header = req.headers.authorization
    if (typeof header !== 'string') return false
    const match = /^Bearer\s+(.+)$/i.exec(header.trim())
    if (match === null) return false
    const presented = match[1] as string
    const expected = SHARED_SECRET
    const a = Buffer.from(presented)
    const b = Buffer.from(expected)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  }

  const server: Server = createServer((req, res) => {
    // `handle` contains its own failures, but the attempt is wrapped once more: an
    // escaped rejection is an unhandled rejection, which Node turns into process
    // termination.
    void handle(req, res).catch((error: unknown) => {
      logger?.warn('dsh-qoder-connect: loopback request failed', error)
      try {
        // Last resort: `handle` already reports its own failures in-band, so only a
        // throw from that path (or from the reporting itself) lands here.
        if (!res.headersSent) writeOpenAIError(res, 500, 'internal', 'loopback request failed')
        else writeStreamError(res, 'internal', 'loopback request failed')
      } catch {
        // The socket is already gone; nothing left to report to.
      }
    })
  })

  const ready = new Promise<void>((resolve, reject) => {
    server.once('listening', () => resolve())
    server.once('error', reject)
  })

  server.listen(0, '127.0.0.1')

  const baseUrl = (): string => {
    const address = server.address()
    if (address === null || typeof address === 'string') {
      throw new Error(`${providerId} shim has no listening address`)
    }
    return `http://127.0.0.1:${address.port}`
  }

  async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      // Inbound hardening: every request must name the loopback host, and
      // browser-sent origins must be loopback too.
      if (!hostIsLoopback(req.headers.host)) {
        writeOpenAIError(res, 403, 'host_not_allowed', 'Host header must name the loopback interface')
        return
      }
      if (!originIsLoopback(req.headers.origin)) {
        writeOpenAIError(res, 403, 'origin_not_allowed', 'Origin must be a loopback origin')
        return
      }
      if (!bearerOk(req)) {
        writeOpenAIError(res, 401, 'unauthorized', 'missing or invalid Authorization bearer')
        return
```

</details>

**依据 8 · 源码核查**：[src/shim.ts:407-465](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/shim.ts#L407-L465)

chat入口的凭证、取消、session/purpose与上游调用。

<details>
<summary>查看原文（59行）</summary>

```text
    }
    // Fail before reading a body the upstream can never accept: no stored or
    // environmental token means nothing here can answer.
    try {
      await store.resolve()
    } catch (error: unknown) {
      writeOpenAIError(res, KIND_STATUS.missing_credential, 'not_signed_in', String(error))
      return
    }

    const raw = (await readBody(req)).toString('utf8')

    const controller = new AbortController()
    const startedAt = performance.now()
    // The response closing before it ends is the client going away — a stopped
    // turn. Listening on the request instead would fire as soon as its body was
    // read, which is not a cancellation.
    res.on('close', () => {
      if (res.writableEnded) return
      // A stopped turn is routine, so this stays in the hand-back log rather than
      // the host's warning stream: the elapsed time and head state are what tell a
      // client-side stop apart from this side's clock, and they are only ever read
      // while diagnosing a wait that ended early.
      const elapsedMs = Math.round(performance.now() - startedAt)
      diag(`chat: client closed the answer after ${elapsedMs}ms (headCommitted=${res.headersSent})`)
      controller.abort('client closed the response')
    })
    const sessionId = readQoderSessionHeader(req.headers[QODER_SESSION_HEADER])
    const purpose = readQoderPurposeHeader(req.headers[QODER_PURPOSE_HEADER])

    /**
     * Commit the streaming head — once, and only if the answer turns slow.
     *
     * A fast failure keeps its status line (and its standard retry headers); a
     * slow one gets a committed 200 and keep-alive comments so a queue wait never
     * looks like a dead connection. See {@link STREAM_GRACE_MS}.
     */
    let stopKeepAlive: (() => void) | undefined
    const keepAlive = (): void => {
      if (res.writableEnded || res.destroyed) return
      stopKeepAlive ??= beginKeepAlive(res, keepAliveMs)
    }
    const stopHead = (): void => {
      stopKeepAlive?.()
      stopKeepAlive = undefined
    }
    const grace = setTimeout(() => {
      if (res.headersSent) return
      writeStreamHead(res)
      keepAlive()
      diag(`chat: head committed after ${graceMs}ms without an upstream answer`)
    }, graceMs)
    // A pending grace must never hold the process open.
    grace.unref?.()

    let result: QoderChatResult
    try {
      result = await client.chatStream(raw, controller.signal, sessionId, purpose)
    } finally {
```

</details>

**依据 9 · 源码核查**：[src/qoder/transport/default-transport.ts:218-250](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/qoder/transport/default-transport.ts#L218-L250)

实际generate捕获PAT、交换凭据、转换消息并流式执行。

<details>
<summary>查看原文（33行）</summary>

```text
  private async * generate(
    options: GenerateOptions,
    model: QoderCatalogModel | undefined,
    onQueueWait: QoderTransportOptions['onQueueWait'],
    onNotice: QoderTransportOptions['onNotice'],
  ): AsyncGenerator<StreamChunk> {
    if (options.signal?.aborted) throw aborted('Request was aborted prior to generation.')

    // Validate before any provider I/O, so an unusable request never consumes a subscription.
    validateQoderRequestShape(options, model)
    // Credentials, which the center image exchange must be able to sign with.
    const pat = await this.requirePat(options.signal)
    const credentials = await this.auth.getCredentials(pat, options.signal)
    // Read attachments, publish images, and assemble wire messages.
    const messages = await translateQoderMessages(options, this.attachments, {
      uploader: this.imageUploader,
      credentials,
      preserveThinking: this.preserveThinking,
    })
    // Image publication may have refreshed a rejected job token, so re-read the
    // credential that actually signs the chat.
    const chatCredentials = await this.auth.getCredentials(pat, options.signal)
    // Track whether any chunk was yielded to the consumer across this request.
    // If output was already produced mid-stream before an error (e.g. 401 mid-flight),
    // replaying the whole request would emit duplicated content to the user.
    let produced = false
    try {
      for await (const chunk of this.streamChat(options, model, chatCredentials, messages, () => {
        this.onChatAccepted()
      }, onQueueWait, onNotice)) {
        produced = true
        yield chunk
      }
```

</details>

**依据 10 · 源码核查**：[src/upstream.ts:932-961](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/upstream.ts#L932-L961)

transport迭代异常转换为abortFrames，不是全部静默结束。

<details>
<summary>查看原文（30行）</summary>

```text
    return new ReadableStream<Uint8Array>({
      pull: async controller => {
        try {
          while (queue.length === 0 && !encoderRef.terminal) {
            if (pending === undefined) {
              pending = await iterator.next()
            }
            const next = pending
            pending = undefined
            if (next.done) {
              queue.push(...encoderRef.finishFallback())
              break
            }
            queue.push(...encoderRef.start(), ...encoderRef.frames(next.value))
          }
        } catch (error: unknown) {
          const message = error instanceof LlmError ? error.failure.message : String(error)
          const code = error instanceof LlmError ? error.failure.code : 'TRANSPORT'
          queue = encoderRef.abortFrames(message, code)
        }
        if (queue.length > 0) {
          controller.enqueue(toBytes(queue.shift()!))
          if (encoderRef.terminal && queue.length === 0) controller.close()
          return
        }
        controller.close()
      },
      cancel: async () => {
        await iterator.return?.()
      },
```

</details>

**依据 11 · 源码核查**：[src/index.ts:1620-1658](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/index.ts#L1620-L1658)

账号切换递增代数并撤旧目录请求。

<details>
<summary>查看原文（39行）</summary>

```text
   */
  const adoptIdentity = (runtime: VariantRuntime, identity: string | undefined): void => {
    const id = runtime.variant.id
    const known = lastIdentities.get(id)
    // "Same identity" may only short-circuit when THIS runtime has already
    // adopted: a fresh catalog starts hidden, and every settings write
    // hot-reloads into exactly such a runtime — skipping the seeding and
    // `setVisible(true)` would leave the card's model list empty for good.
    if (known === identity && runtime.catalog.isVisible()) return
    const hadCredential = known !== undefined
    if (identity === undefined) lastIdentities.delete(id)
    else lastIdentities.set(id, identity)
    // Any change of identity invalidates in-flight work and the rendered catalog.
    // Probe records stay: they are keyed by account and filtered on read.
    runtime.catalogGeneration += 1
    runtime.inflightFetch?.controller.abort()
    runtime.inflightFetch = undefined
    if (hadCredential && known !== identity) {
      runtime.invalidate()
    }
    if (identity === undefined) {
      // Signed out: hide the group and drop the models, and forget this account's
      // saved catalog — it is that account's data, keyed by identity.
      if (known !== undefined) runtime.savedCatalogs.delete(known)
      runtime.catalog.set(runtime.fallback)
      runtime.catalogSource = 'fallback'
      runtime.catalogFetchedAtMs = undefined
      runtime.catalogError = undefined
      if (runtime.catalog.setVisible(false)) runtime.invalidate()
      return
    }
    // Serve this account's best-known catalog until a fetch lands: the saved one is
    // what this account was actually served, the roster only a one-off snapshot.
    // Covers a switch and a restart alike.
    const saved = runtime.savedCatalogs.get(identity)
    if (saved !== undefined) {
      runtime.catalog.set([...saved.models])
      runtime.catalogSource = 'saved'
      runtime.catalogFetchedAtMs = saved.fetchedAtMs
```

</details>

**依据 12 · 源码核查**：[src/index.ts:1997-2024](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/index.ts#L1997-L2024)

目录返回检查代数和账号再更新状态。

<details>
<summary>查看原文（28行）</summary>

```text
        }
      } catch (error: unknown) {
        // Report only if this attempt is still the current one: a superseded
        // attempt's failure must not overwrite the newer state.
        if (stopped || runtime.catalogGeneration !== generation) return
        runtime.lastFetchAtMs = Date.now()
        runtime.catalogError = error instanceof Error ? error.message.slice(0, 300) : String(error)
        ctx.logger.warn(
          `dsh-qoder-connect: ${runtime.variant.displayName} catalog unavailable; serving the fallback list`,
          error,
        )
        runtime.invalidate()
        return
      }
      if (stopped || runtime.catalogGeneration !== generation) return
      runtime.lastFetchAtMs = Date.now()
      // Shared across fiber reloads so a re-applied plugin does not re-fetch.
      lastLiveFetchAt.set(identity, runtime.lastFetchAtMs)
      runtime.catalog.set([...models])
      runtime.catalogSource = 'live'
      runtime.catalogFetchedAtMs = runtime.client.lastCatalog?.fetchedAtMs ?? Date.now()
      runtime.catalogError = undefined
      // Remember it for this account, so a restart or a later failing fetch serves
      // it instead of the compiled-in snapshot. A persist failure is logged and
      // swallowed: `fetchCatalog` promises its callers that it never rejects.
      if (lastIdentities.get(runtime.variant.id) === identity) {
        try {
          runtime.savedCatalogs.set(identity, {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 保存、切换凭证、排队、重试和推理探测有哪些关键边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

PAT卡片保存先按当前区域validateApiKey，再store.add，拒绝与网络不可达分别返回稳定错误，未通过不覆盖旧文件。凭证以variant独立文件保存，目录与文件分别请求0700/0600权限，并通过writeFileAtomic写入；这是文件级写入保护，不等于加密、操作系统ACL验收或多个进程并发改账号列表的事务保证。控制路由要求POST、loopback Host/Origin和进程key，不把只监听本地当作认证。

文件凭证优先，但clear/remove最后一个账号意味着删文件，current随后会重新读取区域环境变量；因此“清除全部”不必然完全退出，也没有撤销上游PAT。clear还吞掉删除异常，用户须回读实际状态并检查环境来源。账号切换的目录generation和探测账号核对可阻止旧结果归错账号，不能当正在运行的聊天已迁移或停止；generate捕获旧PAT后可能继续完成，切卡应在无活跃请求时做。

排队/重试同时跨transport、shim和宿主：streamIdleTimeout至少3660秒并随等待预算增加，shim用注释keep-alive避免长等待被视为死连接；retry提示通过失败消息载体恢复为宿主字段。transport只在尚未产生输出且鉴权拒绝时尝试fresh交换，已经输出后不整轮重播，防止重复内容。超时或abort只是本地请求处理，不证明上游额度未消耗或远端计算停止。

现有反证是upstream的迭代异常有abortFrames，adapter也会保留损坏工具参数以使宿主拒绝。但另一层边界仍在shim：当其Readable body自身发生I/O error、已转发部分字节且没见[DONE]，会warn后补[DONE]而非发错误帧；不能据此认为所有模型错误均被隐藏，也不能凭正常封包证明正文完整，该条件尚未复现。

推理档位以明确上游声明优先，只在未声明且本地probe为validating时补充；接受某个参数只证明拼写被接受，不证明推理强度有效。probe有配置或单次显式同意门槛，会消耗真实额度，不应作为无成本自动探测。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1724-1751](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/index.ts#L1724-L1751)

保存先校验，错误分类后才落盘。

<details>
<summary>查看原文（28行）</summary>

```text
        path: runtime.variant.authPath,
        save: async (pat, label) => {
          // Validate against this variant's region before anything is written: the
          // file never holds a credential the plugin has not seen work.
          // A network outage is not a refusal: validateApiKey throws for it after
          // retrying. Keep it distinct so the card never tells the user to
          // regenerate a token that was never checked.
          let valid: boolean
          try {
            valid = await validateApiKey(pat, runtime.variant.region)
          } catch {
            return { ok: false, error: 'qoder_unreachable' as const }
          }
          if (!valid) {
            return { ok: false, error: 'qoder_invalid_pat' as const }
          }
          const entry = await runtime.store.add(pat, label)
          // Adopt at once so the model group appears without waiting for the sweep.
          const identity = credentialIdentity(entry)
          adoptIdentity(runtime, identity)
          // AWAIT the fetch: the card re-reads status the moment this answer lands.
          // `fetchCatalog` contains its own failures, so a bad upstream cannot fail
          // a valid save.
          await fetchCatalog(runtime, identity)
          return { ok: true, status: await runtime.store.status() }
        },
        activate: async id => {
          const entry = await runtime.store.activate(id)
```

</details>

**依据 2 · 源码核查**：[src/auth.ts:471-501](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/auth.ts#L471-L501)

原子写入及权限模式，凭据仍以pat字段存JSON。

<details>
<summary>查看原文（31行）</summary>

```text
  private async writeDocument(entries: readonly QoderCredentialEntry[], activeId: string | undefined): Promise<void> {
    // No entries means "signed out", which is the absence of the file: an
    // empty document would shadow the environment fallback and make `status`
    // claim a configured-but-empty sign-in.
    if (entries.length === 0) {
      await this.clear()
      return
    }
    const document = {
      version: AUTH_SCHEMA_VERSION,
      activeId: activeId !== undefined && entries.some(entry => entry.id === activeId)
        ? activeId
        : entries[0]!.id,
      credentials: entries.map(entry => ({
        id: entry.id,
        pat: entry.pat,
        region: entry.region,
        savedAt: entry.savedAtMs ?? Date.now(),
        ...entry.label === undefined ? {} : { label: entry.label },
      })),
    }
    const directory = dirname(this.ownPath)
    try {
      await mkdir(directory, { recursive: true, mode: 0o700 })
    } catch {
      // An existing or uncreatable directory surfaces on the write below.
    }
    await writeFileAtomic(this.ownPath, `${JSON.stringify(document, null, 2)}\n`, {
      mode: 0o600,
      dirMode: 0o700,
    })
```

</details>

**依据 3 · 源码核查**：[src/auth.ts:197-215](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/auth.ts#L197-L215)

文件无有效条目时回退环境变量。

<details>
<summary>查看原文（19行）</summary>

```text
  async current(): Promise<QoderCredential | undefined> {
    const stored = await this.readOwn()
    if (stored !== undefined && stored.entries.length > 0) {
      const entry = stored.entries.find(candidate => candidate.id === stored.activeId) ?? stored.entries[0]!
      return {
        id: entry.id,
        pat: entry.pat,
        region: entry.region,
        ...entry.savedAtMs === undefined ? {} : { savedAtMs: entry.savedAtMs },
        ...entry.label === undefined ? {} : { label: entry.label },
        // A file this store wrote came from the card or the CLI; `source` is not
        // persisted because "card vs cli" only records who typed the command.
        source: 'card',
      }
    }
    return this.fromEnvironment()
  }

  /**
```

</details>

**依据 4 · 源码核查**：[src/auth.ts:296-334](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/auth.ts#L296-L334)

移除最后条目/clear只删文件且吞异常，不撤上游凭据。

<details>
<summary>查看原文（39行）</summary>

```text
  async remove(id: string): Promise<QoderCredentialEntry | undefined> {
    const stored = await this.readOwn()
    if (stored === undefined) return undefined
    const index = stored.entries.findIndex(entry => entry.id === id)
    if (index === -1) return undefined
    const [removed] = stored.entries.splice(index, 1)
    const activeId = stored.activeId === id ? stored.entries[0]?.id : stored.activeId
    await this.writeDocument(stored.entries, activeId)
    return removed
  }

  /**
   * Persist a token for this variant and make it active; {@link add} behind the
   * runtime-credential shape older call sites expect.
   */
  async save(pat: string, source: QoderCredentialSource = 'card'): Promise<QoderCredential> {
    const entry = await this.add(pat)
    return {
      id: entry.id,
      pat: entry.pat,
      region: entry.region,
      ...entry.savedAtMs === undefined ? {} : { savedAtMs: entry.savedAtMs },
      source,
    }
  }

  /** Remove every stored credential. A missing file is not an error. */
  async clear(): Promise<void> {
    try {
      await rm(this.ownPath, { force: true })
    } catch {
      // Best effort: a file that cannot be removed will fail validation later
      // and surface through `status()` the same way.
    }
  }

  /** Alias kept for call-site readability (`logout` is just clearing). */
  async logout(): Promise<void> {
    await this.clear()
```

</details>

**依据 5 · 源码核查**：[src/auth-route.ts:138-159](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/auth-route.ts#L138-L159)

控制路由的POST、Host/Origin和进程key限制。

<details>
<summary>查看原文（22行）</summary>

```text
  return async (req, res) => {
    if (req.method !== 'POST') {
      json(res, 405, { error: 'method not allowed' })
      return
    }
    if (!hostIsLoopback(req.headers.host) || !originIsLoopback(req.headers.origin)) {
      json(res, 403, { error: 'request-not-trusted' })
      return
    }
    if (!keyMatches(key, req.headers['x-qoder-auth-key'] as string | undefined)) {
      json(res, 403, { error: 'invalid-auth-key' })
      return
    }
    const body = await readBody(req)
    if (body === undefined) {
      json(res, 413, { error: 'body too large' })
      return
    }
    const request = parseRequest(body)
    if (request === undefined) {
      json(res, 400, { error: 'invalid action' })
      return
```

</details>

**依据 6 · 源码核查**：[src/adapter.ts:275-288](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/adapter.ts#L275-L288)

等待预算和宿主重试策略。

<details>
<summary>查看原文（14行）</summary>

```text
    provider: providerId,
    displayName,
    // Read per call: the queue budget is a setting, and the idle window has to
    // stay longer than it, or the wait the user asked for is cut short.
    get streamIdleTimeoutMs() {
      const budget = options.queueBudgetMs?.() ?? 0
      return Math.max(QODER_STREAM_IDLE_TIMEOUT_MS, budget + 60_000)
    },
    // A hint above `maxDelayMs` makes the host skip the retry instead of
    // waiting, so the ceiling must cover Qoder's own 30s.
    retryPolicy: resolveRetryPolicy({
      mode: 'normal',
      backoff: { maxDelayMs: QODER_RETRY_MAX_DELAY_MS },
    }, `dsh-qoder-connect:${providerId} retryPolicy`),
```

</details>

**依据 7 · 源码核查**：[src/adapter.ts:404-437](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/adapter.ts#L404-L437)

两条流入口恢复providerRetryAfterMs。

<details>
<summary>查看原文（34行）</summary>

```text
  override async *stream(options: GenerateOptions): AsyncGenerator<StreamChunk> {
    yield* withQoderRequestPurpose(options.purpose,
      rejectDamagedToolArguments(this.withRetryHint(super.stream(options))))
  }

  override async prepareCall(provider: string, model: string, signal?: AbortSignal): Promise<PreparedAdapterCall> {
    const prepared = await super.prepareCall(provider, model, signal)
    return {
      ...prepared,
      model: normalizeReasoning(prepared.model),
      stream: (options: GenerateOptions) => withQoderRequestPurpose(options.purpose,
        rejectDamagedToolArguments(this.withRetryHint(prepared.stream(options)))),
    }
  }

  /** Re-stamp `failure.providerRetryAfterMs` on every terminal failure chunk. */
  private async *withRetryHint(inner: AsyncIterable<StreamChunk>): AsyncGenerator<StreamChunk> {
    for await (const chunk of inner) {
      if (chunk.type === 'finish') {
        const { reason } = chunk
        if ((reason.kind === 'error' || reason.kind === 'aborted')
          && reason.failure.providerRetryAfterMs === undefined) {
          const retryAfterMs = retryAfterFromMessage(reason.failure.message)
          if (retryAfterMs !== undefined) {
            yield {
              ...chunk,
              reason: { ...reason, failure: { ...reason.failure, providerRetryAfterMs: retryAfterMs } },
            }
            continue
          }
        }
      }
      yield chunk
    }
```

</details>

**依据 8 · 源码核查**：[src/qoder/transport/default-transport.ts:239-294](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/qoder/transport/default-transport.ts#L239-L294)

产生内容后不重播，鉴权自愈限定错误与次数。

<details>
<summary>查看原文（56行）</summary>

```text
    const chatCredentials = await this.auth.getCredentials(pat, options.signal)
    // Track whether any chunk was yielded to the consumer across this request.
    // If output was already produced mid-stream before an error (e.g. 401 mid-flight),
    // replaying the whole request would emit duplicated content to the user.
    let produced = false
    try {
      for await (const chunk of this.streamChat(options, model, chatCredentials, messages, () => {
        this.onChatAccepted()
      }, onQueueWait, onNotice)) {
        produced = true
        yield chunk
      }
      return
    } catch (error: unknown) {
      if (produced) throw error
      // A cached job token the upstream started rejecting reads as HTTP 401 before
      // any stream byte. One fresh exchange self-heals that window; a revoked PAT
      // fails the retry identically. RATE_LIMIT/QUOTA are never healed here.
      if (!isQoderAuthRejection(error) || options.signal?.aborted) throw error
      this.logger?.warn?.(
        '[Qoder Stream] Chat rejected as unauthorized; exchanging a fresh job token and retrying once',
        { status: error.failure.status },
      )
    }
    // A gateway fault window outlives one immediate retry, so two paced rounds.
    // Each retry exchanges outside the shared single-flight, which a departing
    // waiter can abort.
    let lastRejection: unknown
    let requestNotice: { at: number; sessionId?: string } | undefined
    for (let round = 0; round < 2; round++) {
      const refreshed = await this.auth.exchangeFresh(pat, options.signal)
      // The notice is kept local to this request so concurrent rotations in other
      // sessions cannot crosstalk, overwrite each other, or drop notices.
      requestNotice = {
        at: Date.now(),
        ...(options.sessionId !== undefined ? { sessionId: String(options.sessionId) } : {}),
      }
      try {
        for await (const chunk of this.streamChat(options, model, refreshed, messages, () => {
          this.onChatAccepted()
          if (requestNotice !== undefined) {
            this.emitRefreshedNotice(requestNotice)
            requestNotice = undefined
          }
        }, onQueueWait, onNotice)) {
          produced = true
          yield chunk
        }
        return
      } catch (error: unknown) {
        if (produced) throw error
        if (!isQoderAuthRejection(error) || options.signal?.aborted) throw error
        lastRejection = error
        if (round + 1 < 2) {
          this.logger?.warn?.('[Qoder Stream] Fresh job token also rejected; waiting 2s and retrying once more', {
            status: error.failure.status,
```

</details>

**依据 9 · 源码核查**：[src/shim.ts:493-521](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/shim.ts#L493-L521)

部分body I/O错误补DONE的精确条件，区别空流错误。

<details>
<summary>查看原文（29行）</summary>

```text
    const body = Readable.fromWeb(result.response.body as Parameters<typeof Readable.fromWeb>[0])
    body.on('data', (chunk: Buffer) => {
      forwardedChunks += 1
      // Real bytes are flowing: the keep-alive comments are no longer needed, and
      // from here on the body itself keeps the client's clock alive. Until the
      // first one arrives they stay, so a model that thinks for minutes before its
      // first token does not look like a dead connection.
      if (forwardedChunks === 1) stopHead()
      if (chunk.includes('[DONE]')) sawDone = true
    })
    body.on('end', stopHead)
    body.on('close', stopHead)
    body.on('error', (error: unknown) => {
      stopHead()
      logger?.warn('dsh-qoder-connect: upstream stream failed mid-flight', error)
      if (sawDone || !res.writable) return
      if (forwardedChunks === 0) {
        // Nothing reached the client, so this is not a truncated answer but a
        // failure that never started. Ending quietly would leave the harness to
        // explain it as EMPTY_RESPONSE; the in-band frame names the cause, and its
        // "ended without" wording keeps the classified code at TRANSPORT.
        writeStreamError(res, 'transport', `${providerId} upstream stream ended without any data (${String((error as Error)?.message ?? error)})`)
        return
      }
      // Part of the answer is already out: completing the envelope keeps that text
      // rather than replacing it with a failure. The interruption is logged, never
      // claimed to be a clean end.
      res.end('data: [DONE]\n\n')
    })
```

</details>

**依据 10 · 源码核查**：[src/upstream.ts:932-957](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/upstream.ts#L932-L957)

普通迭代错误转abortFrames，是限制判断的反证。

<details>
<summary>查看原文（26行）</summary>

```text
    return new ReadableStream<Uint8Array>({
      pull: async controller => {
        try {
          while (queue.length === 0 && !encoderRef.terminal) {
            if (pending === undefined) {
              pending = await iterator.next()
            }
            const next = pending
            pending = undefined
            if (next.done) {
              queue.push(...encoderRef.finishFallback())
              break
            }
            queue.push(...encoderRef.start(), ...encoderRef.frames(next.value))
          }
        } catch (error: unknown) {
          const message = error instanceof LlmError ? error.failure.message : String(error)
          const code = error instanceof LlmError ? error.failure.code : 'TRANSPORT'
          queue = encoderRef.abortFrames(message, code)
        }
        if (queue.length > 0) {
          controller.enqueue(toBytes(queue.shift()!))
          if (encoderRef.terminal && queue.length === 0) controller.close()
          return
        }
        controller.close()
```

</details>

**依据 11 · 源码核查**：[src/adapter.ts:145-169](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/adapter.ts#L145-L169)

推理声明优先且probe验证限定。

<details>
<summary>查看原文（25行）</summary>

```text
 */
export function reasoningFields(
  info: QoderModelInfo,
  observed?: QoderProbeRecord,
): { reasoning: boolean; thinkingLevelMap?: ThinkingLevelMap } {
  const reasoning = info.reasoning
  if (reasoning === undefined || reasoning.supports !== true) {
    // Not a reasoning model: pi-ai reads a falsy `reasoning` as "off only".
    return { reasoning: false }
  }
  const declared = reasoning.supportedEfforts
  const efforts = declared !== undefined && declared.length > 0
    ? declared
    // Only a validating observation may supply a set, and only for rows the
    // upstream left undeclared.
    : observed?.validation === 'validating' && observed.efforts.length > 0
      ? observed.efforts
      : undefined
  if (efforts === undefined) {
    // Undeclared and unobserved (or observed as non-validating): no thinking
    // control, and no `reasoning_effort` on the wire.
    return { reasoning: false }
  }
  const map: Record<ModelThinkingLevel, string | null> = {
    // Probing never grants `off`; only an explicit declaration does.
```

</details>

**依据 12 · 源码核查**：[src/probe-service.ts:87-128](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/probe-service.ts#L87-L128)

探测同意门槛、串行和账号捕获。

<details>
<summary>查看原文（42行）</summary>

```text
   * The authenticated manual route supplies one-request consent after UI
   * confirmation; other callers must pass the configured consent gate. Explicit
   * requests bypass historical results but share an ongoing run.
   */
  async probe(modelId: string, manualConsent = false): Promise<QoderProbeStatus> {
    if (!manualConsent && !this.options.consent()) {
      return { state: 'unavailable', reason: 'probing is not authorized' }
    }
    const info = this.options.catalog.current().find(model => model.id === modelId)
    if (info === undefined) return { state: 'unavailable', reason: `unknown model: ${modelId}` }
    const account = this.options.account()
    if (account === undefined) return { state: 'unavailable', reason: 'no Qoder credential' }
    const pendingKey = JSON.stringify([account, modelId])
    const pending = this.pending.get(pendingKey)
    if (pending !== undefined) return pending

    const run = this.queue.then(async (): Promise<QoderProbeStatus> => {
      // Re-read inside the queue: an earlier sweep may have changed the catalog
      // or already answered this model.
      const current = this.options.catalog.current().find(model => model.id === modelId)
      if (current === undefined) return { state: 'unavailable', reason: `unknown model: ${modelId}` }
      if (!manualConsent && !this.options.consent()) {
        return { state: 'unavailable', reason: 'probing is not authorized' }
      }
      if (current.reasoning?.supports !== true || (current.reasoning.supportedEfforts?.length ?? 0) > 0) {
        return { state: 'unavailable', reason: 'model does not need detection' }
      }
      const cached = this.recordFor(modelId)
      if (!manualConsent && cached !== undefined && cached.validation !== 'unknown') {
        return { state: 'ok', validation: cached.validation, efforts: cached.efforts, requests: 0 }
      }

      // The account this sweep runs for. Captured before the requests and
      // re-checked before write-back: a probe can outlive its account, and storing
      // afterwards would resurrect the previous account's answer.
      const activeAccount = this.options.account()
      if (activeAccount !== account) return { state: 'unavailable', reason: 'account changed before detection' }
      const credential = await this.options.credentials.current()
      if (credential === undefined) return { state: 'unavailable', reason: 'no Qoder credential' }

      const send = this.options.send === undefined
        ? (effort: string | undefined, signal: AbortSignal) =>
```

</details>

**依据 13 · 源码核查**：[src/probe-service.ts:134-151](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/probe-service.ts#L134-L151)

探测后账号变更即丢弃结果。

<details>
<summary>查看原文（18行）</summary>

```text
        const outcome = await probeModel({
          send,
          ...this.options.sentinel === undefined ? {} : { sentinel: this.options.sentinel },
        })
        // The account may have changed while the requests were in flight. Drop
        // the observation rather than attribute it to whoever is signed in now.
        if (this.options.account() !== account) {
          return { state: 'unavailable', reason: 'account changed during detection' }
        }
        const record = this.options.store.record(
          fingerprintModel(current),
          outcome.validation,
          outcome.efforts,
          account,
        )
        this.options.store.set(modelId, record)
        if (outcome.validation === 'unknown') {
          return { state: 'unavailable', reason: outcome.reason }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用、维护、计费与退出的负担如何判断？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次需要自己的Qoder账号、与区域相符的PAT以及兼容DSH/Node；Web/Desktop用卡片，终端可用CLI。配置和自有凭据位于profile数据目录，无法确定profile时按路径策略回退，显式环境目录可覆盖。用户应先核对实际数据路径、区域和活动账号，备份现有设置，并避免把PAT贴进对话或仓库。

持续使用承担非官方接口变更、订阅/额度、排队和宿主peer升级维护；模型目录显示live/saved/fallback和倍率不证明所选模型现在可用或实际收费。adapter的NO_COST全零明确源于无法从订阅知道逐token价格，只是给宿主的占位元数据，不能被研究转述为免费、零成本或与API账单可直接比较。每日签到和100 Credits为作者功能/活动声明，本轮不验证当前活动、到达或账户规则；探测和失败重试可能消耗额度。

恢复时先确认错误属于凭证、限流、额度、网络还是中途流错误，再查真实会话输出和账户记录，不因本地错误就假定没有扣费。切账号等当前请求结束后再做；saved目录能维持显示，但不应拿它判断账户权限已经恢复。停止时先禁用provider/插件和后台签到，等待或核查未完成调用，移除保存文件与相应环境变量，再在上游按需要撤销PAT。插件停用清理timer和shim，不会退回已消耗额度或撤销已发请求。

当前建议观察，暂不推荐将其用于必须完整且可审计的生产任务。决定升级为小范围试用前，最有价值的是隔离profile上的双区身份、额度变化、限流建议、正常/损坏工具和部分流中断验证。若账号来源无法确定、接口持续拒绝、短答被误作完成或切换后结果归属不清，应退回Qoder官方产品或已有已验证的DSH供应商。无本轮费用、合格率和耗时记录，无法给单位合格任务成本。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:15-24](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/package.json#L15-L24)

明确Node/DSH版本与CLI。

<details>
<summary>查看原文（10行）</summary>

```text
  "type": "module",
  "engines": {
    "dsh": ">=0.2.1-rc.1",
    "node": "^22.19.0 || >=24.0.0"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "bin": {
    "dsh-qoder-connect": "lib/bin.js"
  },
```

</details>

**依据 2 · 作者声明**：[README.md:86-106](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/README.md#L86-L106)

作者安装/profile与环境说明。

<details>
<summary>查看原文（21行）</summary>

````text
- Node.js `^22.19.0 || >=24.0.0`（`package.json` engines）；
- 你自己的 Qoder 账号，以及至少一枚个人访问令牌。

```sh
# 从 GitHub 安装（推荐）
dsh plugin --profile web add github:masknull/dsh-qoder-connect
# 或从 npm 安装
dsh plugin --profile web add dsh-qoder-connect
```

按你使用的 profile 换 `--profile` 的值（`web` / `desktop` / `tui`，如 `dsh plugin --profile desktop add dsh-qoder-connect`）。装到哪个 profile，数据就落在哪个 profile 目录里，web / desktop / tui 各自独立。没有浏览器卡片的终端环境（TUI）下依旧可用 CLI 保存 PAT 并驱动模型；设置卡片与侧栏额度卡需要 Web/Desktop 界面。

> **DSH 低于 `0.2.1-rc.1`？** 请改用最后一个支持 0.1.7 线的版本 **[v0.2.5](https://github.com/masknull/dsh-qoder-connect/releases/tag/v0.2.5)**（要求 DSH ≥ `0.1.7-rc.1`）：
>
> ```sh
> # GitHub（推荐，指定 tag）
> dsh plugin --profile web add github:masknull/dsh-qoder-connect#v0.2.5
> # 或从 npm 安装
> dsh plugin --profile web add dsh-qoder-connect@0.2.5
> ```
>
````

</details>

**依据 3 · 源码核查**：[src/adapter.ts:70-75](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/adapter.ts#L70-L75)

NO_COST是订阅无法按token计价的占位，不是免费证据。

```text

/** No per-token pricing is knowable for a subscription quota; report zero. */
const NO_COST = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } as const

/**
 * The suffix appended to a model's display name so its billing rate is visible.
```

**依据 4 · 源码核查**：[src/variants.ts:55-87](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/variants.ts#L55-L87)

区域与独立凭据/目录路径的固定描述。

<details>
<summary>查看原文（33行）</summary>

```text
  {
    id: 'qoder',
    displayName: 'Qoder',
    appName: 'Qoder',
    region: 'china',
    ownFilename: '.qoder-auth.json',
    probeFilename: '.qoder-probe.json',
    catalogFilename: '.qoder-catalog.json',
    statusPath: QODER_STATUS_PATH,
    probePath: QODER_PROBE_PATH,
    authPath: QODER_AUTH_PATH,
  },
  {
    id: 'qoder-global',
    displayName: 'Qoder Global',
    appName: 'Qoder Global',
    region: 'global',
    ownFilename: '.qoder-global-auth.json',
    probeFilename: '.qoder-global-probe.json',
    catalogFilename: '.qoder-global-catalog.json',
    statusPath: QODER_GLOBAL_STATUS_PATH,
    probePath: QODER_GLOBAL_PROBE_PATH,
    authPath: QODER_GLOBAL_AUTH_PATH,
  },
]

/** The China variant; the plugin's default and compatibility anchor. */
export const CHINA_VARIANT: QoderVariant = QODER_VARIANTS[0]!

/** The international variant. */
export const GLOBAL_VARIANT: QoderVariant = QODER_VARIANTS[1]!

/** Look up a variant by provider id. */
```

</details>

**依据 5 · 源码核查**：[src/auth.ts:197-215](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/auth.ts#L197-L215)

退出须包括环境变量回退来源。

<details>
<summary>查看原文（19行）</summary>

```text
  async current(): Promise<QoderCredential | undefined> {
    const stored = await this.readOwn()
    if (stored !== undefined && stored.entries.length > 0) {
      const entry = stored.entries.find(candidate => candidate.id === stored.activeId) ?? stored.entries[0]!
      return {
        id: entry.id,
        pat: entry.pat,
        region: entry.region,
        ...entry.savedAtMs === undefined ? {} : { savedAtMs: entry.savedAtMs },
        ...entry.label === undefined ? {} : { label: entry.label },
        // A file this store wrote came from the card or the CLI; `source` is not
        // persisted because "card vs cli" only records who typed the command.
        source: 'card',
      }
    }
    return this.fromEnvironment()
  }

  /**
```

</details>

**依据 6 · 源码核查**：[src/index.ts:1951-1959](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/index.ts#L1951-L1959)

停用清理签到和interval等本地状态。

```text
  ctx.effect(() => () => {
    stopped = true
    checkInScheduler.dispose()
    for (const timer of timers) clearInterval(timer)
    timers.length = 0
    detach(ctx, clearHostHeartbeat(), 'host heartbeat cleanup')
  })

  /**
```

**依据 7 · 源码核查**：[src/shim.ts:529-543](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/shim.ts#L529-L543)

关闭shim先停止接受请求，随后硬限时关闭连接。

<details>
<summary>查看原文（15行）</summary>

```text
    close: () => new Promise<void>((resolve, reject) => {
      server.once('error', reject)
      // Graceful first: a settings write hot-reloads the plugin, and destroying an
      // in-flight answer makes the harness report a terminated connection far from
      // the cause. `close` stops accepting and drops idle sockets on its own; the
      // timer is the hard bound so disposal can never hang on a queue wait.
      const hardStop = setTimeout(() => server.closeAllConnections(), CLOSE_GRACE_MS)
      hardStop.unref?.()
      server.close(() => {
        clearTimeout(hardStop)
        resolve()
      })
    }),
  }
}
```

</details>

**依据 8 · 作者声明**：[README.md:195-202](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/README.md#L195-L202)

作者非官方接口及个人账户风险边界。

```text
- Qoder 传输层移植自 [mo-n/dsh-provider-qoder](https://github.com/mo-n/dsh-provider-qoder)（MIT）。

本项目按 [MIT](./LICENSE) 许可发布，双上游出处详见 [NOTICE](./NOTICE)。本仓库与 Qoder、DeepSeek 官方均无关联，是社区适配器——非官方实现。

## 免责声明

- Qoder 的接口来自上游仓库：上游随时可能改动、限流或封禁调用方，导致本插件部分或全部功能失效；届时可能只有等社区跟进，不保证兼容窗口。
- 本工具仅供个人学习研究，用于驱动**使用者自己的** Qoder 账号；请勿用于商业转售或任何超出个人合理使用的场景。使用即表示你自行承担账号被限制、额度损失、服务中断等一切后果，并遵守 Qoder 的服务条款。
```

#### 缺口

- 实时服务/条款/套餐、实际额度消耗、部分流完整性和退出副作用均未验证。
  **影响**：不能给安装或生产使用建议，也不能量化节省。
  **进一步探讨**：经明确授权后在隔离profile核对一组非敏感任务、失败样本与账户流水，并验证清文件及env后的状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证账号与请求身份绑定的可复核假设？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

已有可复用机制是对目录异步更新同时绑定账号身份和generation，切换即abort旧请求，并在落地时复核代数；探测也在返回时核对账号。它解决的是“旧结果覆盖新卡片”，不证明聊天、图片、额度和签到的全部动作都共享同一身份边界。真实请求捕获PAT的设计说明旧请求和新UI可以同时属于不同账号状态，用户若只看当前卡片可能误认归属。

据此提出未验证假设：在应用层为每个请求持有不含凭证的变体/账号指纹及配置代数，把开始、排队、接受、完成/中断与实际用量观察绑定到同一请求，并在切账号时明确显示仍在旧身份下运行的请求，可降低错误重试和额度归因混淆。它不应把PAT或可逆token编码写日志，也不能用模型目录generation替代服务端执行证明；额外代价是事件保存、隐私审查、处理无法核对的额度状态。

最小实验在两个授权测试账号与两个区域隔离的条件下，用受控的慢目录、运行中切账号、鉴权自愈、排队取消、图片上传失败及部分body中断，比较当前卡片与请求归属视图。观察错归账号、重复生成、用量无法对账和恢复动作。成功条件是每个结果可明确归属或标未知；任何用新卡片给旧请求记账、把本地abort当未扣费，或记录泄露凭证都否定该方案相关保证。本轮未运行，不计入已有贡献与评分。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1620-1658](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/index.ts#L1620-L1658)

目录身份/代数与旧请求abort是推导基础。

<details>
<summary>查看原文（39行）</summary>

```text
   */
  const adoptIdentity = (runtime: VariantRuntime, identity: string | undefined): void => {
    const id = runtime.variant.id
    const known = lastIdentities.get(id)
    // "Same identity" may only short-circuit when THIS runtime has already
    // adopted: a fresh catalog starts hidden, and every settings write
    // hot-reloads into exactly such a runtime — skipping the seeding and
    // `setVisible(true)` would leave the card's model list empty for good.
    if (known === identity && runtime.catalog.isVisible()) return
    const hadCredential = known !== undefined
    if (identity === undefined) lastIdentities.delete(id)
    else lastIdentities.set(id, identity)
    // Any change of identity invalidates in-flight work and the rendered catalog.
    // Probe records stay: they are keyed by account and filtered on read.
    runtime.catalogGeneration += 1
    runtime.inflightFetch?.controller.abort()
    runtime.inflightFetch = undefined
    if (hadCredential && known !== identity) {
      runtime.invalidate()
    }
    if (identity === undefined) {
      // Signed out: hide the group and drop the models, and forget this account's
      // saved catalog — it is that account's data, keyed by identity.
      if (known !== undefined) runtime.savedCatalogs.delete(known)
      runtime.catalog.set(runtime.fallback)
      runtime.catalogSource = 'fallback'
      runtime.catalogFetchedAtMs = undefined
      runtime.catalogError = undefined
      if (runtime.catalog.setVisible(false)) runtime.invalidate()
      return
    }
    // Serve this account's best-known catalog until a fetch lands: the saved one is
    // what this account was actually served, the roster only a one-off snapshot.
    // Covers a switch and a restart alike.
    const saved = runtime.savedCatalogs.get(identity)
    if (saved !== undefined) {
      runtime.catalog.set([...saved.models])
      runtime.catalogSource = 'saved'
      runtime.catalogFetchedAtMs = saved.fetchedAtMs
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1997-2024](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/index.ts#L1997-L2024)

结果落地检查代数，限制旧目录覆盖。

<details>
<summary>查看原文（28行）</summary>

```text
        }
      } catch (error: unknown) {
        // Report only if this attempt is still the current one: a superseded
        // attempt's failure must not overwrite the newer state.
        if (stopped || runtime.catalogGeneration !== generation) return
        runtime.lastFetchAtMs = Date.now()
        runtime.catalogError = error instanceof Error ? error.message.slice(0, 300) : String(error)
        ctx.logger.warn(
          `dsh-qoder-connect: ${runtime.variant.displayName} catalog unavailable; serving the fallback list`,
          error,
        )
        runtime.invalidate()
        return
      }
      if (stopped || runtime.catalogGeneration !== generation) return
      runtime.lastFetchAtMs = Date.now()
      // Shared across fiber reloads so a re-applied plugin does not re-fetch.
      lastLiveFetchAt.set(identity, runtime.lastFetchAtMs)
      runtime.catalog.set([...models])
      runtime.catalogSource = 'live'
      runtime.catalogFetchedAtMs = runtime.client.lastCatalog?.fetchedAtMs ?? Date.now()
      runtime.catalogError = undefined
      // Remember it for this account, so a restart or a later failing fetch serves
      // it instead of the compiled-in snapshot. A persist failure is logged and
      // swallowed: `fetchCatalog` promises its callers that it never rejects.
      if (lastIdentities.get(runtime.variant.id) === identity) {
        try {
          runtime.savedCatalogs.set(identity, {
```

</details>

**依据 3 · 源码核查**：[src/qoder/transport/default-transport.ts:224-242](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/qoder/transport/default-transport.ts#L224-L242)

generate局部捕获PAT，表明请求与当前卡片可有时间差。

<details>
<summary>查看原文（19行）</summary>

```text
    if (options.signal?.aborted) throw aborted('Request was aborted prior to generation.')

    // Validate before any provider I/O, so an unusable request never consumes a subscription.
    validateQoderRequestShape(options, model)
    // Credentials, which the center image exchange must be able to sign with.
    const pat = await this.requirePat(options.signal)
    const credentials = await this.auth.getCredentials(pat, options.signal)
    // Read attachments, publish images, and assemble wire messages.
    const messages = await translateQoderMessages(options, this.attachments, {
      uploader: this.imageUploader,
      credentials,
      preserveThinking: this.preserveThinking,
    })
    // Image publication may have refreshed a rejected job token, so re-read the
    // credential that actually signs the chat.
    const chatCredentials = await this.auth.getCredentials(pat, options.signal)
    // Track whether any chunk was yielded to the consumer across this request.
    // If output was already produced mid-stream before an error (e.g. 401 mid-flight),
    // replaying the whole request would emit duplicated content to the user.
```

</details>

**依据 4 · 源码核查**：[src/probe-service.ts:134-151](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/probe-service.ts#L134-L151)

探测落地核对账号而不归给现活动账号。

<details>
<summary>查看原文（18行）</summary>

```text
        const outcome = await probeModel({
          send,
          ...this.options.sentinel === undefined ? {} : { sentinel: this.options.sentinel },
        })
        // The account may have changed while the requests were in flight. Drop
        // the observation rather than attribute it to whoever is signed in now.
        if (this.options.account() !== account) {
          return { state: 'unavailable', reason: 'account changed during detection' }
        }
        const record = this.options.store.record(
          fingerprintModel(current),
          outcome.validation,
          outcome.efforts,
          account,
        )
        this.options.store.set(modelId, record)
        if (outcome.validation === 'unknown') {
          return { state: 'unavailable', reason: outcome.reason }
```

</details>

**依据 5 · 源码核查**：[src/shim.ts:493-521](https://github.com/masknull/dsh-qoder-connect/blob/2db6c5b4a06fe1d35d83602f50f79898e3f05571/src/shim.ts#L493-L521)

部分流I/O中断需要独立状态而非只看封包。

<details>
<summary>查看原文（29行）</summary>

```text
    const body = Readable.fromWeb(result.response.body as Parameters<typeof Readable.fromWeb>[0])
    body.on('data', (chunk: Buffer) => {
      forwardedChunks += 1
      // Real bytes are flowing: the keep-alive comments are no longer needed, and
      // from here on the body itself keeps the client's clock alive. Until the
      // first one arrives they stay, so a model that thinks for minutes before its
      // first token does not look like a dead connection.
      if (forwardedChunks === 1) stopHead()
      if (chunk.includes('[DONE]')) sawDone = true
    })
    body.on('end', stopHead)
    body.on('close', stopHead)
    body.on('error', (error: unknown) => {
      stopHead()
      logger?.warn('dsh-qoder-connect: upstream stream failed mid-flight', error)
      if (sawDone || !res.writable) return
      if (forwardedChunks === 0) {
        // Nothing reached the client, so this is not a truncated answer but a
        // failure that never started. Ending quietly would leave the harness to
        // explain it as EMPTY_RESPONSE; the in-band frame names the cause, and its
        // "ended without" wording keeps the classified code at TRANSPORT.
        writeStreamError(res, 'transport', `${providerId} upstream stream ended without any data (${String((error as Error)?.message ?? error)})`)
        return
      }
      // Part of the answer is already out: completing the envelope keeps that text
      // rather than replacing it with a failure. The interruption is logged, never
      // claimed to be a clean end.
      res.end('data: [DONE]\n\n')
    })
```

</details>

#### 缺口

- 请求归属视图是否降低错误重试及其隐私/存储负担未验证。
  **影响**：只能作有依据的未来假设，不升级当前账户对账或审计能力。
  **进一步探讨**：比较所列故障与切换场景的错归属、重复生成、未知用量和恢复投入。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
