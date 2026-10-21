# dock-files

> 为Dock提供文件树、viewer分派、文件变更与上传下载通道。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[d24224b](https://github.com/AKS1st/dock-files/tree/d24224beb8cf024a9c6e79fe97445001d73150b8)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-files) [![npm 30d 1,384](https://img.shields.io/static/v1?label=npm+30d&message=1%2C384&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-files) [![首次发布 2026-08-23](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-files)
<!-- END META -->

**使用建议**：先用隔离工作区核对根目录与删除/传输行为，再接入重要文件。

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

- **用途**：需要从会话工作区浏览文件、在Dock打开并管理文件的用户。

- **建议**：未验证假设：每个探测与变更携带明确会话资源根、缺失即拒绝，可减少跨工作区误判。以不同cwd会话、失效session、绝对/资源URL、重启传输矩阵检查目标一致性和误操作率。

先用隔离工作区核对根目录与删除/传输行为，再接入重要文件。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

参照原生文件栏、系统文件管理器与作者注明复用的dsh-better-sidebar文件辅助代码；增量是统一files服务、viewer注册和Dock打开桥接。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：文件树、传输视图与可扩展文件viewer
- **Host 路由**：/wb-files文件查询、变更和传输
- **后台**：客户端files注册与打开桥接服务

**流程与依赖**

主机/wb-files路由进行工作区解析、文件树、创建/复制/移动/删除及传输；客户端提供ctx.files、图标/viewer注册并把原有openResource资源桥接至workbench.openPath。

宿主webServer/sessions/webRuntime与Dock workbench；fflate用于ZIP，具体编辑/预览由注册viewer扩展承担。

选会话→懒加载树→viewer匹配打开路径；变更走主机文件操作，上传/下载显示内存任务并支持当次暂停取消。

**效果与成本**

多种文件操作与大上传维护面大，服务器磁盘/带宽、ZIP内存和浏览器任务状态均有成本；无模型token调用。

有减少文件入口重复操作的可能，未测可靠性、传输吞吐或恢复收益。

- **思考**：多数请求sessionCwdOf在会话缺失时退到process.cwd，而流式上传严格要求会话；openBridge的probePath请求未带sessionId，可能按另一根目录探测并回退原生打开。任务在内存中，暂停恢复不是进程重启续传；递归删除具有实际副作用。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：将文件资源入口、可扩展viewer和传输反馈组成文件域，使工作台扩展无需重复文件树与路径打开逻辑。服务端真实文件副作用而非模型提示；复制来的辅助方法不计独创。

将文件资源入口、可扩展viewer和传输反馈组成文件域，使工作台扩展无需重复文件树与路径打开逻辑。服务端真实文件副作用而非模型提示；复制来的辅助方法不计独创。

realpath约束、上传大小控制、viewer注册释放与原生打开回退有具体实现；权限分支和资源身份要一致验收。

源码依据：[src/index.ts](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/index.ts)、[src/client/index.ts](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/client/index.ts)、[src/client/openBridge.ts](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/client/openBridge.ts)。

<a id="detail-section-5"></a>

### 主要限制

多数请求sessionCwdOf在会话缺失时退到process.cwd，而流式上传严格要求会话；openBridge的probePath请求未带sessionId，可能按另一根目录探测并回退原生打开。任务在内存中，暂停恢复不是进程重启续传；递归删除具有实际副作用。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AKS1st/dock-files](https://github.com/AKS1st/dock-files)
- **版本号**：0.4.0（[固定提交 d24224be](https://github.com/AKS1st/dock-files/tree/d24224beb8cf024a9c6e79fe97445001d73150b8)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/client/index.ts、src/client/openBridge.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：在隔离树验证会话根、软链接、流式取消清理和递归删除确认；不将内存resume称耐久恢复。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：每个探测与变更携带明确会话资源根、缺失即拒绝，可减少跨工作区误判。以不同cwd会话、失效session、绝对/资源URL、重启传输矩阵检查目标一致性和误操作率。

在隔离树验证会话根、软链接、流式取消清理和递归删除确认；不将内存resume称耐久恢复。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：d35a94cbd0fb4093d36d448628ad907074afcb2efdcd9d86b150d9695d4b473b。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 3600 | 3300 | 314 | — |
| .md | source | 2 | 135 | — | — | 2500 |
| .ts | source | 10 | 3231 | 2499 | 498 | — |
| .tsx | source | 2 | 1476 | 1281 | 121 | — |
| .ts | test | 1 | 143 | 132 | 15 | — |
| .mjs | source | 1 | 48 | 38 | 8 | — |

排除 12 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AKS1st/dock-files/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
