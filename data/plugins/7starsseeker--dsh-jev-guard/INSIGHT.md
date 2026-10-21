# dsh-jev-guard

> 在 DSH 命令执行前结合静态规则与 Jev 判定，返回放行、改写、拒绝或人工升级。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[89eb699](https://github.com/7starsseeker/dsh-jev-guard/tree/89eb6995cc2ccd3f49b7c12ae74ad2464354c312)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/7starsseeker/dsh-jev-guard) [![npm 30d 2,072](https://img.shields.io/static/v1?label=npm+30d&message=2%2C072&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-jev-guard) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-jev-guard)
<!-- END META -->

**使用建议**：作为已有沙箱和审批的补充先在隔离项目试；检查实际覆盖的工具、网络故障和降级提示，核对脚本变更后是否重新判断，不把allow当无风险。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、流程与依赖](#detail-section-3)
  - [效果、成本与限制](#detail-section-4)
  - [核心贡献与工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

开发Agent在bash/pwsh执行前补一道误删/覆盖事故检查，交付拦截或人工升级决定及审计；不是完整安全沙箱。

参照静态危险规则、宿主审批与模型风险分类；不把Jev作者校准当独立对照。

<a id="detail-section-3"></a>

### 能力、流程与依赖

adapters/dsh/index.js挂tools/pre-execute提取command，gate先L0再只读/可重建预筛，再调用Jev按阈值判定；额度/认证故障进入持久降级，按宿主ask/never映射typed决策，token提供一次授权路径。

- **事件监听**：tools/pre-execute命令审查及会话降级告知。
- **后台**：规则/Jev判断、缓存和持久降级状态。

DSH tools/pre-execute、审批/userQuestions及凭据服务，Jev端点与额度；被调用脚本最多读取有限字节，真实文件状态可能变化。

提取命令→L0→预筛→缓存/脚本状态→Jev→四态→宿主审批或执行→审计/降级通知；网络错误可能放行，需让使用者知情。

DSH执行管线适配与独立CLI，零运行依赖、Node>=20；支持平台由命令语法与宿主实际hook决定。

<a id="detail-section-4"></a>

### 效果、成本与限制

有机会拦下明显破坏命令并让灰区交人；默认可用性优先的fail-open意味着它不承担不可绕过的安全边界。

首次配置密钥、阈值、覆盖工具与审批政策；持续承担判据API、人工升级、误拦改写与审计存储。作者延迟/费用仅其测量，无本轮成本复现。

事故阀门能否当安全边界？默认只覆盖bash/pwsh，网络/超时错误fail-open，降级仅L0+预筛；绕过工具或未知语法不受全面保障。cache键为cwd+command，在buildState读取脚本前命中，脚本内容变了但命令没变可能复用旧判定。作者小样本校准也不能保证任意生产命令召回。

<a id="detail-section-5"></a>

### 核心贡献与工程亮点

相对仅提示模型小心，贡献是执行管线前真实typed拦截，并将免费规则、语义灰区改写/人工升级和额度故障可见化组合。Jev是外部模型、宿主审批是上游能力；插件增量是命令状态构造、决策映射和降级生命周期。

判据语言独立UI、静态规则先于token、降级状态分scope与global可借鉴；缓存需绑定内容，审计含命令应避免保存敏感参数。

源码依据：[adapters/dsh/index.js](https://github.com/7starsseeker/dsh-jev-guard/blob/89eb6995cc2ccd3f49b7c12ae74ad2464354c312/adapters/dsh/index.js)、[lib/gate.js](https://github.com/7starsseeker/dsh-jev-guard/blob/89eb6995cc2ccd3f49b7c12ae74ad2464354c312/lib/gate.js)、[lib/rules.js](https://github.com/7starsseeker/dsh-jev-guard/blob/89eb6995cc2ccd3f49b7c12ae74ad2464354c312/lib/rules.js)、[lib/quota.js](https://github.com/7starsseeker/dsh-jev-guard/blob/89eb6995cc2ccd3f49b7c12ae74ad2464354c312/lib/quota.js)、[lib/token.js](https://github.com/7starsseeker/dsh-jev-guard/blob/89eb6995cc2ccd3f49b7c12ae74ad2464354c312/lib/token.js)、[lib/audit.js](https://github.com/7starsseeker/dsh-jev-guard/blob/89eb6995cc2ccd3f49b7c12ae74ad2464354c312/lib/audit.js)、[package.json](https://github.com/7starsseeker/dsh-jev-guard/blob/89eb6995cc2ccd3f49b7c12ae74ad2464354c312/package.json)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：开发Agent在bash/pwsh执行前补一道误删/覆盖事故检查，交付拦截或人工升级决定及审计；不是完整安全沙箱。

- **建议**：待验证假设：判定缓存绑定实际被执行脚本/包脚本摘要与规则/模型版本，遇到无法固定输入时不用旧allow，可减少内容变化后的陈旧放行。由cache先于buildState及同命令复用推导，未实现。对照先安全后危险同名脚本、package.json脚本变更和模型故障，测陈旧命中、误拦与延迟；不能以缓存节省牺牲未检查内容。

作为已有沙箱和审批的补充先在隔离项目试；检查实际覆盖的工具、网络故障和降级提示，核对脚本变更后是否重新判断，不把allow当无风险。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码确认执行前挂钩、分层规则和显式降级；作者校准/真实宿主记录未复现，外部模型效果与新命令覆盖未知。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **事件监听**：tools/pre-execute命令审查及会话降级告知。
- **后台**：规则/Jev判断、缓存和持久降级状态。

- **思考**：事故阀门能否当安全边界？默认只覆盖bash/pwsh，网络/超时错误fail-open，降级仅L0+预筛；绕过工具或未知语法不受全面保障。cache键为cwd+command，在buildState读取脚本前命中，脚本内容变了但命令没变可能复用旧判定。作者小样本校准也不能保证任意生产命令召回。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：相对仅提示模型小心，贡献是执行管线前真实typed拦截，并将免费规则、语义灰区改写/人工升级和额度故障可见化组合。Jev是外部模型、宿主审批是上游能力；插件增量是命令状态构造、决策映射和降级生命周期。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- 版本号：0.5.6；版本日期：2026-10-17（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[89eb6995](https://github.com/7starsseeker/dsh-jev-guard/tree/89eb6995cc2ccd3f49b7c12ae74ad2464354c312)；本次截止 2026-10-21T03:36:14Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读DSH adapter、gate缓存/状态/API、rules/quota/token；未运行危险命令、校准集或外部Jev，不宣称生产准确率。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：80909323d11a3ddb0e48cd5758b19457d5a6d48800fa1aaff68bb9beec975d0e。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 40 | 6719 | — | — | 101622 |
| .js | source | 8 | 3258 | 1509 | 1575 | — |
| .mjs | source | 16 | 3680 | 2390 | 998 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：判定缓存绑定实际被执行脚本/包脚本摘要与规则/模型版本，遇到无法固定输入时不用旧allow，可减少内容变化后的陈旧放行。由cache先于buildState及同命令复用推导，未实现。对照先安全后危险同名脚本、package.json脚本变更和模型故障，测陈旧命中、误拦与延迟；不能以缓存节省牺牲未检查内容。

隔离合成命令验证工具绕过、缓存内容变更、网络fail-open、额度粘性和ask/never映射，再独立盲评；本轮无执行。

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/7starsseeker/dsh-jev-guard/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
