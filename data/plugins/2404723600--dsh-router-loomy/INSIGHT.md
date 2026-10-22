# dsh-router-loomy

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[ccabca3](https://github.com/2404723600/dsh-router-loomy/tree/ccabca348ca2194287f0770ce348283fdb8bf3d8)

<!-- BEGIN META -->
[![npm 30d 1,480](https://img.shields.io/static/v1?label=npm+30d&message=1%2C480&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-router-loomy) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-router-loomy)
<!-- END META -->

> **实现功能**：将本机 Loomy 登录态与云端模型通道接入 dsh-router，提供模型目录和客户端状态页。

> **核心亮点**：作者明确参照dsh-router-traework同构范式，不能把核心选号、冷却和换号算插件原创。本项增量是Loomy本地会话发现、追踪头与“有[DONE]却无finish_reason”流的区分，处理常规兼容转发容易把半回答当成功的边界。

> **风险与缺陷**：缺finish_reason是否总能判断坏流并安全重试？sse.ts用completion_tokens>=maxTokens区分撞上限，否则判截断，只有推理无正文也判失败；这匹配作者观测，但合法上游格式变化或usage漏报可能误判。强制核心重试还会增加费用，已产生工具副作用的流需格外核对，不能把重试等同无损补齐。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
  - [1.7 源码索引](#detail-section-8)
- [2 未来设计假设（未验证）](#detail-section-9)
- [3 辅助信息](#detail-section-10)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已登录Loomy且使用dsh-router的用户，想在DSH中使用同一模型通道；成功标准是请求用预期账号完成、异常流可被识别且凭证不误暴露。

参照手工OpenAI兼容端点和traework适配器；本项是供应商差异适配，核心路由贡献不重复归属，也不把客户端账号可读当官方授权稳定性证据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **后台**：router.suppliers的Loomy工厂、本机登录态读取及SSE收尾守卫
- **Host 路由**：Loomy客户端状态与登录操作页面路由

**流程与依赖**

必需dsh-router核心、供应商契约及Loomy有效登录态/网络；本机自动读取依赖安装目录布局，可手填会话作为降级，仍需保护credential store。状态页需webServer，变更操作含进程级CSRF令牌。

已登录客户端→注册供应商→扫描/缓存会话→核心选号→插件加追踪头发请求→透传/聚合响应→守卫判断收尾并报告迟到错误→核心决定重试/冷却。登录失效需客户端重登或替换Key。

**效果与成本**

首次需要Loomy登录、router核心与profile装配；持续消耗上游额度、客户端维护、失效会话和断流重试人工，价格/收益未核算。自动读取避免复制密钥但增加本机客户端状态依赖。

减少手动粘贴会话与通道差异维护，把共同路由逻辑留给核心；可靠性收益取决于非公开客户端存储和上游SSE稳定，未有同条件合格率对照。

> **思考**：缺finish_reason是否总能判断坏流并安全重试？sse.ts用completion_tokens>=maxTokens区分撞上限，否则判截断，只有推理无正文也判失败；这匹配作者观测，但合法上游格式变化或usage漏报可能误判。强制核心重试还会增加费用，已产生工具副作用的流需格外核对，不能把重试等同无损补齐。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：作者明确参照dsh-router-traework同构范式，不能把核心选号、冷却和换号算插件原创。本项增量是Loomy本地会话发现、追踪头与“有[DONE]却无finish_reason”流的区分，处理常规兼容转发容易把半回答当成功的边界。

作者明确参照dsh-router-traework同构范式，不能把核心选号、冷却和换号算插件原创。本项增量是Loomy本地会话发现、追踪头与“有[DONE]却无finish_reason”流的区分，处理常规兼容转发容易把半回答当成功的边界。

api/sse.ts在原始流透传旁嗅探错误并扣住不完整[DONE]，将字节保真和成功语义分开，值得借鉴；accounts.ts读取文件失败可回退上次成功缓存，这利于短暂写入但可能继续使用旧身份。移植要定义缓存有效性和核心重试契约。

<a id="detail-section-5"></a>

### 1.4 主要限制

缺finish_reason是否总能判断坏流并安全重试？sse.ts用completion_tokens>=maxTokens区分撞上限，否则判截断，只有推理无正文也判失败；这匹配作者观测，但合法上游格式变化或usage漏报可能误判。强制核心重试还会增加费用，已产生工具副作用的流需格外核对，不能把重试等同无损补齐。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有Loomy账号和router环境时先用非敏感只读问题验证当前模型、账号与完整收尾，再测会话刷新和中断；频繁断流时核对是否重复调用，勿直接用于要求一次副作用的任务。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已确认本地登录态适配与SSE完整性守卫，作者自称OpenAI兼容不等于官方通道稳定承诺；未打开客户端、未读用户凭证或调用Loomy，截断判据迁移未验证。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/accounts.ts、src/provider.ts、src/api/sse.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读供应商注册、账号文件读取、provider编排与SSE判据；未访问实际auth-session、未运行上游smoke，未证明当前所有Loomy版本契约相同。
- 下一步：保留脱敏正常/截断/撞上限/纯推理/迟到错误SSE样本，固定核心版本比较误判率、重复请求与最终完整回答；再换客户端版本验证会话更新。兼容档若不能降低误重试或增加过多未知结果，则否定假设。

**分析版本**

- **仓库**：[2404723600/dsh-router-loomy](https://github.com/2404723600/dsh-router-loomy)
- **版本号**：0.2.0（[固定提交 ccabca34](https://github.com/2404723600/dsh-router-loomy/tree/ccabca348ca2194287f0770ce348283fdb8bf3d8)）
- **版本日期**：2026-10-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

### 1.7 源码索引

- [src/index.ts](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/index.ts)
- [src/accounts.ts](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/accounts.ts)
- [src/provider.ts](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/provider.ts)
- [src/api/sse.ts](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/api/sse.ts)

<a id="detail-section-9"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：把流完整性判据按上游版本存为兼容档，并向核心同时上报原始收尾事实与判定置信度，允许“结果未知”而非立即重试。来自当前硬编码判据和会话TTL读取；代价是核心契约扩展及版本样本维护。

保留脱敏正常/截断/撞上限/纯推理/迟到错误SSE样本，固定核心版本比较误判率、重复请求与最终完整回答；再换客户端版本验证会话更新。兼容档若不能降低误重试或增加过多未知结果，则否定假设。

<a id="detail-section-10"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 321 | — | — | 3040 |
| .mjs | source | 1 | 109 | 87 | 14 | — |
| .ts | source | 16 | 3185 | 2180 | 779 | — |
| .ts | test | 6 | 771 | 618 | 85 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/2404723600/dsh-router-loomy/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
