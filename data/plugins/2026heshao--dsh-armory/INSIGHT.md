# dsh-armory

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[122670a](https://github.com/2026heshao/dsh-armory/tree/122670a78a15c0df803094dbd0db2fa65d336435)

<!-- BEGIN META -->
[![GitHub ★ 21](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory) [![npm 30d 261](https://img.shields.io/static/v1?label=npm+30d&message=261&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-armory) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-armory)
<!-- END META -->

> **实现功能**：统一管理 MCP、工具账本、专家、Skill 与插件市场入口。

> **核心亮点**：把分散配置、连接详情、工具使用、专家和市场聚合为控制面，显式呈现作用域。贡献是治理视图与接线，不是第三方扩展能力。 参见[Q03](#research-q03)。

> **风险与缺陷**：集中入口也集中命令、网络和凭据风险。缓存状态不等于进程健康，热生效范围不一；大型 bundle、私有 slot 和市场 API 增加审计难度。 参见[Q04](#research-q04)。

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
  - [Q01 · 统一入口服务什么治理？](#detail-section-11)
  - [Q02 · 网关、面板、事件和缓存如何汇总？](#detail-section-12)
  - [Q03 · dsh-armory 相对简单替代的独立增量是什么？](#detail-section-13)
  - [Q04 · 集中供应链放大什么风险？](#detail-section-14)
  - [Q05 · dsh-armory 启动、持续使用与失败恢复依赖什么？](#detail-section-15)
  - [Q06 · 治理成本如何计量？](#detail-section-16)
  - [Q07 · 作用域、遮蔽和刷新是否可靠？](#detail-section-17)
  - [Q08 · 可审计变更集能否改善安全？](#detail-section-18)
  - [Q09 · dsh-armory 适合观察、试用还是安装，停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向同时管理多个 MCP、工具、专家、Skill 和插件来源的高级用户。输入是全局/项目配置和市场条目；合格结果是来源、作用域、敏感值和生效时机清楚，变更可恢复。替代是配置文件、CLI 和市场分别管理。

参见[Q01](#research-q01)。

CLI、配置和市场分别管理；分散但可版本控制审 diff。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| MCP | 连接配置启停 | 健康需实证 |
| 工具账本 | 记录使用 | 不证明正确 |
| 市场 | 聚合来源 | 需供应链审查 |
| 作用域 | 全局/项目 | 误配跨项目 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Remote/Client/UI slot | 必需 | 网关和面板 | 漂移丢功能 |
| MCP/市场/网络 | 按功能 | 发现管理 | 离线状态陈旧 |
| 凭据/作用域纪律 | 效果必需 | 访问与隔离 | 误配跨项目 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 盘点 | 只读来源作用域 | 带时间戳且遮蔽 |
| 计划/应用 | 审 diff 后单变更 | 健康与实际一致 |
| 恢复 | 撤销、吊销、重启 | 回到原状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 账号成本未知 | 盘点审查 | 工时未知 |
| 持续 | 网络/存储 | 审更新 | 陈旧度未知 |
| 恢复 | 凭据/扩展影响 | 停用吊销 | 复杂 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 统一盘点 | 多类面板 | 完整性未证 |
| 作用域 | 区分全局项目 | 错误率未知 |
| 账本 | 监听工具事件 | 非安全审计 |

> **思考**：集中入口也集中命令、网络和凭据风险。缓存状态不等于进程健康，热生效范围不一；大型 bundle、私有 slot 和市场 API 增加审计难度。 参见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把分散配置、连接详情、工具使用、专家和市场聚合为控制面，显式呈现作用域。贡献是治理视图与接线，不是第三方扩展能力。 参见[Q03](#research-q03)。

把分散配置、连接详情、工具使用、专家和市场聚合为控制面，显式呈现作用域。贡献是治理视图与接线，不是第三方扩展能力。 参见[Q03](#research-q03)。

Remote 分离 Host/Client，事件账本补充静态配置，作用域标注必要。仍需验证 dispose、缓存失效、敏感遮蔽与原子写。 参见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

集中入口也集中命令、网络和凭据风险。缓存状态不等于进程健康，热生效范围不一；大型 bundle、私有 slot 和市场 API 增加审计难度。 参见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察。先只读盘点，不从市场安装/改凭据；仅在 diff 与回滚通过后试一个低风险 MCP。错作用域、明文密钥、假健康或无法恢复即停。 参见[Q04](#research-q04)、[Q06](#research-q06)与[Q09](#research-q09)。

参见[Q01](#research-q01)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认 MCP Remote、工具账本、专家/市场面板与全局/项目入口；缓存新鲜度、凭据遮蔽、市场供应链和配置回滚尚未接真实 Host，审计变更集仍待试验，见[Q08](#research-q08)。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、网关、事件和客户端入口；不访问市场。 未运行目标插件、测试、外部服务或真实 Host；源码存在不等于运行通过。
- 下一步：只读对照原配置和进程；泄密、假状态、错作用域或恢复不全即停。

**分析版本**

- **仓库**：[2026heshao/dsh-armory](https://github.com/2026heshao/dsh-armory)
- **版本号**：2.1.0（[固定提交 122670a](https://github.com/2026heshao/dsh-armory/tree/122670a78a15c0df803094dbd0db2fa65d336435)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

操作先生成来源、权限、作用域、diff、健康检查和回滚指令的变更集，批准后原子应用。若错作用域不降则否定。 参见[Q08](#research-q08)。

只读对照原配置和进程；泄密、假状态、错作用域或恢复不全即停。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 2457 | — | — | 48307 |
| .mjs | source | 1 | 123 | 97 | 23 | — |
| .js | source | 24 | 20754 | 16468 | 3857 | — |
| .mjs | test | 42 | 8758 | 6571 | 1600 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/2026heshao/dsh-armory/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 122670a78a15c0df803094dbd0db2fa65d336435 上判断 dsh-armory 的核心贡献、关键质疑、采用边界及可证伪的新设计假设。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统一入口服务什么治理？

**研究主题**：场景与需求

#### 完整回答

面向同时管理多个 MCP、工具、专家、Skill 和插件来源的高级用户。输入是全局/项目配置和市场条目；合格结果是来源、作用域、敏感值和生效时机清楚，变更可恢复。替代是配置文件、CLI 和市场分别管理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:87-90](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/README.md#L87-L90)

作者列出管理面。

```text
## 功能

- 查看每个 MCP 的状态、传输方式、连接参数与工具列表；展开工具可看完整输入 JSON Schema（必填/可选、类型、枚举、默认值与原始 JSON）
- 按传输方式（HTTP/stdio）与状态筛选，按名称/命令/URL 搜索
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 网关、面板、事件和缓存如何汇总？

**研究主题**：功能与机制

#### 完整回答

Host Remote 网关暴露 MCP/工具裁缝，监听 tools/change 和 agent/created 汇总账本；客户端挂载多面板，缓存/轮询刷新连接和市场，并区分全局/项目。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:993-996](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/lib/index.js#L993-L996)

定义 MCP 网关。

```text
	return class McpManagerGateway extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_list_decorators = [Remote("list")];
```

**依据 2 · 源码核查**：[lib/index.js:1058-1061](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/lib/index.js#L1058-L1061)

暴露工具裁缝。

```text
			_toolTailor_decorators = [Remote("toolTailor")];
			__esDecorate(this, null, _toolTailor_decorators, { kind: "method", name: "toolTailor", static: false, private: false, access: { has: (obj) => "toolTailor" in obj, get: (obj) => obj.toolTailor }, metadata: _metadata }, null, _instanceExtraInitializers);
			_wbConnectorCatalog_decorators = [Remote("wbConnectorCatalog")];
			__esDecorate(this, null, _wbConnectorCatalog_decorators, { kind: "method", name: "wbConnectorCatalog", static: false, private: false, access: { has: (obj) => "wbConnectorCatalog" in obj, get: (obj) => obj.wbConnectorCatalog }, metadata: _metadata }, null, _instanceExtraInitializers);
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · dsh-armory 相对简单替代的独立增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

把分散配置、连接详情、工具使用、专家和市场聚合为控制面，显式呈现作用域。贡献是治理视图与接线，不是第三方扩展能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:993-996](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/lib/index.js#L993-L996)

定义 MCP 网关。

```text
	return class McpManagerGateway extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_list_decorators = [Remote("list")];
```

**依据 2 · 源码核查**：[lib/index.js:1058-1061](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/lib/index.js#L1058-L1061)

暴露工具裁缝。

```text
			_toolTailor_decorators = [Remote("toolTailor")];
			__esDecorate(this, null, _toolTailor_decorators, { kind: "method", name: "toolTailor", static: false, private: false, access: { has: (obj) => "toolTailor" in obj, get: (obj) => obj.toolTailor }, metadata: _metadata }, null, _instanceExtraInitializers);
			_wbConnectorCatalog_decorators = [Remote("wbConnectorCatalog")];
			__esDecorate(this, null, _wbConnectorCatalog_decorators, { kind: "method", name: "wbConnectorCatalog", static: false, private: false, access: { has: (obj) => "wbConnectorCatalog" in obj, get: (obj) => obj.wbConnectorCatalog }, metadata: _metadata }, null, _instanceExtraInitializers);
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 集中供应链放大什么风险？

**研究主题**：缺陷与关键质疑

#### 完整回答

集中入口也集中命令、网络和凭据风险。缓存状态不等于进程健康，热生效范围不一；大型 bundle、私有 slot 和市场 API 增加审计难度。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1058-1061](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/lib/index.js#L1058-L1061)

暴露工具裁缝。

```text
			_toolTailor_decorators = [Remote("toolTailor")];
			__esDecorate(this, null, _toolTailor_decorators, { kind: "method", name: "toolTailor", static: false, private: false, access: { has: (obj) => "toolTailor" in obj, get: (obj) => obj.toolTailor }, metadata: _metadata }, null, _instanceExtraInitializers);
			_wbConnectorCatalog_decorators = [Remote("wbConnectorCatalog")];
			__esDecorate(this, null, _wbConnectorCatalog_decorators, { kind: "method", name: "wbConnectorCatalog", static: false, private: false, access: { has: (obj) => "wbConnectorCatalog" in obj, get: (obj) => obj.wbConnectorCatalog }, metadata: _metadata }, null, _instanceExtraInitializers);
```

**依据 2 · 作者声明**：[README.md:87-90](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/README.md#L87-L90)

作者列出管理面。

```text
## 功能

- 查看每个 MCP 的状态、传输方式、连接参数与工具列表；展开工具可看完整输入 JSON Schema（必填/可选、类型、枚举、默认值与原始 JSON）
- 按传输方式（HTTP/stdio）与状态筛选，按名称/命令/URL 搜索
```

#### 缺口

- 缓存与进程不一致时是否标旧
  **影响**：可能基于假健康修改高权限扩展
  **进一步探讨**：外停 MCP、改配置、断网和切项目，测新鲜度与遮蔽

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-armory 启动、持续使用与失败恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

依赖 DSH Remote/Client、多 UI slot、MCP/市场服务；部分需网络、OAuth 和项目配置。持续维护信任、凭据、缓存和优先级；恢复须备份、停新连接、吊销并重启。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:993-996](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/lib/index.js#L993-L996)

定义 MCP 网关。

```text
	return class McpManagerGateway extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_list_decorators = [Remote("list")];
```

**依据 2 · 作者声明**：[README.md:87-90](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/README.md#L87-L90)

作者列出管理面。

```text
## 功能

- 查看每个 MCP 的状态、传输方式、连接参数与工具列表；展开工具可看完整输入 JSON Schema（必填/可选、类型、枚举、默认值与原始 JSON）
- 按传输方式（HTTP/stdio）与状态筛选，按名称/命令/URL 搜索
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 治理成本如何计量？

**研究主题**：效果与总成本

#### 完整回答

单位是一次扩展变更在正确作用域生效且可回滚。首次盘点配置凭据；持续含轮询、账本和审查；恢复定位作用域和吊销。缺治理分钟、错作用域率和陈旧秒数。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:87-90](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/README.md#L87-L90)

作者列出管理面。

```text
## 功能

- 查看每个 MCP 的状态、传输方式、连接参数与工具列表；展开工具可看完整输入 JSON Schema（必填/可选、类型、枚举、默认值与原始 JSON）
- 按传输方式（HTTP/stdio）与状态筛选，按名称/命令/URL 搜索
```

**依据 2 · 源码核查**：[lib/index.js:1058-1061](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/lib/index.js#L1058-L1061)

暴露工具裁缝。

```text
			_toolTailor_decorators = [Remote("toolTailor")];
			__esDecorate(this, null, _toolTailor_decorators, { kind: "method", name: "toolTailor", static: false, private: false, access: { has: (obj) => "toolTailor" in obj, get: (obj) => obj.toolTailor }, metadata: _metadata }, null, _instanceExtraInitializers);
			_wbConnectorCatalog_decorators = [Remote("wbConnectorCatalog")];
			__esDecorate(this, null, _wbConnectorCatalog_decorators, { kind: "method", name: "wbConnectorCatalog", static: false, private: false, access: { has: (obj) => "wbConnectorCatalog" in obj, get: (obj) => obj.wbConnectorCatalog }, metadata: _metadata }, null, _instanceExtraInitializers);
```

#### 缺口

- 每次变更分钟、错作用域率、陈旧秒数、回滚率
  **影响**：无法给出合格任务单位成本、成功率、节时或 ROI
  **进一步探讨**：十次配置任务对比手工和面板

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 作用域、遮蔽和刷新是否可靠？

**研究主题**：工程质量与复用

#### 完整回答

Remote 分离 Host/Client，事件账本补充静态配置，作用域标注必要。仍需验证 dispose、缓存失效、敏感遮蔽与原子写。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:993-996](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/lib/index.js#L993-L996)

定义 MCP 网关。

```text
	return class McpManagerGateway extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_list_decorators = [Remote("list")];
```

**依据 2 · 源码核查**：[lib/index.js:1058-1061](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/lib/index.js#L1058-L1061)

暴露工具裁缝。

```text
			_toolTailor_decorators = [Remote("toolTailor")];
			__esDecorate(this, null, _toolTailor_decorators, { kind: "method", name: "toolTailor", static: false, private: false, access: { has: (obj) => "toolTailor" in obj, get: (obj) => obj.toolTailor }, metadata: _metadata }, null, _instanceExtraInitializers);
			_wbConnectorCatalog_decorators = [Remote("wbConnectorCatalog")];
			__esDecorate(this, null, _wbConnectorCatalog_decorators, { kind: "method", name: "wbConnectorCatalog", static: false, private: false, access: { has: (obj) => "wbConnectorCatalog" in obj, get: (obj) => obj.wbConnectorCatalog }, metadata: _metadata }, null, _instanceExtraInitializers);
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 可审计变更集能否改善安全？

**研究主题**：新假设与验证

#### 完整回答

操作先生成来源、权限、作用域、diff、健康检查和回滚指令的变更集，批准后原子应用。若错作用域不降则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1058-1061](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/lib/index.js#L1058-L1061)

暴露工具裁缝。

```text
			_toolTailor_decorators = [Remote("toolTailor")];
			__esDecorate(this, null, _toolTailor_decorators, { kind: "method", name: "toolTailor", static: false, private: false, access: { has: (obj) => "toolTailor" in obj, get: (obj) => obj.toolTailor }, metadata: _metadata }, null, _instanceExtraInitializers);
			_wbConnectorCatalog_decorators = [Remote("wbConnectorCatalog")];
			__esDecorate(this, null, _wbConnectorCatalog_decorators, { kind: "method", name: "wbConnectorCatalog", static: false, private: false, access: { has: (obj) => "wbConnectorCatalog" in obj, get: (obj) => obj.wbConnectorCatalog }, metadata: _metadata }, null, _instanceExtraInitializers);
```

**依据 2 · 作者声明**：[README.md:87-90](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/README.md#L87-L90)

作者列出管理面。

```text
## 功能

- 查看每个 MCP 的状态、传输方式、连接参数与工具列表；展开工具可看完整输入 JSON Schema（必填/可选、类型、枚举、默认值与原始 JSON）
- 按传输方式（HTTP/stdio）与状态筛选，按名称/命令/URL 搜索
```

#### 缺口

- 变更集能否降低供应链配置错误
  **影响**：新方向仍是推演，不能计入插件当前贡献或效果
  **进一步探讨**：二十次诱饵任务，错误下降且回滚100%

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · dsh-armory 适合观察、试用还是安装，停止条件是什么？

**研究主题**：采用判断

#### 完整回答

建议观察。先只读盘点，不从市场安装/改凭据；仅在 diff 与回滚通过后试一个低风险 MCP。错作用域、明文密钥、假健康或无法恢复即停。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:87-90](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/README.md#L87-L90)

作者列出管理面。

```text
## 功能

- 查看每个 MCP 的状态、传输方式、连接参数与工具列表；展开工具可看完整输入 JSON Schema（必填/可选、类型、枚举、默认值与原始 JSON）
- 按传输方式（HTTP/stdio）与状态筛选，按名称/命令/URL 搜索
```

**依据 2 · 源码核查**：[lib/index.js:1058-1061](https://github.com/2026heshao/dsh-armory/blob/122670a78a15c0df803094dbd0db2fa65d336435/lib/index.js#L1058-L1061)

暴露工具裁缝。

```text
			_toolTailor_decorators = [Remote("toolTailor")];
			__esDecorate(this, null, _toolTailor_decorators, { kind: "method", name: "toolTailor", static: false, private: false, access: { has: (obj) => "toolTailor" in obj, get: (obj) => obj.toolTailor }, metadata: _metadata }, null, _instanceExtraInitializers);
			_wbConnectorCatalog_decorators = [Remote("wbConnectorCatalog")];
			__esDecorate(this, null, _wbConnectorCatalog_decorators, { kind: "method", name: "wbConnectorCatalog", static: false, private: false, access: { has: (obj) => "wbConnectorCatalog" in obj, get: (obj) => obj.wbConnectorCatalog }, metadata: _metadata }, null, _instanceExtraInitializers);
```

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
