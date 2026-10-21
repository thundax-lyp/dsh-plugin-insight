# dsh-pet-live2d

> 在DSH中显示可拖动Live2D宠物，并随会话状态切换动作、气泡与表情。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[2b48355](https://github.com/A8Chann/dsh-pet-live2d/tree/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet)

<!-- BEGIN META -->
[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d) · [![npm 30d 7358](https://img.shields.io/static/v1?label=npm+30d&message=7%2C358&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d) · [![首次发布 2026-09-21](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-09-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d)
<!-- END META -->

**使用建议**：适合个人会话提示先试用。自定义资源先独立备份，核对角色与Core使用条件；升级前检查只改贴图情形，不以manifest未变认定无人修改。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：希望获得会话状态提示与桌面陪伴的用户，合格表现是状态一致、透明画布不挡操作且自定义资源升级不丢失。

- **建议**：由manifest级判定推导，可保存每个随包文件摘要并做逐文件三方更新，冲突保留用户版本并给预览。未验证；分别只改贴图/音频/manifest再升级，若仍覆盖用户同名资源则否定。

适合个人会话提示先试用。自定义资源先独立备份，核对角色与Core使用条件；升级前检查只改贴图情形，不以manifest未变认定无人修改。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

普通网页Live2D只做装饰，插件补会话反馈；宿主状态文字更轻量，价值在用户偏好。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：Live2D互动桌宠与配置。
- **事件监听**：将会话相位镜像为宠物动作。
- **Host 路由**：提供宠物资源、Core缓存与事件数据。

**流程与依赖**

DSH客户端/事件席位、WebGL/Live2D运行时与角色文件；首次联网或人工Core缓存必要，桌面显示依赖宿主能力。

首次复制宠物/获取Core，加载角色，用户拖动配置，事件驱动相位，升级按manifest指纹判断同步；冲突需人工保留资源。

**效果与成本**

首次下载Core与资源，运行占渲染/音频资源，持续维护宿主事件和自定义模型；没有用户效率或GPU开销实测。

改善状态可见与个性体验，未证明工作产出提升。

- **思考**：“自改目录一个字不碰”是否由指纹保证？同步判断只比较pet.json，后续cpSync逐文件覆盖；用户只改同名贴图而manifest未变时未必受保护。Core下载仅长度与标记检查不是固定摘要验证，离线首次安装也需要外部运行时。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对纯静态桌宠，增量是会话相位与动作池、用户互动和可保存配置结合。渲染依赖Cubism/Pixi，随包角色是独立授权资产，不能归为插件原创。

相对纯静态桌宠，增量是会话相位与动作池、用户互动和可保存配置结合。渲染依赖Cubism/Pixi，随包角色是独立授权资产，不能归为插件原创。

组件边界、事件镜像与资源同步记录可借鉴；哈希只覆盖manifest的保护范围必须如实表达，许可证与运行时供应链分开管理。 源码依据：[dsh-live2d-pet/lib/index.js](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/lib/index.js)、[dsh-live2d-pet/README.md](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/README.md)、[dsh-live2d-pet/LICENSE](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/LICENSE)、[dsh-live2d-pet/pets/ds-whale-girl/LICENSE](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/pets/ds-whale-girl/LICENSE)。

<a id="detail-section-5"></a>

### 主要限制

“自改目录一个字不碰”是否由指纹保证？同步判断只比较pet.json，后续cpSync逐文件覆盖；用户只改同名贴图而manifest未变时未必受保护。Core下载仅长度与标记检查不是固定摘要验证，离线首次安装也需要外部运行时。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[A8Chann/dsh-pet-live2d](https://github.com/A8Chann/dsh-pet-live2d)
- **版本号**：3.3.3（[固定提交 2b48355b](https://github.com/A8Chann/dsh-pet-live2d/tree/2b48355bc9fb0c99cd5d32df64675b1900629e88)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 dsh-live2d-pet/lib/index.js、dsh-live2d-pet/README.md、dsh-live2d-pet/LICENSE、dsh-live2d-pet/pets/ds-whale-girl/LICENSE 及固定范围 inventory；组件：dsh-live2d-pet。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：测试透明点击穿透、相位结束回idle、失焦、禁用清理及逐文件自定义升级；监测渲染开销与资源许可。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由manifest级判定推导，可保存每个随包文件摘要并做逐文件三方更新，冲突保留用户版本并给预览。未验证；分别只改贴图/音频/manifest再升级，若仍覆盖用户同名资源则否定。

测试透明点击穿透、相位结束回idle、失焦、禁用清理及逐文件自定义升级；监测渲染开销与资源许可。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：dsh-live2d-pet；内容摘要：6d86f5df89d1ea36cd93647a3749282069cf78dbd3c87a9f973401c5b8b9fe9c。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1328 | — | — | 20751 |
| .js | source | 7 | 12674 | 8169 | 3975 | — |
| .ts | source | 1 | 28 | 17 | 10 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=grey&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) · [![近30天关闭 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=grey&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
