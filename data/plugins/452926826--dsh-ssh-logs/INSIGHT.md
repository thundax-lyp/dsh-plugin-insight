# dsh-ssh-logs

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[4dbc65c](https://github.com/452926826/dsh-ssh-logs/tree/4dbc65c4bb250f72388edfd42b3d3e4d0103699c)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/452926826/dsh-ssh-logs)
<!-- END META -->

> **实现功能**：通过DSH内置MCP桥提供服务器列表、限量日志读取和固定字符串搜索，使用预设SSH主机与日志根别名返回来源片段。

> **核心亮点**：将固定主机/根别名、quote保护的读命令和有界输出接到MCP/DSH，减少人手复制日志，并不提供任意shell或新SSH协议。详见[Q02](#research-q02)。

> **风险与缺陷**：root只词法normalize，符号链接目标未核；child env不继承SSH_AUTH_SOCK，空grep退出1被当SSH失败。取消/远端后代停止未确认，未实际连接复现。详见[Q03](#research-q03)、[Q05](#research-q05)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 哪些运维问题适合，合格日志结果是什么？](#detail-section-11)
  - [Q02 · alias到固定命令和MCP怎样连接？](#detail-section-12)
  - [Q03 · 路径与只读、认证和空结果有什么限制？](#detail-section-13)
  - [Q04 · 依赖和使用流程是什么？](#detail-section-14)
  - [Q05 · 超时、输出和配置生命周期有什么工程取舍？](#detail-section-15)
  - [Q06 · 成本、采用和未来假设怎么判断？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要在DSH会话里读取预先授权服务器日志的开发/运维人员。主机和日志根由人配置alias，模型只能列服务器、读文件头尾/范围或grep固定字符串，适合围绕request ID、时间附近异常取有限片段。它不是远程终端、日志采集平台或任意主机管理器。

合格结果要标清服务器/路径、完整的请求范围和是否因资源限制失败，区分没有命中、SSH失败与文件权限错误。日志片段可辅助定位，但不证明根因，也没有时间戳标准化、跨文件关联或业务告警。动态日志和轮转会让两次读取不在同一快照。

基线是人手SSH加tail/grep再复制给模型。插件减少重复登录和拼命令，固定读面比开放shell简单；不过输出仍作为模型工具内容外发，日志可能带个人数据/凭据，不能从不写远端推断没有信息泄露风险。适合专用只读账户、已清理敏感日志的小范围使用。

人工SSH tail/grep后复制给模型；增量是固定范围的结构化调用，日志权限/保密和根因分析仍需人核查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 服务器列表 | 获取alias/root映射 | 整实例配置共享，无每会话授权集 |
| 限量读 | head/tail/range，最多5000行 | 词法root，物理链接需另核 |
| 字符串搜索 | grep -F、行号/上下文 | 空命中exit1当前当错 |
| SSH安全选项 | strict hostkey/BatchMode/known_hosts | child不继承通常agent socket |
| 输出预算 | 默认128KiB、最大4MiB和timeout | 超限报错不返片段，取消链未知 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=20、MCP SDK/yaml/zod | 包声明必需 | stdio server与配置验证 | 不能仅复制单server文件运行 |
| DSH内置MCP client与patch动态API | DSH集成必需 | 启动/工具发现 | MCP单独可用不代表任意DSH代际兼容 |
| 本机ssh可执行程序 | 远程读取必需 | argv调用 | PATH找不到返回启动错误 |
| known_hosts与专用只读身份 | 实际访问必需 | 严格主机key检查/认证 | 无交互密码，不能自动接受未知host |
| 远端POSIX head/tail/sed/grep | 命令需要 | 三种阅读/搜索 | 非兼容系统工具行为需核 |
| DSH_SSH_LOGS_CONFIG | server配置必需 | bridge默认设置ssh-logs.yml | 缺/坏配置调用isError，修改后需重启 |
| 日志数据披露许可 | 业务使用条件 | 内容进入模型 | 只读不等于秘密不外发 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 配专用账户、known_hosts和可丢弃无敏感日志 | 不自动信任未知主机key |
| 安装 | 固定包并挂Web bundle，重启 | MCP三工具可发现，配置加载成功 |
| 列表 | 先列alias/root，不从物理路径猜参数 | 核服务器和允许根对应 |
| 阅读 | 小范围tail/range，再固定字符串搜索 | 结果有来源，错误与空结果分别核对 |
| 恢复 | 缩小输出/检查SSH状态，再读 | 不把timeout当远端已完全停止 |
| 维护 | 配置变更重启MCP，保留账户/权限管理 | 插件卸载不自动更改远端ACL/key |

本轮只读源码，不SSH连接、不运行MCP/测试或普通宿主冒烟。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | MCP/ssh、账户/key与配置 | 允许根、known_hosts和权限核查 | 无本轮部署耗时 |
| 持续使用 | 每请求SSH进程/握手/网络、模型日志上下文 | 选行数/范围、排除敏感信息 | 默认128KiB不等于固定token费用 |
| 失败恢复 | 重连/重复读取与诊断 | 区分空grep、权限、网络和文件轮转 | 无远端版本/取消确认收据 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 读取接线 | 固定alias/root/命令、来源前缀 | 真实远端兼容/agent认证 |
| 风险收窄 | 严格hostkey、quote与字节预算 | 物理root/ACL隔离和后代清理 |
| 搜索 | literal grep含行号/上下文 | 空命中正确表示，代码把exit1当错 |
| 运维收益 | 减少复制日志步骤 | 根因准确、排障时间或错误率改善 |

> **思考**：root只词法normalize，符号链接目标未核；child env不继承SSH_AUTH_SOCK，空grep退出1被当SSH失败。取消/远端后代停止未确认，未实际连接复现。详见[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将固定主机/根别名、quote保护的读命令和有界输出接到MCP/DSH，减少人手复制日志，并不提供任意shell或新SSH协议。详见[Q02](#research-q02)。

将固定主机/根别名、quote保护的读命令和有界输出接到MCP/DSH，减少人手复制日志，并不提供任意shell或新SSH协议。详见[Q02](#research-q02)。

固定三文件拆开配置、命令/SSH和MCP接线，zod入参/正整数配置、每server最大4MiB、stderr16KiB收集，使远端日志读取的局部资源成本可解释。shellQuote和--保护动态路径/模式，不通过本地shell拼接，减少命令解释风险。测试smoke用临时假ssh回固定输出，是作者的适配模拟，不是本轮真实SSH验证。

每次请求新建SSH进程，没有连接复用或并发上限；请求数多时资源/认证开销线性增加。commandTimeout默认120秒与bridge工具timeout同值，外层先超时是否取消in-flight ssh取决于MCP/宿主，本server工具handler没接request AbortSignal。超时只kill本地ssh并马上reject，不确认远端命令/ProxyJump子进程已停止；通常固定读命令副作用小，但不能给后代清理保证。

配置只在顶层load一次，错误也缓存；改配置不自动修复，必须重启。stdout超限不返回部分内容和truncated标志，而以错误结束，读者需人工换小范围。远端轮转/截断没有inode/mtime/版本收据，range只是行号视图；重试可能读到另一文件版本。可复用的是窄接口和预算，进一步可靠性应改善空结果/取消及物理路径收据。

<a id="detail-section-5"></a>

### 1.4 主要限制

root只词法normalize，符号链接目标未核；child env不继承SSH_AUTH_SOCK，空grep退出1被当SSH失败。取消/远端后代停止未确认，未实际连接复现。详见[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有试用。先专用只读身份、非敏感日志和显式key，核真实root及命中/空/拒绝状态，再评MCP取消；不把固定命令当远端物理围栏。详见[Q06](#research-q06)。

合格结果要标清服务器/路径、完整的请求范围和是否因资源限制失败，区分没有命中、SSH失败与文件权限错误。日志片段可辅助定位，但不证明根因，也没有时间戳标准化、跨文件关联或业务告警。动态日志和轮转会让两次读取不在同一快照。

基线是人手SSH加tail/grep再复制给模型。插件减少重复登录和拼命令，固定读面比开放shell简单；不过输出仍作为模型工具内容外发，日志可能带个人数据/凭据，不能从不写远端推断没有信息泄露风险。适合专用只读账户、已清理敏感日志的小范围使用。

采用建议：有试用。先专用只读身份、非敏感日志和显式key，核真实root及命中/空/拒绝状态，再评MCP取消；不把固定命令当远端物理围栏。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持窄固定命令、严格hostkey与输出预算；物理路径、agent环境、空grep和取消边界需核，不提供根因或远端隔离保证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/config.js、src/server.js、src/remote.js、test/mcp-smoke.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定全部三个src、bundle、包声明与假ssh测试结构；不SSH连接、运行MCP/测试，未核实际远端ACL/工具或宿主取消链。
- 下一步：进一步探讨可用非敏感测试主机的链接/轮转/空命中/超限/取消序列，对比物理目标、MCP状态、残留进程及人工SSH耗时。

**分析版本**

- **仓库**：[452926826/dsh-ssh-logs](https://github.com/452926826/dsh-ssh-logs)
- **版本号**：0.1.0（[固定提交 4dbc65c](https://github.com/452926826/dsh-ssh-logs/tree/4dbc65c4bb250f72388edfd42b3d3e4d0103699c)）
- **版本日期**：2026-08-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索远端规范路径/文件身份和empty/truncated/cancel状态收据，最小传递agent socket，比较目标/状态正确、清理与延迟；未实现。详见[Q06](#research-q06)。

进一步探讨可用非敏感测试主机的链接/轮转/空命中/超限/取消序列，对比物理目标、MCP状态、残留进程及人工SSH耗时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 167 | — | — | 1066 |
| .js | source | 3 | 326 | 301 | 0 | — |
| .js | test | 4 | 139 | 126 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/452926826/dsh-ssh-logs/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/452926826/dsh-ssh-logs/issues?q=is%3Aissue+created%3A2026-09-22T05%3A59%3A32.154Z..2026-10-22T05%3A59%3A32.154Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/452926826/dsh-ssh-logs/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A59%3A32.154Z..2026-10-22T05%3A59%3A32.154Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本固定SSH日志读取面与MCP接线价值，核查词法root、认证环境、空结果与取消边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些运维问题适合，合格日志结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向需要在DSH会话里读取预先授权服务器日志的开发/运维人员。主机和日志根由人配置alias，模型只能列服务器、读文件头尾/范围或grep固定字符串，适合围绕request ID、时间附近异常取有限片段。它不是远程终端、日志采集平台或任意主机管理器。

合格结果要标清服务器/路径、完整的请求范围和是否因资源限制失败，区分没有命中、SSH失败与文件权限错误。日志片段可辅助定位，但不证明根因，也没有时间戳标准化、跨文件关联或业务告警。动态日志和轮转会让两次读取不在同一快照。

基线是人手SSH加tail/grep再复制给模型。插件减少重复登录和拼命令，固定读面比开放shell简单；不过输出仍作为模型工具内容外发，日志可能带个人数据/凭据，不能从不写远端推断没有信息泄露风险。适合专用只读账户、已清理敏感日志的小范围使用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-11](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/README.md#L5-L11)

三工具与固定alias/root作者定位。

```text
A read-only SSH log tool for DeepSeek Harness. It uses the built-in `@deepseek-ai/dsh-mcp-client` bridge to expose three MCP tools to the model:

- `mcp__ssh_logs__list_log_servers`
- `mcp__ssh_logs__read_log`
- `mcp__ssh_logs__search_log`

Servers are configured under fixed aliases. The model cannot select arbitrary hosts, execute arbitrary commands, or modify remote files. Every requested file must remain under an allowlisted log root.
```

**依据 2 · 源码核查**：[src/server.js:50-100](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/server.js#L50-L100)

请求参数与服务器/路径结果前缀。

<details>
<summary>查看原文（51行）</summary>

```text
  },
);

mcp.tool(
  'read_log',
  'Read a bounded section of a log file from an allowlisted SSH server and log root. Use tail by default for recent entries.',
  {
    server: z.string().describe('Configured server alias, for example production'),
    root: z.string().describe('Configured log root alias, for example app'),
    path: z.string().describe('Relative path below the log root, for example service/api.log'),
    mode: z.enum(['tail', 'head', 'range']).default('tail'),
    lines: z.number().int().min(1).max(5000).default(200),
    startLine: z.number().int().min(1).optional().describe('First line for range mode'),
  },
  async (args) => {
    try {
      const server = requireConfig().servers[args.server];
      if (!server) throw new Error(`unknown server ${JSON.stringify(args.server)}`);
      const remotePath = resolveRemotePath(server, args.root, args.path);
      const output = await runSsh(server, readCommand(remotePath, args));
      return textResult(`[${server.name}:${remotePath}]\n${output}`);
    } catch (error) {
      return errorResult(error);
    }
  },
);

mcp.tool(
  'search_log',
  'Search literal text in a remote log file from an allowlisted SSH server and log root. The pattern is not interpreted as a regular expression or shell code.',
  {
    server: z.string().describe('Configured server alias'),
    root: z.string().describe('Configured log root alias'),
    path: z.string().describe('Relative path below the log root'),
    pattern: z.string().min(1).max(500).describe('Literal text to find'),
    ignoreCase: z.boolean().default(true),
    context: z.number().int().min(0).max(20).default(0),
    maxMatches: z.number().int().min(1).max(1000).default(200),
  },
  async (args) => {
    try {
      const server = requireConfig().servers[args.server];
      if (!server) throw new Error(`unknown server ${JSON.stringify(args.server)}`);
      const remotePath = resolveRemotePath(server, args.root, args.path);
      const output = await runSsh(server, searchCommand(remotePath, args.pattern, args));
      return textResult(`[${server.name}:${remotePath}] matches for ${JSON.stringify(args.pattern)}\n${output}`);
    } catch (error) {
      return errorResult(error);
    }
  },
);
```

</details>

**依据 3 · 源码核查**：[src/remote.js:92-112](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/remote.js#L92-L112)

仅固定head/tail/sed/grep命令。

<details>
<summary>查看原文（21行）</summary>

```text
export function readCommand(remotePath, options) {
  const lines = Math.min(options.lines ?? 200, MAX_LINES);
  const quoted = shellQuote(remotePath);
  if (options.mode === 'head') return `head -n ${lines} -- ${quoted}`;
  if (options.mode === 'range') {
    const startLine = options.startLine ?? 1;
    const endLine = Math.min(startLine + lines - 1, startLine + MAX_LINES - 1);
    return `sed -n '${startLine},${endLine}p' -- ${quoted}`;
  }
  return `tail -n ${lines} -- ${quoted}`;
}

export function searchCommand(remotePath, pattern, options = {}) {
  if (typeof pattern !== 'string' || pattern.length === 0 || pattern.length > 500) {
    throw new Error('pattern must contain 1 to 500 characters');
  }
  const maxMatches = Math.min(options.maxMatches ?? 200, MAX_MATCHES);
  const context = Math.min(options.context ?? 0, 20);
  const flags = options.ignoreCase === false ? '-nF' : '-niF';
  return `grep ${flags} -C ${context} -m ${maxMatches} -- ${shellQuote(pattern)} ${shellQuote(remotePath)}`;
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · alias到固定命令和MCP怎样连接？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

bundle挂内置dsh-mcp-client，stdio启动Node src/server.js，把配置路径默认指向dshHome ssh-logs.yml，设置工具调用120秒。server启动一次读YAML，规范化server/root alias、绝对非根日志目录、port和maxBytes，再注册三个MCP工具；缺配置时仍启动但调用返回isError。

read/search参数由zod限制行数/命中/上下文，resolveRemotePath拒绝绝对路径、反斜杠、NUL和词法逃出，再join到配置root。动态路径/关键词shellQuote，grep用-F和--，避免作为正则或命令参数解释。OpenSSH argv用BatchMode、StrictHostKeyChecking和显式known_hosts，identityFile或ProxyJump按配置传入。

runSsh收stdout，超字节/timeout杀SSH并抛错误，成功返回有来源前缀的纯文本。贡献在固定远端读面、参数/输出预算与MCP/DSH接线，不是新SSH协议或远程权限隔离。真实访问权限由SSH账户、密钥策略和远端文件系统决定。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-25](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/cordis.patch.yml#L1-L25)

内置MCP bridge、stdio、config与timeout。

<details>
<summary>查看原文（25行）</summary>

```text
- insert:
    - id: mcp-ssh-logs
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: ssh_logs
        transport: stdio
        command: node
        args:
          - !!js >-
            process.getBuiltinModule('node:path').join(
              process.getBuiltinModule('node:path').dirname(
                process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('dsh-ssh-logs/package.json')
              ),
              'src/server.js'
            )
        cwd: !!js >-
          process.getBuiltinModule('node:path').dirname(
            process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('dsh-ssh-logs/package.json')
          )
        env:
          DSH_SSH_LOGS_CONFIG: !!js >-
            process.env.DSH_SSH_LOGS_CONFIG ||
            dshHomePath('ssh-logs.yml')
        toolCallTimeoutMs: 120000
        failOnStartupError: true
```

</details>

**依据 2 · 源码核查**：[src/config.js:39-58](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/config.js#L39-L58)

alias/root规范化。

<details>
<summary>查看原文（20行）</summary>

```text
function normalizeRoots(value, serverName) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`servers.${serverName}.roots must be a non-empty mapping`);
  }
  const roots = {};
  for (const [rootName, rootPath] of Object.entries(value)) {
    if (!NAME_RE.test(rootName)) {
      throw new Error(`servers.${serverName}.roots has invalid alias ${JSON.stringify(rootName)}`);
    }
    const normalized = path.posix.normalize(requiredString(rootPath, `servers.${serverName}.roots.${rootName}`));
    if (!normalized.startsWith('/') || normalized === '/') {
      throw new Error(`servers.${serverName}.roots.${rootName} must be an absolute non-root path`);
    }
    roots[rootName] = normalized.replace(/\/$/, '');
  }
  if (Object.keys(roots).length === 0) {
    throw new Error(`servers.${serverName}.roots must not be empty`);
  }
  return roots;
}
```

</details>

**依据 3 · 源码核查**：[src/server.js:17-34](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/server.js#L17-L34)

启动读一次与缺配置调用错误。

<details>
<summary>查看原文（18行）</summary>

```text
let config;
let configError;
try {
  config = await loadConfig();
} catch (error) {
  config = { servers: {} };
  configError = error instanceof Error ? error.message : String(error);
}

function requireConfig() {
  if (configError) {
    throw new Error(`SSH log configuration is unavailable: ${configError}. Create the file specified by DSH_SSH_LOGS_CONFIG and restart DSH.`);
  }
  return config;
}

const mcp = new McpServer({ name: 'dsh-ssh-logs', version: '0.1.0' });

```

</details>

**依据 4 · 源码核查**：[src/remote.js:7-41](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/remote.js#L7-L41)

词法路径、shellQuote与SSH选项。

<details>
<summary>查看原文（35行）</summary>

```text
export function resolveRemotePath(server, rootName, relativePath) {
  const root = server.roots[rootName];
  if (!root) throw new Error(`unknown root ${JSON.stringify(rootName)} for server ${server.name}`);
  if (typeof relativePath !== 'string' || relativePath.trim() === '') {
    throw new Error('path must be a non-empty relative path');
  }
  if (relativePath.includes('\0') || relativePath.startsWith('/') || relativePath.includes('\\')) {
    throw new Error('path must be relative and use forward slashes');
  }
  const normalized = path.posix.normalize(relativePath);
  if (normalized === '..' || normalized.startsWith('../')) {
    throw new Error('path must stay inside the configured log root');
  }
  return path.posix.join(root, normalized);
}

export function shellQuote(value) {
  return `'${String(value).replaceAll("'", `'\\''`)}'`;
}

export function buildSshArgs(server, remoteCommand) {
  const args = [
    '-T',
    '-o', 'BatchMode=yes',
    '-o', 'StrictHostKeyChecking=yes',
    '-o', `UserKnownHostsFile=${server.knownHostsFile}`,
    '-o', `ConnectTimeout=${server.connectTimeoutSeconds}`,
    '-o', 'LogLevel=ERROR',
    '-p', String(server.port),
  ];
  if (server.identityFile) args.push('-i', server.identityFile, '-o', 'IdentitiesOnly=yes');
  if (server.proxyJump) args.push('-J', server.proxyJump);
  const destination = server.user ? `${server.user}@${server.host}` : server.host;
  args.push('--', destination, remoteCommand);
  return args;
```

</details>

**依据 5 · 源码核查**：[src/remote.js:45-88](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/remote.js#L45-L88)

输出/超时/结束链。

<details>
<summary>查看原文（44行）</summary>

```text
  return await new Promise((resolve, reject) => {
    const child = spawn('ssh', buildSshArgs(server, remoteCommand), {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { PATH: process.env.PATH ?? '/usr/bin:/bin', LANG: 'C.UTF-8', LC_ALL: 'C.UTF-8' },
    });
    const stdout = [];
    const stderr = [];
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let settled = false;
    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      error ? reject(error) : resolve(value);
    };
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      finish(new Error(`SSH command timed out after ${server.commandTimeoutMs}ms`));
    }, server.commandTimeoutMs);
    child.stdout.on('data', (chunk) => {
      stdoutBytes += chunk.length;
      if (stdoutBytes > maxBytes) {
        child.kill('SIGKILL');
        finish(new Error(`SSH output exceeded ${maxBytes} bytes; request fewer lines or matches`));
        return;
      }
      stdout.push(chunk);
    });
    child.stderr.on('data', (chunk) => {
      stderrBytes += chunk.length;
      if (stderrBytes <= 16 * 1024) stderr.push(chunk);
    });
    child.on('error', (error) => finish(new Error(`failed to start ssh: ${error.message}`)));
    child.on('close', (code, signal) => {
      if (settled) return;
      const output = Buffer.concat(stdout).toString('utf8');
      const errorOutput = Buffer.concat(stderr).toString('utf8').trim();
      if (code !== 0) {
        finish(new Error(`SSH failed (${signal ?? `exit ${code}`}): ${errorOutput || 'no error output'}`));
        return;
      }
      finish(undefined, output);
    });
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 路径与只读、认证和空结果有什么限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

“始终在allowlisted root下”只作词法检查，没有远端realpath核对。日志根或根内文件若为符号链接，head/tail/grep/sed会跟随其目标，源码不能保证物理读取仍在允许目录。远端只读账户是必要独立边界，固定命令不提供chroot或强制命令账户配置，也不能检查远端ssh_config/authorized_keys的所有行为。

runSsh自定义env仅PATH/LANG/LC_ALL，没有SSH_AUTH_SOCK。依赖POSIX环境socket的ssh-agent认证不会通过通常环境继承到child；显式identity文件或SSH配置IdentityAgent等可能另有路径，不能泛称所有agent方式不可用。README说支持ssh-agent需结合实际环境核查。

grep无命中通常退出1，但runSsh对所有非0都当SSH failed；工具会把正常空搜索显示isError，和网络/权限失败混淆。字节超限同样丢已收片段，仅要求缩小查询，不能作为“日志没有该错误”的证据。输出不脱敏、无每会话服务器授权集合，同一MCP实例可访问全部配置alias；多用户宿主或敏感日志需额外策略。

#### 证据与依据

**依据 1 · 源码核查**：[src/remote.js:7-20](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/remote.js#L7-L20)

仅normalize/join，未作远端物理路径核对。

<details>
<summary>查看原文（14行）</summary>

```text
export function resolveRemotePath(server, rootName, relativePath) {
  const root = server.roots[rootName];
  if (!root) throw new Error(`unknown root ${JSON.stringify(rootName)} for server ${server.name}`);
  if (typeof relativePath !== 'string' || relativePath.trim() === '') {
    throw new Error('path must be a non-empty relative path');
  }
  if (relativePath.includes('\0') || relativePath.startsWith('/') || relativePath.includes('\\')) {
    throw new Error('path must be relative and use forward slashes');
  }
  const normalized = path.posix.normalize(relativePath);
  if (normalized === '..' || normalized.startsWith('../')) {
    throw new Error('path must stay inside the configured log root');
  }
  return path.posix.join(root, normalized);
```

</details>

**依据 2 · 源码核查**：[src/remote.js:45-49](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/remote.js#L45-L49)

ssh-agent环境socket不在child env。

```text
  return await new Promise((resolve, reject) => {
    const child = spawn('ssh', buildSshArgs(server, remoteCommand), {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { PATH: process.env.PATH ?? '/usr/bin:/bin', LANG: 'C.UTF-8', LC_ALL: 'C.UTF-8' },
    });
```

**依据 3 · 源码核查**：[src/remote.js:79-87](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/remote.js#L79-L87)

所有非零都判失败。

```text
    child.on('close', (code, signal) => {
      if (settled) return;
      const output = Buffer.concat(stdout).toString('utf8');
      const errorOutput = Buffer.concat(stderr).toString('utf8').trim();
      if (code !== 0) {
        finish(new Error(`SSH failed (${signal ?? `exit ${code}`}): ${errorOutput || 'no error output'}`));
        return;
      }
      finish(undefined, output);
```

**依据 4 · 源码核查**：[src/remote.js:105-112](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/remote.js#L105-L112)

grep -F命令未区分退出1。

```text
  if (typeof pattern !== 'string' || pattern.length === 0 || pattern.length > 500) {
    throw new Error('pattern must contain 1 to 500 characters');
  }
  const maxMatches = Math.min(options.maxMatches ?? 200, MAX_MATCHES);
  const context = Math.min(options.context ?? 0, 20);
  const flags = options.ignoreCase === false ? '-nF' : '-niF';
  return `grep ${flags} -C ${context} -m ${maxMatches} -- ${shellQuote(pattern)} ${shellQuote(remotePath)}`;
}
```

**依据 5 · 源码核查**：[src/server.js:38-44](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/server.js#L38-L44)

服务器列表全局配置roots输出。

```text
  {},
  async () => {
    try {
      const activeConfig = requireConfig();
      return textResult(JSON.stringify(Object.values(activeConfig.servers).map((server) => ({
        server: server.name,
        description: server.description,
```

**依据 6 · 作者声明**：[README.md:28-30](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/README.md#L28-L30)

作者建议SSH key/agent与只读账户。

```text
Create `~/.dsh/ssh-logs.yml` using `config.example.yml` as a reference. Use a dedicated read-only account on each server and authenticate with an SSH key or ssh-agent. Do not store passwords or private key contents in the YAML file.

Restart `dsh web` and refresh the page after configuring the plugin. The Bundle registers an MCP client so agent presets can discover the log tools.
```

#### 缺口

- 远端符号链接/ACL和不同平台agent配置未实际连接验证。
  **影响**：不能给物理root隔离或所有认证方式验收。
  **进一步探讨**：可用无敏感测试主机核root内外链接、专用只读账户与显式key/agent两条认证路径。
- grep空命中与SSH失败的真实返回未运行对照。
  **影响**：当前代码控制流混淆空结果，不推断已影响所有调用。
  **进一步探讨**：用无命中、命中和权限拒绝三种受控日志比较MCP状态与退出码。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖和使用流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=20、MCP SDK/yaml/zod | 包声明必需 | stdio server与配置验证 | 不能仅复制单server文件运行 |
| DSH内置MCP client与patch动态API | DSH集成必需 | 启动/工具发现 | MCP单独可用不代表任意DSH代际兼容 |
| 本机ssh可执行程序 | 远程读取必需 | argv调用 | PATH找不到返回启动错误 |
| known_hosts与专用只读身份 | 实际访问必需 | 严格主机key检查/认证 | 无交互密码，不能自动接受未知host |
| 远端POSIX head/tail/sed/grep | 命令需要 | 三种阅读/搜索 | 非兼容系统工具行为需核 |
| DSH_SSH_LOGS_CONFIG | server配置必需 | bridge默认设置ssh-logs.yml | 缺/坏配置调用isError，修改后需重启 |
| 日志数据披露许可 | 业务使用条件 | 内容进入模型 | 只读不等于秘密不外发 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 配专用账户、known_hosts和可丢弃无敏感日志 | 不自动信任未知主机key |
| 安装 | 固定包并挂Web bundle，重启 | MCP三工具可发现，配置加载成功 |
| 列表 | 先列alias/root，不从物理路径猜参数 | 核服务器和允许根对应 |
| 阅读 | 小范围tail/range，再固定字符串搜索 | 结果有来源，错误与空结果分别核对 |
| 恢复 | 缩小输出/检查SSH状态，再读 | 不把timeout当远端已完全停止 |
| 维护 | 配置变更重启MCP，保留账户/权限管理 | 插件卸载不自动更改远端ACL/key |

本轮只读源码，不SSH连接、不运行MCP/测试或普通宿主冒烟。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:35-46](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/package.json#L35-L46)

Node与运行依赖/作者测试命令。

<details>
<summary>查看原文（12行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.0",
    "yaml": "^2.8.1",
    "zod": "^3.24.0"
  },
  "scripts": {
    "test": "node --test test/*.test.js && node test/mcp-smoke.js",
    "check": "node --check src/server.js && npm test",
    "prepack": "npm run check"
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-25](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/cordis.patch.yml#L1-L25)

DSH/MCP/Node启动条件。

<details>
<summary>查看原文（25行）</summary>

```text
- insert:
    - id: mcp-ssh-logs
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: ssh_logs
        transport: stdio
        command: node
        args:
          - !!js >-
            process.getBuiltinModule('node:path').join(
              process.getBuiltinModule('node:path').dirname(
                process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('dsh-ssh-logs/package.json')
              ),
              'src/server.js'
            )
        cwd: !!js >-
          process.getBuiltinModule('node:path').dirname(
            process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('dsh-ssh-logs/package.json')
          )
        env:
          DSH_SSH_LOGS_CONFIG: !!js >-
            process.env.DSH_SSH_LOGS_CONFIG ||
            dshHomePath('ssh-logs.yml')
        toolCallTimeoutMs: 120000
        failOnStartupError: true
```

</details>

**依据 3 · 源码核查**：[src/config.js:107-112](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/config.js#L107-L112)

配置由env决定，启动读取。

```text
export async function loadConfig(configPath = process.env.DSH_SSH_LOGS_CONFIG) {
  if (!configPath) throw new Error('DSH_SSH_LOGS_CONFIG is not set');
  const resolved = path.resolve(expandHome(configPath));
  const text = await readFile(resolved, 'utf8');
  return { path: resolved, ...normalizeConfig(YAML.parse(text)) };
}
```

**依据 4 · 源码核查**：[src/remote.js:27-41](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/remote.js#L27-L41)

strict known-host和认证选项。

<details>
<summary>查看原文（15行）</summary>

```text
export function buildSshArgs(server, remoteCommand) {
  const args = [
    '-T',
    '-o', 'BatchMode=yes',
    '-o', 'StrictHostKeyChecking=yes',
    '-o', `UserKnownHostsFile=${server.knownHostsFile}`,
    '-o', `ConnectTimeout=${server.connectTimeoutSeconds}`,
    '-o', 'LogLevel=ERROR',
    '-p', String(server.port),
  ];
  if (server.identityFile) args.push('-i', server.identityFile, '-o', 'IdentitiesOnly=yes');
  if (server.proxyJump) args.push('-J', server.proxyJump);
  const destination = server.user ? `${server.user}@${server.host}` : server.host;
  args.push('--', destination, remoteCommand);
  return args;
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 超时、输出和配置生命周期有什么工程取舍？

**研究主题**：工程质量与复用

#### 完整回答

固定三文件拆开配置、命令/SSH和MCP接线，zod入参/正整数配置、每server最大4MiB、stderr16KiB收集，使远端日志读取的局部资源成本可解释。shellQuote和--保护动态路径/模式，不通过本地shell拼接，减少命令解释风险。测试smoke用临时假ssh回固定输出，是作者的适配模拟，不是本轮真实SSH验证。

每次请求新建SSH进程，没有连接复用或并发上限；请求数多时资源/认证开销线性增加。commandTimeout默认120秒与bridge工具timeout同值，外层先超时是否取消in-flight ssh取决于MCP/宿主，本server工具handler没接request AbortSignal。超时只kill本地ssh并马上reject，不确认远端命令/ProxyJump子进程已停止；通常固定读命令副作用小，但不能给后代清理保证。

配置只在顶层load一次，错误也缓存；改配置不自动修复，必须重启。stdout超限不返回部分内容和truncated标志，而以错误结束，读者需人工换小范围。远端轮转/截断没有inode/mtime/版本收据，range只是行号视图；重试可能读到另一文件版本。可复用的是窄接口和预算，进一步可靠性应改善空结果/取消及物理路径收据。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.js:96-104](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/config.js#L96-L104)

per-server硬字节/port上限。

```text
      maxBytes: positiveInteger(value.maxBytes, defaults.maxBytes, `servers.${name}.maxBytes`),
      connectTimeoutSeconds: positiveInteger(value.connectTimeoutSeconds, defaults.connectTimeoutSeconds, `servers.${name}.connectTimeoutSeconds`),
      commandTimeoutMs: positiveInteger(value.commandTimeoutMs, defaults.commandTimeoutMs, `servers.${name}.commandTimeoutMs`),
    };
    if (servers[name].port > 65535) throw new Error(`servers.${name}.port must not exceed 65535`);
    if (servers[name].maxBytes > 4 * 1024 * 1024) throw new Error(`servers.${name}.maxBytes must not exceed 4194304`);
  }
  if (Object.keys(servers).length === 0) throw new Error('servers must not be empty');
  return { defaults, servers };
```

**依据 2 · 源码核查**：[src/remote.js:45-88](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/remote.js#L45-L88)

每调用spawn、超时/超限即错误，无request signal。

<details>
<summary>查看原文（44行）</summary>

```text
  return await new Promise((resolve, reject) => {
    const child = spawn('ssh', buildSshArgs(server, remoteCommand), {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { PATH: process.env.PATH ?? '/usr/bin:/bin', LANG: 'C.UTF-8', LC_ALL: 'C.UTF-8' },
    });
    const stdout = [];
    const stderr = [];
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let settled = false;
    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      error ? reject(error) : resolve(value);
    };
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      finish(new Error(`SSH command timed out after ${server.commandTimeoutMs}ms`));
    }, server.commandTimeoutMs);
    child.stdout.on('data', (chunk) => {
      stdoutBytes += chunk.length;
      if (stdoutBytes > maxBytes) {
        child.kill('SIGKILL');
        finish(new Error(`SSH output exceeded ${maxBytes} bytes; request fewer lines or matches`));
        return;
      }
      stdout.push(chunk);
    });
    child.stderr.on('data', (chunk) => {
      stderrBytes += chunk.length;
      if (stderrBytes <= 16 * 1024) stderr.push(chunk);
    });
    child.on('error', (error) => finish(new Error(`failed to start ssh: ${error.message}`)));
    child.on('close', (code, signal) => {
      if (settled) return;
      const output = Buffer.concat(stdout).toString('utf8');
      const errorOutput = Buffer.concat(stderr).toString('utf8').trim();
      if (code !== 0) {
        finish(new Error(`SSH failed (${signal ?? `exit ${code}`}): ${errorOutput || 'no error output'}`));
        return;
      }
      finish(undefined, output);
    });
```

</details>

**依据 3 · 源码核查**：[src/server.js:17-34](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/server.js#L17-L34)

配置和错误只启动缓存。

<details>
<summary>查看原文（18行）</summary>

```text
let config;
let configError;
try {
  config = await loadConfig();
} catch (error) {
  config = { servers: {} };
  configError = error instanceof Error ? error.message : String(error);
}

function requireConfig() {
  if (configError) {
    throw new Error(`SSH log configuration is unavailable: ${configError}. Create the file specified by DSH_SSH_LOGS_CONFIG and restart DSH.`);
  }
  return config;
}

const mcp = new McpServer({ name: 'dsh-ssh-logs', version: '0.1.0' });

```

</details>

**依据 4 · 源码核查**：[test/mcp-smoke.js:7-18](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/test/mcp-smoke.js#L7-L18)

作者假ssh模拟而非真实远程。

<details>
<summary>查看原文（12行）</summary>

```text
const root = await mkdtemp(path.join(tmpdir(), 'dsh-ssh-logs-'));
const bin = path.join(root, 'bin');
await mkdir(bin);
await writeFile(path.join(root, 'config.yml'), `servers:\n  test:\n    host: example.invalid\n    user: reader\n    roots:\n      app: /srv/logs\n`);
await writeFile(path.join(bin, 'ssh'), `#!/bin/sh\nlast=\"\"\nfor arg in \"$@\"; do last=\"$arg\"; done\ncase \"$last\" in\n  tail*) printf 'recent line 1\\nrecent line 2\\n' ;;\n  grep*) printf '42:request-id=abc\\n' ;;\n  *) exit 9 ;;\nesac\n`, { mode: 0o755 });

async function connect(configPath) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.resolve('src/server.js')],
    cwd: process.cwd(),
    env: {
```

</details>

**依据 5 · 源码核查**：[src/remote.js:92-112](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/remote.js#L92-L112)

行范围/命中有限，但无文件版本收据。

<details>
<summary>查看原文（21行）</summary>

```text
export function readCommand(remotePath, options) {
  const lines = Math.min(options.lines ?? 200, MAX_LINES);
  const quoted = shellQuote(remotePath);
  if (options.mode === 'head') return `head -n ${lines} -- ${quoted}`;
  if (options.mode === 'range') {
    const startLine = options.startLine ?? 1;
    const endLine = Math.min(startLine + lines - 1, startLine + MAX_LINES - 1);
    return `sed -n '${startLine},${endLine}p' -- ${quoted}`;
  }
  return `tail -n ${lines} -- ${quoted}`;
}

export function searchCommand(remotePath, pattern, options = {}) {
  if (typeof pattern !== 'string' || pattern.length === 0 || pattern.length > 500) {
    throw new Error('pattern must contain 1 to 500 characters');
  }
  const maxMatches = Math.min(options.maxMatches ?? 200, MAX_MATCHES);
  const context = Math.min(options.context ?? 0, 20);
  const flags = options.ignoreCase === false ? '-nF' : '-niF';
  return `grep ${flags} -C ${context} -m ${maxMatches} -- ${shellQuote(pattern)} ${shellQuote(remotePath)}`;
}
```

</details>

#### 缺口

- 宿主MCP超时/取消到本地ssh和远端进程的传递未核查。
  **影响**：不能承诺取消即全部停止或高并发资源有界。
  **进一步探讨**：沿宿主transport取消链核对，再用受控慢日志命令观察本地/远端进程及超时状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本、采用和未来假设怎么判断？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | MCP/ssh、账户/key与配置 | 允许根、known_hosts和权限核查 | 无本轮部署耗时 |
| 持续使用 | 每请求SSH进程/握手/网络、模型日志上下文 | 选行数/范围、排除敏感信息 | 默认128KiB不等于固定token费用 |
| 失败恢复 | 重连/重复读取与诊断 | 区分空grep、权限、网络和文件轮转 | 无远端版本/取消确认收据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 读取接线 | 固定alias/root/命令、来源前缀 | 真实远端兼容/agent认证 |
| 风险收窄 | 严格hostkey、quote与字节预算 | 物理root/ACL隔离和后代清理 |
| 搜索 | literal grep含行号/上下文 | 空命中正确表示，代码把exit1当错 |
| 运维收益 | 减少复制日志步骤 | 根因准确、排障时间或错误率改善 |

可有条件试用，先用独立只读账户、非敏感小日志和显式key，核对符号链接/真实路径，明确空grep错误边界。它的窄固定命令面有价值，但不把词法root当远端沙箱；依赖ssh-agent环境或多用户隔离时先核条件。继续探讨从命中/空/拒绝三类结果和root内外链接入手，再比较人工SSH的排障时间。

未验证假设是每次读前取得远端规范路径与文件身份、要求仍在批准根，再返回structured empty/truncated/timeout及已取消状态；认证保留最小agent socket而非全env。相较当前纯文本错误，可能减少误解和越界读取，但远端readlink工具、竞态与额外往返增加成本。最小对照用符号链接/轮转/无命中/超限/取消序列，比较物理目标、正确空结果、剩余进程、延迟和人工次数；若额外往返破坏交互且不能减少边界错误，需更窄方案。未实现，不计既有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/remote.js:7-20](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/remote.js#L7-L20)

词法路径缺物理身份是设计起点。

<details>
<summary>查看原文（14行）</summary>

```text
export function resolveRemotePath(server, rootName, relativePath) {
  const root = server.roots[rootName];
  if (!root) throw new Error(`unknown root ${JSON.stringify(rootName)} for server ${server.name}`);
  if (typeof relativePath !== 'string' || relativePath.trim() === '') {
    throw new Error('path must be a non-empty relative path');
  }
  if (relativePath.includes('\0') || relativePath.startsWith('/') || relativePath.includes('\\')) {
    throw new Error('path must be relative and use forward slashes');
  }
  const normalized = path.posix.normalize(relativePath);
  if (normalized === '..' || normalized.startsWith('../')) {
    throw new Error('path must stay inside the configured log root');
  }
  return path.posix.join(root, normalized);
```

</details>

**依据 2 · 源码核查**：[src/remote.js:45-88](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/remote.js#L45-L88)

环境、错误与取消状态。

<details>
<summary>查看原文（44行）</summary>

```text
  return await new Promise((resolve, reject) => {
    const child = spawn('ssh', buildSshArgs(server, remoteCommand), {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { PATH: process.env.PATH ?? '/usr/bin:/bin', LANG: 'C.UTF-8', LC_ALL: 'C.UTF-8' },
    });
    const stdout = [];
    const stderr = [];
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let settled = false;
    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      error ? reject(error) : resolve(value);
    };
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      finish(new Error(`SSH command timed out after ${server.commandTimeoutMs}ms`));
    }, server.commandTimeoutMs);
    child.stdout.on('data', (chunk) => {
      stdoutBytes += chunk.length;
      if (stdoutBytes > maxBytes) {
        child.kill('SIGKILL');
        finish(new Error(`SSH output exceeded ${maxBytes} bytes; request fewer lines or matches`));
        return;
      }
      stdout.push(chunk);
    });
    child.stderr.on('data', (chunk) => {
      stderrBytes += chunk.length;
      if (stderrBytes <= 16 * 1024) stderr.push(chunk);
    });
    child.on('error', (error) => finish(new Error(`failed to start ssh: ${error.message}`)));
    child.on('close', (code, signal) => {
      if (settled) return;
      const output = Buffer.concat(stdout).toString('utf8');
      const errorOutput = Buffer.concat(stderr).toString('utf8').trim();
      if (code !== 0) {
        finish(new Error(`SSH failed (${signal ?? `exit ${code}`}): ${errorOutput || 'no error output'}`));
        return;
      }
      finish(undefined, output);
    });
```

</details>

**依据 3 · 源码核查**：[src/server.js:50-100](https://github.com/452926826/dsh-ssh-logs/blob/4dbc65c4bb250f72388edfd42b3d3e4d0103699c/src/server.js#L50-L100)

handler返回纯文本，无empty/truncated结构。

<details>
<summary>查看原文（51行）</summary>

```text
  },
);

mcp.tool(
  'read_log',
  'Read a bounded section of a log file from an allowlisted SSH server and log root. Use tail by default for recent entries.',
  {
    server: z.string().describe('Configured server alias, for example production'),
    root: z.string().describe('Configured log root alias, for example app'),
    path: z.string().describe('Relative path below the log root, for example service/api.log'),
    mode: z.enum(['tail', 'head', 'range']).default('tail'),
    lines: z.number().int().min(1).max(5000).default(200),
    startLine: z.number().int().min(1).optional().describe('First line for range mode'),
  },
  async (args) => {
    try {
      const server = requireConfig().servers[args.server];
      if (!server) throw new Error(`unknown server ${JSON.stringify(args.server)}`);
      const remotePath = resolveRemotePath(server, args.root, args.path);
      const output = await runSsh(server, readCommand(remotePath, args));
      return textResult(`[${server.name}:${remotePath}]\n${output}`);
    } catch (error) {
      return errorResult(error);
    }
  },
);

mcp.tool(
  'search_log',
  'Search literal text in a remote log file from an allowlisted SSH server and log root. The pattern is not interpreted as a regular expression or shell code.',
  {
    server: z.string().describe('Configured server alias'),
    root: z.string().describe('Configured log root alias'),
    path: z.string().describe('Relative path below the log root'),
    pattern: z.string().min(1).max(500).describe('Literal text to find'),
    ignoreCase: z.boolean().default(true),
    context: z.number().int().min(0).max(20).default(0),
    maxMatches: z.number().int().min(1).max(1000).default(200),
  },
  async (args) => {
    try {
      const server = requireConfig().servers[args.server];
      if (!server) throw new Error(`unknown server ${JSON.stringify(args.server)}`);
      const remotePath = resolveRemotePath(server, args.root, args.path);
      const output = await runSsh(server, searchCommand(remotePath, args.pattern, args));
      return textResult(`[${server.name}:${remotePath}] matches for ${JSON.stringify(args.pattern)}\n${output}`);
    } catch (error) {
      return errorResult(error);
    }
  },
);
```

</details>

#### 缺口

- 没有相同故障问题下人工SSH与插件的准确率/总耗时/披露量对照。
  **影响**：不能量化运维效率收益。
  **进一步探讨**：固定日志语料/问题集，记录结果正确、人工步骤、上下文token和SSH开销。
- 远端规范路径/文件身份与结构化状态方案未实现。
  **影响**：不提升当前物理围栏或取消保证。
  **进一步探讨**：用链接/轮转/空/超限/取消固定序列比较错误目标和状态/延迟。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
