# dsh-mcp-tunnel

> 生成并管理MCP代理与Cloudflare隧道容器栈，输出待确认的客户端配置片段。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[ecd7d8e](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/tree/ecd7d8e555423123960009f9f8ab878246f0132f)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel) · [![npm 30d 778](https://img.shields.io/static/v1?label=npm+30d&message=778&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-mcp-tunnel)
<!-- END META -->

**使用建议**：只在隔离示例端点试。确认HTTP而非stdio上游、实际鉴权和镜像版本，再手动审阅pending配置；生成URL不代表远端授权完成。

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

- **用途**：适合明确要远程访问本机HTTP MCP端点的维护者；公网URL、鉴权及客户端接入须分别验收。

- **建议**：未验证假设：固定镜像摘要并在生成客户端片段前运行未授权拒绝/授权成功探针，可降低有URL就当安全可用。对空token、错token、健康上游及stdio输入验证结果；缺鉴权时不生成可用声明。

只在隔离示例端点试。确认HTTP而非stdio上游、实际鉴权和镜像版本，再手动审阅pending配置；生成URL不代表远端授权完成。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

替代是手写Compose/cloudflared和MCP客户端配置；项目做编排，不替代端点认证、授权或stdio网关。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：MCP隧道创建、状态及停止工具
- **后台**：Compose栈、状态和待确认mcp-client配置

**流程与依赖**

src/index.ts注册隧道工具并spawn Docker/Podman Compose；tunnel-stack.ts生成代理/隧道栈，mcp-client-config.ts只写pending YAML而不自动改Profile。默认Quick Tunnel的URL从日志发现。

宿主tools、可选jobs、Docker或Podman Compose、外部mcp-proxy/cloudflared镜像、网络及HTTP MCP上游；Node>=23.6声明。

确认暴露目标→解析HTTP地址→生成证书/栈/.env→Compose up→轮询URL→保存状态和pending→用户另行接入；stop清理栈和pending。

**效果与成本**

首次需容器运行时、代理镜像、可达HTTP上游与网络；持续容器/证书/token维护，Quick Tunnel域名会变化。现金取决于本机与服务方案，人工需复核公网暴露和停机恢复。

可减少容器接线与配置抄写，无真实远端稳定性和维护成本数据。

- **思考**：虽然文字称本地MCP，resolveFromMcpJson遇stdio会拒绝并要求先转HTTP，不能宣称任意本地server即用。Compose引用latest镜像，代理API_KEY是否真正强制鉴权需固定镜像实测；pending片段包含Bearer且writePendingFragment无显式0600，与.env明确0600不同。provider anthropic模板的命名隧道启动仍是注释，不是可直接运行的第二方案。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：增量是把容器栈、证书、token文件、状态和待确认客户端片段组织为DSH生命周期工具，相对手动Compose降低重复操作。隧道传输来自cloudflared、MCP转发来自外部mcp-proxy；本项目不实现MCP协议，也不自动提供应用级授权。

增量是把容器栈、证书、token文件、状态和待确认客户端片段组织为DSH生命周期工具，相对手动Compose降低重复操作。隧道传输来自cloudflared、MCP转发来自外部mcp-proxy；本项目不实现MCP协议，也不自动提供应用级授权。

固定argv避免shell拼接、pending与Profile分开、状态临时写rename可借鉴；容器执行走Node child_process而非所有操作经宿主subprocess，权限边界需核。latest与秘密片段权限是复用成本。

源码依据：[src/index.ts](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/src/index.ts)、[src/tunnel-stack.ts](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/src/tunnel-stack.ts)、[src/mcp-client-config.ts](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/src/mcp-client-config.ts)、[templates/docker-compose.yml.hbs](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/templates/docker-compose.yml.hbs)。

<a id="detail-section-5"></a>

### 主要限制

虽然文字称本地MCP，resolveFromMcpJson遇stdio会拒绝并要求先转HTTP，不能宣称任意本地server即用。Compose引用latest镜像，代理API_KEY是否真正强制鉴权需固定镜像实测；pending片段包含Bearer且writePendingFragment无显式0600，与.env明确0600不同。provider anthropic模板的命名隧道启动仍是注释，不是可直接运行的第二方案。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[988hj7tczd-oss/dsh-mcp-tunnel](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel)
- **版本号**：0.1.0（[固定提交 ecd7d8e5](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/tree/ecd7d8e555423123960009f9f8ab878246f0132f)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/tunnel-stack.ts、src/mcp-client-config.ts、templates/docker-compose.yml.hbs、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：固定镜像在隔离端点核鉴权拒绝、token权限、重启/stop、取消及非Quick配置；本轮未建容器或公网隧道。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：固定镜像摘要并在生成客户端片段前运行未授权拒绝/授权成功探针，可降低有URL就当安全可用。对空token、错token、健康上游及stdio输入验证结果；缺鉴权时不生成可用声明。

固定镜像在隔离端点核鉴权拒绝、token权限、重启/stop、取消及非Quick配置；本轮未建容器或公网隧道。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：3425f890c4968bef1a6a9e4a58fdaed6c0ec3c45ad63d8dc64934fe8a1db85d7。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 367 | — | — | 4324 |
| .ts | source | 4 | 1421 | 1059 | 238 | — |
| .ts | test | 2 | 434 | 326 | 76 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
