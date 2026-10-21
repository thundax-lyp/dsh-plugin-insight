# dsh-discord-richpresence

> 把 DSH 的粗粒度活动或可选丰富状态同步到本地 Discord Rich Presence。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[bf8d34b](https://github.com/0QwQ0/dsh-discord-richpresence/tree/bf8d34b4a4c52e9128a44ca7abf6a7de52880266)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence)
<!-- END META -->

**使用建议**：先只开模糊状态，检查实际 Discord 展示内容和断线重连，再考虑丰富模式。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：希望向 Discord 联系人展示工作状态的桌面用户，而非需要团队任务追踪的部署。

手工状态或系统勿扰更轻；本轮源码核查支持自动同步机制，不支持效率提升结论。

## 能力与限制

- **后台**：本地 Discord RPC 连接、活动更新与重连。

**流程与依赖**

依赖本地 Discord IPC、应用 ID 及 DSH 活动信号；远程无桌面部署未必适用。

配置应用和文案，后台连接 Discord；未启动或断线时等待重连，用户从 Discord 实际状态验收。

**兼容条件**

包与本地 Discord 客户端共同决定可用性，GitHub 源码存在不证明 RPC 已连接。

**效果与成本**

无额外模型服务，持续代价是常驻连接、重连和隐私配置；没有资源占用实测。

- **思考**：减少手动改状态，但不能证明专注度或工作产出；企业环境应先确认活动公开政策。

## 工程分析

- **亮点**：Host 聚合活动信号，通过本地 Discord RPC 更新文案；丰富模式按最短展示间隔轮换数据。

把状态模板与 RPC 传输分离便于检查外发数据；复用时需重新评估默认文案和更新频率。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：默认模糊文案仍对外暴露活动，丰富模式增加时间和用量信息；没有跨平台隐私验收。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：模拟 Discord 关闭、重启及多会话切换，抓取外发字段并核对真实用户会话选择。

**分析版本**

固定提交 [bf8d34b](https://github.com/0QwQ0/dsh-discord-richpresence/tree/bf8d34b4a4c52e9128a44ca7abf6a7de52880266)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 518 | — | — | 4632 |
| .js | source | 3 | 1305 | 940 | 270 | — |
| .mjs | test | 7 | 762 | 608 | 81 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
