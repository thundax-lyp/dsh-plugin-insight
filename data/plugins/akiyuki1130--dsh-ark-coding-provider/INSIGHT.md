# dsh-ark-coding-provider

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[a412af3](https://github.com/Akiyuki1130/dsh-ark-coding-provider/tree/a412af3f085afe7989d1386efb426e3e4a1c3d8a)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/Akiyuki1130/dsh-ark-coding-provider)
<!-- END META -->

> **实现功能**：为DSH注册Ark Coding Plan模型路由，适配流式和工具消息，管理API Key/CLI多账户，并展示官方目录与套餐额度。

> **核心亮点**：将专用模型能力/流式与错误分类、多账户HOME/cache、固定CLI/额度统一接到DSH，并在yield后禁止混账号重试。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **风险与缺陷**：能力/容量是固定作者材料，额度不是账单；HOME只词法prefix、重复ID后者丢弃，冷却仍可请求且偏好优先。usage body不受headers timer完整保护，跨平台进程/授权需核。详见[Q03](#research-q03)、[Q04](#research-q04)。

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

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有火山方舟Coding Plan订阅和密钥/SSO权限的DSH用户。插件注册ark-coding路由，把兼容OpenAI的聊天/SSE、模型目录、CLI账户与额度界面接到宿主，API Key账户用于聊天，CLI账户还可读套餐/官方目录。不是免费模型、官方产品或替用户购买订阅。

合格结果必须路由/模型/账户正确、流式工具调用和最终状态完整、取消/错误分类清楚，额度标时间与来源。目录上的context/max-output/vision/reasoning字段是适配器声明，不等于当前平台每个版本实测能力，API Key能聊天也不证明能读控制面额度。

基线是手配通用OpenAI兼容provider再单独看门户额度。增量在专用模型能力/流式修补、多账户与CLI登录/配额接线；实际生成质量、订阅限制和费用需用户与平台核对，源码不提供这些商业承诺。

通用OpenAI兼容provider加门户额度；插件省能力/账户/CLI接线，生成质量/套餐规则仍由平台及任务验证。

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
| DSH_HOME可写状态目录 | CLI必需 | 各账户HOME/安装目录 | 无物理沙箱保证 |
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

> **思考**：能力/容量是固定作者材料，额度不是账单；HOME只词法prefix、重复ID后者丢弃，冷却仍可请求且偏好优先。usage body不受headers timer完整保护，跨平台进程/授权需核。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将专用模型能力/流式与错误分类、多账户HOME/cache、固定CLI/额度统一接到DSH，并在yield后禁止混账号重试。详见[Q02](#research-q02)、[Q03](#research-q03)。

将专用模型能力/流式与错误分类、多账户HOME/cache、固定CLI/额度统一接到DSH，并在yield后禁止混账号重试。详见[Q02](#research-q02)、[Q03](#research-q03)。

CLI按账户派生HOME，配置显式home只接受插件状态根下的resolve路径；ID白名单清洗，重复清洗ID只保第一个，避免共用HOME/key缓存。派生cache key包含id/type/home/ref，配置改变可自然失效。buildChildEnv用最小白名单和明确HOME，避免带宿主登录态/密钥到另一账户，这些是具体隔离措施。

homeForAccount只词法resolve/prefix，未核已有目录/父目录realpath；状态根内父链接指向外部时物理写入不由该判断保证。重复ID静默丢后来者、冷却/偏好也按ID，用户应核配置结果而非仅看原输入。HOME分离不构成OS账户/进程沙箱。

spawnCollect detached进程组、error/close处理、stdout/stderr限制和timeout killTree，优于只kill npm包装器。安装显式npm prefix固定版本，安装后执行status确认文件/版本存在，不能只把npm0当成功。Windows/POSIX进程树和SSO回环回调实际清理仍需对应平台核；本轮不登录或执行npm安装。

<a id="detail-section-5"></a>

### 1.4 主要限制

能力/容量是固定作者材料，额度不是账单；HOME只词法prefix、重复ID后者丢弃，冷却仍可请求且偏好优先。usage body不受headers timer完整保护，跨平台进程/授权需核。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有试用，已有订阅用户先可信本机单API Key小请求，确需额度/多账号再核CLI HOME/取消与身份。详见[Q07](#research-q07)。

合格结果必须路由/模型/账户正确、流式工具调用和最终状态完整、取消/错误分类清楚，额度标时间与来源。目录上的context/max-output/vision/reasoning字段是适配器声明，不等于当前平台每个版本实测能力，API Key能聊天也不证明能读控制面额度。

基线是手配通用OpenAI兼容provider再单独看门户额度。增量在专用模型能力/流式修补、多账户与CLI登录/配额接线；实际生成质量、订阅限制和费用需用户与平台核对，源码不提供这些商业承诺。

采用建议：有试用，已有订阅用户先可信本机单API Key小请求，确需额度/多账号再核CLI HOME/取消与身份。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。专用流式/轮换与最小CLI环境明确，HOME物理范围、能力/额度实时口径和body/进程平台边界需验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、accounts.js、arkcli.js、usage.js、models.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：五Host模块关键stream/账号/CLI/额度/模型表和包声明；client只登记界面能力，非全6.7k行审计。不安装CLI/SSO/付费请求或运行测试。
- 下一步：可继续模拟首chunk前后故障、偏好冷却/改HOME/父链接、慢body与CLI取消，核身份/最终状态/usage和资源残留。

**分析版本**

- **仓库**：[Akiyuki1130/dsh-ark-coding-provider](https://github.com/Akiyuki1130/dsh-ark-coding-provider)
- **版本号**：0.5.0（[固定提交 a412af3](https://github.com/Akiyuki1130/dsh-ark-coding-provider/tree/a412af3f085afe7989d1386efb426e3e4a1c3d8a)）
- **版本日期**：2026-10-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索账户/端点/能力版本与请求阶段/终止usage收据、物理HOME和body预算，比较错身份/重复请求及元数据成本；未实现。详见[Q07](#research-q07)。

可继续模拟首chunk前后故障、偏好冷却/改HOME/父链接、慢body与CLI取消，核身份/最终状态/usage和资源残留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 6750 | 4869 | 1521 | — |
| .md | source | 1 | 441 | — | — | 8106 |
| .mjs | test | 7 | 4425 | 3641 | 588 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Akiyuki1130/dsh-ark-coding-provider/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Akiyuki1130/dsh-ark-coding-provider/issues?q=is%3Aissue+created%3A2026-09-22T07%3A31%3A25.925Z..2026-10-22T07%3A31%3A25.925Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Akiyuki1130/dsh-ark-coding-provider/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A31%3A25.925Z..2026-10-22T07%3A31%3A25.925Z)



统计日期：2026-10-22。

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

**依据 1 · 作者声明**：[README.md:3-10](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/README.md#L3-L10)

社区定位/订阅前提。

```text
**火山方舟 Coding Plan** 的 DeepSeek Harness LLM 提供商插件（非官方社区集成）。

仿照 [`@mars-sea/dsh-commandcode-provider`](https://github.com/Mars-Sea/dsh-commandcode-provider)
的形态做的：注册一个提供商路由、在 Models 页挂一张属于自己的卡片、在设置里开一个
同名分区，把模型目录、容量事实和密钥管理都放在那里。

> 这是社区集成，不是火山引擎官方产品。你需要自己的火山方舟账号与 Coding Plan 订阅，
> 并遵守火山引擎的服务条款。
```

**依据 2 · 作者声明**：[README.md:20-30](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/README.md#L20-L30)

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

**依据 3 · 源码核查**：[index.js:61-76](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/index.js#L61-L76)

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

**依据 4 · 作者声明**：[accounts.js:5-15](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/accounts.js#L5-L15)

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

**依据 1 · 源码核查**：[index.js:797-843](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/index.js#L797-L843)

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

**依据 2 · 源码核查**：[index.js:858-868](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/index.js#L858-L868)

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

**依据 3 · 源码核查**：[index.js:915-924](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/index.js#L915-L924)

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

**依据 4 · 源码核查**：[accounts.js:205-235](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/accounts.js#L205-L235)

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

spawnCollect detached进程组、error/close处理、stdout/stderr限制和timeout killTree，优于只kill npm包装器。安装显式npm prefix固定版本，安装后执行status确认文件/版本存在，不能只把npm0当成功。Windows/POSIX进程树和SSO回环回调实际清理仍需对应平台核；本轮不登录或执行npm安装。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1570-1618](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/index.js#L1570-L1618)

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

**依据 2 · 源码核查**：[accounts.js:55-58](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/accounts.js#L55-L58)

ID清洗。

```text
export function sanitizeAccountId(raw, fallback = 'default') {
  const text = typeof raw === 'string' ? raw.trim() : ''
  const cleaned = text.replace(ID_SAFE, '_').replace(/^\.+/, '').slice(0, 64)
  return cleaned === '' ? fallback : cleaned
```

**依据 3 · 源码核查**：[accounts.js:131-139](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/accounts.js#L131-L139)

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

**依据 4 · 源码核查**：[arkcli.js:307-345](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/arkcli.js#L307-L345)

最小子进程环境设计。

<details>
<summary>查看原文（39行）</summary>

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
 * @param home - 该账号的 HOME（绝对路径）。
 * @param extra - 追加/覆盖的键，值为 undefined 的键会被跳过。
 * @throws 当 home 缺失或为空。
 */
export function buildChildEnv(home, extra) {
  if (typeof home !== 'string' || home === '') {
    throw new Error('必须显式给定 HOME：arkcli 把状态放在 $HOME/.arkcli 且没有环境变量可以覆盖，多账号隔离完全依赖它。')
  }
  const put = (target, key, value) => {
    if (value !== undefined) target[key] = value
  }
  const env = {}
  put(env, 'PATH', process.env.PATH)
  env.HOME = home
  env.LANG = process.env.LANG ?? 'C.UTF-8'
  env.LC_ALL = process.env.LC_ALL ?? 'C.UTF-8'
  put(env, 'TMPDIR', process.env.TMPDIR ?? tmpdir())
  env.NO_COLOR = '1'
  env.ARKCLI_NO_UPDATE_NOTIFIER = '1'
  env.ARKCLI_CALLER_TYPE = 'ai_agent'
  env.ARKCLI_CALLER_NAME = 'dsh-ark-coding-provider'
  for (const [key, value] of Object.entries(extra ?? {})) put(env, key, value)
  return env
}

// ---------------------------------------------------------------------------
// 归一化
// ---------------------------------------------------------------------------

```

</details>

**依据 5 · 源码核查**：[arkcli.js:629-673](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/arkcli.js#L629-L673)

spawn组/error/输出/timeout。

<details>
<summary>查看原文（45行）</summary>

```text
  async #spawnCollect(bin, args, options) {
    const { env, timeoutMs } = options
    return await new Promise((resolve) => {
      let child
      try {
        // `detached: true`：起独立进程组，这样超时能整组带走（见 #killTree）。
        child = this.spawn(bin, args, { stdio: ['ignore', 'pipe', 'pipe'], env, detached: true })
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
          this.#killTree(child)
          done({ ok: false, code: null, stdout, stderr, error: '超时', failure: 'timeout' })
        }, timeoutMs)
```

</details>

**依据 6 · 源码核查**：[arkcli.js:689-697](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/arkcli.js#L689-L697)

进程组kill fallback。

```text
  #killTree(child) {
    const pid = child?.pid
    if (typeof pid === 'number' && pid > 0) {
      try {
        process.kill(-pid, 'SIGKILL')
        return
      } catch { /* 进程组可能已经没了，退回杀单个进程 */ }
    }
    try { child?.kill?.('SIGKILL') } catch { /* 已经退出就无所谓 */ }
```

**依据 7 · 源码核查**：[arkcli.js:791-813](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/arkcli.js#L791-L813)

固定npm安装与回读status。

<details>
<summary>查看原文（23行）</summary>

```text
    const wanted = version ?? this.packageVersion ?? DEFAULT_INSTALL_VERSION
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    const args = ['install', '--prefix', dir, `${ARKCLI_PACKAGE}@${wanted}`, ...NPM_INSTALL_FLAGS]
    // npm 也用最小环境：否则 npm 会把宿主 HOME 下的 .npm 缓存/配置带进这次安装。
    // 中性 HOME 建不出来也无所谓（npm 自己会建缓存目录），但环境绝不能退回"继承父进程"。
    const npmHome = this.#neutralHome()
    try { this.mkdir(npmHome, { recursive: true }) } catch { /* 让 npm 自己决定 */ }
    const env = buildChildEnv(npmHome)
    const collected = await this.#spawnCollect(npm, args, { env, timeoutMs })
    if (!collected.ok) {
      const tail = collected.stderr.trim().slice(-400) || collected.stdout.trim().slice(-400) || collected.error
      return { ok: false, path: undefined, version: undefined, error: `安装 ${ARKCLI_PACKAGE}@${wanted} 失败：${tail}` }
    }
    const resolved = await this.resolveBin()
    if (resolved.path === undefined) {
      return { ok: false, path: undefined, version: undefined, error: `npm 退出码为 0，但 ${managedBinPath(this.dshHome)} 不存在。` }
    }
    const status = await this.status({ home: this.#neutralHome() })
    if (!status.installed) {
      return { ok: false, path: resolved.path, version: status.version, error: status.error ?? '安装后 arkcli 无法执行。' }
    }
    this.logger?.debug?.(`[arkcli] 已安装 ${ARKCLI_PACKAGE}@${wanted} → ${resolved.path}`)
    return { ok: true, path: resolved.path, version: status.version ?? wanted, error: undefined }
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

**依据 1 · 作者声明**：[models.js:1-23](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/models.js#L1-L23)

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

**依据 2 · 源码核查**：[usage.js:155-181](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/usage.js#L155-L181)

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

**依据 3 · 源码核查**：[usage.js:212-225](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/usage.js#L212-L225)

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

**依据 4 · 源码核查**：[index.js:847-854](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/index.js#L847-L854)

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

**依据 5 · 源码核查**：[index.js:929-947](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/index.js#L929-L947)

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

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 相容DSH llm/credentials/launchEnvironment/Typert | 必需 | provider与设置接口 | 声明rc.2为作者目标非本轮验收 |
| Ark Coding Plan订阅/API Key | 聊天必需 | 数据面模型请求 | 普通非套餐key可能拒绝 |
| arkcli与浏览器SSO | 仅CLI账户 | 官方目录/真实套餐额度 | 可显式安装，API Key模式不等于控制面登录 |
| DSH_HOME可写状态目录 | CLI必需 | 各账户HOME/安装目录 | 无物理沙箱保证 |
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

#### 证据与依据

**依据 1 · 源码核查**：[package.json:48-66](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/package.json#L48-L66)

DSH兼容/peer声明。

<details>
<summary>查看原文（19行）</summary>

```text
    }
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-credentials": "^0.2.0-rc.2",
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

**依据 2 · 源码核查**：[index.js:61-78](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/index.js#L61-L78)

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

**依据 3 · 源码核查**：[arkcli.js:791-813](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/arkcli.js#L791-L813)

CLI版本/状态前提。

<details>
<summary>查看原文（23行）</summary>

```text
    const wanted = version ?? this.packageVersion ?? DEFAULT_INSTALL_VERSION
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    const args = ['install', '--prefix', dir, `${ARKCLI_PACKAGE}@${wanted}`, ...NPM_INSTALL_FLAGS]
    // npm 也用最小环境：否则 npm 会把宿主 HOME 下的 .npm 缓存/配置带进这次安装。
    // 中性 HOME 建不出来也无所谓（npm 自己会建缓存目录），但环境绝不能退回"继承父进程"。
    const npmHome = this.#neutralHome()
    try { this.mkdir(npmHome, { recursive: true }) } catch { /* 让 npm 自己决定 */ }
    const env = buildChildEnv(npmHome)
    const collected = await this.#spawnCollect(npm, args, { env, timeoutMs })
    if (!collected.ok) {
      const tail = collected.stderr.trim().slice(-400) || collected.stdout.trim().slice(-400) || collected.error
      return { ok: false, path: undefined, version: undefined, error: `安装 ${ARKCLI_PACKAGE}@${wanted} 失败：${tail}` }
    }
    const resolved = await this.resolveBin()
    if (resolved.path === undefined) {
      return { ok: false, path: undefined, version: undefined, error: `npm 退出码为 0，但 ${managedBinPath(this.dshHome)} 不存在。` }
    }
    const status = await this.status({ home: this.#neutralHome() })
    if (!status.installed) {
      return { ok: false, path: resolved.path, version: status.version, error: status.error ?? '安装后 arkcli 无法执行。' }
    }
    this.logger?.debug?.(`[arkcli] 已安装 ${ARKCLI_PACKAGE}@${wanted} → ${resolved.path}`)
    return { ok: true, path: resolved.path, version: status.version ?? wanted, error: undefined }
```

</details>

**依据 4 · 源码核查**：[usage.js:190-220](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/usage.js#L190-L220)

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

#### 证据与依据

**依据 1 · 源码核查**：[index.js:819-839](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/index.js#L819-L839)

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

**依据 2 · 源码核查**：[arkcli.js:629-673](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/arkcli.js#L629-L673)

CLI预算/错误状态。

<details>
<summary>查看原文（45行）</summary>

```text
  async #spawnCollect(bin, args, options) {
    const { env, timeoutMs } = options
    return await new Promise((resolve) => {
      let child
      try {
        // `detached: true`：起独立进程组，这样超时能整组带走（见 #killTree）。
        child = this.spawn(bin, args, { stdio: ['ignore', 'pipe', 'pipe'], env, detached: true })
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
          this.#killTree(child)
          done({ ok: false, code: null, stdout, stderr, error: '超时', failure: 'timeout' })
        }, timeoutMs)
```

</details>

**依据 3 · 源码核查**：[usage.js:155-181](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/usage.js#L155-L181)

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

**依据 4 · 源码核查**：[index.js:1570-1618](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/index.js#L1570-L1618)

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

**依据 1 · 源码核查**：[index.js:819-839](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/index.js#L819-L839)

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

**依据 2 · 源码核查**：[accounts.js:228-235](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/accounts.js#L228-L235)

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

**依据 3 · 源码核查**：[index.js:1580-1611](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/index.js#L1580-L1611)

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

**依据 4 · 源码核查**：[usage.js:212-225](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/usage.js#L212-L225)

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

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
