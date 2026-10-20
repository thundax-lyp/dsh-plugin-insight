# dsh-ui-auth

> 为 DSH Web 提供登录、用户管理和认证网关，并支持 TOTP、Passkey 与会话隔离。

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth) · [![npm 30d 1608](https://img.shields.io/static/v1?label=npm+30d&message=1%2C608&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-auth) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth/commits)
<!-- END META -->

## 版本

固定提交 [6c5e87b44be4e973b092910968001916bb97d22e](https://github.com/0QwQ0/dsh-ui-auth/tree/6c5e87b44be4e973b092910968001916bb97d22e)

## 用途与采用点评

- **用途**：需要让多个用户访问 DSH Web 的部署者，需要认证入口和数据访问边界。
- **亮点**：包装 HTTP 与 upgrade 入口，现代网关按会话处理认证；宿主能力缺失时 fail-closed。
- **思考**：统一入口与关闭式失败路径是有效机制；全接口安全仍依赖覆盖、宿主升级和反代配置。
- **建议**：先在隔离环境逐一测试 HTTP、WebSocket 和多用户访问，不把安装成功当成公网安全保证。

## 场景与替代办法

需要让多个用户访问 DSH Web 的部署者，需要认证入口和数据访问边界。

反向代理认证是可替代的入口层，但未必有宿主会话隔离；两者要按同一越权用例比较。

## 依赖与流程

需要现代 webServer、connection 契约和持久化认证状态；TOTP、Passkey 还受浏览器与站点条件影响。

初始化管理员后建立普通用户并测试权限；升级前备份认证材料，异常时采用受控恢复流程。

## 成本与效果

需维护账号、密钥、恢复方式和反向代理配置；省掉自写登录页不代表省掉安全运维。

统一入口与关闭式失败路径是有效机制；全接口安全仍依赖覆盖、宿主升级和反代配置。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：899ef6bf9e10d0f20336ae41438de66b117eb4343f7e61d4c6043911fd2bf986。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 3381 | — | — | 58130 |
| .js | source | 12 | 9818 | 8996 | 849 | — |
| .ts | source | 12 | 8122 | 6639 | 1044 | — |
| .cjs | test | 2 | 288 | 244 | 19 | — |
| .mjs | test | 35 | 6084 | 4406 | 1302 | — |

排除 2 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **Host 路由**：认证网关及 HTTP/WebSocket 访问裁决。
- **界面**：登录与用户管理设置页面。

## 工程亮点

集中处理 transport 与注销清理可降低散落拦截；打包客户端含第三方代码，不应把其行数算原创。

## 分发与兼容

清单版本 0.7.1，目标为 DSH 0.2.0 系列；作者明确停止 legacy 支持，不应混用旧部署说明。

## 历史对照

前次代码指纹为 6c5e87b44be4e973b092910968001916bb97d22e；本轮固定为 6c5e87b44be4e973b092910968001916bb97d22e。反向代理认证是可替代的入口层，但未必有宿主会话隔离；两者要按同一越权用例比较。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读鉴权入口与客户端，未完成全路由越权、密码学、会话隔离或代理部署安全审计。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用两个用户覆盖未登录 API、未知路径、WebSocket、会话读取与升级失败，确认没有旁路。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
