# dsh-web-url-view

> 显示当前 Web 地址，并提供转发到当前 DSH 实例的固定端口入口。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[1933430](https://github.com/1032740078/dsh-web-url-view/tree/193343093186016080a81c5512c6936809daff25)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view)
<!-- END META -->

**使用建议**：先保持回环绑定，测试重启后的令牌更新与拒绝外部 Origin，再考虑受控网络访问。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：桌面版每次重启更换端口和令牌时，用户希望有稳定的浏览器入口。

复制宿主原生带令牌地址最简单；固定代理只在频繁重启且明确网络边界时值得增加。

## 能力与限制

- **Host 路由**：固定端口 HTTP/WebSocket 转发。
- **界面**：查看当前访问地址。

**流程与依赖**

依赖宿主认证握手、WebSocket 和当前目标端口，不能脱离宿主认证实现单独保证安全。

查看当前地址或打开固定端口；重启后代理重新取得目标会话，失败时检查握手和绑定地址。

**兼容条件**

包版本 0.1.0，依赖连接和 Web 服务；源码与打包库体积需分开理解。

**效果与成本**

无需模型调用，代价是额外监听端口和代理状态，升级时要核查信任边界。

- **思考**：稳定地址能减少复制地址的操作；将访问扩展到局域网会改变访问控制需求。

## 工程分析

- **亮点**：固定端口代理在内部换取当前实例会话 cookie，转发 HTTP/WebSocket 并处理 Host、Origin 与 cookie。

固定入口与易变目标分离有可借鉴性，但重写请求头和代持 cookie 需要专门审查。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未做认证审计或真实网络测试；固定入口持有目标会话能力，不能视为普通无权限书签。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：验证旧令牌失效、目标重启、异源请求、WebSocket 与回环/局域网绑定差异。

**分析版本**

固定提交 [1933430](https://github.com/1032740078/dsh-web-url-view/tree/193343093186016080a81c5512c6936809daff25)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 12 | 11342 | 9891 | 1880 | — |
| .md | source | 2 | 384 | — | — | 3075 |
| .ts | source | 10 | 1097 | 586 | 443 | — |
| .tsx | source | 1 | 206 | 160 | 32 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1032740078/dsh-web-url-view/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
