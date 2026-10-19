# 基础设施

[返回首页](../../../README.md)

## 分类导航

- [@zzerx/dsh-plugin-usage-billing](#plugin-1363429979-plugin-usage-billing)：从会话日志聚合 token 用量，并按事件时价格显示预算与费用。
- [DSH Telemetry Redactor](#plugin-1333368566-root)：运维希望保留可观测性又降低遥测后端收到凭证的概率。
- [dsh-about](#plugin-1354283280-root)：在设置页展示当前 DSH 与插件版本及项目入口。
- [dsh-model-info-fill](#plugin-1358816037-root)：按 models.dev 补齐自定义模型的上下文、输出、推理和图片能力。
- [dsh-plugin-quota](#plugin-1400927706-root)：实时跟踪会话 token、轮次与估算费用，并向模型注入预算信号。
- [dsh-reasoning-tiers](#plugin-1367305514-root)：为第三方模型补齐推理档位与模型能力元数据。
- [dsh-ui-auth](#plugin-1343420855-root)：小团队想共用DSH Web而隔离工作区、会话和API凭证。
- [dsh-web-restart](#plugin-1335060007-root)：在 Web 侧栏提供单击重启 DSH Web 进程的入口。
- [dsh-web-url-view](#plugin-1366583376-root)：在设置页显示临时与固定 Web 访问地址，支持局域网访问。
- [元冰可 ybkkasi](#plugin-1416699252-root)：面向需要厘清谁能调用什么、费用归谁和出了问题如何追踪的企业平台团队。

### 基础设施（10）

<a id="plugin-1363429979-plugin-usage-billing"></a>

#### [@zzerx/dsh-plugin-usage-billing](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 1814](https://img.shields.io/static/v1?label=npm+30d&message=1%2C814&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/commits)

- **用途**：从会话日志聚合 token 用量，并按事件时价格显示预算与费用。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：费用准确性依赖日志完整、模型键匹配和历史价格表；估算不可直接当账单或财务凭证。
- **建议**：抽取已知模型与价格的一组会话，逐条复算 token 和费用；差异无法解释时只作趋势参考。

<a id="plugin-1333368566-root"></a>

#### [DSH Telemetry Redactor](../../plugins/030611--dsh-telemetry-redactor/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor) · [![npm 30d 1248](https://img.shields.io/static/v1?label=npm+30d&message=1%2C248&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor/commits)

- **用途**：运维希望保留可观测性又降低遥测后端收到凭证的概率。合格结果是支持的假密钥在导出副本被替换、计量字段保留且原始记录不变；基线是不开遥测或后端事后清洗。
- **亮点**：在 DSH 遥测副本导出前遮盖支持的敏感键和凭证模式，保留原始会话日志。
- **思考**：不新增模型调用；每条副本同步遍历，成本随内容大小增长。首次成本是规则矩阵与出口盘点，持续成本是格式变化、监听顺序与性能回归；不在本轮编造吞吐或延迟。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：适合已有遥测导出的部署先做合成凭证试用，同时检查完整监听链和本地日志权限。

<a id="plugin-1354283280-root"></a>

#### [dsh-about](../../plugins/1010n111--dsh-about/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1010n111/dsh-about) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-about) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1010n111/dsh-about/commits)

- **用途**：在设置页展示当前 DSH 与插件版本及项目入口。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：它改善可见性但不执行升级或兼容判断；显示版本若来自不同运行副本仍可能误导排障。
- **建议**：在升级前后核对页面、CLI 与实际加载包版本一致，把它作为诊断入口而非更新保证。

<a id="plugin-1358816037-root"></a>

#### [dsh-model-info-fill](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model-info-fill) · [![最后更新 5天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=5%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill/commits)

- **用途**：按 models.dev 补齐自定义模型的上下文、输出、推理和图片能力。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：名称匹配和外部目录都可能过时或碰撞；自动补值若覆盖人工配置会影响任务成本与正确性。
- **建议**：用一组已知模型检查匹配、未匹配和人工覆盖优先级，错误匹配出现时保持手工配置。

<a id="plugin-1400927706-root"></a>

#### [dsh-plugin-quota](../../plugins/121212165--dsh-plugin-quota/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota) · [![npm 30d 147](https://img.shields.io/static/v1?label=npm+30d&message=147&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-quota) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota/commits)

- **用途**：实时跟踪会话 token、轮次与估算费用，并向模型注入预算信号。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：估算和预测不等于供应商账单；每轮注入本身占上下文，错误价格会让模型做出错误自限。
- **建议**：用已知 token 记录核对仪表和账单，比较注入开销；偏差超出容忍度时只保留只读面板。

<a id="plugin-1367305514-root"></a>

#### [dsh-reasoning-tiers](../../plugins/1069137617--dsh-reasoning-tiers/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1069137617/dsh-reasoning-tiers) · [![npm 30d 1066](https://img.shields.io/static/v1?label=npm+30d&message=1%2C066&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-reasoning-tiers) · [![最后更新 13天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=13%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1069137617/dsh-reasoning-tiers/commits)

- **用途**：为第三方模型补齐推理档位与模型能力元数据。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：内置知识表会随供应商模型变化而过时；错误上下文或推理档位可能导致失败或意外成本。
- **建议**：用实际供应商模型逐一核对上下文、输出与图片能力，并保留未知项而非自动猜测。

<a id="plugin-1343420855-root"></a>

#### [dsh-ui-auth](../../plugins/0qwq0--dsh-ui-auth/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth) · [![npm 30d 1635](https://img.shields.io/static/v1?label=npm+30d&message=1%2C635&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-auth) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth/commits)

- **用途**：小团队想共用DSH Web而隔离工作区、会话和API凭证。合格交付物是用户A无法读取／操作B的资源，撤销与退出立即影响长连接；基线是各用户独立实例与反向代理认证，两者复杂度与隔离强度应同时比较。
- **亮点**：为 DSH Web 提供登录、用户管理、会话隔离与按用户模型凭证管理，支持 TOTP 和通行密钥。
- **思考**：首次包括身份策略、TLS、数据迁移与多用户回归；持续包括口令派生、加解密、mux代理、审计留存和宿主适配；迁移需保护加密数据与恢复路径。无新增模型调用不等于无运维成本。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：仅作为隔离测试环境的候选，先做双用户REST／WS／凭证和升级回归，尚无本轮真实宿主安全验收。

<a id="plugin-1335060007-root"></a>

#### [dsh-web-restart](../../plugins/1123762794--dsh-web-restart/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1123762794/dsh-web-restart) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-restart) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1123762794/dsh-web-restart/commits)

- **用途**：在 Web 侧栏提供单击重启 DSH Web 进程的入口。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：无二次确认的重启会中断活动连接；持久按钮不等于会话与后台任务能安全恢复。
- **建议**：只在可恢复环境试用，先验证活动任务、未保存输入和重启后的连接状态。

<a id="plugin-1366583376-root"></a>

#### [dsh-web-url-view](../../plugins/1032740078--dsh-web-url-view/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-url-view) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view/commits)

- **用途**：在设置页显示临时与固定 Web 访问地址，支持局域网访问。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：稳定地址提高可达性也扩大暴露面；必须结合认证、监听接口与网络边界判断安全性。
- **建议**：先在受控局域网核对绑定地址、认证和重启后稳定性，不应把可访问等同于安全远程接入。

<a id="plugin-1416699252-root"></a>

#### [元冰可 ybkkasi](../../plugins/01men--ybkkasi/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/01men/ybkkasi) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-enterprise-ops) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/01men/ybkkasi/commits)

- **用途**：面向需要厘清谁能调用什么、费用归谁和出了问题如何追踪的企业平台团队。合格交付物是授权可撤销、调用可归属且账目可核对；基线是现有 IAM、API 网关、费用报表和审批台账，不能直接据作者新品类表述推导市场需求已验证。
- **亮点**：自托管企业 AI 资源管理平台，统一纳管 MCP、Skill、Agent 和应用，提供身份、权限、计量与审计。
- **思考**：首次成本集中在权限映射、资产录入、账号接入与运维；持续包括数据库与备份、审计留存、渠道费用及策略维护。迁移涉及多域数据和身份关系，远高于装一个 UI 插件。没有实测企业工作负载，不能用作者自测断言数推算可靠性。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：有多团队资产治理痛点时先评估独立测试实例与最小域，个人使用不建议为一个需求部署整个平台。

## 更新时间

2026-10-19
