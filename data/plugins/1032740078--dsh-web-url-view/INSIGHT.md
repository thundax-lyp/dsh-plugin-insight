# dsh-web-url-view

> 显示当前 Web 地址，并提供转发到当前 DSH 实例的固定端口入口。

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view/commits)
<!-- END META -->

## 版本

固定提交 [193343093186016080a81c5512c6936809daff25](https://github.com/1032740078/dsh-web-url-view/tree/193343093186016080a81c5512c6936809daff25)

## 用途与采用点评

- **用途**：桌面版每次重启更换端口和令牌时，用户希望有稳定的浏览器入口。
- **亮点**：固定端口代理在内部换取当前实例会话 cookie，转发 HTTP/WebSocket 并处理 Host、Origin 与 cookie。
- **思考**：稳定地址能减少复制地址的操作；将访问扩展到局域网会改变访问控制需求。
- **建议**：先保持回环绑定，测试重启后的令牌更新与拒绝外部 Origin，再考虑受控网络访问。

## 场景与替代办法

复制宿主原生带令牌地址最简单；固定代理只在频繁重启且明确网络边界时值得增加。

## 依赖与流程

依赖宿主认证握手、WebSocket 和当前目标端口，不能脱离宿主认证实现单独保证安全。

查看当前地址或打开固定端口；重启后代理重新取得目标会话，失败时检查握手和绑定地址。

## 成本与效果

无需模型调用，代价是额外监听端口和代理状态，升级时要核查信任边界。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：e01146b826cfba304a4890d14eb979a282dce5f49064163b11e94e71c63b203e。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 12 | 11342 | 9891 | 1880 | — |
| .md | source | 2 | 384 | — | — | 3075 |
| .ts | source | 10 | 1097 | 586 | 443 | — |
| .tsx | source | 1 | 206 | 160 | 32 | — |

排除 11 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **Host 路由**：固定端口 HTTP/WebSocket 转发。
- **界面**：查看当前访问地址。

## 工程亮点

固定入口与易变目标分离有可借鉴性，但重写请求头和代持 cookie 需要专门审查。

## 分发与兼容

包版本 0.1.0，依赖连接和 Web 服务；源码与打包库体积需分开理解。


## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未做认证审计或真实网络测试；固定入口持有目标会话能力，不能视为普通无权限书签。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：验证旧令牌失效、目标重启、异源请求、WebSocket 与回环/局域网绑定差异。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
