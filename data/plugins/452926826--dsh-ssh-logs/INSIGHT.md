# SSH 只读日志工具

> 通过预配置 SSH 别名读取或搜索有界远端日志，作为 MCP 工具接入 DSH。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[4dbc65c](https://github.com/452926826/dsh-ssh-logs/tree/4dbc65c4bb250f72388edfd42b3d3e4d0103699c)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/452926826/dsh-ssh-logs)
<!-- END META -->

**使用建议**：适合已建立只读SSH权限的团队先用测试服务器验证；根目录不能单靠字符串约束当隔离，生产环境以服务端账号权限兜底。

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

- **用途**：运维和开发者在对话中定位已授权服务器日志，交付限定范围的日志片段或字面量搜索结果；不需要让模型获得任意shell能力。

适合已建立只读SSH权限的团队先用测试服务器验证；根目录不能单靠字符串约束当隔离，生产环境以服务端账号权限兜底。

核查状态：源码支持本文所述机制与有限集成贡献；效果、宿主兼容和独立采用未验证。未来设计假设仅为推演，未实现、未验证。 只执行研究工程的统计/装配与结构验证，未安装插件、运行目标代码/测试或做真实宿主验收。

<a id="detail-section-3"></a>

### 能力、流程与成本

参照手工tail/grep与通用SSH MCP；不把词法根限制推导成远端文件系统沙箱。

MCP server暴露list/read/search，经YAML固定server/root别名选择目标；相对路径规范化后拼接允许根，固定head/tail/sed/grep -F命令对动态值shellQuote，SSH严格known_hosts并限制输出和超时。


Node>=20、系统ssh、MCP SDK/YAML/zod；预配SSH key或agent和known_hosts、服务器shell工具及真正只读账号。模型不能动态选任意主机；日志会进入模型上下文，需先授权数据范围。

管理员配置服务器/root别名和凭据路径→模型list映射目标→read或search→本地spawn ssh固定命令→字节/行数/超时检查→返回日志。配置读取在进程启动，修改后需重启；失败由管理员核主机键、权限和路径。

初次建只读账号、known_hosts和配置成本；持续维护服务器别名/密钥、日志敏感数据复核与轮转。无额外专用模型API，但日志进入现有上下文消耗token，未测排障省时。

有界日志读取可减少开放shell权限和人工复制；排障质量仍依赖日志可读性、时间范围和模型判断，不保证自动定位故障。

- **模型工具**：MCP list_log_servers、read_log、search_log三工具，经宿主bridge暴露。

- **思考**：最强质疑是README“每个文件必须留在允许根”只由词法路径检查支持。remote.js没有远端realpath/符号链接解析，root内符号链接若指向外部仍会被head/grep跟随；实际隔离必须依赖只读账号/ACL。grep零匹配exit1也被runSsh当失败，模型需区分无匹配与连接错误。

<a id="detail-section-4"></a>

### 工程贡献

参数经zod范围验证、shellQuote和SSH参数数组降低命令注入面；runSsh限制stdout并截断stderr防资源耗尽。可借鉴意图式接口，但需补符号链接边界和grep退出码语义。

dsh-ssh-logs 0.1.0，通过bundle挂载内置MCP bridge；不执行远端写命令，但本轮未安装/连服务器。

固定源码依据：[src/remote.js L7–25](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/remote.js#L7-L25)；[src/remote.js L49–92](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/remote.js#L49-L92)；[src/server.js L55–79](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/server.js#L55-L79)。上述贡献与关键质疑均限定于这些固定源码，不把测试文件存在当运行通过。

- **亮点**：相对把通用SSH shell交给模型，贡献是缩小为三种只读意图、固定主机根目录和有界输出。借用OpenSSH与MCP，不是新的日志检索算法；命令生成与路径约束的组合降低误操作面。

<a id="detail-section-5"></a>

### 核查说明与分析版本

- 版本依据：仓库：[452926826/dsh-ssh-logs](https://github.com/452926826/dsh-ssh-logs)；固定提交：[4dbc65c4](https://github.com/452926826/dsh-ssh-logs/tree/4dbc65c4bb250f72388edfd42b3d3e4d0103699c)；版本号：0.1.0；版本日期：2026-08-26（固定提交日期，北京时间，非包发布日期）。
- 已检查与未覆盖范围：核查MCP注册/配置/路径/SSH模板，未连接服务器，符号链接越界为静态边界发现而非已执行攻击证明。
- 证据限制：作者功能摘要来自固定版本README；未核实独立用户采用、同条件效果或端到端收益。版本、证据原文与inventory绑定保存在本项JSON；GitHub/npm统计仅作背景，不构成采用证明。

<a id="detail-section-6"></a>

## 未来设计假设（未验证）

待验证假设：在远端受限入口中以文件描述符或解析后的真实路径核根，并返回“零匹配”独立状态，可让工具边界比命令模板更可靠。依据是当前词法检查和统一非零退出处理；新增部署成本为远端包装器及平台适配。

最小验证与否定条件：在自有测试SSH服务构造根内普通文件、../、引号、根内指向外部的符号链接和零匹配；对照手工只读SSH。要求越根无法读、敏感日志外发范围清楚、零匹配不冒充网络故障。若链接越界则收窄为“命令只读/词法根限制”，不能承诺文件系统沙箱。

<a id="detail-section-7"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 167 | — | — | 1066 |
| .js | source | 3 | 326 | 301 | 0 | — |
| .js | test | 4 | 139 | 126 | 1 | — |

排除 0 项；解析错误 0 项。统计为固定Git范围，源码抽读不冒充全面审计；JS/TS与Markdown分别计量。默认排除为启发式，不能从LOC推算原创量或工时。

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/452926826/dsh-ssh-logs/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
