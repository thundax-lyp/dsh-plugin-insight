# dsh-domain-bridge

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[8ef0119](https://github.com/1Lany2a/dsh-domain-role/tree/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/1Lany2a/dsh-domain-role) [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-domain-bridge) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-domain-bridge)
<!-- END META -->

> **实现功能**：以四级状态协调多会话投递、暂停、恢复、建会话与模型分派。

> **核心亮点**：把域寻址、持久队列、层级暂停、会话创建和模型分派组成控制面，并区分 create/attach 失败。它复用宿主会话能力，不是隔离系统。 参见[Q03](#research-q03)。

> **风险与缺陷**：只控制插件介导发送，手动/宿主唤醒和已运行 agent 不受阻断。并发恢复、崩溃与文件写交错可能重复/漏投；子代理无独立模型，切换还触碰全局默认。 参见[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 域桥适合哪类协作？](#detail-section-11)
  - [Q02 · 域解析、队列、暂停和唤醒怎样工作？](#detail-section-12)
  - [Q03 · dsh-domain-bridge 相对简单替代的独立增量是什么？](#detail-section-13)
  - [Q04 · 介导边界和并发如何破坏协调？](#detail-section-14)
  - [Q05 · dsh-domain-bridge 启动、持续使用与失败恢复依赖什么？](#detail-section-15)
  - [Q06 · 持久队列成本如何衡量？](#detail-section-16)
  - [Q07 · OR 暂停与降级链是否可靠？](#detail-section-17)
  - [Q08 · 能否用租约收据替代模糊发送状态？](#detail-section-18)
  - [Q09 · dsh-domain-bridge 适合观察、试用还是安装，停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向按业务域拆分 DSH 会话并需暂停/恢复的用户。输入是域、消息、暂停范围和模型；合格结果是正确目标恰好处理一次，暂停时持久排队，恢复后重评。替代是手工会话表和复制消息。

参见[Q01](#research-q01)。

手工地址簿、复制消息与人工暂停记录；透明但恢复去重靠人。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 域消息 | 按声明找目标 | 只覆盖介导路径 |
| 四级暂停 | OR 叠加 | 非全局冻结 |
| 持久队列 | 落盘恢复 | 恰好一次未证 |
| 会话模型 | 创建和切换 | 依赖内部接口 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH/Harness 接口 | 必需 | 工具与会话控制 | 漂移会降级 |
| 域声明/config | 必需 | 解析目标 | 冲突会错投 |
| stateDir | 暂停恢复必需 | 状态/inbox | 损坏不可可信重投 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 定义域和状态目录 | 解析唯一 |
| 投递 | 记录 ID 与回执 | 目标正确 |
| 恢复 | 审 inbox 后重评 | 无重复漏投 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 存储未知 | 建域模型 | 耦合深 |
| 持续 | token/I-O | 审队列 | 工时未知 |
| 恢复 | 重复执行代价 | 去重重投 | P95 未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 域寻址 | 声明优先 | 错配率未测 |
| 暂停恢复 | 四级 OR 与落盘 | 非系统冻结 |
| 模型分派 | 切换并恢复默认 | 子代理受限 |

> **思考**：只控制插件介导发送，手动/宿主唤醒和已运行 agent 不受阻断。并发恢复、崩溃与文件写交错可能重复/漏投；子代理无独立模型，切换还触碰全局默认。 参见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把域寻址、持久队列、层级暂停、会话创建和模型分派组成控制面，并区分 create/attach 失败。它复用宿主会话能力，不是隔离系统。 参见[Q03](#research-q03)。

把域寻址、持久队列、层级暂停、会话创建和模型分派组成控制面，并区分 create/attach 失败。它复用宿主会话能力，不是隔离系统。 参见[Q03](#research-q03)。

四级 OR、两端检查和恢复重评优于 UI 布尔值；阶段回执便于归因。文件状态缺事务/租约，wake 只是尝试而非消费确认。 参见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

只控制插件介导发送，手动/宿主唤醒和已运行 agent 不受阻断。并发恢复、崩溃与文件写交错可能重复/漏投；子代理无独立模型，切换还触碰全局默认。 参见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察。固定版本、维护域声明并人工审队列的用户先做沙箱；跨域、重复、漏投、文件损坏或把暂停误认系统冻结即停止。 参见[Q04](#research-q04)、[Q06](#research-q06)与[Q09](#research-q09)。

参见[Q01](#research-q01)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认域寻址、四级 OR 暂停、持久 inbox、恢复重评和模型分派机制；崩溃/双恢复下的重复漏投与插件介导边界未做 Host 故障注入，租约收据仍属假设，见[Q08](#research-q08)。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-domain-bridge/README.md、plugins/dsh-domain-bridge/package.json、plugins/dsh-domain-bridge/lib/bridge.js、plugins/dsh-domain-bridge/lib/core/tools.js、plugins/dsh-domain-bridge/lib/core/shared.js 及固定范围 inventory；组件：plugins/dsh-domain-bridge。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查组件 README、bridge、shared 与工具源码；不运行 Host。 未运行目标插件、测试、外部服务或真实 Host；源码存在不等于运行通过。
- 下一步：唯一 ID 并发/崩溃矩阵；跨域、重复、漏投即停。

**分析版本**

- **仓库**：[1Lany2a/dsh-domain-role](https://github.com/1Lany2a/dsh-domain-role)
- **版本号**：0.8.5（[固定提交 8ef0119](https://github.com/1Lany2a/dsh-domain-role/tree/8ef0119937f5f9d18a0628a891dd086db6522834)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

加入 message_id、解析版本、租约和消费收据，分开排队/投递/接收/完成；若故障注入下重复漏投不降则否定。 参见[Q08](#research-q08)。

唯一 ID 并发/崩溃矩阵；跨域、重复、漏投即停。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 1039 | — | — | 24042 |
| .js | source | 12 | 9457 | 7292 | 1720 | — |
| .mjs | test | 6 | 6637 | 5614 | 547 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/1Lany2a/dsh-domain-role/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 8ef0119937f5f9d18a0628a891dd086db6522834 上判断 dsh-domain-bridge 的核心贡献、关键质疑、采用边界及可证伪的新设计假设。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 域桥适合哪类协作？

**研究主题**：场景与需求

#### 完整回答

面向按业务域拆分 DSH 会话并需暂停/恢复的用户。输入是域、消息、暂停范围和模型；合格结果是正确目标恰好处理一次，暂停时持久排队，恢复后重评。替代是手工会话表和复制消息。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-domain-bridge/README.md:13-16](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/README.md#L13-L16)

作者定义域桥目标。

```text
## 它解决什么

现状（dsh 0.2.1-rc.2 实测）：模型侧 `send_message` / `list_agents` **只认自己的子树**（直系父子）⇒ 用户手开的顶层会话（我们的"域会话"）之间**互相看不见、也发不到**，只能靠人当信使搬运。

```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 域解析、队列、暂停和唤醒怎样工作？

**研究主题**：功能与机制

#### 完整回答

bridge 注册工具；shared 解析声明、在线态和 domain/session/project/global 暂停。发送前 OR 检查并投递或落盘 inbox，恢复时重评/wake；另有建会话、入组置顶和模型切换。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/bridge.js:106-109](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/bridge.js#L106-L109)

注册工具集合。

```text
      for (const definition of Object.values(defs)) registerTool(ctx, definition)
      // v0.7.0：六条宿主斜杠命令（/register /initialize /handoff /retire /pause /pause-all）。
      // v0.8.0：同一批定义既注册成命令，也挂到 popup 菜单路由上——一个实现，两个入口。
      // ⚠️ 0.8.1 修复：`ctx.get('commands')` / `ctx.get('webServer')` 在**未注入**时拿不到服务，
```

**依据 2 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/shared.js:63-66](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/core/shared.js#L63-L66)

定义四级暂停。

```text
export const PAUSE_SCOPES = [SCOPE_DOMAIN, SCOPE_SESSION, SCOPE_PROJECT, SCOPE_GLOBAL]
/** global 的保留键（唯一）。 */
export const GLOBAL_KEY = '*'
/** 工具参数 `scope` 接受的中文别名（机器面仍归一到上面四个字面量）。 */
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · dsh-domain-bridge 相对简单替代的独立增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

把域寻址、持久队列、层级暂停、会话创建和模型分派组成控制面，并区分 create/attach 失败。它复用宿主会话能力，不是隔离系统。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/bridge.js:106-109](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/bridge.js#L106-L109)

注册工具集合。

```text
      for (const definition of Object.values(defs)) registerTool(ctx, definition)
      // v0.7.0：六条宿主斜杠命令（/register /initialize /handoff /retire /pause /pause-all）。
      // v0.8.0：同一批定义既注册成命令，也挂到 popup 菜单路由上——一个实现，两个入口。
      // ⚠️ 0.8.1 修复：`ctx.get('commands')` / `ctx.get('webServer')` 在**未注入**时拿不到服务，
```

**依据 2 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/shared.js:63-66](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/core/shared.js#L63-L66)

定义四级暂停。

```text
export const PAUSE_SCOPES = [SCOPE_DOMAIN, SCOPE_SESSION, SCOPE_PROJECT, SCOPE_GLOBAL]
/** global 的保留键（唯一）。 */
export const GLOBAL_KEY = '*'
/** 工具参数 `scope` 接受的中文别名（机器面仍归一到上面四个字面量）。 */
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 介导边界和并发如何破坏协调？

**研究主题**：缺陷与关键质疑

#### 完整回答

只控制插件介导发送，手动/宿主唤醒和已运行 agent 不受阻断。并发恢复、崩溃与文件写交错可能重复/漏投；子代理无独立模型，切换还触碰全局默认。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/shared.js:63-66](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/core/shared.js#L63-L66)

定义四级暂停。

```text
export const PAUSE_SCOPES = [SCOPE_DOMAIN, SCOPE_SESSION, SCOPE_PROJECT, SCOPE_GLOBAL]
/** global 的保留键（唯一）。 */
export const GLOBAL_KEY = '*'
/** 工具参数 `scope` 接受的中文别名（机器面仍归一到上面四个字面量）。 */
```

**依据 2 · 作者声明**：[plugins/dsh-domain-bridge/README.md:13-16](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/README.md#L13-L16)

作者定义域桥目标。

```text
## 它解决什么

现状（dsh 0.2.1-rc.2 实测）：模型侧 `send_message` / `list_agents` **只认自己的子树**（直系父子）⇒ 用户手开的顶层会话（我们的"域会话"）之间**互相看不见、也发不到**，只能靠人当信使搬运。

```

#### 缺口

- 崩溃与双恢复下重复/漏投
  **影响**：任务重复执行或被误认完成
  **进一步探讨**：四级暂停下并发恢复和 kill，核对状态、回执与消费次数

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-domain-bridge 启动、持续使用与失败恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

依赖精确 DSH/Harness 会话、模型、置顶和事件接口，cordis/config、域声明与可写 stateDir。恢复须分 create/attach/pin/model/queue/wake 核对 inbox 与实际消费。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/bridge.js:106-109](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/bridge.js#L106-L109)

注册工具集合。

```text
      for (const definition of Object.values(defs)) registerTool(ctx, definition)
      // v0.7.0：六条宿主斜杠命令（/register /initialize /handoff /retire /pause /pause-all）。
      // v0.8.0：同一批定义既注册成命令，也挂到 popup 菜单路由上——一个实现，两个入口。
      // ⚠️ 0.8.1 修复：`ctx.get('commands')` / `ctx.get('webServer')` 在**未注入**时拿不到服务，
```

**依据 2 · 作者声明**：[plugins/dsh-domain-bridge/README.md:13-16](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/README.md#L13-L16)

作者定义域桥目标。

```text
## 它解决什么

现状（dsh 0.2.1-rc.2 实测）：模型侧 `send_message` / `list_agents` **只认自己的子树**（直系父子）⇒ 用户手开的顶层会话（我们的"域会话"）之间**互相看不见、也发不到**，只能靠人当信使搬运。

```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 持久队列成本如何衡量？

**研究主题**：效果与总成本

#### 完整回答

单位是一条域消息被正确目标恰好处理一次。首次定义域/模型；持续含状态 I/O、队列审阅和 token；恢复要去重重投。无并发重复率、恢复 P95 或每百条人工分钟。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-domain-bridge/README.md:13-16](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/README.md#L13-L16)

作者定义域桥目标。

```text
## 它解决什么

现状（dsh 0.2.1-rc.2 实测）：模型侧 `send_message` / `list_agents` **只认自己的子树**（直系父子）⇒ 用户手开的顶层会话（我们的"域会话"）之间**互相看不见、也发不到**，只能靠人当信使搬运。

```

**依据 2 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/shared.js:63-66](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/core/shared.js#L63-L66)

定义四级暂停。

```text
export const PAUSE_SCOPES = [SCOPE_DOMAIN, SCOPE_SESSION, SCOPE_PROJECT, SCOPE_GLOBAL]
/** global 的保留键（唯一）。 */
export const GLOBAL_KEY = '*'
/** 工具参数 `scope` 接受的中文别名（机器面仍归一到上面四个字面量）。 */
```

#### 缺口

- 每百条正确率、重复率、漏投率、P95 与审阅分钟
  **影响**：无法给出合格任务单位成本、成功率、节时或 ROI
  **进一步探讨**：三域六会话跑百条唯一 ID 故障矩阵

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · OR 暂停与降级链是否可靠？

**研究主题**：工程质量与复用

#### 完整回答

四级 OR、两端检查和恢复重评优于 UI 布尔值；阶段回执便于归因。文件状态缺事务/租约，wake 只是尝试而非消费确认。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/bridge.js:106-109](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/bridge.js#L106-L109)

注册工具集合。

```text
      for (const definition of Object.values(defs)) registerTool(ctx, definition)
      // v0.7.0：六条宿主斜杠命令（/register /initialize /handoff /retire /pause /pause-all）。
      // v0.8.0：同一批定义既注册成命令，也挂到 popup 菜单路由上——一个实现，两个入口。
      // ⚠️ 0.8.1 修复：`ctx.get('commands')` / `ctx.get('webServer')` 在**未注入**时拿不到服务，
```

**依据 2 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/shared.js:63-66](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/core/shared.js#L63-L66)

定义四级暂停。

```text
export const PAUSE_SCOPES = [SCOPE_DOMAIN, SCOPE_SESSION, SCOPE_PROJECT, SCOPE_GLOBAL]
/** global 的保留键（唯一）。 */
export const GLOBAL_KEY = '*'
/** 工具参数 `scope` 接受的中文别名（机器面仍归一到上面四个字面量）。 */
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 能否用租约收据替代模糊发送状态？

**研究主题**：新假设与验证

#### 完整回答

加入 message_id、解析版本、租约和消费收据，分开排队/投递/接收/完成；若故障注入下重复漏投不降则否定。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/shared.js:63-66](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/core/shared.js#L63-L66)

定义四级暂停。

```text
export const PAUSE_SCOPES = [SCOPE_DOMAIN, SCOPE_SESSION, SCOPE_PROJECT, SCOPE_GLOBAL]
/** global 的保留键（唯一）。 */
export const GLOBAL_KEY = '*'
/** 工具参数 `scope` 接受的中文别名（机器面仍归一到上面四个字面量）。 */
```

**依据 2 · 作者声明**：[plugins/dsh-domain-bridge/README.md:13-16](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/README.md#L13-L16)

作者定义域桥目标。

```text
## 它解决什么

现状（dsh 0.2.1-rc.2 实测）：模型侧 `send_message` / `list_agents` **只认自己的子树**（直系父子）⇒ 用户手开的顶层会话（我们的"域会话"）之间**互相看不见、也发不到**，只能靠人当信使搬运。

```

#### 缺口

- 租约收据能否降错且不依赖宿主改造
  **影响**：新方向仍是推演，不能计入插件当前贡献或效果
  **进一步探讨**：kill-before/after-send 各五十次，无改善则否定

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · dsh-domain-bridge 适合观察、试用还是安装，停止条件是什么？

**研究主题**：采用判断

#### 完整回答

建议观察。固定版本、维护域声明并人工审队列的用户先做沙箱；跨域、重复、漏投、文件损坏或把暂停误认系统冻结即停止。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-domain-bridge/README.md:13-16](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/README.md#L13-L16)

作者定义域桥目标。

```text
## 它解决什么

现状（dsh 0.2.1-rc.2 实测）：模型侧 `send_message` / `list_agents` **只认自己的子树**（直系父子）⇒ 用户手开的顶层会话（我们的"域会话"）之间**互相看不见、也发不到**，只能靠人当信使搬运。

```

**依据 2 · 源码核查**：[plugins/dsh-domain-bridge/lib/core/shared.js:63-66](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/core/shared.js#L63-L66)

定义四级暂停。

```text
export const PAUSE_SCOPES = [SCOPE_DOMAIN, SCOPE_SESSION, SCOPE_PROJECT, SCOPE_GLOBAL]
/** global 的保留键（唯一）。 */
export const GLOBAL_KEY = '*'
/** 工具参数 `scope` 接受的中文别名（机器面仍归一到上面四个字面量）。 */
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
