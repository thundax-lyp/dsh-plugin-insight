# 基础设施

[返回首页](../../../README.md)

## 分类导航

- [DSH Telemetry Redactor](#plugin-1333368566-root)：在遥测副本送往已配置后端前遮盖支持的凭证模式，保留原始会话日志。
- [dsh-ui-auth](#plugin-1343420855-root)：为多人使用的 DSH Web 增加登录、用户隔离和按用户模型凭证管理。
- [元冰可 ybkkasi](#plugin-1416699252-root)：统一管理企业的 MCP、Skill、Agent、应用、权限、用量与审计资产。

### 基础设施（3）

<a id="plugin-1333368566-root"></a>

#### [DSH Telemetry Redactor](../../plugins/030611--dsh-telemetry-redactor/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor) · [![npm 30d 1203](https://img.shields.io/static/v1?label=npm+30d&message=1%2C203&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor/commits)

- **用途**：在遥测副本送往已配置后端前遮盖支持的凭证模式，保留原始会话日志。
- **亮点**：敏感键与字符串模式联合处理，区分 token 计量字段；拒绝循环、访问器及超深记录。
- **思考**：过滤规则和监听器顺序都有边界，原始日志仍含原值；它不能作为全面数据防泄漏证明。
- **建议**：适合已有遥测导出的部署先做合成凭证试用，同时检查完整监听链和本地日志权限。

<a id="plugin-1343420855-root"></a>

#### [dsh-ui-auth](../../plugins/0qwq0--dsh-ui-auth/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth) · [![npm 30d 1551](https://img.shields.io/static/v1?label=npm+30d&message=1%2C551&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-auth) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth/commits)

- **用途**：为多人使用的 DSH Web 增加登录、用户隔离和按用户模型凭证管理。
- **亮点**：不仅拦页面，还处理 REST、WebSocket mux帧归属和私有模型配置的信封加密。
- **思考**：共享服务的安全边界依赖宿主路由、传输与升级契约；有登录页不等于所有数据面已隔离，也不抵御控制服务进程的管理员。
- **建议**：仅作为隔离测试环境的候选，先做双用户REST／WS／凭证和升级回归，尚无本轮真实宿主安全验收。

<a id="plugin-1416699252-root"></a>

#### [元冰可 ybkkasi](../../plugins/01men--ybkkasi/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/01men/ybkkasi) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/01men/ybkkasi/commits)

- **用途**：统一管理企业的 MCP、Skill、Agent、应用、权限、用量与审计资产。
- **亮点**：以资源本体、身份、计量和审批贯通多个业务域，提供独立宿主及 DSH 桥接两种接入。
- **思考**：它是平台型工程而非轻量增效插件；DSH 形态仍为 experimental，治理模型是否贴合现有业务比功能数量更重要。
- **建议**：有多团队资产治理痛点时先评估独立测试实例与最小域，个人使用不建议为一个需求部署整个平台。

## 更新时间

2026-10-19
