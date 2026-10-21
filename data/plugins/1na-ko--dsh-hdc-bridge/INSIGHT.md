# dsh-hdc-bridge

> 在 DSH 中连接鸿蒙设备，构建调试应用并查询版本化开发知识。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[51868ae](https://github.com/1na-ko/dsh-hdc-bridge/tree/51868ae19c9114ea1f7d148f708928c0c0d00e59)

<!-- BEGIN META -->
[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/1na-ko/dsh-hdc-bridge) · [![npm 30d 1740](https://img.shields.io/static/v1?label=npm+30d&message=1%2C740&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-hdc-bridge)
<!-- END META -->

**使用建议**：已有鸿蒙环境的开发者可在测试设备评估；先验证构建产物与设备身份，再评价闭环是否省时。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [核查说明与分析版本](#detail-section-5)
- [未来设计假设（未验证）](#detail-section-6)
- [辅助信息](#detail-section-7)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：鸿蒙应用开发者在会话中观察设备、修改代码、构建部署并复核行为；合格交付是目标设备上符合预期的应用。

已有鸿蒙环境的开发者可在测试设备评估；先验证构建产物与设备身份，再评价闭环是否省时。

**核查状态**：已实现机制有源码支持；贡献价值为条件性解释，未来设计假设未验证。本轮仅作固定版本源码核查，未安装、运行目标代码或验收宿主。

<a id="detail-section-3"></a>

### 能力、流程与成本

参照直接hdc脚本及作者点名的hdc_mcp，未对该上游作完整实现比较，不主张协议创新。

host.js按会话策略调用shell，新execute/result和旧run两种宿主接口兼容；hdc-core统一设备发现与目标选择，knowledge读取带出处的离线官方文档。


本机hdc、授权设备及DSH shell服务；构建需DevEco或CLT/SDK、签名凭据，可选devecocli；图像检查依赖图像模型。

先switch_cwd和环境体检，显式选择设备，静态检查与构建，核查产物后安装启动，再以UI树、截图及日志复核；失败按结构化原因处理。

现金包括设备、模型与开发环境；人工为调试授权、签名、SDK布局兼容及失败复核。回退会增加命令执行与诊断时间，尚无同条件收益测量。

同一会话承接观察与部署减少手工交接，但源码完整性不能证明修复成功率。

- **模型工具**：hdc_list_targets、hdc_screenshot、build_project、start_app（源码注册）；带来源的离线官方知识读取与本地SDK查询

- **思考**：构建成功是否真的对应本次代码？build_project允许devecocli产物未更新时返回成功并附stale警告；hvigorw回退则要求mtime增长，增量无变化可能被拒。产物存在与mtime均不足以证明包对应目标配置，不能把ok视为部署验收。设备自动回退首台也可能改变观察对象。

<a id="detail-section-4"></a>

### 工程贡献

hdc-core以依赖注入闭包共享设备发现，知识加载保留来源及截断标记；host的环境失败分类避免缓存错误发现结果。复用时须保留策略、设备身份和产物验证语义。 源码依据：[lib/host.js](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/host.js#L46)、[lib/hdc-core.mjs](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/hdc-core.mjs#L17)、[lib/knowledge.mjs](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/knowledge.mjs#L27)。

- **亮点**：作者明确以hdc_mcp为已有参照、不重写协议。增量在将会话策略、设备观察、构建回退和版本知识接入同一工作流；shell seam缺失与沙箱环境失败独立报告，减少把环境故障误认成hdc缺失。

<a id="detail-section-5"></a>

### 核查说明与分析版本

- **仓库**：[1na-ko/dsh-hdc-bridge](https://github.com/1na-ko/dsh-hdc-bridge)
- **版本号**：0.10.2（[固定提交 51868ae](https://github.com/1na-ko/dsh-hdc-bridge/tree/51868ae19c9114ea1f7d148f708928c0c0d00e59)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）
- **实际范围**：固定提交源码抽读与作者材料核查；没有执行目标代码、测试、安装或真实宿主验收，没有确认独立用户效果。
- **来源**：作者README与上述固定版本源码；未确认独立采用效果，目录收录与下载统计不作效果证据。

<a id="detail-section-6"></a>

## 未来设计假设（未验证）

待验证假设：为每次构建部署绑定代码摘要、目标配置、HAP摘要、设备ID和观察记录，可减少过期包与多设备误归因。由已有构建产物检查和设备漏斗组合推导；需额外记录存储并处理敏感日志。

最小验证：两个API设备交替部署，注入旧HAP、无变化增量构建和错误签名；比较直接hdc与身份绑定流程的误投设备、错误成功和人工复核工时；未降低误判即否定假设。

<a id="detail-section-7"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 47 | 41131 | — | — | 270128 |
| .cjs | source | 1 | 458 | 361 | 36 | — |
| .js | source | 2 | 3281 | 2860 | 324 | — |
| .mjs | source | 17 | 3453 | 2904 | 377 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1na-ko/dsh-hdc-bridge/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 6](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=grey&logo=github&style=flat)](https://github.com/1na-ko/dsh-hdc-bridge/issues?q=is%3Aissue+created%3A2026-09-21T02%3A00%3A24.782Z..2026-10-21T02%3A00%3A24.782Z) · [![近30天关闭 6](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=grey&logo=github&style=flat)](https://github.com/1na-ko/dsh-hdc-bridge/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T02%3A00%3A24.782Z..2026-10-21T02%3A00%3A24.782Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
