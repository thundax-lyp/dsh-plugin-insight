# dsh-feishu

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[17ed9c0](https://github.com/2048lr/dsh-feishu/tree/17ed9c0dada4b40580dcf1e1b07918716a94f69d)

<!-- BEGIN META -->
[![npm 30d 71](https://img.shields.io/static/v1?label=npm+30d&message=71&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-feishu) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-feishu)
<!-- END META -->

> **实现功能**：以应用或用户身份把飞书主要办公 API 接入 DSH。

> **核心亮点**：提供 DSH 原生身份、授权 UI、十领域工具和两代 Bitable 兼容；相对通用 MCP，token 留在 Host。飞书平台能力非插件贡献。 参见[Q03](#research-q03)。

> **风险与缺陷**：宽 scopes 和身份差异会越权/空结果；两代 API、分页、限流和 token 类型分叉。消息、文档、表格和上传都有协作可见副作用。 参见[Q04](#research-q04)。

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
  - [Q01 · 飞书集成服务哪些任务？](#detail-section-11)
  - [Q02 · 身份、令牌和十工具如何协作？](#detail-section-12)
  - [Q03 · dsh-feishu 相对简单替代的独立增量是什么？](#detail-section-13)
  - [Q04 · 权限/API 分叉如何失效？](#detail-section-14)
  - [Q05 · dsh-feishu 启动、持续使用与失败恢复依赖什么？](#detail-section-15)
  - [Q06 · 每次云任务成本怎样算？](#detail-section-16)
  - [Q07 · 身份与 token custody 是否可靠？](#detail-section-17)
  - [Q08 · 权限计划和预览能否降风险？](#detail-section-18)
  - [Q09 · dsh-feishu 适合观察、试用还是安装，停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向查询/更新飞书消息、文档、云盘、表格、多维表格和知识库的用户。输入是应用凭据或用户 OAuth、资源和动作；合格结果是预期身份访问正确租户，写可追踪且不泄露令牌。替代是 UI、SDK 或脚本。

参见[Q01](#research-q01)。

飞书 UI、SDK 或 MCP；插件优势是 DSH 原生身份和统一工具。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 认证 | 应用/用户身份 | 核对租户 scope |
| 消息文档知识库 | 查询和写内容 | 协作可见 |
| 云盘表格多维表 | 文件和数据操作 | 分页上传/API分叉 |
| 通用 API | 覆盖缺口 | 风险最高 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 飞书应用/scopes | 必需 | API 权限 | 过宽放大风险 |
| 身份/token store | 按任务 | 租户可见性 | 串身份越权 |
| 网络/配额/API版本 | 必需 | 执行工具 | 需明确重试 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 测试租户最小 scope | 秘密不进模型 |
| 授权/执行 | 明确身份，先读后单写 | 记录资源回执 |
| 恢复 | 超时先查是否已写 | 避免重复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 应用成本未知 | scope/OAuth | 分钟未知 |
| 持续 | API/token/流量 | 审批审计 | 调用数未知 |
| 恢复 | 错内容/权限代价 | 撤回吊销去重 | 对象不一 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 覆盖 | 十领域工具 | 成功率未测 |
| 身份 | Host token custody | 并发未测 |
| 兼容 | 两代 Bitable | 平台会漂移 |

> **思考**：宽 scopes 和身份差异会越权/空结果；两代 API、分页、限流和 token 类型分叉。消息、文档、表格和上传都有协作可见副作用。 参见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：提供 DSH 原生身份、授权 UI、十领域工具和两代 Bitable 兼容；相对通用 MCP，token 留在 Host。飞书平台能力非插件贡献。 参见[Q03](#research-q03)。

提供 DSH 原生身份、授权 UI、十领域工具和两代 Bitable 兼容；相对通用 MCP，token 留在 Host。飞书平台能力非插件贡献。 参见[Q03](#research-q03)。

identity 分离 app/user，Host 托管 token，领域工具比万能 API 易约束。feishu_api 和宽 scope 可绕边界，需验证日志脱敏、刷新并发和部分写。 参见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

宽 scopes 和身份差异会越权/空结果；两代 API、分页、限流和 token 类型分叉。消息、文档、表格和上传都有协作可见副作用。 参见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察。最小 scopes 测试租户先只读，再单对象试写；用户 OAuth、消息、批量表和通用 API 暂缓。泄 token、串身份、重复写或不可补偿即停。 参见[Q04](#research-q04)、[Q06](#research-q06)与[Q09](#research-q09)。

参见[Q01](#research-q01)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认 app/user identity、Host token custody 和十类飞书工具注册；真实租户 scopes、刷新并发、限流与部分写补偿均未连接验证，任务级权限计划仍待测试租户实验，见[Q08](#research-q08)。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/identity.js、lib/tools/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、入口、identity 和工具注册；不连接飞书。 未运行目标插件、测试、外部服务或真实 Host；源码存在不等于运行通过。
- 下一步：最小 scope 测试租户故障注入；泄 token、串身份、重复写或回执无法定位即停。

**分析版本**

- **仓库**：[2048lr/dsh-feishu](https://github.com/2048lr/dsh-feishu)
- **版本号**：0.1.0（[固定提交 17ed9c0](https://github.com/2048lr/dsh-feishu/tree/17ed9c0dada4b40580dcf1e1b07918716a94f69d)）
- **版本日期**：2026-10-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

任务前生成身份、租户、scope、目标、预计 API 次数和写 diff；高风险写预览并幂等提交。若错身份/重复写不降则否定。 参见[Q08](#research-q08)。

最小 scope 测试租户故障注入；泄 token、串身份、重复写或回执无法定位即停。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 23 | 6137 | 4398 | 1403 | — |
| .md | source | 3 | 899 | — | — | 7352 |
| .mjs | test | 1 | 1806 | 1626 | 183 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/2048lr/dsh-feishu/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 17ed9c0dada4b40580dcf1e1b07918716a94f69d 上判断 dsh-feishu 的核心贡献、关键质疑、采用边界及可证伪的新设计假设。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 飞书集成服务哪些任务？

**研究主题**：场景与需求

#### 完整回答

面向查询/更新飞书消息、文档、云盘、表格、多维表格和知识库的用户。输入是应用凭据或用户 OAuth、资源和动作；合格结果是预期身份访问正确租户，写可追踪且不泄露令牌。替代是 UI、SDK 或脚本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:230-233](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/README.md#L230-L233)

作者说明架构。

````text
## How it works

```
lib/
````

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 身份、令牌和十工具如何协作？

**研究主题**：功能与机制

#### 完整回答

apply 建 identity/token store/client，注册 feishu_api/auth/bitable/dashboard/doc/drive/message/query/sheet/wiki；settings/overlay 处理配置授权，identity 选择 app/user token，工具映射领域 API。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:102-105](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/index.js#L102-L105)

建立身份并注册工具。

```text
export function apply(ctx, rawConfig) {
  const config = normalizeConfig(rawConfig);
  const logger = ctx.logger;
  const activity = createActivityLog(config.activityLogSize);
```

**依据 2 · 源码核查**：[lib/identity.js:82-85](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/identity.js#L82-L85)

封装身份选择。

```text
export function createIdentity(options) {
  const config = options.config;
  const credentials = options.credentials;
  const logger = options.logger;
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · dsh-feishu 相对简单替代的独立增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

提供 DSH 原生身份、授权 UI、十领域工具和两代 Bitable 兼容；相对通用 MCP，token 留在 Host。飞书平台能力非插件贡献。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:102-105](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/index.js#L102-L105)

建立身份并注册工具。

```text
export function apply(ctx, rawConfig) {
  const config = normalizeConfig(rawConfig);
  const logger = ctx.logger;
  const activity = createActivityLog(config.activityLogSize);
```

**依据 2 · 源码核查**：[lib/identity.js:82-85](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/identity.js#L82-L85)

封装身份选择。

```text
export function createIdentity(options) {
  const config = options.config;
  const credentials = options.credentials;
  const logger = options.logger;
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 权限/API 分叉如何失效？

**研究主题**：缺陷与关键质疑

#### 完整回答

宽 scopes 和身份差异会越权/空结果；两代 API、分页、限流和 token 类型分叉。消息、文档、表格和上传都有协作可见副作用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/identity.js:82-85](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/identity.js#L82-L85)

封装身份选择。

```text
export function createIdentity(options) {
  const config = options.config;
  const credentials = options.credentials;
  const logger = options.logger;
```

**依据 2 · 作者声明**：[README.md:230-233](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/README.md#L230-L233)

作者说明架构。

````text
## How it works

```
lib/
````

#### 缺口

- 身份切换/刷新并发和部分失败是否串身份或重复
  **影响**：越权或错误租户重复写
  **进一步探讨**：两身份交替，注入401/429/超时，核对身份、刷新和幂等

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-feishu 启动、持续使用与失败恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

依赖飞书应用、正确 scopes/redirect、网络、设置 UI 和 token store。持续依赖刷新、配额和对象授权；恢复需区分认证/权限/限流/部分写并按对象补偿。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:102-105](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/index.js#L102-L105)

建立身份并注册工具。

```text
export function apply(ctx, rawConfig) {
  const config = normalizeConfig(rawConfig);
  const logger = ctx.logger;
  const activity = createActivityLog(config.activityLogSize);
```

**依据 2 · 作者声明**：[README.md:230-233](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/README.md#L230-L233)

作者说明架构。

````text
## How it works

```
lib/
````

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 每次云任务成本怎样算？

**研究主题**：效果与总成本

#### 完整回答

单位是查询/变更在正确身份资源完成且无额外写。首次建应用 OAuth；持续含 token、API、限流和审批；恢复撤回/还原。缺各工具 API 次数、成功率与恢复分钟。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:230-233](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/README.md#L230-L233)

作者说明架构。

````text
## How it works

```
lib/
````

**依据 2 · 源码核查**：[lib/identity.js:82-85](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/identity.js#L82-L85)

封装身份选择。

```text
export function createIdentity(options) {
  const config = options.config;
  const credentials = options.credentials;
  const logger = options.logger;
```

#### 缺口

- API次数、P95、限流率、授权数、错误写和恢复分钟
  **影响**：无法给出合格任务单位成本、成功率、节时或 ROI
  **进一步探讨**：四类对象各十任务对比 UI/脚本

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 身份与 token custody 是否可靠？

**研究主题**：工程质量与复用

#### 完整回答

identity 分离 app/user，Host 托管 token，领域工具比万能 API 易约束。feishu_api 和宽 scope 可绕边界，需验证日志脱敏、刷新并发和部分写。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:102-105](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/index.js#L102-L105)

建立身份并注册工具。

```text
export function apply(ctx, rawConfig) {
  const config = normalizeConfig(rawConfig);
  const logger = ctx.logger;
  const activity = createActivityLog(config.activityLogSize);
```

**依据 2 · 源码核查**：[lib/identity.js:82-85](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/identity.js#L82-L85)

封装身份选择。

```text
export function createIdentity(options) {
  const config = options.config;
  const credentials = options.credentials;
  const logger = options.logger;
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 权限计划和预览能否降风险？

**研究主题**：新假设与验证

#### 完整回答

任务前生成身份、租户、scope、目标、预计 API 次数和写 diff；高风险写预览并幂等提交。若错身份/重复写不降则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/identity.js:82-85](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/identity.js#L82-L85)

封装身份选择。

```text
export function createIdentity(options) {
  const config = options.config;
  const credentials = options.credentials;
  const logger = options.logger;
```

**依据 2 · 作者声明**：[README.md:230-233](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/README.md#L230-L233)

作者说明架构。

````text
## How it works

```
lib/
````

#### 缺口

- 权限计划能否降错且不拖慢只读
  **影响**：新方向仍是推演，不能计入插件当前贡献或效果
  **进一步探讨**：二十混合任务，错误零且只读延迟<15%

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · dsh-feishu 适合观察、试用还是安装，停止条件是什么？

**研究主题**：采用判断

#### 完整回答

建议观察。最小 scopes 测试租户先只读，再单对象试写；用户 OAuth、消息、批量表和通用 API 暂缓。泄 token、串身份、重复写或不可补偿即停。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:230-233](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/README.md#L230-L233)

作者说明架构。

````text
## How it works

```
lib/
````

**依据 2 · 源码核查**：[lib/identity.js:82-85](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/identity.js#L82-L85)

封装身份选择。

```text
export function createIdentity(options) {
  const config = options.config;
  const credentials = options.credentials;
  const logger = options.logger;
```

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
