# dsh-wsl-ollama

> 访问本地Ollama，提供模型列表、聊天和嵌入工具。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[90a0f51](https://github.com/173787247/dsh-wsl-ollama/tree/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-ollama)
<!-- END META -->

**使用建议**：显式配置服务地址和模型，分别核对聊天与嵌入结果，不把本地标签当无数据外发保证。

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

已有贡献：将本地推理服务包装为DSH工具；地址探测便利于WSL接线，模型能力和隐私边界仍取决于实际服务。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：Agent按需把任务或文本嵌入交给已有本地模型服务，保留主会话工作流。

- **建议**：本次未形成新创新假设；先将服务地址、模型ID和具体能力分别验证，避免通过一个状态探测推断全部就绪。

采用建议：显式配置服务地址和模型，分别核对聊天与嵌入结果，不把本地标签当无数据外发保证。

宿主Ollama provider或直接API；插件适合局部调用而非自动模型路由。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：ollama_status、ollama_list、ollama_chat和ollama_embed。

**流程与依赖**

依赖Ollama服务、已下载模型、WSL网络及本地算力；某模型不一定支持嵌入。

明确地址后列模型，分别做小聊天与嵌入任务，再决定是否长期使用。

**效果与成本**

本地计算、模型驻留和主Agent编排token，未测质量与吞吐。

将本地推理服务包装为DSH工具；地址探测便利于WSL接线，模型能力和隐私边界仍取决于实际服务。 自动地址推断可能受WSL网络模式与resolv.conf影响，不能把自动选中地址当正确服务；模型列表不证明聊天和嵌入均可用。

- **思考**：自动地址推断可能受WSL网络模式与resolv.conf影响，不能把自动选中地址当正确服务；模型列表不证明聊天和嵌入均可用。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：将本地推理服务包装为DSH工具；地址探测便利于WSL接线，模型能力和隐私边界仍取决于实际服务。

将本地推理服务包装为DSH工具；地址探测便利于WSL接线，模型能力和隐私边界仍取决于实际服务。

客户端和工具注册分离可复用，自动地址选择需要回显和覆盖入口。

<a id="detail-section-5"></a>

### 主要限制

自动地址推断可能受WSL网络模式与resolv.conf影响，不能把自动选中地址当正确服务；模型列表不证明聊天和嵌入均可用。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读注册与客户端；未访问Ollama或进行推理。 固定checkout的注册候选与关键主张定向抽读；未逐行完整审阅全部源码、测试、依赖及外部参照，未运行目标代码。评分仅针对文中明确的CLI/API/人工流程参照；跨场景迁移为解释性判断。
- 下一步：测试错误地址、仅聊天模型和实际嵌入模型，比较返回维度、截断及超时；与Ollama原生API核对。

**分析版本**

- **仓库**：[173787247/dsh-wsl-ollama](https://github.com/173787247/dsh-wsl-ollama)
- **版本号**：0.2.0（[固定提交 90a0f51](https://github.com/173787247/dsh-wsl-ollama/tree/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

本次未形成新创新假设；先将服务地址、模型ID和具体能力分别验证，避免通过一个状态探测推断全部就绪。

测试错误地址、仅聊天模型和实际嵌入模型，比较返回维度、截断及超时；与Ollama原生API核对。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 120 | — | — | 594 |
| .js | source | 2 | 275 | 255 | 8 | — |
| .js | test | 1 | 61 | 57 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-ollama/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
