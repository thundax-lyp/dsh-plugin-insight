# EchoBird

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[3dea068](https://github.com/edison7009/EchoBird/tree/3dea068c9950ef3e6327c2650ef0df5badcee37b)

<!-- BEGIN META -->
[![GitHub ★ 3,442](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C442&color=yellow&logo=github&style=flat)](https://github.com/edison7009/EchoBird)
<!-- END META -->

> **实现功能**：桌面AI工具管理器，提供账号与模型配置、安装管理、本地模型和多候选路由入口。

> **核心亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持的增量是将多provider候选与客户端入口分开，以桌面控制面、统一本地协议和健康状态减少手工改endpoint。它不是按任务质量选最佳模型，账号切换与API路由分开；本轮其他安装/账号功能仅作者范围，不据此加分。

> **风险与缺陷**：[Q03](#research-q03)表明previous_response_id续接绑定原候选和fingerprint，provider变化或过期需完整输入；background/conversation也被拒绝。自动failover不能概括为状态无损迁移或输出等价。文档与源码差异加重配置判断负担，实际发布二进制兼容未知，不照抄旧限制或宣称全支持。

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
  - [Q01 · EchoBird服务什么任务，账号与API路由是否同一件事？](#detail-section-11)
  - [Q02 · 候选配置如何进入实际多协议路由，README限制仍准确吗？](#detail-section-12)
  - [Q03 · 有状态续接还能任意切provider吗？](#detail-section-13)
  - [Q04 · 统一入口增加什么全周期负担，怎样退出？](#detail-section-14)
  - [Q05 · 按协议与续接能力建立探针能否减少错误选择？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：根项目是Tauri/Rust加React的桌面AI工具管理应用，不是可安装到DSH profile的单一插件。作者覆盖工具安装、模型配置、账号切换和本地模型等场景；本轮深入Smart Router，其合格结果是兼容客户端发到本地入口后由明确候选响应，出错能说明哪个provider失败和如何退回直接调用。

客户端直接配置provider，故障时用户手动切endpoint。只比较相同协议和任务的恢复/人工成本，不将赞助商宣传或免费模型目录当质量和经济性依据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 候选配置 | 复用模型并维护优先级 | 需可用provider和适合的数据范围 |
| 多协议本地API | 兼容客户端统一入口 | 源码含Responses，旧README限制不准确 |
| 故障分类冷却 | 暂停失败资源并恢复优先级 | 不是按质量或价格选模型 |
| Responses续接绑定 | 保持原provider状态归属 | 过期/变更要求完整输入，非任意迁移 |
| listener控制 | 启停本地服务 | 在途请求独立drain |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| EchoBird桌面应用常驻 | 是 | 本地服务与配置 | 停应用后客户端须恢复直连 |
| 有效provider或本地模型 | 是 | 实际响应 | 本地入口不等于数据不离机 |
| 兼容客户端协议 | 是 | Chat/Messages/有限Responses | background/conversation不支持 |
| 原配置备份与凭据治理 | 试用需要 | 退出和数据边界 | 共享登录可能影响其他工具 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户备份客户端/账号配置，选少量候选 | 输入允许给所有候选处理 |
| 2 | 配置优先级和本地入口/密钥 | 兼容协议基本任务可核查 |
| 3 | 比较直接provider与Router | 记录正确结果、尝试数和费用 |
| 4 | 检查完整输入与绑定续接失败 | 不把切换当状态迁移 |
| 5 | 不合适时停新请求并恢复直连 | 核对在途请求、原配置与账号状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 桌面应用、provider账户/网络 | 备份原配置、候选和协议核对 | 金额/耗时未知，不直接改唯一生产配置 |
| 持续使用 | provider及重试可能计费、应用常驻 | 维护额度、能力、冷却与数据范围 | 不按统一endpoint推断节费 |
| 失败恢复 | 多尝试请求费用未知 | 完整输入重发/恢复直连、核对在途请求 | 有状态续接不能任意换候选 |
| 退出 | 停listener与后台常驻 | 恢复客户端及共享账号配置 | 在途drain独立，停止不撤销上游工作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多候选入口 | profile配置、端点、授权和候选解析 | 净配置节时及真实兼容 |
| 故障恢复 | 分类冷却和候选优先级 | 多provider输出/工具结果等价 |
| Responses | 当前代码挂载并处理 | 发布包一致，background/conversation不支持 |
| 续接 | response绑定候选和fingerprint | 非任意状态迁移，完整输入恢复代价未知 |

> **思考**：[Q03](#research-q03)表明previous_response_id续接绑定原候选和fingerprint，provider变化或过期需完整输入；background/conversation也被拒绝。自动failover不能概括为状态无损迁移或输出等价。文档与源码差异加重配置判断负担，实际发布二进制兼容未知，不照抄旧限制或宣称全支持。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持的增量是将多provider候选与客户端入口分开，以桌面控制面、统一本地协议和健康状态减少手工改endpoint。它不是按任务质量选最佳模型，账号切换与API路由分开；本轮其他安装/账号功能仅作者范围，不据此加分。

[Q01](#research-q01)、[Q02](#research-q02)支持的增量是将多provider候选与客户端入口分开，以桌面控制面、统一本地协议和健康状态减少手工改endpoint。它不是按任务质量选最佳模型，账号切换与API路由分开；本轮其他安装/账号功能仅作者范围，不据此加分。

[Q02](#research-q02)的公开配置/内部凭据及Tauri/Rust分层可复用，[Q03](#research-q03)的绑定续接避免把上游状态错误迁到别家；代价是大体量协议/流/健康状态逻辑。runtime把listener释放和在途drain分开，所有权清晰但退出不能等同已撤销请求。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)表明previous_response_id续接绑定原候选和fingerprint，provider变化或过期需完整输入；background/conversation也被拒绝。自动failover不能概括为状态无损迁移或输出等价。文档与源码差异加重配置判断负担，实际发布二进制兼容未知，不照抄旧限制或宣称全支持。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)、[Q05](#research-q05)建议能恢复配置的用户只用少量已知provider在非关键任务试路由，先核对协议和有状态续接。不要凭延迟探针或旧README决定全部兼容；出现协议/数据边界/恢复问题，停Router并恢复直接endpoint。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

深入核查Smart Router固定源码；README的Responses缺失说法与当前端点冲突，源码支持有限Responses路径而非全协议兼容。未运行桌面、模型或目标测试。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/api/smartRouter.ts、src-tauri/src/commands/smart_router_commands.rs、src-tauri/src/services/smart_router/mod.rs、src-tauri/src/services/smart_router/server.rs、src-tauri/src/services/smart_router/runtime.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根应用以Smart Router为深入目标，只读固定源码；账号切换/工具安装/本地LLM等仅按作者说明定位，未全面审计，不执行应用、安装、模型、测试或账号操作。源码不保证下载二进制同版。
- 下一步：后续固定桌面产物、客户端、provider和任务，对Chat/Messages/Responses、工具、部分流、绑定续接及配置恢复记录结果与费用，再决定持续使用。

**分析版本**

- **仓库**：[edison7009/EchoBird](https://github.com/edison7009/EchoBird)
- **版本号**：6.0.8（[固定提交 3dea068](https://github.com/edison7009/EchoBird/tree/3dea068c9950ef3e6327c2650ef0df5badcee37b)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的协议/续接能力探针，显示固定provider任务验收而非只看延迟；用合成工具/结构化/续接任务对照优先级路由，若误选不降或探针费用维护过大就停止。该设想不计已有贡献。

后续固定桌面产物、客户端、provider和任务，对Chat/Messages/Responses、工具、部分流、绑定续接及配置恢复记录结果与费用，再决定持续使用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 3526 | — | — | 31768 |
| .js | source | 6 | 212 | 192 | 22 | — |
| .mjs | test | 1 | 152 | 142 | 12 | — |
| .ts | test | 37 | 3599 | 3355 | 45 | — |
| .ts | source | 140 | 14978 | 13652 | 725 | — |
| .tsx | source | 106 | 28823 | 26251 | 1693 | — |
| .tsx | test | 107 | 44297 | 42752 | 218 | — |

</details>

**活跃度**

[![Issue 未关闭 394](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=394&color=grey&logo=github&style=flat)](https://github.com/edison7009/EchoBird/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 26](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=26&color=grey&logo=github&style=flat)](https://github.com/edison7009/EchoBird/issues?q=is%3Aissue+created%3A2026-09-27T02%3A06%3A36.518Z..2026-10-27T02%3A06%3A36.518Z) [![近30天关闭 5](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=grey&logo=github&style=flat)](https://github.com/edison7009/EchoBird/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A06%3A36.518Z..2026-10-27T02%3A06%3A36.518Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：EchoBird本地Smart Router多协议与有状态续接的贡献、限制和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · EchoBird服务什么任务，账号与API路由是否同一件事？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根项目是Tauri/Rust加React的桌面AI工具管理应用，不是可安装到DSH profile的单一插件。作者覆盖工具安装、模型配置、账号切换和本地模型等场景；本轮深入Smart Router，其合格结果是兼容客户端发到本地入口后由明确候选响应，出错能说明哪个provider失败和如何退回直接调用。

简单基线是用户逐个改客户端endpoint或在故障时手动切换provider。Router复用已配置模型并保存候选顺序、启用状态和本地入口，将一次客户端配置与候选维护分开，减少手动改多个客户端的步骤。它不是按任务质量或价格自动找最佳模型，也不能从同一endpoint推断候选输出等价。

README把保存账号切换和模型API路由分别说明，ChatGPT/Codex共享本地账号配置，切换影响共享登录。这是作者对副作用的明示，不应把本地路由和账号轮换混成“免费额度自动切换”。实际账号存储、所有工具安装/修复和硬件推理不在本轮深入范围；不据其功能目录证明各项已验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:70-105](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/README.md#L70-L105)

作者说明桌面场景、账号共享与路由优先级，不能当独立运行效果。

<details>
<summary>查看原文（36行）</summary>

```text
EchoBird offers **4 scenarios** sharing a **unified model data hub** — **configure once, used everywhere**.

### 4 scenarios

- **Install & Repair Agent** — let an AI install and fix mainstream tools (Claude Code, OpenClaw, Hermes Agent, …); works locally and remotely
- **One-click local LLM** — bundled vLLM / SGLang / llama.cpp runtimes; pick a quant, hit START
- **My AI Projects** — onboard and manage your own vibe-coded apps and games inside EchoBird
- **App Manager** — one-click launch and management for every AI / Agent app & game

### Shared foundation

- **Model Nexus** — a unified data hub for OpenAI / Anthropic / local LLMs / API Routers; configure once and all 4 scenarios pick it up; one-click latency check before you commit

**Cross-platform** — Windows, macOS, Linux (x64 + arm64)

## Multi-account switching — ChatGPT, Codex CLI, and Claude Code

Manage multiple saved accounts in EchoBird's **App Manager**, view their usage quota, and choose the account to use when launching a tool.

- **ChatGPT desktop and Codex CLI** — add OpenAI accounts through browser sign-in, then select a saved account and launch. Both tools share the local Codex account configuration, so switching affects the shared login.
- **Claude Code** — add accounts through browser authorization, select an account, and launch Claude Code with it. View the plan, remaining 5-hour and 7-day quota, and reset countdowns when available.
- **Quota at a glance** — check remaining quota and reset times, refresh account usage, and remove saved accounts from the same panel.

**Get started:** open App Manager → choose ChatGPT, Codex CLI, or Claude Code → add and authorize your accounts → select an account → launch. Account selection takes effect on launch; choose a third-party model instead when you want to use an API provider.

## Multi-model smart routing — priority and automatic failover

EchoBird's **Smart Router** puts multiple model providers behind one local API. Add free, paid, or private models from Model Nexus, then drag the cards into your preferred order. The router tries models in that order and automatically falls back when a model is rate-limited, out of quota, or temporarily unavailable. After cooldown, it retries models in priority order.

- **Up to 20 models** — reuse your configured models without entering their API keys again.
- **One endpoint for compatible tools** — supports OpenAI Chat Completions and Anthropic Messages, including clients such as Claude Code.
- **Explicit priority** — you control the order; routing follows that order rather than selecting models by task or price.

**Get started:** open Smart Router → add models from My Models or the free-model directory → drag to set priority → choose **Auto Router** for a compatible tool in App Manager. Keep EchoBird running while tools use its local API.

Smart Router switches between configured model APIs; it does not automatically rotate saved login accounts. ChatGPT / Codex CLI third-party models require the **Responses API**, which Smart Router does not currently expose. For those tools, use account switching or a Responses-compatible provider directly.
```

</details>

**依据 2 · 源码核查**：[package.json:1-7](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/package.json#L1-L7)

根包桌面应用身份。

```text
{
  "name": "echobird",
  "version": "6.0.8",
  "description": "AI Model & Skill Management Desktop Application",
  "author": "Echo Bird Team",
  "license": "MIT",
  "type": "module",
```

**依据 3 · 源码核查**：[src-tauri/src/services/smart_router/mod.rs:100-135](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src-tauri/src/services/smart_router/mod.rs#L100-L135)

候选启用状态和公开入口配置。

<details>
<summary>查看原文（36行）</summary>

```text
impl StoredConfig {
    fn active_candidate_ids(&self) -> Vec<String> {
        self.candidate_ids
            .iter()
            .filter(|id| !self.disabled_candidate_ids.contains(id))
            .cloned()
            .collect()
    }

    fn set_candidate_enabled(&mut self, internal_id: &str, enabled: bool) -> Result<(), String> {
        if !self.candidate_ids.iter().any(|id| id == internal_id) {
            return Err(format!("Smart Router candidate not found: {internal_id}"));
        }
        self.disabled_candidate_ids.retain(|id| id != internal_id);
        if !enabled {
            self.disabled_candidate_ids.push(internal_id.to_string());
        }
        Ok(())
    }
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PublicConfig {
    pub id: String,
    pub name: String,
    pub master_enabled: bool,
    pub group_enabled: bool,
    pub enabled: bool,
    pub candidate_ids: Vec<String>,
    pub disabled_candidate_ids: Vec<String>,
    pub usable_candidate_count: usize,
    pub base_url: String,
    pub model_id: String,
    pub port: u16,
    pub running: bool,
```

</details>

#### 缺口

- 用户在多provider故障时手动切换的真实时间和必要性未知
  **影响**：不能推导统一入口一定值得引入桌面管理器
  **进一步探讨**：以同一客户端/任务比较直接provider与Router故障恢复时间及人工操作

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 候选配置如何进入实际多协议路由，README限制仍准确吗？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

前端smartRouter API经Tauri invoke调用Rust命令，配置候选ID、启用状态、模型别名和端口。Rust以profile作用域执行并给出PublicConfig，server按请求回读配置、校验本地API key、把候选ID解析为用户模型或正在运行的本地模型，再进入protected_route。这是桌面控制面到本地数据面的具体链路，而不是只有UI。

固定提交的server明确挂载chat/completions、messages、responses以及音频路径；handle_responses进行授权和候选选择后使用Responses协议。因此README第105行“不暴露Responses”与当前源码不一致，不能照抄成当前能力缺失。源码存在端点也不等于全协议兼容；后续Q03说明background与conversation等限制，发布二进制是否包含同一实现也未验收。

可借鉴的是将公开配置与内部凭据、候选身份分开，并从同一Rust服务维护多个协议入口；代价是转换语义、流解析、账户状态与profile生命周期复杂。API复用并不自动实现原生平台全部功能，也不证明下游客户端已经通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/api/smartRouter.ts:52-98](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src/api/smartRouter.ts#L52-L98)

前端配置与启用操作进入Tauri。

<details>
<summary>查看原文（47行）</summary>

```text
export async function getSmartRouterConfig(routerId?: string): Promise<SmartRouterConfig> {
  return invoke('get_smart_router_config', routerId ? { routerId } : undefined);
}

export async function setSmartRouterEnabled(enabled: boolean): Promise<SmartRouterConfig> {
  const result = await invoke<SmartRouterConfig>('set_smart_router_enabled', { enabled });
  window.dispatchEvent(new Event('models-changed'));
  return result;
}

export async function setSmartRouterCandidateEnabled(
  internalId: string,
  enabled: boolean,
  routerId?: string
): Promise<SmartRouterConfig> {
  return invoke('set_smart_router_candidate_enabled', { internalId, enabled, routerId });
}

export async function getSmartRouterActivity(routerId?: string): Promise<SmartRouterActivity> {
  return invoke('get_smart_router_activity', routerId ? { routerId } : undefined);
}

export async function setSmartRouterCandidates(
  candidateIds: string[],
  routerId?: string
): Promise<SmartRouterConfig> {
  const result = await invoke<SmartRouterConfig>('set_smart_router_candidates', {
    candidateIds,
    routerId,
  });
  window.dispatchEvent(new Event('models-changed'));
  return result;
}

export async function getSmartRouterCandidates(routerId?: string): Promise<ModelConfig[]> {
  return invoke('get_smart_router_candidates', routerId ? { routerId } : undefined);
}

export async function removeSmartRouterCandidate(
  internalId: string,
  routerId?: string
): Promise<SmartRouterConfig> {
  const result = await invoke<SmartRouterConfig>('remove_smart_router_candidate', {
    internalId,
    routerId,
  });
  window.dispatchEvent(new Event('models-changed'));
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/commands/smart_router_commands.rs:4-48](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src-tauri/src/commands/smart_router_commands.rs#L4-L48)

Rust命令按profile操作候选。

<details>
<summary>查看原文（45行）</summary>

```text
#[tauri::command]
pub async fn set_smart_router_enabled(enabled: bool) -> Result<PublicConfig, String> {
    smart_router::profiles::set_master_enabled(enabled).await
}

#[tauri::command]
pub fn set_smart_router_candidate_enabled(
    internal_id: String,
    enabled: bool,
    router_id: Option<String>,
) -> Result<PublicConfig, String> {
    smart_router::profiles::checked(router_id, || {
        smart_router::set_candidate_enabled(&internal_id, enabled)
    })?
}

#[tauri::command]
pub fn get_smart_router_config(router_id: Option<String>) -> Result<PublicConfig, String> {
    smart_router::profiles::checked(router_id, smart_router::get_public_config)?
}

#[tauri::command]
pub fn get_smart_router_activity(router_id: Option<String>) -> Result<PublicActivity, String> {
    smart_router::profiles::checked(router_id, smart_router::get_public_activity)
}

#[tauri::command]
pub fn set_smart_router_candidates(
    candidate_ids: Vec<String>,
    router_id: Option<String>,
) -> Result<PublicConfig, String> {
    smart_router::profiles::checked(router_id, || smart_router::set_candidate_ids(candidate_ids))?
}

#[tauri::command]
pub fn get_smart_router_candidates(router_id: Option<String>) -> Result<Vec<ModelConfig>, String> {
    smart_router::profiles::checked(router_id, smart_router::get_candidate_models)
}

#[tauri::command]
pub fn remove_smart_router_candidate(
    internal_id: String,
    router_id: Option<String>,
) -> Result<PublicConfig, String> {
    smart_router::profiles::checked(router_id, || smart_router::remove_candidate(&internal_id))?
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:651-675](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src-tauri/src/services/smart_router/server.rs#L651-L675)

生产server挂载包含Responses的实际端点。

<details>
<summary>查看原文（25行）</summary>

```text
pub(super) fn start(
    listener: std::net::TcpListener,
) -> Result<super::runtime::ServerControl, String> {
    let state = AppState::new()?;
    let shutdown = state.shutdown.clone();
    let app = Router::new()
        .route("/health", get(handle_health))
        .route("/v1/models", get(handle_models))
        .route("/models", get(handle_models))
        .route("/v1/chat/completions", post(handle_chat))
        .route("/chat/completions", post(handle_chat))
        .route("/v1/responses", post(handle_responses))
        .route("/responses", post(handle_responses))
        .route("/v1/messages", post(handle_messages))
        .route("/messages", post(handle_messages))
        .route("/v1/audio/transcriptions", post(voice::handle))
        .route("/audio/transcriptions", post(voice::handle))
        .layer(DefaultBodyLimit::max(MAX_REQUEST_BODY_BYTES))
        .with_state(state);
    let listener = tokio::net::TcpListener::from_std(listener).map_err(|e| e.to_string())?;
    let port = listener.local_addr().map_err(|e| e.to_string())?.port();

    log::info!("[SmartRouter] listening on 127.0.0.1:{port}");
    Ok(super::runtime::ServerControl::start(
        listener, app, shutdown,
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:873-910](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src-tauri/src/services/smart_router/server.rs#L873-L910)

Responses授权、候选与协议入口。

<details>
<summary>查看原文（38行）</summary>

```text
async fn handle_responses(
    State(mut state): State<AppState>,
    headers: HeaderMap,
    body: Result<Json<Value>, JsonRejection>,
) -> Response {
    let body = match body {
        Ok(Json(body)) => body,
        Err(error) if error.status() == StatusCode::PAYLOAD_TOO_LARGE => {
            return openai_error(error.status(), &error.body_text())
        }
        Err(error) => return error.into_response(),
    };
    state.request_epoch = Some(state.standby.epoch());
    let request_config = match config_for_request(&state) {
        Ok(config) => config,
        Err(error) => return openai_error(StatusCode::INTERNAL_SERVER_ERROR, &error),
    };
    if !is_authorized(&headers, &request_config.api_key) {
        return openai_error(StatusCode::UNAUTHORIZED, "Invalid EchoBird router API key");
    }
    state.model_id = request_config.model_id;
    let candidates = match select_candidates(
        &mut state,
        body["model"].as_str().unwrap_or_default(),
        resolve_candidates(request_config.candidate_ids),
        false,
    ) {
        Ok(candidates) => candidates,
        Err(error) => return openai_error(StatusCode::NOT_FOUND, &error),
    };
    protected_route(
        &state,
        &headers,
        body,
        candidates,
        ClientProtocol::Responses,
    )
    .await
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:968-1008](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src-tauri/src/services/smart_router/server.rs#L968-L1008)

候选解析与密钥使用边界。

<details>
<summary>查看原文（41行）</summary>

```text
fn resolve_candidates(ids: Vec<String>) -> Vec<Candidate> {
    resolve_candidates_from(
        ids,
        &model_manager::get_user_models(),
        &crate::services::local_llm::get_server_info_sync(),
    )
}

fn resolve_candidates_from(
    ids: Vec<String>,
    user_models: &[crate::models::model::ModelConfig],
    local_server: &crate::services::local_llm::LocalServerInfo,
) -> Vec<Candidate> {
    ids.into_iter()
        .filter_map(|id| {
            if id == "local-server" && local_server.running {
                let model_id = local_server.model_name.clone();
                let base_url = format!("http://127.0.0.1:{}/v1", local_server.port);
                let api_key = local_server.api_key.clone();
                return Some(Candidate {
                    attempt: None,
                    internal_id: id,
                    fingerprint: candidate_fingerprint(&model_id, &base_url, &api_key),
                    model_id,
                    base_url,
                    api_key,
                    account_source: None,
                });
            }

            let model = user_models.iter().find(|model| model.internal_id == id)?;
            let model_id = model.model_id.as_deref()?.trim();
            if model_id.is_empty() || model.base_url.trim().is_empty() {
                return None;
            }
            let api_key = model_manager::decrypt_key_for_use(&model.api_key);

            Some(Candidate {
                attempt: None,
                internal_id: model.internal_id.clone(),
                fingerprint: candidate_fingerprint(
```

</details>

**依据 6 · 作者声明**：[README.md:95-105](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/README.md#L95-L105)

README保留旧限制，与生产源码有具体冲突。

<details>
<summary>查看原文（11行）</summary>

```text
## Multi-model smart routing — priority and automatic failover

EchoBird's **Smart Router** puts multiple model providers behind one local API. Add free, paid, or private models from Model Nexus, then drag the cards into your preferred order. The router tries models in that order and automatically falls back when a model is rate-limited, out of quota, or temporarily unavailable. After cooldown, it retries models in priority order.

- **Up to 20 models** — reuse your configured models without entering their API keys again.
- **One endpoint for compatible tools** — supports OpenAI Chat Completions and Anthropic Messages, including clients such as Claude Code.
- **Explicit priority** — you control the order; routing follows that order rather than selecting models by task or price.

**Get started:** open Smart Router → add models from My Models or the free-model directory → drag to set priority → choose **Auto Router** for a compatible tool in App Manager. Keep EchoBird running while tools use its local API.

Smart Router switches between configured model APIs; it does not automatically rotate saved login accounts. ChatGPT / Codex CLI third-party models require the **Responses API**, which Smart Router does not currently expose. For those tools, use account switching or a Responses-compatible provider directly.
```

</details>

#### 缺口

- 下载的6.0.8二进制是否与此提交协议实现一致
  **影响**：不能据源码端点保证发布客户端兼容
  **进一步探讨**：固定发布产物来源并对三个协议的核心任务逐项验收

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 有状态续接还能任意切provider吗？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不能。Responses带previous_response_id时从response_memory查绑定，要求ID未过期、无歧义且候选ID和fingerprint匹配；否则明确要求发送完整conversation input，而不是盲目换provider。候选配置变化或原provider不在可用队列中会限制继续，这保留上游状态所有权，代价是高可用切换在有状态续接上不能与独立请求等同。

同一路径拒绝background Responses和conversation对象，表明本地协议入口只是有界子集。cooldown根据认证、模型不可用、rate/billing和transient分类，临时错误指数延长而请求不兼容不冻结候选；错误类别与恢复时间绑定不是“任意错误换账号”。内容安全和上下文限制另有识别，不应把故障切换解释成绕开上游约束。

流式路径在输出前缓冲并解析终止/内容状态，达到meaningful等条件才放出；完成检查要求明确终止或finish_reason，否则报告上游提前结束。测试代码命名中有输出后不重放的意图，本轮不以它作为通过证据。关键质疑是“自动failover”是否被用户误读成中途有状态迁移和输出质量等价，实际续接、工具调用和失败费用仍需同任务核对。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:1453-1495](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src-tauri/src/services/smart_router/server.rs#L1453-L1495)

拒绝background/conversation并收窄绑定续接候选。

<details>
<summary>查看原文（43行）</summary>

```text
async fn route_with_policy(
    state: &AppState,
    inbound_headers: &HeaderMap,
    body: Value,
    mut candidates: Vec<Candidate>,
    policy: RoutePolicy,
    protocol: RouteProtocol,
) -> Response {
    if protocol == RouteProtocol::Responses && body["background"] == true {
        return openai_error(StatusCode::BAD_REQUEST, "Background Responses require a separate task lifecycle and are not supported by Auto Router");
    }
    if protocol == RouteProtocol::Responses
        && body
            .get("conversation")
            .is_some_and(|value| !value.is_null())
    {
        return openai_error(StatusCode::BAD_REQUEST, "Conversation objects are not supported by Auto Router; use complete input or a bound previous_response_id");
    }
    let bound_continuation = protocol == RouteProtocol::Responses && has_previous_response(&body);
    let bound_candidates = match response_candidates(state, &body, candidates.clone(), protocol) {
        Ok(candidates) => candidates,
        Err(error) => return openai_error(StatusCode::BAD_REQUEST, error),
    };
    if candidates.is_empty() {
        return openai_error(
            StatusCode::SERVICE_UNAVAILABLE,
            "No usable models are configured for Auto Router",
        );
    }

    let configured_candidates = candidates.clone();
    let standby_epoch = state
        .standby
        .order_for_request(&mut candidates, state.request_epoch)
        .filter(|_| !bound_continuation);
    let mut available = prioritized_candidates(state, candidates);
    if bound_continuation {
        available.retain(|candidate| {
            bound_candidates
                .iter()
                .any(|bound| bound.internal_id == candidate.internal_id)
        });
    }
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:3813-3844](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src-tauri/src/services/smart_router/server.rs#L3813-L3844)

原response的候选与fingerprint所有权。

<details>
<summary>查看原文（32行）</summary>

```text
fn has_previous_response(body: &Value) -> bool {
    body.get("previous_response_id")
        .is_some_and(|value| !value.is_null())
}

fn response_candidates(
    state: &AppState,
    body: &Value,
    candidates: Vec<Candidate>,
    protocol: RouteProtocol,
) -> Result<Vec<Candidate>, &'static str> {
    if protocol != RouteProtocol::Responses || !has_previous_response(body) {
        return Ok(candidates);
    }
    let id = body["previous_response_id"]
        .as_str()
        .filter(|id| !id.is_empty())
        .ok_or("previous_response_id must be a response ID")?;
    let binding = state
        .response_memory
        .lock()
        .ok()
        .and_then(|memory| memory.response_bindings.get(id).cloned())
        .filter(|binding| binding.expires_at_ms > now_ms())
        .ok_or("Unknown or expired response ID; send the complete conversation input")?;
    if binding.ambiguous {
        return Err("Ambiguous response ID; send the complete conversation input");
    }
    let candidate = candidates.into_iter()
        .find(|candidate| candidate.internal_id == binding.candidate_id && candidate.fingerprint == binding.fingerprint)
        .ok_or("The original response provider configuration has changed; send the complete conversation input")?;
    Ok(vec![candidate])
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:3588-3631](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src-tauri/src/services/smart_router/server.rs#L3588-L3631)

不同故障冷却与不误归因的分支。

<details>
<summary>查看原文（44行）</summary>

```text
fn cooldown_for_failure(
    failure: FailureClass,
    retry_after: Option<Duration>,
    consecutive_failures: u32,
) -> Duration {
    match failure {
        FailureClass::Authentication => AUTH_OR_BILLING_COOLDOWN,
        FailureClass::ModelUnavailable => MODEL_UNAVAILABLE_COOLDOWN,
        FailureClass::RateLimit | FailureClass::Billing => retry_after
            .unwrap_or(RATE_LIMIT_COOLDOWN)
            .min(MAX_RETRY_AFTER),
        FailureClass::Transient => {
            let multiplier = 1_u32 << consecutive_failures.saturating_sub(1).min(3);
            TRANSIENT_COOLDOWN
                .saturating_mul(multiplier)
                .min(MAX_TRANSIENT_COOLDOWN)
        }
        FailureClass::RequestIncompatible => Duration::ZERO,
    }
}

fn remaining_timeout(started: Instant, budget: Duration, cap: Duration) -> Option<Duration> {
    budget
        .checked_sub(started.elapsed())
        .map(|remaining| remaining.min(cap))
        .filter(|remaining| !remaining.is_zero())
}

fn classify_failure(status: StatusCode, body: &[u8]) -> Option<FailureClass> {
    if is_context_limit_body(body) {
        return None;
    }
    let message = String::from_utf8_lossy(body).to_ascii_lowercase();
    if [
        "content policy",
        "safety policy",
        "content moderation",
        "blocked by safety",
    ]
    .iter()
    .any(|pattern| message.contains(pattern))
    {
        return None;
    }
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:2894-2915](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src-tauri/src/services/smart_router/server.rs#L2894-L2915)

流完成和非空依据检查。

<details>
<summary>查看原文（22行）</summary>

```text
    fn finish(&mut self) -> Result<(), std::io::Error> {
        let frames = self.parser.finish();
        self.observe(frames)?;
        if self.done || self.finish_reason {
            if self.failure.is_some() {
                Ok(())
            } else {
                self.require_output()
            }
        } else {
            Err(std::io::Error::other(
                "Upstream stream ended before completion",
            ))
        }
    }

    fn require_output(&self) -> Result<(), std::io::Error> {
        if self.meaningful || self.accounted || self.legitimate_empty {
            Ok(())
        } else {
            Err(std::io::Error::other(empty_response_error()))
        }
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:2930-2965](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src-tauri/src/services/smart_router/server.rs#L2930-L2965)

流输出前预检缓冲，非全请求任意重放。

<details>
<summary>查看原文（36行）</summary>

```text
    let mut first = Some(first_chunk);
    loop {
        let chunk = if let Some(chunk) = first.take() {
            chunk
        } else {
            match upstream.next().await {
                Some(chunk) => chunk?,
                None => break,
            }
        };
        if chunk.is_empty() {
            continue;
        }
        completion.push(&chunk).map_err(axum::Error::new)?;
        if let Some(error) = &completion.failure {
            if !preserve_native_failure
                || crate::services::account_proxy::context_limit_error(
                    error.error_code.as_deref(),
                    &error.message,
                )
            {
                return Err(axum::Error::new(error.clone()));
            }
        }
        buffered_bytes = buffered_bytes.saturating_add(chunk.len());
        buffered.push_back(chunk);
        if completion.meaningful
            || completion.done
            || (completion.finish_reason && (completion.accounted || completion.legitimate_empty))
        {
            return Ok(buffered);
        }
        if buffered_bytes > MAX_STREAM_PREFLIGHT_BYTES {
            return Err(axum::Error::new(std::io::Error::other(
                "Upstream stream sent too much metadata before any output",
            )));
```

</details>

#### 缺口

- 不同provider的工具/结构化输出/续接质量是否等价
  **影响**：可达性不能代替客户端任务正确性，换provider可能增加复核
  **进一步探讨**：固定工具任务和完整/有状态请求，对比候选成功率、重复调用、输出保真及账单

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 统一入口增加什么全周期负担，怎样退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

实际使用需要桌面应用常驻、目标客户端支持所用协议、至少一个有效provider或本地模型、适合处理该输入的凭据与网络。配置里本地API key与上游candidate key属于不同层，不能把本地监听等同数据不离机。账号切换还可能改共享登录；本轮未审计全部配置写入/备份行为，试用不能直接覆盖唯一生产环境。

首次需要备份客户端原配置和账号状态，选少量已知provider，配置顺序、端口、模型别名与客户端入口。持续要维护额度、模型能力、冷却和provider数据边界；每次fallback可能已经发生上游计费尝试，统一endpoint不保证节费。启用本地LLM还有硬件/下载/内存成本，本轮没有核查所有运行时，不给资源容量承诺。

runtime用CancellationToken停止listener并等待释放，在途响应独立drain，停router不等于取消已上游提交的任务。退出需先停新请求，恢复客户端直连provider/原账号配置，核查仍在途请求和健康状态；移除候选不自动撤销外部请求。金额、耗时和多次尝试费用均未知，采用只能在可恢复配置副本中试用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:87-105](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/README.md#L87-L105)

共享登录及必须保持应用运行的前提。

<details>
<summary>查看原文（19行）</summary>

```text
Manage multiple saved accounts in EchoBird's **App Manager**, view their usage quota, and choose the account to use when launching a tool.

- **ChatGPT desktop and Codex CLI** — add OpenAI accounts through browser sign-in, then select a saved account and launch. Both tools share the local Codex account configuration, so switching affects the shared login.
- **Claude Code** — add accounts through browser authorization, select an account, and launch Claude Code with it. View the plan, remaining 5-hour and 7-day quota, and reset countdowns when available.
- **Quota at a glance** — check remaining quota and reset times, refresh account usage, and remove saved accounts from the same panel.

**Get started:** open App Manager → choose ChatGPT, Codex CLI, or Claude Code → add and authorize your accounts → select an account → launch. Account selection takes effect on launch; choose a third-party model instead when you want to use an API provider.

## Multi-model smart routing — priority and automatic failover

EchoBird's **Smart Router** puts multiple model providers behind one local API. Add free, paid, or private models from Model Nexus, then drag the cards into your preferred order. The router tries models in that order and automatically falls back when a model is rate-limited, out of quota, or temporarily unavailable. After cooldown, it retries models in priority order.

- **Up to 20 models** — reuse your configured models without entering their API keys again.
- **One endpoint for compatible tools** — supports OpenAI Chat Completions and Anthropic Messages, including clients such as Claude Code.
- **Explicit priority** — you control the order; routing follows that order rather than selecting models by task or price.

**Get started:** open Smart Router → add models from My Models or the free-model directory → drag to set priority → choose **Auto Router** for a compatible tool in App Manager. Keep EchoBird running while tools use its local API.

Smart Router switches between configured model APIs; it does not automatically rotate saved login accounts. ChatGPT / Codex CLI third-party models require the **Responses API**, which Smart Router does not currently expose. For those tools, use account switching or a Responses-compatible provider directly.
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/services/smart_router/mod.rs:63-82](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src-tauri/src/services/smart_router/mod.rs#L63-L82)

配置包含候选和本地API key。

<details>
<summary>查看原文（20行）</summary>

```text
struct StoredConfig {
    #[serde(default = "default_name")]
    name: String,
    #[serde(default = "default_model_id")]
    model_id: String,
    #[serde(default)]
    port: Option<u16>,
    #[serde(default = "default_enabled")]
    enabled: bool,
    #[serde(default = "default_version")]
    version: u32,
    #[serde(default)]
    candidate_ids: Vec<String>,
    #[serde(default)]
    disabled_candidate_ids: Vec<String>,
    #[serde(default)]
    api_key: String,
    #[serde(default)]
    defaults_initialization_pending: bool,
}
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:998-1008](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src-tauri/src/services/smart_router/server.rs#L998-L1008)

上游凭据按候选使用。

<details>
<summary>查看原文（11行）</summary>

```text
            let model = user_models.iter().find(|model| model.internal_id == id)?;
            let model_id = model.model_id.as_deref()?.trim();
            if model_id.is_empty() || model.base_url.trim().is_empty() {
                return None;
            }
            let api_key = model_manager::decrypt_key_for_use(&model.api_key);

            Some(Candidate {
                attempt: None,
                internal_id: model.internal_id.clone(),
                fingerprint: candidate_fingerprint(
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/services/smart_router/runtime.rs:54-72](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src-tauri/src/services/smart_router/runtime.rs#L54-L72)

停止listener与在途drain分离。

<details>
<summary>查看原文（19行）</summary>

```text
    pub(super) fn cancel(&self) {
        self.shutdown.cancel();
    }

    pub(super) async fn stop(self) {
        self.cancel();
        // Wait for the listening socket; in-flight responses drain independently.
        let _ = self.stopped.await;
        super::profiles::set_running(&self.id, false);
        // Windows may still be processing canceled socket I/O after Drop.
        #[cfg(windows)]
        if let Err(error) = wait_for_port_release(self.addr).await {
            // Closed connections or another listener may still reserve the port.
            // A subsequent start retains its existing bind fallback.
            log::debug!(
                "[SmartRouter] listener closed; port {} not yet reusable: {error}",
                self.addr
            );
        }
```

</details>

#### 缺口

- 客户端原生配置是否完整可恢复、故障尝试成本未知
  **影响**：影响退出可逆性与成本档位，不能宣称一键切换无副作用
  **进一步探讨**：在配置副本记录前后差异、恢复结果、在途请求和provider每次费用

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 按协议与续接能力建立探针能否减少错误选择？

**研究主题**：新假设与验证、工程质量与复用、采用判断

#### 完整回答

未验证假设是让候选配置显示“无状态chat、工具调用、Responses完整输入、绑定续接”等实际能力，并将带状态请求限制到有匹配验收的候选。Q02文档与源码差异和Q03绑定续接限制共同说明，只有模型名/低延迟不足以选择。探针应记录固定provider/model、协议、时间和真实结果，不能把一次health或延迟成功当完整任务通过。

代价是额外模型请求、可能收费、能力过期和隐私测试样本；不能为了配置方便自动发送用户敏感内容。最小验证使用合成工具调用、结构化输出和绑定续接任务，对比仅按优先级与按能力过滤的错误率、切换次数、费用及人工排障时间。若没有减少误选，或探针维护成本超过手配收益，就停止该方向。

现阶段建议熟悉provider且能恢复客户端配置的人，在非关键任务中固定少量候选试本地Router。若实际协议不支持、续接绑定无法恢复或请求被发到不适合的provider，应恢复直接endpoint而不是继续增加候选。它不等于可安装DSH插件，也不推荐凭下载目录直接运行所有安装修复能力。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:651-675](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src-tauri/src/services/smart_router/server.rs#L651-L675)

多协议端点可作为能力区分起点。

<details>
<summary>查看原文（25行）</summary>

```text
pub(super) fn start(
    listener: std::net::TcpListener,
) -> Result<super::runtime::ServerControl, String> {
    let state = AppState::new()?;
    let shutdown = state.shutdown.clone();
    let app = Router::new()
        .route("/health", get(handle_health))
        .route("/v1/models", get(handle_models))
        .route("/models", get(handle_models))
        .route("/v1/chat/completions", post(handle_chat))
        .route("/chat/completions", post(handle_chat))
        .route("/v1/responses", post(handle_responses))
        .route("/responses", post(handle_responses))
        .route("/v1/messages", post(handle_messages))
        .route("/messages", post(handle_messages))
        .route("/v1/audio/transcriptions", post(voice::handle))
        .route("/audio/transcriptions", post(voice::handle))
        .layer(DefaultBodyLimit::max(MAX_REQUEST_BODY_BYTES))
        .with_state(state);
    let listener = tokio::net::TcpListener::from_std(listener).map_err(|e| e.to_string())?;
    let port = listener.local_addr().map_err(|e| e.to_string())?.port();

    log::info!("[SmartRouter] listening on 127.0.0.1:{port}");
    Ok(super::runtime::ServerControl::start(
        listener, app, shutdown,
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:3818-3844](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src-tauri/src/services/smart_router/server.rs#L3818-L3844)

续接绑定是不能仅靠模型名表达的能力边界。

<details>
<summary>查看原文（27行）</summary>

```text
fn response_candidates(
    state: &AppState,
    body: &Value,
    candidates: Vec<Candidate>,
    protocol: RouteProtocol,
) -> Result<Vec<Candidate>, &'static str> {
    if protocol != RouteProtocol::Responses || !has_previous_response(body) {
        return Ok(candidates);
    }
    let id = body["previous_response_id"]
        .as_str()
        .filter(|id| !id.is_empty())
        .ok_or("previous_response_id must be a response ID")?;
    let binding = state
        .response_memory
        .lock()
        .ok()
        .and_then(|memory| memory.response_bindings.get(id).cloned())
        .filter(|binding| binding.expires_at_ms > now_ms())
        .ok_or("Unknown or expired response ID; send the complete conversation input")?;
    if binding.ambiguous {
        return Err("Ambiguous response ID; send the complete conversation input");
    }
    let candidate = candidates.into_iter()
        .find(|candidate| candidate.internal_id == binding.candidate_id && candidate.fingerprint == binding.fingerprint)
        .ok_or("The original response provider configuration has changed; send the complete conversation input")?;
    Ok(vec![candidate])
```

</details>

**依据 3 · 源码核查**：[src/api/smartRouter.ts:27-45](https://github.com/edison7009/EchoBird/blob/3dea068c9950ef3e6327c2650ef0df5badcee37b/src/api/smartRouter.ts#L27-L45)

现有延迟探针接口不等于本假设完整协议验收。

<details>
<summary>查看原文（19行）</summary>

```text
export interface SmartRouterProbeResult {
  latencyMs: number | null;
  error: string | null;
}

export async function testSmartRouterCandidate(
  internalId: string,
  modelId: string,
  requestId: string,
  batchId?: string,
  routerId?: string
): Promise<SmartRouterProbeResult> {
  return invoke('test_smart_router_candidate', {
    internalId,
    modelId,
    requestId,
    batchId,
    routerId,
  });
```

</details>

#### 缺口

- 协议能力标签能否减少误选，真实用户是否愿承担探针费用
  **影响**：仅为新假设，不算已有智能路由能力
  **进一步探讨**：以固定合成任务比较误选和全周期费用，无增益则停止

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
