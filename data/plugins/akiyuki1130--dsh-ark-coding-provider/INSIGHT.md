# dsh-ark-coding-provider

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c7a0240](https://github.com/Akiyuki1130/dsh-ark-coding-provider/tree/c7a02400397b15a8418736366d942e0382972246)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Akiyuki1130/dsh-ark-coding-provider)
<!-- END META -->

> **实现功能**：为DSH注册Ark Coding Plan模型路由，适配流式和工具消息，管理API Key/CLI多账户，并展示官方目录与套餐额度。

> **核心亮点**：把Coding Plan专用流式、错误轮换、账户HOME/凭据和控制面额度接成宿主provider，并在已yield后拒绝混账户续接；固定二进制安装降低桌面外部npm依赖。[Q02](#research-q02)、[Q08](#research-q08)

> **风险与缺陷**：静态能力表与额度不是本轮模型或账单实测；HOME约束为词法，冷却为排序；直接下载的实际字节限额在完整缓冲后判断，不能当流式内存硬上限。[Q03](#research-q03)、[Q04](#research-q04)、[Q08](#research-q08)

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
  - [Q01 · 哪类用户需要这个提供商，成功结果是什么？](#detail-section-11)
  - [Q02 · 模型请求和多账户切换怎么实现？](#detail-section-12)
  - [Q03 · CLI登录、账户隔离与取消有哪些真实约束？](#detail-section-13)
  - [Q04 · 模型能力、额度和流式超时是否可当实测事实？](#detail-section-14)
  - [Q05 · 启动与使用步骤是什么？](#detail-section-15)
  - [Q06 · 首次持续失败成本与效果是什么？](#detail-section-16)
  - [Q07 · 推荐与可继续研究的改进是什么？](#detail-section-17)
  - [Q08 · 直接二进制安装怎样降低桌面端依赖，资源保护是否在读取前生效？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有Ark Coding Plan订阅及密钥/SSO权限的DSH用户，将专用route、流式工具和控制面目录/额度接入宿主；不同认证类型覆盖不同能力。

通用OpenAI兼容provider加门户额度是直接替代，额外价值要看具体工具SSE、账号切换与控制面维护需求；同任务、同账号、同套餐比较请求轨迹、合格输出和恢复成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 模型route | Ark聊天/SSE/工具消息 | 固定能力表，当前服务能力未独立重测 |
| 多账号 | API Key/CLI按序轮换 | 已yield不轮换，冷却非排除 |
| CLI登录 | 隔离HOME与最小环境 | 物理父路径与跨平台清理需核 |
| 目录/额度 | 官方CLI/签名控制面查询 | 有来源/时间，不是财务账单 |
| 设置/卡片 | 密钥引用/显示策略 | 依宿主凭据/远程权限与可信endpoint |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 相容DSH llm/credentials/launchEnvironment/Typert | 必需 | provider与设置接口 | 声明rc.2为作者目标非本轮验收 |
| Ark Coding Plan订阅/API Key | 聊天必需 | 数据面模型请求 | 普通非套餐key可能拒绝 |
| arkcli与浏览器SSO | 仅CLI账户 | 官方目录/真实套餐额度 | 可显式安装，API Key模式不等于控制面登录 |
| 按宿主规则解析的可写状态目录 | CLI必需 | DSH_HOME或默认~/.dsh下的各账户HOME/安装目录 | 无物理沙箱保证 |
| AK/SK与最小ark读权限 | 另一路额度可选 | 控制面签名请求 | 需独立管理，不自动从API key推导 |
| 可信apiBase/凭据服务与模型披露许可 | 使用前提 | 发Bearer/会话内容 | 可配置endpoint需读者核目标 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 固定安装 | 核宿主代际和包/CLI版本 | 不把作者test当当前运行通过 |
| 配账户 | 一账户一种认证，核ID/HOME | 重复ID/派生缓存需对照 |
| 登录 | 如需CLI，明确安装/SSO并核取消 | 不使用他人登录态或改宿主HOME |
| 小请求 | 先文本，再工具/图像所需能力 | route/账户/最终chunk可追踪 |
| 查看额度 | 核来源/账号/updatedAt/reset | 不把缺数据/百分比当账单 |
| 失败 | 核分类、是否已yield和轮换 | 不把冷却当不请求；已yield不另账号接续 |
| 维护 | 更换key/目录后核cache与进程 | 清理凭据不等于撤销平台key |

本轮只读源码，未安装CLI、登录或调用模型/控制面。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 已有套餐/密钥、可选CLI存储/安装网络 | 宿主/provider配置、CLI/SSO与权限核对 | 订阅价格和配置时间未核，不填金额 |
| 持续使用 | 模型上下文/工具/图像、额度/目录刷新与轮换网络 | 账户/额度与能力变化维护 | 实际消耗依套餐规则，轮换失败也有网络开销；价格/总usage未知 |
| 失败恢复 | 重试完整任务可能再耗模型额度与网络 | 检AUTH/QUOTA、SSE断流、CLI进程/缓存/登录 | 已yield不回退避免混答，仍需用户重试；恢复时间/费用未知 |



#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 接通套餐模型 | 专用route/静态能力/流式映射 | 不证明模型任务质量 |
| 更稳失败处理 | 仅可换码且yield后不混答，idle错误 | 不保证平台受理/额度计量正确 |
| 多账户管理 | 隔离HOME/缓存身份/最小env | 非OS沙箱，物理父链接需核 |
| 额度可见 | CLI/控制面归一与时间 | 不是金额节省证明 |

作者有离线测试/真机问题记录，但本轮不执行。可控输出、固定CLI版本与错误显式化有利于恢复，仍需看完整任务总usage/失败时间，而非12模型数量或绿色quota卡片。

> **思考**：静态能力表与额度不是本轮模型或账单实测；HOME约束为词法，冷却为排序；直接下载的实际字节限额在完整缓冲后判断，不能当流式内存硬上限。[Q03](#research-q03)、[Q04](#research-q04)、[Q08](#research-q08)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把Coding Plan专用流式、错误轮换、账户HOME/凭据和控制面额度接成宿主provider，并在已yield后拒绝混账户续接；固定二进制安装降低桌面外部npm依赖。[Q02](#research-q02)、[Q08](#research-q08)

把Coding Plan专用流式、错误轮换、账户HOME/凭据和控制面额度接成宿主provider，并在已yield后拒绝混账户续接；固定二进制安装降低桌面外部npm依赖。[Q02](#research-q02)、[Q08](#research-q08)

明确已yield后禁止跨账号续接、配置身份绑定缓存、最小子进程环境值得借鉴；当前Windows USERPROFILE和进程树处理及哈希后rename改善接线，但物理目录和下载内存边界仍需核。[Q03](#research-q03)、[Q08](#research-q08)

<a id="detail-section-5"></a>

### 1.4 主要限制

静态能力表与额度不是本轮模型或账单实测；HOME约束为词法，冷却为排序；直接下载的实际字节限额在完整缓冲后判断，不能当流式内存硬上限。[Q03](#research-q03)、[Q04](#research-q04)、[Q08](#research-q08)

<a id="detail-section-6"></a>

### 1.5 使用建议

有试用，已有订阅用户先可信本机单API Key小请求，确需额度/多账号再核CLI HOME/取消与身份。详见[Q07](#research-q07)。

采用建议：有试用，已有订阅用户先可信本机单API Key小请求，确需额度/多账号再核CLI HOME/取消与身份。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。专用流式/轮换与最小CLI环境明确，HOME物理范围、能力/额度实时口径和body/进程平台边界需验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、accounts.js、arkcli.js、usage.js、models.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：五Host模块关键stream/账号/CLI/额度/模型表和包声明；client只登记界面能力，非全6.7k行审计。不安装CLI/SSO/付费请求或运行测试。
- 下一步：按 [Q07](#research-q07) 核首chunk前后错误、账号变更与SSO取消，按 [Q08](#research-q08) 检下载校验、版本探针和流式字节预算原型；不运行付费请求。

**分析版本**

- **仓库**：[Akiyuki1130/dsh-ark-coding-provider](https://github.com/Akiyuki1130/dsh-ark-coding-provider)
- **版本号**：0.5.2（[固定提交 c7a0240](https://github.com/Akiyuki1130/dsh-ark-coding-provider/tree/c7a02400397b15a8418736366d942e0382972246)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索账户/端点/能力版本与请求阶段/终止usage收据、物理HOME和body预算，比较错身份/重复请求及元数据成本；未实现。详见[Q07](#research-q07)。

按 [Q07](#research-q07) 核首chunk前后错误、账号变更与SSO取消，按 [Q08](#research-q08) 检下载校验、版本探针和流式字节预算原型；不运行付费请求。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 7223 | 5123 | 1741 | — |
| .md | source | 1 | 465 | — | — | 8413 |
| .mjs | test | 7 | 4913 | 4065 | 637 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Akiyuki1130/dsh-ark-coding-provider/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本核Ark Coding Plan模型/流式/多账户/CLI/额度接线，区分作者容量实测与本轮源码、会话身份和资源预算。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类用户需要这个提供商，成功结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向已有火山方舟Coding Plan订阅和密钥/SSO权限的DSH用户。插件注册ark-coding路由，把兼容OpenAI的聊天/SSE、模型目录、CLI账户与额度界面接到宿主，API Key账户用于聊天，CLI账户还可读套餐/官方目录。不是免费模型、官方产品或替用户购买订阅。

合格结果必须路由/模型/账户正确、流式工具调用和最终状态完整、取消/错误分类清楚，额度标时间与来源。目录上的context/max-output/vision/reasoning字段是适配器声明，不等于当前平台每个版本实测能力，API Key能聊天也不证明能读控制面额度。

基线是手配通用OpenAI兼容provider再单独看门户额度。增量在专用模型能力/流式修补、多账户与CLI登录/配额接线；实际生成质量、订阅限制和费用需用户与平台核对，源码不提供这些商业承诺。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-10](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/README.md#L3-L10)

社区定位/订阅前提。

```text
**火山方舟 Coding Plan** 的 DeepSeek Harness LLM 提供商插件（非官方社区集成）。

仿照 [`@mars-sea/dsh-commandcode-provider`](https://github.com/Mars-Sea/dsh-commandcode-provider)
的形态做的：注册一个提供商路由、在 Models 页挂一张属于自己的卡片、在设置里开一个
同名分区，把模型目录、容量事实和密钥管理都放在那里。

> 这是社区集成，不是火山引擎官方产品。你需要自己的火山方舟账号与 Coding Plan 订阅，
> 并遵守火山引擎的服务条款。
```

**依据 2 · 作者声明**：[README.md:20-30](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/README.md#L20-L30)

路由模型/设置卡片作者功能。

<details>
<summary>查看原文（11行）</summary>

```text

- **一个提供商路由 `ark-coding`** —— 直接对着 `<span>https://ark.cn-beijing.volces.com/api/coding/v3</span>`
  的 OpenAI 兼容端点说话，`/chat/completions` + SSE 流式。
- **12 个模型，容量事实是实测出来的** —— 上下文窗口、单次输出上限、是否吃图、
  接受哪些 `reasoning_effort` 档位，全部逐项探过（见下表）。
- **设置页「设置 → 火山方舟」** —— 账户管理、登录向导、逐模型可见性、连接参数、上下文覆盖。
- **Models 页的提供商卡片** —— **只读**的账户现状：正在用哪个账户、额度来源、
  没配好该去哪。**插件贡献的这张卡片上没有密钥输入框、也没有「测试连接」按钮**；
  密钥在设置页的账户行里填。官方 Models 页自带的密钥编辑器（宿主渲染，插件管不着）
  写的是顶层 `ARK_CODING_API_KEY`，一个账户都没有时它会被当成兜底账户读进来
  （见「配置密钥」）。
```

</details>

**依据 3 · 源码核查**：[index.js:62-77](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/index.js#L62-L77)

provider/端点和超时默认。

<details>
<summary>查看原文（16行）</summary>

```text
export const PROVIDER = 'ark-coding'
/** 本插件的设置命名空间（也是 profile 里的条目 id）。 */
export const NS = 'llm-ark-coding'
export const name = 'llm-ark-coding'
export const inject = ['llm']

/** Coding Plan 的 OpenAI 兼容端点。 */
export const DEFAULT_API_BASE = 'https://ark.cn-beijing.volces.com/api/coding/v3'
export const DEFAULT_API_KEY_ENV = 'ARK_CODING_API_KEY'
export const DISPLAY_NAME = '火山方舟 Coding Plan'

/** 未配置时单次请求的 max_tokens 上限；会被逐模型输出上限夹住。 */
export const DEFAULT_MAX_OUTPUT_TOKENS = 65536
/** 首字节超时与流空闲超时。Coding Plan 会出现很长的思考，默认给足 5 分钟。 */
export const DEFAULT_REQUEST_TIMEOUT_MS = 300_000
export const DEFAULT_STREAM_IDLE_TIMEOUT_MS = 300_000
```

</details>

**依据 4 · 作者声明**：[accounts.js:5-15](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/accounts.js#L5-L15)

API key/CLI两类型作者设计。

<details>
<summary>查看原文（11行）</summary>

```text
 * 换另一个账号的 key 就还能继续。所以适配器在发请求前按顺序解析可用账号，
 * 遇到「这个账号被限流/额度用尽/鉴权失败」就在**还没吐出任何内容之前**换下一个。
 *
 * 账户有两种来源，靠 `type` 区分：
 *
 * - `apikey`：用户直接粘一把方舟 API Key。它能打数据面（`/api/coding/v3`），
 *   但控制面（套餐额度、官方模型目录）不认 API Key —— 那两样只有 SSO 身份能查。
 * - `cli`：用户在设置页走 arkcli 的 SSO 登录。登录后在每个账户**独立的 HOME**
 *   下存一份 arkcli 身份，于是同一个进程里可以同时持有多个账号，互不打架
 *   （arkcli 的状态目录写死在 `$HOME/.arkcli`，没有环境变量可以改，所以隔离
 *   只能靠换 HOME）。这种账户既能取到 key 用于聊天，也能查套餐额度和模型目录。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型请求和多账户切换怎么实现？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

适配器先解析connection和静态model事实，prepare把宿主消息/工具/图像/推理参数转请求，再resolveAccounts取得可用key。每account独立streamOnce，POST apiBase/chat/completions带Bearer，SSE逐chunk映射宿主StreamChunk，出口剔undefined键以满足JSON序列化。

仅AUTH/INVALID_CREDENTIAL/RATE_LIMIT/QUOTA/ACCOUNT_QUOTA可轮换，已yield任何chunk后即停止轮换，避免用户收到一半旧账户回答再混新回答。取消也原样抛。这个明确时序边界比无条件重试保守，但“任何chunk”包括开始/用量等是否算首内容依解析器，可能比可见首字更早阻止回退。

账户冷却是排序而非排除，preferredId无论冷却都rank0，所有冷却仍会尝试；不能把冷却解释为严格不请求或总预算保护。贡献在特定Coding Plan协议/能力事实、错误分类和宿主流式接线，不是新推理算法。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:798-844](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/index.js#L798-L844)

resolve/轮换/已yield及取消边界。

<details>
<summary>查看原文（47行）</summary>

```text
  async *stream(options) {
    const connection = this.connection()
    const model = modelById(options.model)
    const accounts = await this.resolveAccounts(connection)
    if (accounts.length === 0) {
      // 现在没有"默认账户"了，所以这里要区分两种空：压根没有账户 vs 有账户但都没配好。
      // 顺带把"怎么修"说到具体动作上，而不是丢一句"没有 API key"。
      const exists = connection.accounts.length > 0
      throw new LlmError(
        exists
          ? `${DISPLAY_NAME} 的账户都还没有可用的 API key：去「设置 → 火山方舟」，`
            + '给 API Key 账户填上密钥，或给 CLI 账户完成登录。'
          : `${DISPLAY_NAME} 还没有任何账户：去「设置 → 火山方舟」点「添加账户」，`
            + '选「CLI 登录」能顺带拿到真实套餐额度，选「API Key」则只够聊天。',
        'MISSING_CREDENTIAL',
      )
    }

    const prepared = await this.prepare(options, connection, model)
    const marks = this.deps.marks
    let lastError

    for (const account of accounts) {
      const state = { emitted: false }
      try {
        for await (const chunk of this.streamOnce(options, connection, model, prepared, account)) {
          state.emitted = true
          yield chunk
        }
        marks?.clear(account.id)
        return
      } catch (error) {
        if (options.signal?.aborted === true) throw error
        const code = error instanceof LlmError ? error.code : undefined
        const reason = rotationReasonFor(code)
        // 已经吐过内容、或者这个失败换账号也没用 → 原样抛出去。
        if (reason === undefined || state.emitted) throw error
        const cooldown = retryAfterMsOf(error?.failure) ?? cooldownFor(reason)
        marks?.mark(account.id, reason, Date.now() + cooldown)
        lastError = error
        this.deps.logger?.warn?.(
          `${NS}: 账户「${account.label}」${reason}（${code}），冷却 ${Math.round(cooldown / 1000)}s 后重试，先切到下一个账户`,
        )
      }
    }

    throw lastError ?? new LlmError(`${DISPLAY_NAME} 的所有账户都不可用。`, 'QUOTA')
```

</details>

**依据 2 · 源码核查**：[index.js:859-869](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/index.js#L859-L869)

实际模型POST。

<details>
<summary>查看原文（11行）</summary>

```text
      response = await fetch(`${connection.apiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'text/event-stream',
          authorization: `Bearer ${account.key}`,
          ...attributionHeaders(),
        },
        body: JSON.stringify(prepared.body),
        signal: controller.signal,
      })
```

</details>

**依据 3 · 源码核查**：[index.js:916-925](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/index.js#L916-L925)

出口JSON可表示清理。

<details>
<summary>查看原文（10行）</summary>

```text
  /**
   * 解析 SSE 流并产出 StreamChunk。
   *
   * 这里只做出口兜底：真正的解析在 `parseStreamRaw`，本方法保证交出去的每一块都
   * 是"无损 JSON"（见 `withoutUndefined`）。
   */
  async *parseStream(response, connection, options) {
    for await (const chunk of this.parseStreamRaw(response, connection, options)) {
      yield withoutUndefined(chunk)
    }
```

</details>

**依据 4 · 源码核查**：[accounts.js:205-235](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/accounts.js#L205-L235)

可轮换码与冷却排序/优先账户。

<details>
<summary>查看原文（31行）</summary>

```text
export function rotationReasonFor(code) {
  if (code === 'AUTH' || code === 'INVALID_CREDENTIAL') return 'invalid-credential'
  if (code === 'RATE_LIMIT') return 'rate-limit'
  if (code === 'QUOTA' || code === 'ACCOUNT_QUOTA') return 'quota'
  return undefined
}

/** 一个原因对应的冷却时长。 */
export function cooldownFor(reason) {
  return reason === 'invalid-credential' ? AUTH_COOLDOWN_MS : DEFAULT_COOLDOWN_MS
}

/**
 * 排一次请求的账号顺序。
 *
 * 顺序：明确指定的账号 → 其余账号。冷却中的账号排到最后（而不是直接剔除），
 * 这样「所有账号都在冷却」时仍会尝试，而不是直接报「没有可用账号」。
 *
 * @param accounts - 已解析的账号（含 key）。
 * @param marks - 标记表。
 * @param preferredId - 配置里指定的当前账号 id，可选。
 * @returns 有序的可用账号。
 */
export function orderAccounts(accounts, marks, preferredId) {
  const usable = accounts.filter((account) => account.key !== undefined)
  const rank = (account) => {
    if (account.id === preferredId) return 0
    if (marks.usable(account.id)) return 1
    return 2
  }
  return [...usable].sort((left, right) => rank(left) - rank(right))
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · CLI登录、账户隔离与取消有哪些真实约束？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

CLI按账户派生HOME，配置显式home只接受插件状态根下的resolve路径；ID白名单清洗，重复清洗ID只保第一个，避免共用HOME/key缓存。派生cache key包含id/type/home/ref，配置改变可自然失效。buildChildEnv用最小白名单和明确HOME，避免带宿主登录态/密钥到另一账户，这些是具体隔离措施。

homeForAccount只词法resolve/prefix，未核已有目录/父目录realpath；状态根内父链接指向外部时物理写入不由该判断保证。重复ID静默丢后来者、冷却/偏好也按ID，用户应核配置结果而非仅看原输入。HOME分离不构成OS账户/进程沙箱。

当前buildChildEnv在Windows同时设置USERPROFILE与HOME，补齐Go CLI的家目录语义；Windows .cmd经cmd.exe转义启动，终止用taskkill /T /F并在失败后退child.kill，POSIX用独立进程组。目标是减少账号串用与孙进程残留，实际SSO/平台行为仍需对应操作系统验收。

CLI安装当前优先直接取固定1.0.39平台二进制，校验嵌入sha256、在唯一临时文件运行--version后rename；只有下载失败或用户指定其他版本才走存在的npm。不能沿用“始终npm安装”描述，固定版本和可执行探针是实际工程防护。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1590-1638](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/index.js#L1590-L1638)

home约束/缓存身份/失效。

<details>
<summary>查看原文（49行）</summary>

```text
  /**
   * 账户的 HOME：配置里写了就用写的，否则派生到 `<DSH_HOME>/ark-coding/accounts/<id>`。
   *
   * 显式 `home` 必须落在本插件状态根之下，理由：`accounts` 是 volatile（浏览器可写）
   * 字段，而它的 `home` 会被当成 **root 子进程的 HOME** —— arkcli 随后会在
   * `<HOME>/.arkcli/` 下写凭据、跑 `auth login`。账户 `id` 有白名单清洗，`home` 却是
   * 原样透传的，于是一次配置写入就能让 root 往任意目录写文件（`/etc`、`/root/.config`…）。
   * 运行时从来不需要自定义 HOME —— 多账户隔离靠的就是"每个账户一个派生目录"——
   * 所以越界的值直接拒绝，而不是悄悄接受。
   */
  const homeForAccount = (account) => {
    if (dshHome === undefined) throw new Error(NO_DSH_HOME)
    if (typeof account.home === 'string' && account.home !== '') {
      const root = arkcliStateRoot(dshHome)
      const resolved = resolvePath(account.home)
      if (resolved === root || resolved.startsWith(`${root}${pathSep}`)) return resolved
      throw new Error(`${NS}: 账户「${account.id}」的 home 必须位于 ${root} 之下，收到 ${account.home}。`)
    }
    return accountHomeDir(dshHome, account.id)
  }

  /** 按 id 找账户的 HOME（登录时账户可能还没写进配置，所以容忍找不到）。 */
  const homeForId = (accountId) => {
    const found = resolveConnection(live()).accounts.find((account) => account.id === accountId)
    return found === undefined ? homeForAccount({ id: accountId }) : homeForAccount(found)
  }

  /**
   * 派生缓存的键。
   *
   * **不能只用 `account.id`**：缓存的内容（API key、登录态、额度）取决于这个账户
   * 指向哪个 HOME / 什么类型 / 哪个凭据引用。用户删掉一个 CLI 账户再用同一个 id 新建
   * （或者改掉它的 `home`），旧键仍然命中，于是最长 10 分钟里继续拿**旧账户**的 key
   * 去发请求、额度和登录态也串台 —— 而删掉重建往往正是因为旧账户不该再用了。
   * 拼上这几个字段后，配置一变键就变，天然失效。id 经过白名单清洗，不含 `|`。
   */
  const cacheKeyOf = (account) => [
    account.id,
    account.type ?? '',
    account.home ?? '',
    account.ref ?? '',
  ].join('|')

  /** 清掉某个账户的所有派生缓存（登录成功/安装完成后必须调用）。 */
  const invalidateAccount = (accountId) => {
    if (accountId === undefined) {
      cliKeyCache.clear()
      cliStateCache.clear()
      planCache.clear()
```

</details>

**依据 2 · 源码核查**：[accounts.js:55-58](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/accounts.js#L55-L58)

ID清洗。

```text
export function sanitizeAccountId(raw, fallback = 'default') {
  const text = typeof raw === 'string' ? raw.trim() : ''
  const cleaned = text.replace(ID_SAFE, '_').replace(/^\.+/, '').slice(0, 64)
  return cleaned === '' ? fallback : cleaned
```

**依据 3 · 源码核查**：[accounts.js:131-139](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/accounts.js#L131-L139)

重复ID保首。

```text
  // 同一个 id 出现两次，两个账户就会共用同一个 HOME 与同一组派生缓存（额度/登录态
  // 串台、冷却互相影响）。手改配置很容易撞上，所以保留第一个、丢掉后来者。
  const seen = new Set()
  const accounts = []
  for (const account of mapped) {
    if (seen.has(account.id)) continue
    seen.add(account.id)
    accounts.push(account)
  }
```

**依据 4 · 源码核查**：[arkcli.js:408-555](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/arkcli.js#L408-L555)

最小子进程环境设计。

<details>
<summary>查看原文（148行）</summary>

```text
/**
 * 构造 arkcli 子进程用的最小环境。
 *
 * 白名单重建，**绝不继承** `ARK_API_KEY` / `ARK_PROFILE` / `ARK_BASE_URL` / `VOLC_*`
 * / `ARKCLI_ALLOW_HEADLESS_*`：这些一旦被继承，arkcli 就会把宿主自己的凭据与上下文
 * 当成"当前账号"，多账号隔离当场失效（而且宿主的 key 会被写进别的账号目录）。
 *
 * `HOME` 是必填的：arkcli 的状态目录是 `$HOME/.arkcli` 且无法用环境变量覆盖，
 * 少传 HOME 就等于在宿主的家目录里乱写。
 *
 * **Windows 上 `HOME` 是无效的**：Go 的 `os.UserHomeDir()` 只认 `%USERPROFILE%`。
 * 只设 HOME 的话，所有账户都会读写宿主的 `%USERPROFILE%\.arkcli`，多账户隔离
 * 表现成"登录一个、全部串台"。所以 Windows 还必须把 USERPROFILE 指到同一个目录，
 * 并保留 SystemRoot / ComSpec / PATHEXT / TEMP 这些系统变量——缺了它们，Go 程序
 * 起子进程、解析路径、写临时文件都会出怪问题。
 *
 * @param home - 该账号的 HOME（绝对路径）。
 * @param extra - 追加/覆盖的键，值为 undefined 的键会被跳过。
 * @param platform - 目标平台，默认 `process.platform`（测试可注入 win32）。
 * @throws 当 home 缺失或为空。
 */
export function buildChildEnv(home, extra, platform = process.platform) {
  if (typeof home !== 'string' || home === '') {
    throw new Error('必须显式给定 HOME：arkcli 把状态放在 $HOME/.arkcli 且没有环境变量可以覆盖，多账号隔离完全依赖它。')
  }
  const put = (target, key, value) => {
    if (value !== undefined) target[key] = value
  }
  const env = {}
  put(env, 'PATH', process.env.PATH)
  env.HOME = home
  // Windows：Go 取家目录只看 USERPROFILE（不看 HOME）。不设它 = 多账户全部串到宿主家目录。
  if (platform === 'win32') put(env, 'USERPROFILE', home)
  env.LANG = process.env.LANG ?? 'C.UTF-8'
  env.LC_ALL = process.env.LC_ALL ?? 'C.UTF-8'
  put(env, 'TMPDIR', process.env.TMPDIR ?? tmpdir())
  // Windows 的系统变量：缺 SystemRoot 时部分 Go 运行时会拿不到系统目录；
  // 缺 ComSpec/PATHEXT 时子进程无法再起 .exe/.cmd。
  if (platform === 'win32') {
    for (const key of ['SystemRoot', 'SystemDrive', 'windir', 'ComSpec', 'PATHEXT', 'NUMBER_OF_PROCESSORS', 'PROCESSOR_ARCHITECTURE', 'TEMP', 'TMP']) {
      put(env, key, process.env[key])
    }
  }
  env.NO_COLOR = '1'
  env.ARKCLI_NO_UPDATE_NOTIFIER = '1'
  env.ARKCLI_CALLER_TYPE = 'ai_agent'
  env.ARKCLI_CALLER_NAME = 'dsh-ark-coding-provider'
  for (const [key, value] of Object.entries(extra ?? {})) put(env, key, value)
  return env
}

// ---------------------------------------------------------------------------
// 子进程启动
// ---------------------------------------------------------------------------

/** cmd.exe 里需要引号或转义的字符（含元字符与百分号展开）。 */
const CMD_SPECIAL = /[\s"&|<>^()%!]/

/**
 * 转义一个参数，供 `cmd.exe /d /s /c` 使用。
 *
 * cmd 的引号规则和 POSIX 完全不同：没有反斜杠转义，双引号里 `&|<>^()` 不再生效，
 * 所以一律把带元字符的参数包进双引号。
 *
 * **两个已知边界**：①`%VAR%` 即使在双引号里也会展开，本函数不处理——Windows 路径
 * 里带 `%` 极罕见，而且直接下载的 `.exe`（主路径）根本不经过 cmd；②双引号本身在
 * cmd 里没有可靠转义，`""` 只是尽力而为（Windows 路径本来也不允许 `"`）。
 * 走到这里的只有 npm 兜底和 PATH 上已有的 `.cmd` 安装，参数都是普通词/路径。
 */
function escapeCmdArgument(argument) {
  if (argument === '') return '""'
  if (!CMD_SPECIAL.test(argument)) return argument
  // `"` 不是合法 Windows 路径字符；`""` 是 cmd 对字面引号的唯一近似写法。
  return `"${argument.replace(/"/g, '""')}"`
}

/**
 * 决定怎么启动一个可执行文件。
 *
 * POSIX 直接 `spawn(path, args)`；Windows 上 `.cmd/.bat` 不是有效的 PE，`CreateProcess`
 * 不能直接执行它（报 ENOENT / "不是有效的 Win32 应用程序"），必须包一层
 * `cmd.exe /d /s /c "<命令行>"`。返回的 `verbatim: true` 表示调用方要给 spawn 传
 * `windowsVerbatimArguments`——命令行已经自己拼好了，Node 再 quote 一次反而会把
 * cmd 看到的引号搞乱。
 *
 * @param target - 可执行文件路径（或 PATH 上的命令）。
 * @param args - 参数数组。
 * @param platform - 目标平台。
 * @param comspec - Windows 命令解释器，默认 `$ComSpec`。
 * @returns `{command, args, verbatim}`。
 */
export function spawnPlanFor(target, args, platform = process.platform, comspec = process.env.ComSpec) {
  if (platform !== 'win32' || !/\.(?:cmd|bat)$/i.test(target)) return { command: target, args, verbatim: false }
  const shell = typeof comspec === 'string' && comspec !== '' ? comspec : 'cmd.exe'
  const line = [escapeCmdArgument(target), ...args.map(escapeCmdArgument)].join(' ')
  // 整条命令包一层引号：`/s` 会剥掉最外层这一对，里面的引号原样留给 cmd。
  return { command: shell, args: ['/d', '/s', '/c', `"${line}"`], verbatim: true }
}

/**
 * 杀一个子进程**及其后代**。
 *
 * `node_modules/.bin/arkcli` 是个 node 包装脚本，它用 `execFileSync` 阻塞地去跑真正的
 * Go 二进制。**杀掉包装进程不会杀掉那个 Go 孙子进程**：实测 SIGKILL 掉包装之后，
 * Go 二进制被 init 收养继续活着（PPID=1），还占着回环端口和 `<HOME>/.arkcli` 下的
 * 锁文件 —— 也就是说"超时"并没有真的停下工作，反复超时还会累积 root 进程。
 *
 * 所以 POSIX 上子进程一律以 `detached: true` 起独立进程组，这里按**进程组**杀（负 pid）；
 * Windows 没有进程组信号，改用 `taskkill /T /F` 整棵树带走（直接下载安装的是单个
 * .exe，杀它本身也够；但 PATH 上 npm 全局装的 .cmd 仍有两层）。
 *
 * @param child - spawn 出来的子进程。
 * @param options.platform - 目标平台。
 * @param options.spawnSync - 同步进程工厂（taskkill 用），可注入。
 * @param options.comspec - Windows 命令解释器。
 */
export function killProcessTree(child, options = {}) {
  const platform = options.platform ?? process.platform
  const comspec = options.comspec ?? process.env.ComSpec
  const runSync = options.spawnSync ?? nodeSpawnSync
  const pid = child?.pid
  if (typeof pid === 'number' && pid > 0) {
    if (platform === 'win32') {
      // `spawnSync` 正常不会抛：cmd.exe 找不到 → `{error}`，taskkill 失败 → `{status:1}`。
      // 只有真的成功（status 0 且无 error）才提前返回，否则必须落到下面 child.kill 的兜底。
      try {
        const shell = typeof comspec === 'string' && comspec !== '' ? comspec : 'cmd.exe'
        const result = runSync(shell, ['/d', '/s', '/c', `taskkill /pid ${pid} /T /F`], {
          windowsHide: true,
          stdio: 'ignore',
          timeout: 5_000,
        })
        if (result !== null && typeof result === 'object' && result.status === 0 && result.error === undefined) return
      } catch { /* taskkill 不可用就退回杀单个进程 */ }
    } else {
      try {
        process.kill(-pid, 'SIGKILL')
        return
      } catch { /* 进程组可能已经没了，退回杀单个进程 */ }
    }
  }
  try { child?.kill?.('SIGKILL') } catch { /* 已经退出就无所谓 */ }
}

// ---------------------------------------------------------------------------
// 归一化
// ---------------------------------------------------------------------------

```

</details>

**依据 5 · 源码核查**：[arkcli.js:873-925](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/arkcli.js#L873-L925)

spawn组/error/输出/timeout。

<details>
<summary>查看原文（53行）</summary>

```text
  async #spawnCollect(bin, args, options) {
    const { env, timeoutMs } = options
    const plan = spawnPlanFor(bin, args, this.platform, this.comspec)
    return await new Promise((resolve) => {
      let child
      try {
        // `detached: true`：起独立进程组，这样超时能整组带走（见 killProcessTree）。
        // Windows 上 detached 会开一个新控制台窗口（桌面端每跑一次闪一下），所以只在 POSIX 用。
        child = this.spawn(plan.command, plan.args, {
          stdio: ['ignore', 'pipe', 'pipe'],
          env,
          detached: this.platform !== 'win32',
          windowsHide: true,
          ...plan.verbatim ? { windowsVerbatimArguments: true } : {},
        })
      } catch (error) {
        resolve({ ok: false, code: null, stdout: '', stderr: '', error: `无法启动 ${bin}：${messageOf(error)}`, failure: 'spawn' })
        return
      }
      let stdout = ''
      let stderr = ''
      let settled = false
      let timer
      const done = (result) => {
        if (settled) return
        settled = true
        if (timer !== undefined) clearTimeout(timer)
        resolve(result)
      }
      child.stdout?.on?.('data', (chunk) => {
        if (stdout.length < MAX_CHILD_OUTPUT_CHARS) stdout += String(chunk)
      })
      child.stderr?.on?.('data', (chunk) => {
        if (stderr.length < MAX_CHILD_OUTPUT_CHARS) stderr += String(chunk)
      })
      child.on?.('error', (error) => {
        done({ ok: false, code: null, stdout, stderr, error: `执行 ${bin} 失败：${messageOf(error)}`, failure: 'spawn' })
      })
      child.on?.('close', (code, signal) => {
        done({
          ok: code === 0,
          code,
          stdout,
          stderr,
          error: code === 0 ? undefined : `退出码 ${code ?? signal}`,
          failure: code === 0 ? undefined : 'exit',
        })
      })
      if (typeof timeoutMs === 'number' && timeoutMs > 0) {
        timer = setTimeout(() => {
          killProcessTree(child, { platform: this.platform, spawnSync: this.spawnSync, comspec: this.comspec })
          done({ ok: false, code: null, stdout, stderr, error: '超时', failure: 'timeout' })
        }, timeoutMs)
```

</details>

**依据 6 · 源码核查**：[arkcli.js:928-928](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/arkcli.js#L928-L928)

进程组kill fallback。

```text
  }
```

**依据 7 · 源码核查**：[arkcli.js:1034-1249](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/arkcli.js#L1034-L1249)

固定npm安装与回读status。

<details>
<summary>查看原文（216行）</summary>

```text
    const wanted = version ?? this.packageVersion ?? DEFAULT_INSTALL_VERSION
    const failures = []
    /** 两条路都失败时的统一结论：带上两条原因，并给出"自己装"的退路。 */
    const failureOf = () => ({
      ok: false,
      path: undefined,
      version: undefined,
      error: `安装 ${ARKCLI_PACKAGE}@${wanted} 失败：${failures.join('；')}。也可以自己装好 arkcli 后，在设置页「arkcli 路径」里指定可执行文件。`,
    })

    // 1) 直接下载官方二进制。#installBinary 会先对**临时文件**跑 --version，通过后才
    // 落盘，所以成功即代表"这个路径上的文件真的能执行"，不需要再用 resolveBin() 复检
    // （那会把一个坏文件已经占住的托管路径当成结论）。
    if (wanted === ARKCLI_BINARY_VERSION) {
      const download = await this.#installBinary(wanted, timeoutMs)
      if (download.ok) {
        this.logger?.debug?.(`[arkcli] 已下载 ${ARKCLI_PACKAGE}@${wanted} → ${download.path}`)
        return download
      }
      failures.push(download.error)
    } else {
      // 版本不是内置清单里的那个：没有可信的 sha256，只能走 npm。
      failures.push(`没有 ${wanted} 的官方二进制清单（内置 ${ARKCLI_BINARY_VERSION}）`)
    }

    // 2) npm 兜底（桌面端通常没有 npm，这条会直接跳过而不是报 ENOENT）。
    const npm = findExecutableOnPath('npm', this.pathEnv, this.exists, this.platform)
    if (npm === undefined) {
      failures.push('PATH 上找不到 npm，无法用 npm 兜底')
      return failureOf()
    }
    const args = ['install', '--prefix', dir, `${ARKCLI_PACKAGE}@${wanted}`, ...NPM_INSTALL_FLAGS]
    // npm 也用最小环境：否则 npm 会把宿主 HOME 下的 .npm 缓存/配置带进这次安装。
    // 中性 HOME 建不出来也无所谓（npm 自己会建缓存目录），但环境绝不能退回"继承父进程"。
    const npmHome = this.#neutralHome()
    try { this.mkdir(npmHome, { recursive: true }) } catch { /* 让 npm 自己决定 */ }
    const env = buildChildEnv(npmHome, undefined, this.platform)
    const collected = await this.#spawnCollect(npm, args, { env, timeoutMs })
    if (!collected.ok) {
      const tail = collected.stderr.trim().slice(-400) || collected.stdout.trim().slice(-400) || collected.error
      failures.push(`npm 安装失败：${tail}`)
      return failureOf()
    }
    // 验证 npm 刚写下的那份 shim，而不是 resolveBin() 的全局首选：托管目录里可能还留着
    // 之前直接下载的旧版本，拿它复检会让"装 1.0.38"看起来装上了 1.0.39。
    const npmShim = managedBinPath(this.dshHome, this.platform)
    const verified = await this.#verifyInstalled(wanted, this.exists(npmShim) ? npmShim : undefined)
    if (verified.ok) {
      this.logger?.debug?.(`[arkcli] 已安装 ${ARKCLI_PACKAGE}@${wanted} → ${verified.path}`)
      return verified
    }
    failures.push(`npm 装完后 arkcli 无法执行：${verified.error}`)
    return failureOf()
  }

  /**
   * 跑一次 `<target> --version`，确认这个文件真的能执行。
   *
   * 直接对**待落盘/刚装好**的文件验证，而不是 `resolveBin()` 的全局首选：否则一个
   * 下载坏掉的文件会先占住托管路径，之后所有解析都指向它，连 npm 兜底都被它带死。
   *
   * @param target - 要验证的可执行文件绝对路径。
   * @returns `{ok, version, error}`。
   */
  async #probeVersion(target) {
    const neutral = this.#neutralHome()
    // 中性 HOME 先建出来：Windows 上它会被当成 USERPROFILE，目录不存在时某些工具会
    // 在第一次写状态时把错误一路带出来。
    try { this.mkdir(neutral, { recursive: true }) } catch { /* 建不出来就让它自己报 */ }
    const env = buildChildEnv(neutral, undefined, this.platform)
    const collected = await this.#spawnCollect(target, ['--version'], { env, timeoutMs: 30_000 })
    const text = `${collected.stdout}\n${collected.stderr}`
    if (!collected.ok) {
      return {
        ok: false,
        version: undefined,
        error: collected.error ?? lastMeaningfulLine(text) ?? `无法执行 ${target}`,
      }
    }
    const match = /(\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?)/.exec(text)
    return { ok: true, version: match?.[1], error: undefined }
  }

  /**
   * 复检一个**已经装好的**路径（npm 兜底用）：文件存在、能执行。
   *
   * @param wanted - 期望版本（只用于输出兜底，不参与判定）。
   * @param explicitPath - 明确要验证的路径；缺省回退到 resolveBin()。
   * @returns `{ok, path, version, error}`。
   */
  async #verifyInstalled(wanted, explicitPath) {
    let target = explicitPath
    if (target === undefined) {
      const resolved = await this.resolveBin()
      if (resolved.path === undefined) {
        return { ok: false, path: undefined, version: undefined, error: '安装完成后仍然找不到 arkcli 可执行文件。' }
      }
      target = resolved.path
    } else if (!this.exists(target)) {
      return { ok: false, path: target, version: undefined, error: `安装完成后没有找到 ${target}。` }
    }
    const probe = await this.#probeVersion(target)
    if (!probe.ok) {
      return { ok: false, path: target, version: probe.version, error: probe.error ?? '安装后 arkcli 无法执行。' }
    }
    return { ok: true, path: target, version: probe.version ?? wanted, error: undefined }
  }

  /**
   * 直接下载官方 Go 二进制到 `<installDir>/bin/`。
   *
   * 逐个源尝试（CDN → GitHub Release），每个源下载完都校验 sha256，再对临时文件实跑
   * `--version`；任何一步失败都删掉临时文件、换下一个源。只有 sha256 与可执行性都
   * 通过才 rename 成正式文件——坏文件绝不占住托管路径。
   *
   * @param version - 版本（必须等于 {@link ARKCLI_BINARY_VERSION}）。
   * @param timeoutMs - 单个源的下载超时。
   * @returns `{ok, path, version, error}`。
   */
  async #installBinary(version, timeoutMs) {
    const key = platformKeyOf(this.platform, this.arch)
    if (key === undefined) {
      return { ok: false, path: undefined, version: undefined, error: `官方 arkcli 没有发布 ${this.platform}-${this.arch} 的二进制` }
    }
    const entry = this.binaries?.[key]
    if (entry === undefined || typeof entry.url !== 'string') {
      return { ok: false, path: undefined, version: undefined, error: `没有 ${key} 的下载清单` }
    }
    // 没有合法 sha256 就**拒绝下载**（fail closed）：官方 postinstall 也是这么做的。
    // "清单里没写校验值 ⇒ 下什么装什么"比不装危险得多。
    if (typeof entry.sha256 !== 'string' || !/^[0-9a-f]{64}$/i.test(entry.sha256)) {
      return { ok: false, path: undefined, version: undefined, error: `${key} 的下载清单缺少合法的 sha256，拒绝下载。` }
    }
    const expected = entry.sha256.toLowerCase()
    const destination = managedBinaryPath(this.dshHome, this.platform)
    try {
      this.mkdir(join(managedInstallDir(this.dshHome), 'bin'), { recursive: true })
    } catch (error) {
      return { ok: false, path: undefined, version: undefined, error: `无法创建 ${destination} 的目录：${messageOf(error)}` }
    }
    // 同一份二进制已经在了就别重下 40 MB：既省流量，也避免在 Windows 上 rename 覆盖
    // 一个正被登录会话/扫描占用的 .exe。sha 对不上（旧版本/坏文件）才继续下载覆盖。
    if (this.exists(destination)) {
      try {
        const existing = createHash('sha256').update(readFileSync(destination)).digest('hex')
        if (existing === expected) {
          const probe = await this.#probeVersion(destination)
          if (probe.ok) return { ok: true, path: destination, version: probe.version ?? version, error: undefined }
        }
      } catch { /* 读不出来就当没装过，走下载 */ }
    }
    // 临时文件名必须唯一（并发点两次安装不能互相截断），且 Windows 上必须以 `.exe`
    // 结尾——CreateProcess 不会执行无扩展名的文件，而我们要在落盘前就试跑它。
    const unique = randomBytes(6).toString('hex')
    const temporary = this.platform === 'win32'
      ? `${destination}.${unique}.download.exe`
      : `${destination}.${unique}.download`
    const errors = []
    const sources = [entry.url, entry.fallback].filter((url) => typeof url === 'string' && url !== '')
    for (const url of sources) {
      let cannotWrite = false
      try {
        const bytes = await this.#downloadBytes(url, timeoutMs)
        const digest = createHash('sha256').update(bytes).digest('hex')
        if (digest !== expected) throw new Error(`sha256 不匹配（期望 ${expected}，实际 ${digest}）`)
        writeFileSync(temporary, bytes)
        // 先 chmod 再验证/改名：chmod 失败时坏文件还停在临时路径，不会污染托管路径。
        if (this.platform !== 'win32') chmodSync(temporary, 0o755)
        const probe = await this.#probeVersion(temporary)
        if (!probe.ok) throw new Error(`下载的二进制无法执行：${probe.error ?? '未知原因'}`)
        try {
          renameSync(temporary, destination)
        } catch (error) {
          // 写不进去通常是被占用（Windows 上正在运行的 .exe 改不了名）。换下一个源
          // 只会再下 40 MB、然后同样写不进去，所以直接收手。
          cannotWrite = true
          throw new Error(`无法写入 ${destination}：${messageOf(error)}（如果 arkcli 正在运行或登录，请先取消再装）`)
        }
        return { ok: true, path: destination, version: probe.version ?? version, error: undefined }
      } catch (error) {
        try { rmSync(temporary, { force: true }) } catch { /* 临时文件清不掉不影响结论 */ }
        errors.push(`${url}：${messageOf(error)}`)
        if (cannotWrite) break
      }
    }
    return { ok: false, path: undefined, version: undefined, error: `下载 arkcli ${version}（${key}）失败：${errors.join('；')}` }
  }

  /**
   * 下载一个 URL 的全部字节。
   *
   * 用注入的 fetch：桌面端宿主跑在 Electron Node 模式里，全局 fetch 可用；测试里
   * 换成假实现就完全离线。超时用 `AbortSignal.timeout`（运行环境没提供时就不带）。
   *
   * @param url - 下载地址。
   * @param timeoutMs - 超时毫秒。
   * @returns `Buffer`。
   */
  async #downloadBytes(url, timeoutMs) {
    if (typeof this.fetchImpl !== 'function') throw new Error('当前运行环境没有 fetch，无法直接下载')
    const init = {}
    if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
      init.signal = AbortSignal.timeout(timeoutMs)
    }
    const response = await this.fetchImpl(url, init)
    if (response === null || typeof response !== 'object') throw new Error('下载没有返回有效响应')
    const status = typeof response.status === 'number' ? response.status : (response.ok === false ? 0 : 200)
    if (response.ok === false || status < 200 || status >= 300) throw new Error(`HTTP ${status === 0 ? '失败' : status}`)
    if (typeof response.arrayBuffer !== 'function') throw new Error('下载响应不支持 arrayBuffer')
    // 先看声明的 Content-Length 就拒绝明显超大的响应，避免先把它读进内存再发现。
    const declared = Number(response.headers?.get?.('content-length') ?? Number.NaN)
    if (Number.isFinite(declared) && declared > MAX_BINARY_BYTES) throw new Error(`响应过大（${declared} 字节）`)
    const bytes = Buffer.from(await response.arrayBuffer())
    if (bytes.byteLength === 0) throw new Error('下载内容为空')
    if (bytes.byteLength > MAX_BINARY_BYTES) throw new Error(`响应过大（${bytes.byteLength} 字节）`)
    return bytes
```

</details>

**依据 8 · 源码核查**：[arkcli.js:429-448](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/arkcli.js#L429-L448)

Windows同时改USERPROFILE与HOME，保持最小环境。

<details>
<summary>查看原文（20行）</summary>

```text
export function buildChildEnv(home, extra, platform = process.platform) {
  if (typeof home !== 'string' || home === '') {
    throw new Error('必须显式给定 HOME：arkcli 把状态放在 $HOME/.arkcli 且没有环境变量可以覆盖，多账号隔离完全依赖它。')
  }
  const put = (target, key, value) => {
    if (value !== undefined) target[key] = value
  }
  const env = {}
  put(env, 'PATH', process.env.PATH)
  env.HOME = home
  // Windows：Go 取家目录只看 USERPROFILE（不看 HOME）。不设它 = 多账户全部串到宿主家目录。
  if (platform === 'win32') put(env, 'USERPROFILE', home)
  env.LANG = process.env.LANG ?? 'C.UTF-8'
  env.LC_ALL = process.env.LC_ALL ?? 'C.UTF-8'
  put(env, 'TMPDIR', process.env.TMPDIR ?? tmpdir())
  // Windows 的系统变量：缺 SystemRoot 时部分 Go 运行时会拿不到系统目录；
  // 缺 ComSpec/PATHEXT 时子进程无法再起 .exe/.cmd。
  if (platform === 'win32') {
    for (const key of ['SystemRoot', 'SystemDrive', 'windir', 'ComSpec', 'PATHEXT', 'NUMBER_OF_PROCESSORS', 'PROCESSOR_ARCHITECTURE', 'TEMP', 'TMP']) {
      put(env, key, process.env[key])
```

</details>

**依据 9 · 源码核查**：[arkcli.js:524-549](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/arkcli.js#L524-L549)

各平台终止路径和失败fallback。

<details>
<summary>查看原文（26行）</summary>

```text
export function killProcessTree(child, options = {}) {
  const platform = options.platform ?? process.platform
  const comspec = options.comspec ?? process.env.ComSpec
  const runSync = options.spawnSync ?? nodeSpawnSync
  const pid = child?.pid
  if (typeof pid === 'number' && pid > 0) {
    if (platform === 'win32') {
      // `spawnSync` 正常不会抛：cmd.exe 找不到 → `{error}`，taskkill 失败 → `{status:1}`。
      // 只有真的成功（status 0 且无 error）才提前返回，否则必须落到下面 child.kill 的兜底。
      try {
        const shell = typeof comspec === 'string' && comspec !== '' ? comspec : 'cmd.exe'
        const result = runSync(shell, ['/d', '/s', '/c', `taskkill /pid ${pid} /T /F`], {
          windowsHide: true,
          stdio: 'ignore',
          timeout: 5_000,
        })
        if (result !== null && typeof result === 'object' && result.status === 0 && result.error === undefined) return
      } catch { /* taskkill 不可用就退回杀单个进程 */ }
    } else {
      try {
        process.kill(-pid, 'SIGKILL')
        return
      } catch { /* 进程组可能已经没了，退回杀单个进程 */ }
    }
  }
  try { child?.kill?.('SIGKILL') } catch { /* 已经退出就无所谓 */ }
```

</details>

**依据 10 · 源码核查**：[arkcli.js:1044-1065](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/arkcli.js#L1044-L1065)

直接二进制优先，仅条件npm回退。

<details>
<summary>查看原文（22行）</summary>

```text
    // 1) 直接下载官方二进制。#installBinary 会先对**临时文件**跑 --version，通过后才
    // 落盘，所以成功即代表"这个路径上的文件真的能执行"，不需要再用 resolveBin() 复检
    // （那会把一个坏文件已经占住的托管路径当成结论）。
    if (wanted === ARKCLI_BINARY_VERSION) {
      const download = await this.#installBinary(wanted, timeoutMs)
      if (download.ok) {
        this.logger?.debug?.(`[arkcli] 已下载 ${ARKCLI_PACKAGE}@${wanted} → ${download.path}`)
        return download
      }
      failures.push(download.error)
    } else {
      // 版本不是内置清单里的那个：没有可信的 sha256，只能走 npm。
      failures.push(`没有 ${wanted} 的官方二进制清单（内置 ${ARKCLI_BINARY_VERSION}）`)
    }

    // 2) npm 兜底（桌面端通常没有 npm，这条会直接跳过而不是报 ENOENT）。
    const npm = findExecutableOnPath('npm', this.pathEnv, this.exists, this.platform)
    if (npm === undefined) {
      failures.push('PATH 上找不到 npm，无法用 npm 兜底')
      return failureOf()
    }
    const args = ['install', '--prefix', dir, `${ARKCLI_PACKAGE}@${wanted}`, ...NPM_INSTALL_FLAGS]
```

</details>

#### 缺口

- 状态根父链接、双账号同时登录/切换以及不同OS取消的进程/凭据状态未受控复现。
  **影响**：不能给物理HOME围栏或所有平台无遗留验收。
  **进一步探讨**：用可丢弃账户目录/假CLI核父链接、两账号、超时/取消/孙进程和环境变量，不读真实凭据。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 模型能力、额度和流式超时是否可当实测事实？

**研究主题**：缺陷与关键质疑

#### 完整回答

models.js列静态context/output/vision/effort并附作者探测说明。保守把失败图像模型标text可避免UI过度宣称，但这是固定版本作者材料；本轮没有发送容量/多模态/工具回合请求，不能称当前12模型均已独立验证或永不变化。

额度支持CLI SSO控制面及AK/SK签名查询，parseCodingPlanUsage只在有level/percent时加入，百分比clamp0..100，reset校验范围，缺时间null。这是显示归一，不是独立账单核验；percent不是模型token单价/账户余额，跨窗口也不能直接相加。usage fetch的15秒timer在fetch返回headers后清除，response.text随后读，慢body不受该预算完整覆盖。

聊天分请求headers预算和stream idle预算，SSE idle到期会cancel并抛异常而非假正常结束，调用signal传请求controller。长持续流可能一直保持活跃超过head timeout；业务读者应分清总时限与空闲时限，不把“300秒”当所有生成最多300秒。

#### 证据与依据

**依据 1 · 作者声明**：[models.js:1-23](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/models.js#L1-L23)

作者静态能力/探测声明。

<details>
<summary>查看原文（23行）</summary>

```text
/**
 * 火山方舟（Volcengine Ark）Coding Plan 模型目录。
 *
 * 每一行的容量、模态与思考档位都来自实测（2026-10-15，对本机 key 直接调用
 * `https://ark.cn-beijing.volces.com/api/coding/v3/chat/completions`）与官方文档
 * （https://docs.volcengine.com/docs/ark/coding-plan-personal-plan-overview）的交叉验证；
 * 无法确认的字段一律取保守值并在 `note` 里写明，绝不猜测。
 *
 * 字段说明：
 * - `contextWindow`：上下文窗口（tokens）。Ark 别名模型与带日期的目录 id 共用同一容量。
 * - `maxOutput`：单次请求 `max_tokens` 的上限。实测方式是在阶梯值上探测服务端是否拒绝。
 * - `input`：DSH 只认识 `text` / `image` 两种模态。模型若支持视频/音频输入，这里只体现
 *   它同时接受图片；DSH 的模态声明必须保守，宁可不给也不能错给。
 * - `efforts`：实测被服务端接受的 `reasoning_effort` 取值。`off` 映射为 `none`。
 * - `visionNote`：图片能力的实测结论，方便排查。
 *
 * 实测要点（非猜测）：
 * - `glm-5.3` 明确拒绝图片（`Model only support text input`），且不支持关闭思考
 *   （`thinking.type disabled is not supported`），也不接受 `reasoning_effort: none/minimal`。
 * - `deepseek-v4-pro` 收图后回答"看不到图片"，判定为纯文本；`deepseek-v4-flash` 每次带图
 *   都在 3 分钟内无响应，同样按纯文本处理（宁可少给不可错给）。
 * - `minimax-m3` 第 1 轮工具调用正常，但它回传的 `tool_calls[].type` 是 `functionfunction`
 *   （服务端序列化缺陷）。适配器重建请求时强制写 `type: "function"`，多轮工具调用因此可用。
```

</details>

**依据 2 · 源码核查**：[usage.js:155-181](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/usage.js#L155-L181)

额度/时间归一。

<details>
<summary>查看原文（27行）</summary>

```text
  const rows = Array.isArray(result.QuotaUsage) ? result.QuotaUsage : Array.isArray(result.quotaUsage) ? result.quotaUsage : []
  const windows = []
  for (const row of rows) {
    if (typeof row !== 'object' || row === null) continue
    const level = typeof row.Level === 'string' ? row.Level : typeof row.level === 'string' ? row.level : undefined
    const percentRaw = typeof row.Percent === 'number' ? row.Percent : typeof row.percent === 'number' ? row.percent : undefined
    if (level === undefined || percentRaw === undefined) continue
    const resetRaw = typeof row.ResetTimestamp === 'number' ? row.ResetTimestamp
      : typeof row.resetTimestamp === 'number' ? row.resetTimestamp : undefined
    windows.push({
      level,
      label: WINDOW_LABELS[level] ?? level,
      percent: Math.max(0, Math.min(100, percentRaw)),
      // 秒 → 毫秒；缺省时给 null，页面自行处理。
      // 范围校验是必需的：负数会渲染成 1970-01-01，天文数字会渲染成 "Invalid Date"
      // —— 用户看到的是假日期，比"没有日期"更糟（`formatClock` 的 try/catch 拦不住
      // 这两种，它们根本不抛）。所以超出可用范围一律当"没有"。
      resetAt: inUsableRange(resetRaw) ? (resetRaw > 1e12 ? resetRaw : resetRaw * 1000) : null,
    })
  }
  const order = { session: 0, fiveHour: 0, daily: 1, weekly: 1, monthly: 2 }
  windows.sort((left, right) => (order[left.level] ?? 9) - (order[right.level] ?? 9))
  return {
    windows,
    status: typeof result.Status === 'string' ? result.Status : undefined,
    updatedAt: typeof result.UpdateTimestamp === 'number' ? result.UpdateTimestamp : Date.now(),
  }
```

</details>

**依据 3 · 源码核查**：[usage.js:212-225](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/usage.js#L212-L225)

usage timeout止于headers。

<details>
<summary>查看原文（14行）</summary>

```text
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(new Error('usage timeout')), timeoutMs)
  let response
  try {
    response = await fetchImpl(`https://${VOLC_HOST}/?${query}`, {
      method: 'POST',
      headers: { ...headers, accept: 'application/json', 'user-agent': 'dsh-ark-coding-provider' },
      body: '',
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
  const text = await response.text()
```

</details>

**依据 4 · 源码核查**：[index.js:848-855](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/index.js#L848-L855)

聊天signal/head timer。

```text
  async *streamOnce(options, connection, model, prepared, account) {
    const controller = new AbortController()
    const onAbort = () => controller.abort(options.signal?.reason)
    if (options.signal !== undefined) {
      if (options.signal.aborted) controller.abort(options.signal.reason)
      else options.signal.addEventListener('abort', onAbort, { once: true })
    }
    const headTimer = setTimeout(() => controller.abort(new Error('request timeout')), connection.requestTimeoutMs)
```

**依据 5 · 源码核查**：[index.js:930-948](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/index.js#L930-L948)

stream idle取消与错误设计。

<details>
<summary>查看原文（19行）</summary>

```text
    const reader = response.body?.getReader()
    if (reader === undefined) {
      throw new LlmError('火山方舟返回了空的响应体', 'TRANSPORT')
    }
    const decoder = new TextDecoder()
    let buffer = ''
    let idleTimer
    /** 空闲超时不是"正常结束"：它必须被报出来，不能悄悄截断成一次成功的补全。 */
    let idleExpired = false
    const armIdle = () => {
      if (idleTimer !== undefined) clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        idleExpired = true
        // 必须吞掉拒绝：`cancel()` 拒绝时就是一个未处理 rejection，而 DSH 把
        // unhandledRejection 当致命错误（`dsh-app-boot` 的 report() → proc.exit(1)）。
        // 同一个调用在下面的 finally 里是包了 try/catch 的，这里当时漏了。
        try {
          const cancelled = reader.cancel(new Error('stream idle timeout'))
          if (typeof cancelled?.catch === 'function') cancelled.catch(() => {})
```

</details>

#### 缺口

- 平台当前目录/容量与真实额度口径、慢body/SSE异常没有本轮固定响应+实际请求对照。
  **影响**：不作实时能力/费用/取消保证。
  **进一步探讨**：先模拟headers/body延迟与破帧/空闲，再用授权测试账户的小样对照官方目录/额度时间，避免大额探测。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动与使用步骤是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动需要匹配DSH llm、credentials、launchEnvironment、home-paths与Typert接口；聊天需已有Coding Plan订阅和正确API Key，控制面目录/额度则需要CLI登录或另一路AK/SK权限，二者不能混为同一凭据。

状态根通过resolveDshHome与宿主一致，不再要求环境中必须显式设置DSH_HOME。Windows把HOME和USERPROFILE同时派生到账号目录；用户仍应核实际物理路径，不将词法prefix当沙箱。先单API Key文本小请求，再按确需功能核CLI/SSO和工具/图像。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:48-67](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/package.json#L48-L67)

DSH兼容/peer声明。

<details>
<summary>查看原文（20行）</summary>

```text
    }
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-credentials": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-home-paths": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-launch-environment": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-llm": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-typert-protocol": "^0.2.0-rc.2",
    "@deepseek-ai/schemastery": "~3.18.4"
  },
  "keywords": [
    "deepseek-harness",
    "dsh",
    "volcengine",
    "ark",
    "coding-plan",
    "火山方舟",
    "doubao",
    "llm",
    "provider",
```

</details>

**依据 2 · 源码核查**：[index.js:62-79](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/index.js#L62-L79)

数据面/default预算。

<details>
<summary>查看原文（18行）</summary>

```text
export const PROVIDER = 'ark-coding'
/** 本插件的设置命名空间（也是 profile 里的条目 id）。 */
export const NS = 'llm-ark-coding'
export const name = 'llm-ark-coding'
export const inject = ['llm']

/** Coding Plan 的 OpenAI 兼容端点。 */
export const DEFAULT_API_BASE = 'https://ark.cn-beijing.volces.com/api/coding/v3'
export const DEFAULT_API_KEY_ENV = 'ARK_CODING_API_KEY'
export const DISPLAY_NAME = '火山方舟 Coding Plan'

/** 未配置时单次请求的 max_tokens 上限；会被逐模型输出上限夹住。 */
export const DEFAULT_MAX_OUTPUT_TOKENS = 65536
/** 首字节超时与流空闲超时。Coding Plan 会出现很长的思考，默认给足 5 分钟。 */
export const DEFAULT_REQUEST_TIMEOUT_MS = 300_000
export const DEFAULT_STREAM_IDLE_TIMEOUT_MS = 300_000
/** 单次请求内联图片（base64 后）的字节上限；超出即要求上层卸载最旧的图片。 */
export const DEFAULT_MAX_REQUEST_IMAGE_BYTES = 20 * 1024 * 1024
```

</details>

**依据 3 · 源码核查**：[arkcli.js:1034-1249](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/arkcli.js#L1034-L1249)

CLI版本/状态前提。

<details>
<summary>查看原文（216行）</summary>

```text
    const wanted = version ?? this.packageVersion ?? DEFAULT_INSTALL_VERSION
    const failures = []
    /** 两条路都失败时的统一结论：带上两条原因，并给出"自己装"的退路。 */
    const failureOf = () => ({
      ok: false,
      path: undefined,
      version: undefined,
      error: `安装 ${ARKCLI_PACKAGE}@${wanted} 失败：${failures.join('；')}。也可以自己装好 arkcli 后，在设置页「arkcli 路径」里指定可执行文件。`,
    })

    // 1) 直接下载官方二进制。#installBinary 会先对**临时文件**跑 --version，通过后才
    // 落盘，所以成功即代表"这个路径上的文件真的能执行"，不需要再用 resolveBin() 复检
    // （那会把一个坏文件已经占住的托管路径当成结论）。
    if (wanted === ARKCLI_BINARY_VERSION) {
      const download = await this.#installBinary(wanted, timeoutMs)
      if (download.ok) {
        this.logger?.debug?.(`[arkcli] 已下载 ${ARKCLI_PACKAGE}@${wanted} → ${download.path}`)
        return download
      }
      failures.push(download.error)
    } else {
      // 版本不是内置清单里的那个：没有可信的 sha256，只能走 npm。
      failures.push(`没有 ${wanted} 的官方二进制清单（内置 ${ARKCLI_BINARY_VERSION}）`)
    }

    // 2) npm 兜底（桌面端通常没有 npm，这条会直接跳过而不是报 ENOENT）。
    const npm = findExecutableOnPath('npm', this.pathEnv, this.exists, this.platform)
    if (npm === undefined) {
      failures.push('PATH 上找不到 npm，无法用 npm 兜底')
      return failureOf()
    }
    const args = ['install', '--prefix', dir, `${ARKCLI_PACKAGE}@${wanted}`, ...NPM_INSTALL_FLAGS]
    // npm 也用最小环境：否则 npm 会把宿主 HOME 下的 .npm 缓存/配置带进这次安装。
    // 中性 HOME 建不出来也无所谓（npm 自己会建缓存目录），但环境绝不能退回"继承父进程"。
    const npmHome = this.#neutralHome()
    try { this.mkdir(npmHome, { recursive: true }) } catch { /* 让 npm 自己决定 */ }
    const env = buildChildEnv(npmHome, undefined, this.platform)
    const collected = await this.#spawnCollect(npm, args, { env, timeoutMs })
    if (!collected.ok) {
      const tail = collected.stderr.trim().slice(-400) || collected.stdout.trim().slice(-400) || collected.error
      failures.push(`npm 安装失败：${tail}`)
      return failureOf()
    }
    // 验证 npm 刚写下的那份 shim，而不是 resolveBin() 的全局首选：托管目录里可能还留着
    // 之前直接下载的旧版本，拿它复检会让"装 1.0.38"看起来装上了 1.0.39。
    const npmShim = managedBinPath(this.dshHome, this.platform)
    const verified = await this.#verifyInstalled(wanted, this.exists(npmShim) ? npmShim : undefined)
    if (verified.ok) {
      this.logger?.debug?.(`[arkcli] 已安装 ${ARKCLI_PACKAGE}@${wanted} → ${verified.path}`)
      return verified
    }
    failures.push(`npm 装完后 arkcli 无法执行：${verified.error}`)
    return failureOf()
  }

  /**
   * 跑一次 `<target> --version`，确认这个文件真的能执行。
   *
   * 直接对**待落盘/刚装好**的文件验证，而不是 `resolveBin()` 的全局首选：否则一个
   * 下载坏掉的文件会先占住托管路径，之后所有解析都指向它，连 npm 兜底都被它带死。
   *
   * @param target - 要验证的可执行文件绝对路径。
   * @returns `{ok, version, error}`。
   */
  async #probeVersion(target) {
    const neutral = this.#neutralHome()
    // 中性 HOME 先建出来：Windows 上它会被当成 USERPROFILE，目录不存在时某些工具会
    // 在第一次写状态时把错误一路带出来。
    try { this.mkdir(neutral, { recursive: true }) } catch { /* 建不出来就让它自己报 */ }
    const env = buildChildEnv(neutral, undefined, this.platform)
    const collected = await this.#spawnCollect(target, ['--version'], { env, timeoutMs: 30_000 })
    const text = `${collected.stdout}\n${collected.stderr}`
    if (!collected.ok) {
      return {
        ok: false,
        version: undefined,
        error: collected.error ?? lastMeaningfulLine(text) ?? `无法执行 ${target}`,
      }
    }
    const match = /(\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?)/.exec(text)
    return { ok: true, version: match?.[1], error: undefined }
  }

  /**
   * 复检一个**已经装好的**路径（npm 兜底用）：文件存在、能执行。
   *
   * @param wanted - 期望版本（只用于输出兜底，不参与判定）。
   * @param explicitPath - 明确要验证的路径；缺省回退到 resolveBin()。
   * @returns `{ok, path, version, error}`。
   */
  async #verifyInstalled(wanted, explicitPath) {
    let target = explicitPath
    if (target === undefined) {
      const resolved = await this.resolveBin()
      if (resolved.path === undefined) {
        return { ok: false, path: undefined, version: undefined, error: '安装完成后仍然找不到 arkcli 可执行文件。' }
      }
      target = resolved.path
    } else if (!this.exists(target)) {
      return { ok: false, path: target, version: undefined, error: `安装完成后没有找到 ${target}。` }
    }
    const probe = await this.#probeVersion(target)
    if (!probe.ok) {
      return { ok: false, path: target, version: probe.version, error: probe.error ?? '安装后 arkcli 无法执行。' }
    }
    return { ok: true, path: target, version: probe.version ?? wanted, error: undefined }
  }

  /**
   * 直接下载官方 Go 二进制到 `<installDir>/bin/`。
   *
   * 逐个源尝试（CDN → GitHub Release），每个源下载完都校验 sha256，再对临时文件实跑
   * `--version`；任何一步失败都删掉临时文件、换下一个源。只有 sha256 与可执行性都
   * 通过才 rename 成正式文件——坏文件绝不占住托管路径。
   *
   * @param version - 版本（必须等于 {@link ARKCLI_BINARY_VERSION}）。
   * @param timeoutMs - 单个源的下载超时。
   * @returns `{ok, path, version, error}`。
   */
  async #installBinary(version, timeoutMs) {
    const key = platformKeyOf(this.platform, this.arch)
    if (key === undefined) {
      return { ok: false, path: undefined, version: undefined, error: `官方 arkcli 没有发布 ${this.platform}-${this.arch} 的二进制` }
    }
    const entry = this.binaries?.[key]
    if (entry === undefined || typeof entry.url !== 'string') {
      return { ok: false, path: undefined, version: undefined, error: `没有 ${key} 的下载清单` }
    }
    // 没有合法 sha256 就**拒绝下载**（fail closed）：官方 postinstall 也是这么做的。
    // "清单里没写校验值 ⇒ 下什么装什么"比不装危险得多。
    if (typeof entry.sha256 !== 'string' || !/^[0-9a-f]{64}$/i.test(entry.sha256)) {
      return { ok: false, path: undefined, version: undefined, error: `${key} 的下载清单缺少合法的 sha256，拒绝下载。` }
    }
    const expected = entry.sha256.toLowerCase()
    const destination = managedBinaryPath(this.dshHome, this.platform)
    try {
      this.mkdir(join(managedInstallDir(this.dshHome), 'bin'), { recursive: true })
    } catch (error) {
      return { ok: false, path: undefined, version: undefined, error: `无法创建 ${destination} 的目录：${messageOf(error)}` }
    }
    // 同一份二进制已经在了就别重下 40 MB：既省流量，也避免在 Windows 上 rename 覆盖
    // 一个正被登录会话/扫描占用的 .exe。sha 对不上（旧版本/坏文件）才继续下载覆盖。
    if (this.exists(destination)) {
      try {
        const existing = createHash('sha256').update(readFileSync(destination)).digest('hex')
        if (existing === expected) {
          const probe = await this.#probeVersion(destination)
          if (probe.ok) return { ok: true, path: destination, version: probe.version ?? version, error: undefined }
        }
      } catch { /* 读不出来就当没装过，走下载 */ }
    }
    // 临时文件名必须唯一（并发点两次安装不能互相截断），且 Windows 上必须以 `.exe`
    // 结尾——CreateProcess 不会执行无扩展名的文件，而我们要在落盘前就试跑它。
    const unique = randomBytes(6).toString('hex')
    const temporary = this.platform === 'win32'
      ? `${destination}.${unique}.download.exe`
      : `${destination}.${unique}.download`
    const errors = []
    const sources = [entry.url, entry.fallback].filter((url) => typeof url === 'string' && url !== '')
    for (const url of sources) {
      let cannotWrite = false
      try {
        const bytes = await this.#downloadBytes(url, timeoutMs)
        const digest = createHash('sha256').update(bytes).digest('hex')
        if (digest !== expected) throw new Error(`sha256 不匹配（期望 ${expected}，实际 ${digest}）`)
        writeFileSync(temporary, bytes)
        // 先 chmod 再验证/改名：chmod 失败时坏文件还停在临时路径，不会污染托管路径。
        if (this.platform !== 'win32') chmodSync(temporary, 0o755)
        const probe = await this.#probeVersion(temporary)
        if (!probe.ok) throw new Error(`下载的二进制无法执行：${probe.error ?? '未知原因'}`)
        try {
          renameSync(temporary, destination)
        } catch (error) {
          // 写不进去通常是被占用（Windows 上正在运行的 .exe 改不了名）。换下一个源
          // 只会再下 40 MB、然后同样写不进去，所以直接收手。
          cannotWrite = true
          throw new Error(`无法写入 ${destination}：${messageOf(error)}（如果 arkcli 正在运行或登录，请先取消再装）`)
        }
        return { ok: true, path: destination, version: probe.version ?? version, error: undefined }
      } catch (error) {
        try { rmSync(temporary, { force: true }) } catch { /* 临时文件清不掉不影响结论 */ }
        errors.push(`${url}：${messageOf(error)}`)
        if (cannotWrite) break
      }
    }
    return { ok: false, path: undefined, version: undefined, error: `下载 arkcli ${version}（${key}）失败：${errors.join('；')}` }
  }

  /**
   * 下载一个 URL 的全部字节。
   *
   * 用注入的 fetch：桌面端宿主跑在 Electron Node 模式里，全局 fetch 可用；测试里
   * 换成假实现就完全离线。超时用 `AbortSignal.timeout`（运行环境没提供时就不带）。
   *
   * @param url - 下载地址。
   * @param timeoutMs - 超时毫秒。
   * @returns `Buffer`。
   */
  async #downloadBytes(url, timeoutMs) {
    if (typeof this.fetchImpl !== 'function') throw new Error('当前运行环境没有 fetch，无法直接下载')
    const init = {}
    if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
      init.signal = AbortSignal.timeout(timeoutMs)
    }
    const response = await this.fetchImpl(url, init)
    if (response === null || typeof response !== 'object') throw new Error('下载没有返回有效响应')
    const status = typeof response.status === 'number' ? response.status : (response.ok === false ? 0 : 200)
    if (response.ok === false || status < 200 || status >= 300) throw new Error(`HTTP ${status === 0 ? '失败' : status}`)
    if (typeof response.arrayBuffer !== 'function') throw new Error('下载响应不支持 arrayBuffer')
    // 先看声明的 Content-Length 就拒绝明显超大的响应，避免先把它读进内存再发现。
    const declared = Number(response.headers?.get?.('content-length') ?? Number.NaN)
    if (Number.isFinite(declared) && declared > MAX_BINARY_BYTES) throw new Error(`响应过大（${declared} 字节）`)
    const bytes = Buffer.from(await response.arrayBuffer())
    if (bytes.byteLength === 0) throw new Error('下载内容为空')
    if (bytes.byteLength > MAX_BINARY_BYTES) throw new Error(`响应过大（${bytes.byteLength} 字节）`)
    return bytes
```

</details>

**依据 4 · 源码核查**：[usage.js:190-220](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/usage.js#L190-L220)

AK/SK和控制面请求。

<details>
<summary>查看原文（31行）</summary>

```text
export async function fetchCodingPlanUsage(options) {
  const {
    accessKeyId,
    secretAccessKey,
    region = VOLC_DEFAULT_REGION,
    timeoutMs = 15_000,
    fetchImpl = fetch,
    date = new Date(),
  } = options
  if (typeof accessKeyId !== 'string' || accessKeyId.trim() === '') throw new Error('缺少 AccessKey ID')
  if (typeof secretAccessKey !== 'string' || secretAccessKey.trim() === '') throw new Error('缺少 Secret AccessKey')

  const query = `Action=${CODING_PLAN_USAGE_ACTION}&Version=${CODING_PLAN_USAGE_VERSION}`
  const headers = volcengineSignedHeaders({
    accessKeyId: accessKeyId.trim(),
    secretAccessKey: secretAccessKey.trim(),
    region,
    query,
    body: '',
    date,
  })

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(new Error('usage timeout')), timeoutMs)
  let response
  try {
    response = await fetchImpl(`https://${VOLC_HOST}/?${query}`, {
      method: 'POST',
      headers: { ...headers, accept: 'application/json', 'user-agent': 'dsh-ark-coding-provider' },
      body: '',
      signal: controller.signal,
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次持续失败成本与效果是什么？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

任务成本应包含套餐模型、失败轮换、目录/额度网络和可选CLI安装。当前默认可直接下载约几十MB二进制而不需要外部npm，但校验、存储、SSO和跨平台恢复仍有资源/人工成本。现金支出依用户套餐，未核订阅金额或真实总usage，不给费用承诺。

已yield不回退避免拼接两账户回答，却使半途失败需要用户判断重试，不能忽略重复任务成本。固定CLI版本、哈希和执行探针支持安装可靠性机制，不能代替本轮安装或模型任务验收。额度百分比也不是节省金额证明。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:820-840](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/index.js#L820-L840)

失败轮换时序。

<details>
<summary>查看原文（21行）</summary>

```text
    for (const account of accounts) {
      const state = { emitted: false }
      try {
        for await (const chunk of this.streamOnce(options, connection, model, prepared, account)) {
          state.emitted = true
          yield chunk
        }
        marks?.clear(account.id)
        return
      } catch (error) {
        if (options.signal?.aborted === true) throw error
        const code = error instanceof LlmError ? error.code : undefined
        const reason = rotationReasonFor(code)
        // 已经吐过内容、或者这个失败换账号也没用 → 原样抛出去。
        if (reason === undefined || state.emitted) throw error
        const cooldown = retryAfterMsOf(error?.failure) ?? cooldownFor(reason)
        marks?.mark(account.id, reason, Date.now() + cooldown)
        lastError = error
        this.deps.logger?.warn?.(
          `${NS}: 账户「${account.label}」${reason}（${code}），冷却 ${Math.round(cooldown / 1000)}s 后重试，先切到下一个账户`,
        )
```

</details>

**依据 2 · 源码核查**：[arkcli.js:873-925](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/arkcli.js#L873-L925)

CLI预算/错误状态。

<details>
<summary>查看原文（53行）</summary>

```text
  async #spawnCollect(bin, args, options) {
    const { env, timeoutMs } = options
    const plan = spawnPlanFor(bin, args, this.platform, this.comspec)
    return await new Promise((resolve) => {
      let child
      try {
        // `detached: true`：起独立进程组，这样超时能整组带走（见 killProcessTree）。
        // Windows 上 detached 会开一个新控制台窗口（桌面端每跑一次闪一下），所以只在 POSIX 用。
        child = this.spawn(plan.command, plan.args, {
          stdio: ['ignore', 'pipe', 'pipe'],
          env,
          detached: this.platform !== 'win32',
          windowsHide: true,
          ...plan.verbatim ? { windowsVerbatimArguments: true } : {},
        })
      } catch (error) {
        resolve({ ok: false, code: null, stdout: '', stderr: '', error: `无法启动 ${bin}：${messageOf(error)}`, failure: 'spawn' })
        return
      }
      let stdout = ''
      let stderr = ''
      let settled = false
      let timer
      const done = (result) => {
        if (settled) return
        settled = true
        if (timer !== undefined) clearTimeout(timer)
        resolve(result)
      }
      child.stdout?.on?.('data', (chunk) => {
        if (stdout.length < MAX_CHILD_OUTPUT_CHARS) stdout += String(chunk)
      })
      child.stderr?.on?.('data', (chunk) => {
        if (stderr.length < MAX_CHILD_OUTPUT_CHARS) stderr += String(chunk)
      })
      child.on?.('error', (error) => {
        done({ ok: false, code: null, stdout, stderr, error: `执行 ${bin} 失败：${messageOf(error)}`, failure: 'spawn' })
      })
      child.on?.('close', (code, signal) => {
        done({
          ok: code === 0,
          code,
          stdout,
          stderr,
          error: code === 0 ? undefined : `退出码 ${code ?? signal}`,
          failure: code === 0 ? undefined : 'exit',
        })
      })
      if (typeof timeoutMs === 'number' && timeoutMs > 0) {
        timer = setTimeout(() => {
          killProcessTree(child, { platform: this.platform, spawnSync: this.spawnSync, comspec: this.comspec })
          done({ ok: false, code: null, stdout, stderr, error: '超时', failure: 'timeout' })
        }, timeoutMs)
```

</details>

**依据 3 · 源码核查**：[usage.js:155-181](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/usage.js#L155-L181)

额度展示。

<details>
<summary>查看原文（27行）</summary>

```text
  const rows = Array.isArray(result.QuotaUsage) ? result.QuotaUsage : Array.isArray(result.quotaUsage) ? result.quotaUsage : []
  const windows = []
  for (const row of rows) {
    if (typeof row !== 'object' || row === null) continue
    const level = typeof row.Level === 'string' ? row.Level : typeof row.level === 'string' ? row.level : undefined
    const percentRaw = typeof row.Percent === 'number' ? row.Percent : typeof row.percent === 'number' ? row.percent : undefined
    if (level === undefined || percentRaw === undefined) continue
    const resetRaw = typeof row.ResetTimestamp === 'number' ? row.ResetTimestamp
      : typeof row.resetTimestamp === 'number' ? row.resetTimestamp : undefined
    windows.push({
      level,
      label: WINDOW_LABELS[level] ?? level,
      percent: Math.max(0, Math.min(100, percentRaw)),
      // 秒 → 毫秒；缺省时给 null，页面自行处理。
      // 范围校验是必需的：负数会渲染成 1970-01-01，天文数字会渲染成 "Invalid Date"
      // —— 用户看到的是假日期，比"没有日期"更糟（`formatClock` 的 try/catch 拦不住
      // 这两种，它们根本不抛）。所以超出可用范围一律当"没有"。
      resetAt: inUsableRange(resetRaw) ? (resetRaw > 1e12 ? resetRaw : resetRaw * 1000) : null,
    })
  }
  const order = { session: 0, fiveHour: 0, daily: 1, weekly: 1, monthly: 2 }
  windows.sort((left, right) => (order[left.level] ?? 9) - (order[right.level] ?? 9))
  return {
    windows,
    status: typeof result.Status === 'string' ? result.Status : undefined,
    updatedAt: typeof result.UpdateTimestamp === 'number' ? result.UpdateTimestamp : Date.now(),
  }
```

</details>

**依据 4 · 源码核查**：[index.js:1590-1638](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/index.js#L1590-L1638)

账户HOME与缓存维护。

<details>
<summary>查看原文（49行）</summary>

```text
  /**
   * 账户的 HOME：配置里写了就用写的，否则派生到 `<DSH_HOME>/ark-coding/accounts/<id>`。
   *
   * 显式 `home` 必须落在本插件状态根之下，理由：`accounts` 是 volatile（浏览器可写）
   * 字段，而它的 `home` 会被当成 **root 子进程的 HOME** —— arkcli 随后会在
   * `<HOME>/.arkcli/` 下写凭据、跑 `auth login`。账户 `id` 有白名单清洗，`home` 却是
   * 原样透传的，于是一次配置写入就能让 root 往任意目录写文件（`/etc`、`/root/.config`…）。
   * 运行时从来不需要自定义 HOME —— 多账户隔离靠的就是"每个账户一个派生目录"——
   * 所以越界的值直接拒绝，而不是悄悄接受。
   */
  const homeForAccount = (account) => {
    if (dshHome === undefined) throw new Error(NO_DSH_HOME)
    if (typeof account.home === 'string' && account.home !== '') {
      const root = arkcliStateRoot(dshHome)
      const resolved = resolvePath(account.home)
      if (resolved === root || resolved.startsWith(`${root}${pathSep}`)) return resolved
      throw new Error(`${NS}: 账户「${account.id}」的 home 必须位于 ${root} 之下，收到 ${account.home}。`)
    }
    return accountHomeDir(dshHome, account.id)
  }

  /** 按 id 找账户的 HOME（登录时账户可能还没写进配置，所以容忍找不到）。 */
  const homeForId = (accountId) => {
    const found = resolveConnection(live()).accounts.find((account) => account.id === accountId)
    return found === undefined ? homeForAccount({ id: accountId }) : homeForAccount(found)
  }

  /**
   * 派生缓存的键。
   *
   * **不能只用 `account.id`**：缓存的内容（API key、登录态、额度）取决于这个账户
   * 指向哪个 HOME / 什么类型 / 哪个凭据引用。用户删掉一个 CLI 账户再用同一个 id 新建
   * （或者改掉它的 `home`），旧键仍然命中，于是最长 10 分钟里继续拿**旧账户**的 key
   * 去发请求、额度和登录态也串台 —— 而删掉重建往往正是因为旧账户不该再用了。
   * 拼上这几个字段后，配置一变键就变，天然失效。id 经过白名单清洗，不含 `|`。
   */
  const cacheKeyOf = (account) => [
    account.id,
    account.type ?? '',
    account.home ?? '',
    account.ref ?? '',
  ].join('|')

  /** 清掉某个账户的所有派生缓存（登录成功/安装完成后必须调用）。 */
  const invalidateAccount = (accountId) => {
    if (accountId === undefined) {
      cliKeyCache.clear()
      cliStateCache.clear()
      planCache.clear()
```

</details>

#### 缺口

- 人工兼容provider与插件的同任务质量/总usage/失败恢复成本没有对照。
  **影响**：不能量化省钱/省时/可用性提升。
  **进一步探讨**：固定小型文本/工具任务与模拟故障，核最终状态、重复请求、usage和人工步骤。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 推荐与可继续研究的改进是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有条件试用。适合已订阅Ark Coding Plan、可信本机DSH的用户，先单API Key账户小请求，确需额度/多账号再启用CLI并验证HOME/取消。专用模型映射、yield后不轮换、最小子进程环境和固定版本CLI是具体优势；不因静态模型表直接推荐把生产任务全量迁移或以多账户绕过平台规则。

可探讨“请求/账户/能力版本收据”。每次请求标账户不可逆标识、端点/目录版本、首chunk/首正文/终止原因、实际usage与轮换轨迹，HOME验证物理父路径/身份；额度响应保原始来源时间和缺项，网络预算覆盖body。相较当前分散错误/缓存，更容易发现错账号/能力漂移与不完整结果。

未实现。最小对照含首chunk前后AUTH/QUOTA、偏好冷却、同ID变配置、父链接HOME、慢额度body、SSO取消/孙进程，记录错误身份、重复请求、有效结果/usage和资源残留。新增收据若带入秘密或显著增加延迟，应只保最小无密标识。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:820-840](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/index.js#L820-L840)

请求阶段收据基线。

<details>
<summary>查看原文（21行）</summary>

```text
    for (const account of accounts) {
      const state = { emitted: false }
      try {
        for await (const chunk of this.streamOnce(options, connection, model, prepared, account)) {
          state.emitted = true
          yield chunk
        }
        marks?.clear(account.id)
        return
      } catch (error) {
        if (options.signal?.aborted === true) throw error
        const code = error instanceof LlmError ? error.code : undefined
        const reason = rotationReasonFor(code)
        // 已经吐过内容、或者这个失败换账号也没用 → 原样抛出去。
        if (reason === undefined || state.emitted) throw error
        const cooldown = retryAfterMsOf(error?.failure) ?? cooldownFor(reason)
        marks?.mark(account.id, reason, Date.now() + cooldown)
        lastError = error
        this.deps.logger?.warn?.(
          `${NS}: 账户「${account.label}」${reason}（${code}），冷却 ${Math.round(cooldown / 1000)}s 后重试，先切到下一个账户`,
        )
```

</details>

**依据 2 · 源码核查**：[accounts.js:228-235](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/accounts.js#L228-L235)

冷却/偏好基线。

```text
export function orderAccounts(accounts, marks, preferredId) {
  const usable = accounts.filter((account) => account.key !== undefined)
  const rank = (account) => {
    if (account.id === preferredId) return 0
    if (marks.usable(account.id)) return 1
    return 2
  }
  return [...usable].sort((left, right) => rank(left) - rank(right))
```

**依据 3 · 源码核查**：[index.js:1600-1631](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/index.js#L1600-L1631)

物理HOME/身份方案基线。

<details>
<summary>查看原文（32行）</summary>

```text
  const homeForAccount = (account) => {
    if (dshHome === undefined) throw new Error(NO_DSH_HOME)
    if (typeof account.home === 'string' && account.home !== '') {
      const root = arkcliStateRoot(dshHome)
      const resolved = resolvePath(account.home)
      if (resolved === root || resolved.startsWith(`${root}${pathSep}`)) return resolved
      throw new Error(`${NS}: 账户「${account.id}」的 home 必须位于 ${root} 之下，收到 ${account.home}。`)
    }
    return accountHomeDir(dshHome, account.id)
  }

  /** 按 id 找账户的 HOME（登录时账户可能还没写进配置，所以容忍找不到）。 */
  const homeForId = (accountId) => {
    const found = resolveConnection(live()).accounts.find((account) => account.id === accountId)
    return found === undefined ? homeForAccount({ id: accountId }) : homeForAccount(found)
  }

  /**
   * 派生缓存的键。
   *
   * **不能只用 `account.id`**：缓存的内容（API key、登录态、额度）取决于这个账户
   * 指向哪个 HOME / 什么类型 / 哪个凭据引用。用户删掉一个 CLI 账户再用同一个 id 新建
   * （或者改掉它的 `home`），旧键仍然命中，于是最长 10 分钟里继续拿**旧账户**的 key
   * 去发请求、额度和登录态也串台 —— 而删掉重建往往正是因为旧账户不该再用了。
   * 拼上这几个字段后，配置一变键就变，天然失效。id 经过白名单清洗，不含 `|`。
   */
  const cacheKeyOf = (account) => [
    account.id,
    account.type ?? '',
    account.home ?? '',
    account.ref ?? '',
  ].join('|')
```

</details>

**依据 4 · 源码核查**：[usage.js:212-225](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/usage.js#L212-L225)

body预算基线。

<details>
<summary>查看原文（14行）</summary>

```text
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(new Error('usage timeout')), timeoutMs)
  let response
  try {
    response = await fetchImpl(`https://${VOLC_HOST}/?${query}`, {
      method: 'POST',
      headers: { ...headers, accept: 'application/json', 'user-agent': 'dsh-ark-coding-provider' },
      body: '',
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
  const text = await response.text()
```

</details>

#### 缺口

- 统一能力/请求版本收据与物理HOME核验方案未实现。
  **影响**：不计当前身份/质量或创新优势。
  **进一步探讨**：模拟错阶段/错身份与延迟故障，对照可定位性与元数据成本。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 直接二进制安装怎样降低桌面端依赖，资源保护是否在读取前生效？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

主安装路径按platform/arch选择嵌入清单，只接受合法sha256，先校验下载字节，再写唯一临时文件、设置可执行权限、运行版本探针，通过才rename为正式文件。相同哈希的现有文件可先验证复用；CDN失败转GitHub源，写入失败不无谓换源重下。它把桌面端缺外部npm的障碍变成宿主fetch与固定二进制的条件，降低安装接线负担。

哈希验证的是下载字节与插件内固定清单一致，不是本轮独立证明该清单来源或CLI全部行为安全。非内置版本走npm，需单独核依赖与版本结果。版本探针通过也只说明该文件能运行并输出版本，不证明SSO和额度协议可用。

下载先检查Content-Length，但缺失或伪小长度时先await arrayBuffer，再检查256MiB上限。故它能拒绝超大结果，却不能在读取过程中按累计字节停止内存增长；AbortSignal.timeout是时间预算而非内存预算。假设中的恶意/坏CDN大流是否触发宿主内存问题未实测，不能把事后长度检查称严格流式上限。

#### 证据与依据

**依据 1 · 源码核查**：[arkcli.js:1153-1167](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/arkcli.js#L1153-L1167)

清单、平台和哈希格式为前置条件。

<details>
<summary>查看原文（15行）</summary>

```text
  async #installBinary(version, timeoutMs) {
    const key = platformKeyOf(this.platform, this.arch)
    if (key === undefined) {
      return { ok: false, path: undefined, version: undefined, error: `官方 arkcli 没有发布 ${this.platform}-${this.arch} 的二进制` }
    }
    const entry = this.binaries?.[key]
    if (entry === undefined || typeof entry.url !== 'string') {
      return { ok: false, path: undefined, version: undefined, error: `没有 ${key} 的下载清单` }
    }
    // 没有合法 sha256 就**拒绝下载**（fail closed）：官方 postinstall 也是这么做的。
    // "清单里没写校验值 ⇒ 下什么装什么"比不装危险得多。
    if (typeof entry.sha256 !== 'string' || !/^[0-9a-f]{64}$/i.test(entry.sha256)) {
      return { ok: false, path: undefined, version: undefined, error: `${key} 的下载清单缺少合法的 sha256，拒绝下载。` }
    }
    const expected = entry.sha256.toLowerCase()
```

</details>

**依据 2 · 源码核查**：[arkcli.js:1185-1219](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/arkcli.js#L1185-L1219)

唯一临时路径、哈希/执行验证、rename与失败清理。

<details>
<summary>查看原文（35行）</summary>

```text
    // 临时文件名必须唯一（并发点两次安装不能互相截断），且 Windows 上必须以 `.exe`
    // 结尾——CreateProcess 不会执行无扩展名的文件，而我们要在落盘前就试跑它。
    const unique = randomBytes(6).toString('hex')
    const temporary = this.platform === 'win32'
      ? `${destination}.${unique}.download.exe`
      : `${destination}.${unique}.download`
    const errors = []
    const sources = [entry.url, entry.fallback].filter((url) => typeof url === 'string' && url !== '')
    for (const url of sources) {
      let cannotWrite = false
      try {
        const bytes = await this.#downloadBytes(url, timeoutMs)
        const digest = createHash('sha256').update(bytes).digest('hex')
        if (digest !== expected) throw new Error(`sha256 不匹配（期望 ${expected}，实际 ${digest}）`)
        writeFileSync(temporary, bytes)
        // 先 chmod 再验证/改名：chmod 失败时坏文件还停在临时路径，不会污染托管路径。
        if (this.platform !== 'win32') chmodSync(temporary, 0o755)
        const probe = await this.#probeVersion(temporary)
        if (!probe.ok) throw new Error(`下载的二进制无法执行：${probe.error ?? '未知原因'}`)
        try {
          renameSync(temporary, destination)
        } catch (error) {
          // 写不进去通常是被占用（Windows 上正在运行的 .exe 改不了名）。换下一个源
          // 只会再下 40 MB、然后同样写不进去，所以直接收手。
          cannotWrite = true
          throw new Error(`无法写入 ${destination}：${messageOf(error)}（如果 arkcli 正在运行或登录，请先取消再装）`)
        }
        return { ok: true, path: destination, version: probe.version ?? version, error: undefined }
      } catch (error) {
        try { rmSync(temporary, { force: true }) } catch { /* 临时文件清不掉不影响结论 */ }
        errors.push(`${url}：${messageOf(error)}`)
        if (cannotWrite) break
      }
    }
    return { ok: false, path: undefined, version: undefined, error: `下载 arkcli ${version}（${key}）失败：${errors.join('；')}` }
```

</details>

**依据 3 · 源码核查**：[arkcli.js:1232-1249](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/arkcli.js#L1232-L1249)

声明长度提前拒绝，实际长度在arrayBuffer之后检查。

<details>
<summary>查看原文（18行）</summary>

```text
  async #downloadBytes(url, timeoutMs) {
    if (typeof this.fetchImpl !== 'function') throw new Error('当前运行环境没有 fetch，无法直接下载')
    const init = {}
    if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
      init.signal = AbortSignal.timeout(timeoutMs)
    }
    const response = await this.fetchImpl(url, init)
    if (response === null || typeof response !== 'object') throw new Error('下载没有返回有效响应')
    const status = typeof response.status === 'number' ? response.status : (response.ok === false ? 0 : 200)
    if (response.ok === false || status < 200 || status >= 300) throw new Error(`HTTP ${status === 0 ? '失败' : status}`)
    if (typeof response.arrayBuffer !== 'function') throw new Error('下载响应不支持 arrayBuffer')
    // 先看声明的 Content-Length 就拒绝明显超大的响应，避免先把它读进内存再发现。
    const declared = Number(response.headers?.get?.('content-length') ?? Number.NaN)
    if (Number.isFinite(declared) && declared > MAX_BINARY_BYTES) throw new Error(`响应过大（${declared} 字节）`)
    const bytes = Buffer.from(await response.arrayBuffer())
    if (bytes.byteLength === 0) throw new Error('下载内容为空')
    if (bytes.byteLength > MAX_BINARY_BYTES) throw new Error(`响应过大（${bytes.byteLength} 字节）`)
    return bytes
```

</details>

**依据 4 · 源码核查**：[index.js:1527-1533](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/c7a02400397b15a8418736366d942e0382972246/index.js#L1527-L1533)

状态根依宿主解析，缺DSH_HOME不直接判不可用。

```text
export function resolveDshHomePath() {
  try {
    return resolveDshHome()
  } catch {
    // `os.homedir()` 在极端的裁剪环境里会抛错（拿不到用户主目录）；交给调用方给一句人话。
    return undefined
  }
```

#### 缺口

- Windows/macOS实际安装、SSO及大body资源行为没有本轮验收。
  **影响**：不能给持续安装结论或严格内存上限保证。
  **进一步探讨**：隔离环境以小型合成响应测试缺Content-Length/超长body、校验失败、并发安装与取消，再在授权目标系统核安装登录。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
