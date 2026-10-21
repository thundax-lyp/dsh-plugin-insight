# dsh-neo-skin

> 通过主题覆盖层为 DSH Web 提供新粗野主义配色和可切换外观方案。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[fe5ef0e](https://github.com/0nt-one/dsh-neo-skin/tree/fe5ef0e671fab5ab8c8700013f3966eb9642455f)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/0nt-one/dsh-neo-skin) · [![npm 30d 108](https://img.shields.io/static/v1?label=npm+30d&message=108&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-neo-skin) · [![首次发布 2026-08-15](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-neo-skin)
<!-- END META -->

**使用建议**：先在测试配置中切换深浅主题、关闭插件并刷新，确认能完整恢复原生样式。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：长时间使用 DSH Web 且偏好高对比外观的用户，需要可撤销的视觉定制。

宿主自带主题维护最低；本轮确认仍是覆盖方案，不是完整独立主题引擎。

## 能力与限制

- **界面**：主题覆盖和外观开关设置。

**流程与依赖**

依赖 DSH Web theme、locale 与 slots；偏好是浏览器本地状态，跨设备不会自动一致。

选择方案并保存本地偏好；升级后检查原生主题切换，异常时关闭覆盖层。

**兼容条件**

包版本 0.6.1，Web bundle 依赖主题服务；源码和发布产物未逐字节比较。

**效果与成本**

无需模型服务，但维护自定义外观和排查主题冲突需要时间，未测视觉疲劳改善。

- **思考**：叠加覆盖比替换原生主题更容易回退；个性化审美价值不能写成工作效率提升。

## 工程分析

- **亮点**：客户端调用 theme.overrideTokens，设置插槽控制开关与方案，偏好保存在 localStorage。

主题 token 与开关持久化分离可借鉴；复用依赖宿主主题和设置插槽契约。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未做可访问性、窄屏和不同宿主版本的视觉验收；截图不证明当前渲染一致。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：逐一检查深浅色、缩放、禁用后恢复和两个主题插件同时加载的冲突。

**分析版本**

固定提交 [fe5ef0e](https://github.com/0nt-one/dsh-neo-skin/tree/fe5ef0e671fab5ab8c8700013f3966eb9642455f)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 633 | 455 | 130 | — |
| .md | source | 1 | 142 | — | — | 1122 |
| .mjs | source | 1 | 47 | 29 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0nt-one/dsh-neo-skin/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/0nt-one/dsh-neo-skin/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0nt-one/dsh-neo-skin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
