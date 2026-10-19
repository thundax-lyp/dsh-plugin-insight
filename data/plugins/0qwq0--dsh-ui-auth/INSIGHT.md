# dsh-ui-auth

> 为 DSH Web 提供登录、用户管理、会话隔离与按用户模型凭证管理，支持 TOTP 和通行密钥。

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth) · [![npm 30d 1635](https://img.shields.io/static/v1?label=npm+30d&message=1%2C635&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-auth) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth/commits)
<!-- END META -->

## 版本

固定提交 [6c5e87b44be4e973b092910968001916bb97d22e](https://github.com/0QwQ0/dsh-ui-auth/tree/6c5e87b44be4e973b092910968001916bb97d22e)

## 采用点评

- **用途**：小团队想共用DSH Web而隔离工作区、会话和API凭证。合格交付物是用户A无法读取／操作B的资源，撤销与退出立即影响长连接；基线是各用户独立实例与反向代理认证，两者复杂度与隔离强度应同时比较。
- **亮点**：为 DSH Web 提供登录、用户管理、会话隔离与按用户模型凭证管理，支持 TOTP 和通行密钥。
- **思考**：首次包括身份策略、TLS、数据迁移与多用户回归；持续包括口令派生、加解密、mux代理、审计留存和宿主适配；迁移需保护加密数据与恢复路径。无新增模型调用不等于无运维成本。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：仅作为隔离测试环境的候选，先做双用户REST／WS／凭证和升级回归，尚无本轮真实宿主安全验收。

## 场景、原有办法与合格交付

目标场景是：小团队想共用DSH Web而隔离工作区、会话和API凭证。合格交付物是用户A无法读取／操作B的资源，撤销与退出立即影响长连接；基线是各用户独立实例与反向代理认证，两者复杂度与隔离强度应同时比较。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`dsh-ui-auth@0.7.1`。
- 声明依赖：`@simplewebauthn/server`、`qrcode`、`ws`、`@deepseek-ai/cordis`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 14 | 3381 | — | — | — | 58130 |
| source | .js | 12 | 9818 | 8996 | 849 | 40 | — |
| source | .ts | 12 | 8122 | 6639 | 1044 | 506 | — |
| test | .cjs | 2 | 288 | 244 | 19 | 26 | — |
| test | .mjs | 35 | 6084 | 4406 | 1302 | 457 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：`build/client.mjs`（generated/dependency/vendor/declaration heuristic; review exclusions）；`build/docs-matrix.mjs`（generated/dependency/vendor/declaration heuristic; review exclusions）。解析错误：未记录。

## 能力清单

- **事件监听**：locale/change

- events：`locale/change`（[lib/client.js:2966](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/lib/client.js#L2966)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 75 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 4 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[lib/client.js](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/lib/client.js)。


lib/index.js 接管server request／upgrade并注册/auth路由；modern-gateway.js投影HTTP结果与代理mux帧；profile-kek.js以用户口令派生KEK包装每配置随机DEK，AAD绑定uid/profileId。登录口令不直接持久化为明文key。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-19。
