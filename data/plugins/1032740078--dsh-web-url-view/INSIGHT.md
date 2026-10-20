# dsh-web-url-view

> 在设置页显示临时与固定 Web 访问地址，支持局域网访问。

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-url-view) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view/commits)
<!-- END META -->

## 版本

固定提交 [193343093186016080a81c5512c6936809daff25](https://github.com/1032740078/dsh-web-url-view/tree/193343093186016080a81c5512c6936809daff25)

## 采用点评

- **用途**：在设置页显示临时与固定 Web 访问地址，支持局域网访问。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：稳定地址提高可达性也扩大暴露面；必须结合认证、监听接口与网络边界判断安全性。
- **建议**：先在受控局域网核对绑定地址、认证和重启后稳定性，不应把可访问等同于安全远程接入。

## 场景、原有办法与合格交付

目标场景是：在设置页显示临时与固定 Web 访问地址，支持局域网访问。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`dsh-web-url-view@0.1.0`。
- 声明依赖：`react`、`@deepseek-ai/cordis`、`@deepseek-ai/dsh-typert-protocol`、`@deepseek-ai/dsh-api-remotes`、`@deepseek-ai/dsh-client-locale`、`@deepseek-ai/dsh-client-ui-slots`、`@deepseek-ai/dsh-client-ui-settings`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .js | 12 | 11342 | 9891 | 1880 | 15 | — |
| source | .md | 2 | 384 | — | — | — | 3075 |
| source | .ts | 10 | 1097 | 586 | 443 | 74 | — |
| source | .tsx | 1 | 206 | 160 | 32 | 14 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：`lib/types/client/index.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/types/client/locales.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/types/client/remote.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/types/client/WebUrlSection.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/types/fixed-entry.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/types/index.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/types/lan.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/types/service.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/types/typert.host.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/types/wire.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`src/css-modules.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）。解析错误：未记录。

## 能力清单

- inventory 未检出可人工确认的正向 DSH 注册条目；这不等于确认不存在动态或配置式能力。

## 工程亮点

固定组件内共纳入 25 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 7 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[lib/client.js](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/lib/client.js)。


把临时 token 地址与稳定入口并列，便于用户理解两种生命周期。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-19。
