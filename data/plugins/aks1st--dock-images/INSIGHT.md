# dock-images

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[b98f391](https://github.com/AKS1st/dock-images/tree/b98f3910c59af6f30c742b0ddc001315c2c176ee)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-images) [![npm 30d 1,046](https://img.shields.io/static/v1?label=npm+30d&message=1%2C046&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-images) [![最新发布 2026-09-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-images)
<!-- END META -->

> **实现功能**：通过受限文件读取在Dock缩放、旋转和拖动图片。

> **核心亮点**：在统一资源入口提供无需外部应用的图片预览，缩放限制0.1至8倍、加载切换时丢弃旧响应；不是图像处理或模型识别。

> **风险与缺陷**：20MiB文件限制和扩展名MIME映射不限制解码像素与内存，base64还放大传输；路径允许任意绝对文件，不能宣称工作区读隔离。旋转不产生可保存的新图。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：查看聊天相关本地截图或素材，保持在工作台中。

参照浏览器img与系统图片查看器；增量是files viewer与Dock视图接线。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：图片viewer与缩放旋转拖动
- **Host 路由**：/dock-images/read只读图片

**流程与依赖**

主机/read按扩展名和文件大小读取base64，客户端ImageView建立data URL并以CSS transform缩放旋转拖动。

Dock、dock-files与webServer/sessions/webRuntime，浏览器图片解码器；无需模型视觉API。

files选图片→主机读取→img展示→用户变换；操作只改变视图，不修改原图。

**效果与成本**

无token费用；服务端全文件读取、base64和浏览器解码占内存带宽，维护viewer契约。

预览便利性有源码支持，无耗时与内存实测。

> **思考**：20MiB文件限制和扩展名MIME映射不限制解码像素与内存，base64还放大传输；路径允许任意绝对文件，不能宣称工作区读隔离。旋转不产生可保存的新图。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：在统一资源入口提供无需外部应用的图片预览，缩放限制0.1至8倍、加载切换时丢弃旧响应；不是图像处理或模型识别。

在统一资源入口提供无需外部应用的图片预览，缩放限制0.1至8倍、加载切换时丢弃旧响应；不是图像处理或模型识别。

img data URL而非内联SVG HTML，指针捕获与响应取消标志使交互实现明确；压缩字节限制不覆盖解码成本。

源码依据：[src/index.ts](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/index.ts)、[src/client/index.ts](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/index.ts)、[src/client/ImageView.tsx](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/ImageView.tsx)。

<a id="detail-section-5"></a>

### 1.4 主要限制

20MiB文件限制和扩展名MIME映射不限制解码像素与内存，base64还放大传输；路径允许任意绝对文件，不能宣称工作区读隔离。旋转不产生可保存的新图。

<a id="detail-section-6"></a>

### 1.5 使用建议

用于普通小图片预览；大图先核资源占用，别把视图旋转当文件编辑。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AKS1st/dock-images](https://github.com/AKS1st/dock-images)
- **版本号**：0.1.3（[固定提交 b98f3910](https://github.com/AKS1st/dock-images/tree/b98f3910c59af6f30c742b0ddc001315c2c176ee)）
- **版本日期**：2026-09-23（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/client/index.ts、src/client/ImageView.tsx、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：隔离图片集核格式误配、解码失败、内存和视图切换；未打开目标插件。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：读取前核像素与格式、对大图返回缩略图可降低峰值内存。用小压缩高像素、误扩展及普通截图比较内存、首屏延迟和拒绝提示。

隔离图片集核格式误配、解码失败、内存和视图切换；未打开目标插件。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：8e502709905cdc12de2761ddf996bf0ef95905bdf4182648edb0697b4c20ef47。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 494 | 464 | 32 | — |
| .md | source | 2 | 116 | — | — | 901 |
| .ts | source | 3 | 645 | 384 | 204 | — |
| .tsx | source | 1 | 140 | 125 | 0 | — |
| .mjs | source | 1 | 46 | 38 | 6 | — |

排除 4 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AKS1st/dock-images/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
