# chicheng-stats

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[53ee7d9](https://github.com/534119219/chicheng-stats/tree/53ee7d9bc356b16f7f461caeb89b85bd79c9a608)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-stats)
<!-- END META -->

> **实现功能**：在 DSH 汇总请求用量、展示趋势和模型明细，并支持历史会话扫描。

> **核心亮点**：相对只看当前对话用量，增量是共享fold同时接实时事件和日志扫描，以水位降低重复摄取，并提供跨会话模型/提供方明细。token计量沿用宿主事件语义，平台余额来自外部API；本插件贡献在归集、呈现和回填工程。

> **风险与缺陷**：累计量能否在重启与跨进程场景保持可核对？lastUsage仅内存保存，重启后同turn/step的更高seq补报可能无法替换旧计数；watermarks超过5000会剪掉旧会话，重新扫描可能再计。decodeSessionLog在Electron默认返回空数组以避免zstd崩溃，因此README“包括其他进程”不能无条件适用于Desktop。余额差估算也可能受充值和外部请求影响。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 场景与替代办法](#detail-section-2)
  - [1.2 能力、流程与依赖](#detail-section-3)
  - [1.3 效果、成本与限制](#detail-section-4)
  - [1.4 核心贡献与工程亮点](#detail-section-5)
  - [1.5 用途与适用场景](#detail-section-6)
  - [1.6 能力、流程与成本](#detail-section-7)
  - [1.7 工程贡献](#detail-section-8)
  - [1.8 使用建议](#detail-section-9)
  - [1.9 核查说明与分析版本](#detail-section-10)
- [2 未来设计假设（未验证）](#detail-section-11)
- [3 辅助信息](#detail-section-12)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 场景与替代办法

想了解不同会话和模型资源消耗的用户查看用量趋势与请求明细；用于排查资源分布，账单应与平台实际计费分别核对。

参照当前会话token显示、读日志脚本与外部平台账单；不把平台实际计费能力归于本插件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与依赖

lib/index.js createFold按session seq水位消费事件，用turn/step替换近期重复usage并从request/header识别模型/提供方；扫描zstd会话补充事件、持久化聚合与明细，client展示筛选趋势。

- **事件监听**：实时请求usage与模型头信息归集。
- **后台**：条件性历史日志回填与周期扫描。
- **Host 路由**：用量查询与可选平台数据接口。
- **界面**：侧栏统计、趋势与请求筛选。

DSH session/event和会话日志格式、Node zstd、客户端图表；DeepSeek余额/平台明细为可选凭据路径，浏览器token导入不是统计核心必需。

实时事件或历史扫描→顺序水位过滤→usage归集与近期重复替换→写聚合/明细→UI按时间/提供方筛选；平台API另取余额或估算，不与本地计数等同。

web bundle，依赖Node zstd支持；Desktop默认跳过历史解压，可显式开扫描但作者指出native崩溃风险，不能隐去该条件。

<a id="detail-section-4"></a>

### 1.3 效果、成本与限制

能把消费集中到模型/时间维度辅助定位；总量正确性、计费价目及其他进程覆盖仍受事件、扫描与运行时限制。

首次核对Node/宿主、日志规模与统计定义；持续写聚合/明细并周期扫日志，API和浏览器凭据导入还需单独管理。实际CPU/内存、现金和节约额度均未测。

累计量能否在重启与跨进程场景保持可核对？lastUsage仅内存保存，重启后同turn/step的更高seq补报可能无法替换旧计数；watermarks超过5000会剪掉旧会话，重新扫描可能再计。decodeSessionLog在Electron默认返回空数组以避免zstd崩溃，因此README“包括其他进程”不能无条件适用于Desktop。余额差估算也可能受充值和外部请求影响。

<a id="detail-section-5"></a>

### 1.4 核心贡献与工程亮点

相对只看当前对话用量，增量是共享fold同时接实时事件和日志扫描，以水位降低重复摄取，并提供跨会话模型/提供方明细。token计量沿用宿主事件语义，平台余额来自外部API；本插件贡献在归集、呈现和回填工程。

纯fold、可替换用量样本与逐帧zstd处理值得借鉴；watermark剪枝、lastUsage内存状态和聚合/明细分开持久化需要在恢复语义中一起验证。

源码依据：[lib/index.js](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/index.js)、[lib/client.js](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/lib/client.js)、[test-backfill.mjs](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/test-backfill.mjs)、[package.json](https://github.com/534119219/chicheng-stats/blob/53ee7d9bc356b16f7f461caeb89b85bd79c9a608/package.json)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：想了解不同会话和模型资源消耗的用户查看用量趋势与请求明细；用于排查资源分布，账单应与平台实际计费分别核对。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **事件监听**：实时请求usage与模型头信息归集。
- **后台**：条件性历史日志回填与周期扫描。
- **Host 路由**：用量查询与可选平台数据接口。
- **界面**：侧栏统计、趋势与请求筛选。

> **思考**：累计量能否在重启与跨进程场景保持可核对？lastUsage仅内存保存，重启后同turn/step的更高seq补报可能无法替换旧计数；watermarks超过5000会剪掉旧会话，重新扫描可能再计。decodeSessionLog在Electron默认返回空数组以避免zstd崩溃，因此README“包括其他进程”不能无条件适用于Desktop。余额差估算也可能受充值和外部请求影响。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：相对只看当前对话用量，增量是共享fold同时接实时事件和日志扫描，以水位降低重复摄取，并提供跨会话模型/提供方明细。token计量沿用宿主事件语义，平台余额来自外部API；本插件贡献在归集、呈现和回填工程。

<a id="detail-section-9"></a>

### 1.8 使用建议

想查看DSH资源分布的人可先对一个已知会话核对请求数和token；Desktop先确认是否有历史回填，平台余额和本地统计分开看，不用它直接结算费用。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码确认事件归集与回填分支；未跑日志回填或核对平台账单，Electron默认回填被禁用，跨进程覆盖有条件。未来可恢复请求台账是假设。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.10.4；版本日期：2026-08-26（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[53ee7d9b](https://github.com/534119219/chicheng-stats/tree/53ee7d9bc356b16f7f461caeb89b85bd79c9a608)；本次截止 2026-10-21T03:00:27Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读fold、水位/替换、zstd与Electron分支、持久化及平台凭据入口；未扫描真实日志、未读取本机浏览器token或调用平台。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：4636ee551a1f5e5b1a4e24c48dc312faed2aec62ecd64e9506a7b51f9728907b。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 3853 | 3392 | 265 | — |
| .md | source | 1 | 194 | — | — | 1722 |
| .mjs | source | 1 | 60 | 50 | 5 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：用持久请求键保存最后用量版本，将扫描水位与聚合更新做同一可恢复提交，可使重启后补报替换与历史重扫可核对。依据是当前持久水位与内存lastUsage不对称，未实现。对照实时chunk后重启再final、超过5000会话重扫和异常中断，比较总量与独立事件账本；权衡是台账体积与迁移维护成本。

隔离合成日志核对chunk/final替换、重启、乱序、更换模型、跨日和水位剪枝，分别测试Node与Electron；本轮无目标执行或账单校验。

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/534119219/chicheng-stats/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
