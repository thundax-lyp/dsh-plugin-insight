# DSH Flowix Memory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a48d45c](https://github.com/text2future/flowix/tree/a48d45ca42cdfb252f80c0c2db5d213bf904546d/dsh-flowix-memory)

<!-- BEGIN META -->
[![GitHub ★ 493](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=493&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/text2future/flowix)
<!-- END META -->

> **功能**：以本地 Flowix CLI MCP 接入 DSH，搜索和编辑 Markdown 笔记及声明的 artifact。

> **亮点**：[Q01](#research-q01) 本地CLI发现/stdio与可见安装错误使笔记能力进入DSH，不是检索新算法。

> **主要限制**：[Q02](#research-q02) 注册不等就绪，内部expected_content非Agent旧读条件、取消通知不终止同步操作；[Q03](#research-q03)env过滤依上游/实际binary版本待核。

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
  - [Q01 · DSH记忆bundle实际提供什么？](#detail-section-11)
  - [Q02 · typed memo、冲突和取消怎样接线？](#detail-section-12)
  - [Q03 · 本地接入有哪些环境和生命周期负担？](#detail-section-13)
  - [Q04 · 值得怎样试，额外方向如何推翻？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有Flowix笔记的DSH用户希望跨会话调用旧资料并按授权更新。

手工复制笔记或手动配置同CLI MCP；薄bundle增加接线便利。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MCP接线 | DSH调用本地笔记 | 注册不等CLI就绪 |
| typed memo | 搜索/读写/声明artifact | 未指定库可扫全部配置库 |
| edit预览/冲突 | 减少误写 | 内部body比较非Agent旧读版本 |
| 缺CLI降级 | 安装指引 | 异步坏CLI不自动恢复 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH MCP client/Node/profile | 必需 | 加载launcher | 注册非就绪 |
| 本地Flowix CLI/正确binary | 必需 | memo实际操作 | 缺失/坏启动分别处理 |
| 配置笔记库/备份/写授权 | 必需 | 原Markdown访问 | 默认库范围需明确 |
| 上游环境/模型策略 | 采用前提 | 凭证与笔记披露 | 本包未自过滤env |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户独立profile/副本/CLI版本 | 显式库与已知笔记 |
| 检索 | Agent调用memo | 核原文非只tools/list |
| 修改 | 授权目标edit dryRun再写 | 核实际笔记与索引 |
| 异常退出 | 停重试/移bundle | 回CLI/原文/备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | CLI/副本存储 | profile/binary配置 | 金额工时未知 |
| 持续 | 进程/索引/模型token | 核目标和内容 | 净节时未测 |
| 失败恢复 | 原文/索引副本 | 查实际副作用再重试 | 不保证error无变更 |
| 退出 | 笔记配置保留 | 移bundle回编辑器 | 数据清理另授权 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 笔记接入 | stdio/typed链 | Host/实际binary兼容 |
| 搜索 | 配置库/索引/limit | 全局相关性/召回效果 |
| 写入 | 唯一匹配/内部冲突 | caller旧版本保护/完整事务 |
| 便利 | 接线和可见错误 | 真实任务节时/恢复成本 |

> **思考**：[Q02](#research-q02) 注册不等就绪，内部expected_content非Agent旧读条件、取消通知不终止同步操作；[Q03](#research-q03)env过滤依上游/实际binary版本待核。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 本地CLI发现/stdio与可见安装错误使笔记能力进入DSH，不是检索新算法。

[Q02](#research-q02) typed dispatch、地址限定、唯一匹配/内部冲突真实存在，不能外推整库事务或caller版本保护。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 注册不等就绪，内部expected_content非Agent旧读条件、取消通知不终止同步操作；[Q03](#research-q03)env过滤依上游/实际binary版本待核。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 独立profile/显式库地址先检索，edit dryRun后授权写；错误核原文再回CLI。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定bundle/launcher与共享Rust关键链源码核查，未运行CLI/Host/模型；限定脱敏副本小范围试用。

- 已检查：作者 README、包清单、源码路径 dsh-flowix-memory/README.md、dsh-flowix-memory/launcher.mjs、dsh-flowix-memory/cordis.patch.yml、dsh-flowix-memory/package.json、app/flowix-cli/src/mcp.rs、app/flowix-cli/src/path_store.rs、app/flowix-cli/src/operation.rs、app/flowix-core/src/service.rs 及固定范围 inventory；组件：dsh-flowix-memory。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读bundle README/launcher/patch/package，补同提交Rust MCP/operation/path_store与NoteService保存关键段；复核全部旧findings。未全面审Desktop/底层文件锁索引/Host环境过滤，不运行目标。
- 下一步：副本核CLI缺失/坏路径/旧binary、跨库limit/写前外改/派生失败/取消最终原文，量人工恢复与token。

**分析版本**

- **仓库**：[text2future/flowix](https://github.com/text2future/flowix)
- **版本号**：0.1.0（[固定提交 a48d45c](https://github.com/text2future/flowix/tree/a48d45ca42cdfb252f80c0c2db5d213bf904546d)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 就绪/版本/笔记hash收据与caller版本前置条件可探索，若既有CLI探针等效或误就绪即否定。

副本核CLI缺失/坏路径/旧binary、跨库limit/写前外改/派生失败/取消最终原文，量人工恢复与token。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 162 | 152 | 1 | — |
| .md | source | 1 | 97 | — | — | 521 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/text2future/flowix/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查本地记忆桥贡献、就绪/版本/写冲突与资料边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH记忆bundle实际提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有Flowix本地Markdown笔记的用户，它把搜索/读取/创建/编辑及声明artifact能力接成mcp__flowix__memo，让Agent在会话中取用旧资料。合格结果是取到正确笔记并只修改授权目标，不能由工具注册推出跨会话记忆已可靠。相对手工复制Markdown或自己挂CLI MCP，薄bundle只省配置与发现路径；检索/索引/写入由共享Rust CLI/core承担，不是本包新记忆算法。

固定patch挂官方DSH MCP client，Node launcher寻找本地CLI并启动mcp stdio；未找到时也列同一个工具但call返回isError安装指引。这种诚实降级比伪成功好，不过tools/list不能当就绪探针。此bundle独立于Flowix Desktop控制桥；没有必须远程Flowix API这条接线，不等模型使用笔记不出网。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-flowix-memory/cordis.patch.yml:8-16](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/dsh-flowix-memory/cordis.patch.yml#L8-L16)

真实DSH bundle接线。

```text
- insert:
    - id: dsh-flowix-memory
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: flowix
        transport: stdio
        command: !!js process.execPath
        args:
          - !!js "process.env.DSH_PROFILE_DIR + '/node_modules/dsh-flowix-memory/launcher.mjs'"
```

**依据 2 · 源码核查**：[dsh-flowix-memory/launcher.mjs:15-47](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/dsh-flowix-memory/launcher.mjs#L15-L47)

本地CLI发现。

<details>
<summary>查看原文（33行）</summary>

```text
const cli = findCli()
if (cli !== undefined) {
  proxyToCli(cli)
} else {
  runUnavailableServer()
}

function findCli() {
  const explicit = [process.env.FLOWIX_DSH_MCP_CLI, process.env.FLOWIX_CLI_PATH]
    .find(value => typeof value === 'string' && value.trim() !== '')
  if (explicit !== undefined) return isExecutable(explicit.trim()) ? explicit.trim() : undefined

  const candidates = []
  if (platform === 'darwin') {
    candidates.push(
      '/Applications/Flowix.app/Contents/MacOS/flowix-cli',
      join(process.env.HOME ?? '', 'Applications/Flowix.app/Contents/MacOS/flowix-cli'),
    )
  }
  if (platform === 'win32') {
    const appData = process.env.LOCALAPPDATA ?? ''
    const programFiles = process.env.ProgramFiles ?? ''
    candidates.push(
      join(appData, 'Flowix', 'flowix-cli.exe'),
      join(programFiles, 'Flowix', 'flowix-cli.exe'),
    )
  }
  candidates.push('flowix-cli', 'flowix')
  for (const candidate of candidates) {
    const resolved = resolveCommand(candidate)
    if (resolved !== undefined) return resolved
  }
  return undefined
```

</details>

**依据 3 · 源码核查**：[dsh-flowix-memory/launcher.mjs:126-148](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/dsh-flowix-memory/launcher.mjs#L126-L148)

占位工具非就绪。

<details>
<summary>查看原文（23行）</summary>

```text
    if (message.method === 'tools/list') {
      writeResponse({
        jsonrpc: '2.0',
        id: message.id,
        result: {
          tools: [{
            name: TOOL_NAME,
            description: 'Search and edit Flowix memos. Requires the Flowix CLI.',
            inputSchema: TOOL_SCHEMA,
          }],
        },
      })
      return
    }
    if (message.method === 'tools/call') {
      const name = message.params?.name
      const text = name === TOOL_NAME
        ? `Flowix CLI is unavailable. Install Flowix from ${INSTALL_URL} for your platform, or set FLOWIX_CLI_PATH to the absolute path of flowix-cli. After installation, restart the DSH profile and retry this tool.`
        : `Unknown tool: ${String(name)}`
      writeResponse({
        jsonrpc: '2.0',
        id: message.id,
        result: { isError: true, content: [{ type: 'text', text }] },
```

</details>

**依据 4 · 源码核查**：[dsh-flowix-memory/README.md:3-15](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/dsh-flowix-memory/README.md#L3-L15)

作者本地笔记定位。

<details>
<summary>查看原文（13行）</summary>

```text
A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) bundle  
that registers the **local** `flowix-cli` **MCP server** with any Harness instance. Once installed, the agent gets the  
`mcp__flowix__memo` tool to search, read, create, and edit  
Flowix Markdown memos, and to create declared plugin artifacts such as mind maps.

The bundle includes a small launcher. It transparently proxies to `flowix-cli`  
when installed; otherwise it keeps the tool registered and returns an  
actionable installation error to the agent. The launcher is a `cordis.patch.yml`  
that inserts one  
`@deepseek-ai/dsh-mcp-client`  
row, which ships inside every Harness distribution. Nothing here connects to a  
remote Flowix service — the CLI is spawned locally over stdio and reads the  
local notebook data directory.
```

</details>

#### 缺口

- 真实Host/资料任务与手工挂载对照未验。
  **影响**：不能声称可靠记忆或净节时。
  **进一步探讨**：独立profile与样例笔记核已知检索/目标写入，再比较手工复制。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · typed memo、冲突和取消怎样接线？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Rust MCP按行同步处理，structured action和legacy command互斥，参数验证后直调typed operation，没有shell执行；legacy另拒管道/重定向等。search默认不指定notebook会遍历配置库，先reconcile索引再查，受总limit和顺序影响，不是跨库全局最相关排序。note地址绝对路径canonicalize后限定配置库、相对拒../空段；不是任意文件读写接口。

edit要求old恰一处并可dryRun，write/delete先get当前body再传core expected_content，core确实返回Conflict。这保护CLI内部读到落盘窗口，不是Agent上次show版本的前置条件：write不接caller expectedVersion，过时全文仍可能按刚读的磁盘版本写。get→save后派生索引/文档也可能报错，不能把任何error当无文件副作用。本轮未深入全部底层锁/索引事务，不宣称无原子保护或已复现丢数据。

MCP无id通知直接忽略，长同步操作不能靠后来的cancel通知中断；launcher只透传stdio/env，异步spawn error仅记stderr/exitCode，不切回占位server重试。缺CLI和坏CLI启动是不同故障。

#### 证据与依据

**依据 1 · 源码核查**：[app/flowix-cli/src/mcp.rs:23-62](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-cli/src/mcp.rs#L23-L62)

同步循环/无id通知忽略。

<details>
<summary>查看原文（40行）</summary>

```text
pub fn run_mcp<R: BufRead, W: Write>(reader: R, mut writer: W) -> Result<(), CliError> {
    for line in reader.lines() {
        let line = line.map_err(CliError::Io)?;
        if line.trim().is_empty() {
            continue;
        }

        let request: Value = match serde_json::from_str(&line) {
            Ok(value) => value,
            Err(error) => {
                write_json_line(
                    &mut writer,
                    &rpc_error(Value::Null, -32700, format!("parse error: {error}")),
                )?;
                continue;
            }
        };

        // MCP notifications do not receive responses.
        let Some(id) = request.get("id").cloned() else {
            continue;
        };
        let method = request
            .get("method")
            .and_then(Value::as_str)
            .unwrap_or_default();
        let params = request.get("params").cloned().unwrap_or_else(|| json!({}));

        let response = match method {
            "initialize" => rpc_result(id, initialize_result(&params)),
            "ping" => rpc_result(id, json!({})),
            "tools/list" => rpc_result(id, json!({"tools": [tool_definition()]})),
            "tools/call" => match call_tool(&params) {
                Ok(result) => rpc_result(id, result),
                Err(error) => rpc_error(id, -32602, error.to_string()),
            },
            _ => rpc_error(id, -32601, format!("method not found: {method}")),
        };
        write_json_line(&mut writer, &response)?;
    }
```

</details>

**依据 2 · 源码核查**：[app/flowix-cli/src/mcp.rs:112-152](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-cli/src/mcp.rs#L112-L152)

typed dispatch与真实isError。

<details>
<summary>查看原文（41行）</summary>

```text
    validate_argument_keys(arguments)?;
    if arguments.contains_key("action") && arguments.contains_key("command") {
        return Err(CliError::Usage(
            "memo accepts either structured `action` or legacy `command`, not both".into(),
        ));
    }
    let stdin = match arguments.get("stdin") {
        Some(value) => Some(
            value
                .as_str()
                .ok_or_else(|| CliError::Usage("memo.stdin must be a string".into()))?,
        ),
        None => None,
    };

    let execution = if arguments.contains_key("action") {
        if stdin.is_some() {
            return Err(CliError::Usage(
                "structured actions use `content`; legacy `stdin` is not allowed".into(),
            ));
        }
        operation::execute(parse_structured_operation(arguments)?)
    } else {
        let command = arguments
            .get("command")
            .and_then(Value::as_str)
            .ok_or_else(|| CliError::Usage("memo requires `action` or legacy `command`".into()))?;
        execute_command(command, stdin)
    };

    match execution {
        Ok(data) => Ok(tool_result(data, false)),
        Err(error) => {
            let error_data = json!({
                "ok": false,
                "error": {
                    "code": error_code(&error),
                    "message": error.to_string()
                }
            });
            Ok(tool_result(error_data, true))
```

</details>

**依据 3 · 源码核查**：[app/flowix-cli/src/mcp.rs:185-245](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-cli/src/mcp.rs#L185-L245)

structured参数/各操作。

<details>
<summary>查看原文（61行）</summary>

```text
fn parse_structured_operation(
    arguments: &Map<String, Value>,
) -> Result<operation::FlowixOperation, CliError> {
    use operation::FlowixOperation;
    let action = required_string(arguments, "action")?;
    let notebook = optional_string(arguments, "notebook")?;
    let content = || required_string(arguments, "content");
    let address = || required_string(arguments, "address");
    let limit = integer(arguments, "limit", 50, 1, 200)?;
    let offset = integer(arguments, "offset", 0, 0, usize::MAX)?;
    let dry_run = boolean(arguments, "dryRun", false)?;
    match action.as_str() {
        "notebooks" => Ok(FlowixOperation::Notebooks),
        "collection.read" => {
            let notebook = required_string(arguments, "notebook")?;
            Ok(FlowixOperation::CollectionRead {
                notebook,
                collection_id: optional_string(arguments, "collectionId")?,
                path: optional_string(arguments, "path")?,
            })
        }
        "list" => Ok(FlowixOperation::List {
            notebook,
            limit,
            offset,
        }),
        "tags" => Ok(FlowixOperation::Tags { notebook }),
        "show" => Ok(FlowixOperation::Show { address: address()? }),
        "search" => Ok(FlowixOperation::Search {
            query: required_string(arguments, "query")?,
            notebook,
            tag: optional_string(arguments, "tag")?,
            limit,
        }),
        "create" => Ok(FlowixOperation::Create {
            notebook,
            content: content()?,
        }),
        "edit" => Ok(FlowixOperation::Edit {
            address: address()?,
            old: required_string(arguments, "old")?,
            replacement: content()?,
            dry_run,
        }),
        "write" => Ok(FlowixOperation::Write {
            address: address()?,
            content: content()?,
        }),
        "delete" => Ok(FlowixOperation::Delete { address: address()? }),
        "artifact.list" => Ok(FlowixOperation::ArtifactList),
        "artifact.describe" => Ok(FlowixOperation::ArtifactDescribe {
            plugin_id: required_string(arguments, "pluginId")?,
        }),
        "artifact.create" => Ok(FlowixOperation::ArtifactCreate {
            plugin_id: required_string(arguments, "pluginId")?,
            notebook,
            source_note: optional_string(arguments, "sourceNote")?,
            producer: optional_string(arguments, "producer")?.unwrap_or_else(|| "agent-mcp".into()),
            content: content()?,
        }),
        _ => Err(CliError::Usage(format!("unknown memo action: `{action}`"))),
```

</details>

**依据 4 · 源码核查**：[app/flowix-cli/src/mcp.rs:445-455](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-cli/src/mcp.rs#L445-L455)

legacy shell语法拒绝。

<details>
<summary>查看原文（11行）</summary>

```text
fn reject_shell_syntax(command: &str) -> Result<(), CliError> {
    const FORBIDDEN: &[&str] = &["|", ";", "&&", ">", "<", "`", "$(", "${"];
    if let Some(operator) = FORBIDDEN
        .iter()
        .find(|operator| command.contains(**operator))
    {
        return Err(CliError::Usage(format!(
            "shell syntax `{operator}` is not allowed"
        )));
    }
    Ok(())
```

</details>

**依据 5 · 源码核查**：[app/flowix-cli/src/path_store.rs:7-49](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-cli/src/path_store.rs#L7-L49)

配置笔记库地址边界。

<details>
<summary>查看原文（43行）</summary>

```text
fn address(
    raw: &str,
) -> Result<(flowix_core::memo_file::MemoFile, NotebookConfig, String), CliError> {
    let mf = store::open()?;
    let configs = mf.read_notebook_configs()?;
    let (notebook, relative) = if let Some((key, relative)) = raw.split_once("::") {
        let notebook = store::find_notebook(&configs, key)
            .ok_or_else(|| CliError::NotFound(format!("notebook not found: {key}")))?;
        (notebook, relative.replace('\\', "/"))
    } else if Path::new(raw).is_absolute() {
        let absolute = std::fs::canonicalize(raw)?;
        let notebook = configs
            .iter()
            .filter_map(|config| {
                let root = std::fs::canonicalize(&config.path).ok()?;
                absolute
                    .strip_prefix(&root)
                    .ok()
                    .map(|relative| (config, relative.to_path_buf(), root.components().count()))
            })
            .max_by_key(|(_, _, depth)| *depth)
            .ok_or_else(|| {
                CliError::NotFound(format!("note is outside configured notebooks: {raw}"))
            })?;
        (notebook.0, notebook.1.to_string_lossy().replace('\\', "/"))
    } else {
        let key = store::resolve_notebook_key(None)?;
        let notebook = store::find_notebook(&configs, &key)
            .ok_or_else(|| CliError::NotFound(format!("notebook not found: {key}")))?;
        (notebook, raw.replace('\\', "/"))
    };
    if relative.is_empty()
        || relative.starts_with('/')
        || relative
            .split('/')
            .any(|part| part.is_empty() || part == "." || part == "..")
    {
        return Err(CliError::Usage(
            "note address must be a notebook-relative Markdown path".into(),
        ));
    }
    let notebook = notebook.clone();
    Ok((mf, notebook, relative))
```

</details>

**依据 6 · 源码核查**：[app/flowix-cli/src/path_store.rs:99-159](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-cli/src/path_store.rs#L99-L159)

old匹配/内部expected_content。

<details>
<summary>查看原文（61行）</summary>

```text
pub(crate) fn edit(
    raw: &str,
    old: &str,
    replacement: &str,
    dry_run: bool,
) -> Result<Value, CliError> {
    if old.is_empty() {
        return Err(CliError::Usage("edit: --old cannot be empty".into()));
    }
    let (mf, notebook, relative) = address(raw)?;
    let current = NoteService::new(&mf).get(&notebook.id, &relative)?;
    let matches = current.body.match_indices(old).count();
    if matches != 1 {
        return Err(CliError::Usage(format!(
            "edit: expected exactly one match, found {matches}"
        )));
    }
    let next = current.body.replacen(old, replacement, 1);
    if !dry_run {
        match NoteService::new(&mf).save(&notebook.id, &relative, &next, Some(&current.body))? {
            flowix_core::service::NoteSaveOutcome::Saved(_) => {}
            flowix_core::service::NoteSaveOutcome::Conflict { .. } => {
                return Err(CliError::Conflict(
                    "note changed on disk; edit was not applied".into(),
                ))
            }
        }
    }
    Ok(
        json!({"ok": true, "action": if dry_run {"edit_preview"} else {"edited"},
        "notebookId": notebook.id, "relativePath": relative, "address": locator(&notebook.id, &relative),
        "path": current.path, "oldBytes": old.len(), "newBytes": replacement.len(), "wrote": !dry_run}),
    )
}

pub(crate) fn write(raw: &str, content: &str) -> Result<Value, CliError> {
    if content.trim().is_empty() {
        return Err(CliError::Usage("write: content is empty".into()));
    }
    let (mf, notebook, relative) = address(raw)?;
    let current = NoteService::new(&mf).get(&notebook.id, &relative)?;
    let saved =
        NoteService::new(&mf).save(&notebook.id, &relative, content, Some(&current.body))?;
    match saved {
        flowix_core::service::NoteSaveOutcome::Saved(document) => {
            Ok(json!({"ok": true, "action": "written", "note": document_json(&document)}))
        }
        flowix_core::service::NoteSaveOutcome::Conflict { .. } => Err(CliError::Conflict(
            "note changed on disk; write was not applied".into(),
        )),
    }
}

pub(crate) fn delete(raw: &str) -> Result<Value, CliError> {
    let (mf, notebook, relative) = address(raw)?;
    let document = NoteService::new(&mf).get(&notebook.id, &relative)?;
    let removed = NoteService::new(&mf).delete_checked(&notebook.id, &relative, &document.body)?;
    Ok(
        json!({"ok": removed, "action": "deleted", "notebookId": notebook.id,
        "relativePath": relative, "address": locator(&notebook.id, &relative), "path": document.path}),
    )
```

</details>

**依据 7 · 源码核查**：[app/flowix-cli/src/path_store.rs:183-212](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-cli/src/path_store.rs#L183-L212)

跨库顺序/索引。

<details>
<summary>查看原文（30行）</summary>

```text
    let mf = store::open()?;
    let configs = mf.read_notebook_configs()?;
    let selected = if let Some(key) = notebook_filter {
        vec![store::resolve_notebook_config(&mf, key)?]
    } else {
        configs
    };
    let mut hits = Vec::new();
    for notebook in selected {
        mf.reconcile_note_index_blocking(&notebook.id)?;
        for hit in NoteService::new(&mf).search_with_tag_filter(
            &notebook.id,
            query,
            normalized_tag.as_deref(),
            limit.saturating_sub(hits.len()),
        )? {
            hits.push(
                json!({"notebookId": notebook.id, "relativePath": hit.relative_path,
                "address": locator(&notebook.id, &hit.relative_path), "title": hit.title,
                "snippet": hit.snippet}),
            );
            if hits.len() >= limit {
                break;
            }
        }
        if hits.len() >= limit {
            break;
        }
    }
    Ok(json!({"ok": true, "action": "search", "query": query, "matches": hits}))
```

</details>

**依据 8 · 源码核查**：[app/flowix-core/src/service.rs:375-412](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-core/src/service.rs#L375-L412)

保存冲突及后续文档派生。

<details>
<summary>查看原文（38行）</summary>

```text
    pub(crate) fn save_note_by_path(
        &mut self,
        notebook_key: &str,
        relative_path: &str,
        content: &str,
        expected_content: Option<&str>,
    ) -> Result<NoteSaveOutcome, FlowixError> {
        let notebook = self.resolve_notebook(notebook_key)?;
        match self.memo_file.write_note_by_path_with_result(
            &notebook.id,
            relative_path,
            content,
            expected_content,
        )? {
            NoteWriteResult::Conflict { disk_content } => {
                Ok(NoteSaveOutcome::Conflict { disk_content })
            }
            NoteWriteResult::Saved {
                content,
                index_entry,
            } => {
                let entry = match index_entry {
                    Some(entry) => entry,
                    None => self
                        .memo_file
                        .derive_note_entry_from_disk(&notebook.id, relative_path)?,
                };
                let path = notebook_path_from_relative(
                    &PathBuf::from(&notebook.path),
                    &entry.relative_path,
                )
                .map_err(FlowixError::InvalidInput)?;
                Ok(NoteSaveOutcome::Saved(NoteDocument {
                    entry,
                    notebook,
                    path,
                    body: content,
                }))
```

</details>

**依据 9 · 源码核查**：[dsh-flowix-memory/launcher.mjs:75-94](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/dsh-flowix-memory/launcher.mjs#L75-L94)

实际子进程/异步错误。

<details>
<summary>查看原文（20行）</summary>

```text
function proxyToCli(command) {
  let child
  try {
    child = spawn(command, ['mcp'], { stdio: ['pipe', 'pipe', 'pipe'], env: process.env })
  } catch (error) {
    process.stderr.write(`[${SERVER_NAME}] failed to start Flowix CLI: ${String(error)}\n`)
    runUnavailableServer()
    return
  }
  process.stdin.pipe(child.stdin)
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  child.once('error', error => {
    process.stderr.write(`[${SERVER_NAME}] failed to start Flowix CLI: ${String(error)}\n`)
    process.exitCode = 1
  })
  child.once('exit', (code, signal) => {
    if (signal !== null) process.kill(process.pid, signal)
    else process.exitCode = code ?? 1
  })
```

</details>

#### 缺口

- 底层写锁/索引事务及取消最终状态未全核。
  **影响**：无法保证失败无变更或旧Agent内容不覆盖。
  **进一步探讨**：副本在show后外改、内部读写竞态/派生失败/长检索取消后核原文与索引。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地接入有哪些环境和生命周期负担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要正确profile、DSH内置MCP client与Node launcher、本地Flowix CLI、配置笔记库/写权限；launcher显式env路径错就返回未找到，不再搜PATH，安装后二次启动才重发现。package0.1.0 AGPL-3.0-only，README说尚未npm发布，本轮不核实时registry。运行CLI不等与审查提交相同，应记录实际binary版本/来源。

README说MCP桥过滤凭证/DSH变量，但launcher spawn实际env:process.env；可能宿主已先过滤，本包本身不做该保证，必须核DSH上游而非宣称已泄露secret。本地笔记摘要/原文仍进入Agent/模型上下文，分享或敏感信息另审。首次配置与备份，持续CLI/索引reconcile/模型token，未测CPU/节时/现金。错误先核实际Markdown/索引再重试；delete破坏性需真实目标授权。退出移除bundle回CLI/原文，笔记和配置不随卸载删除，备份/恢复人工时间未知。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-flowix-memory/package.json:1-10](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/dsh-flowix-memory/package.json#L1-L10)

版本许可。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "dsh-flowix-memory",
  "version": "0.1.0",
  "description": "DeepSeek Harness bundle: expose Flowix memos and artifact tools through the local flowix-cli MCP server",
  "license": "AGPL-3.0-only",
  "type": "module",
  "files": [
    "cordis.patch.yml",
    "launcher.mjs",
    "memo-tool-schema.json",
```

</details>

**依据 2 · 源码核查**：[dsh-flowix-memory/launcher.mjs:22-25](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/dsh-flowix-memory/launcher.mjs#L22-L25)

显式路径失败不fallback。

```text
function findCli() {
  const explicit = [process.env.FLOWIX_DSH_MCP_CLI, process.env.FLOWIX_CLI_PATH]
    .find(value => typeof value === 'string' && value.trim() !== '')
  if (explicit !== undefined) return isExecutable(explicit.trim()) ? explicit.trim() : undefined
```

**依据 3 · 源码核查**：[dsh-flowix-memory/launcher.mjs:75-89](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/dsh-flowix-memory/launcher.mjs#L75-L89)

继承env，无自有过滤。

<details>
<summary>查看原文（15行）</summary>

```text
function proxyToCli(command) {
  let child
  try {
    child = spawn(command, ['mcp'], { stdio: ['pipe', 'pipe', 'pipe'], env: process.env })
  } catch (error) {
    process.stderr.write(`[${SERVER_NAME}] failed to start Flowix CLI: ${String(error)}\n`)
    runUnavailableServer()
    return
  }
  process.stdin.pipe(child.stdin)
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  child.once('error', error => {
    process.stderr.write(`[${SERVER_NAME}] failed to start Flowix CLI: ${String(error)}\n`)
    process.exitCode = 1
```

</details>

**依据 4 · 源码核查**：[dsh-flowix-memory/README.md:25-36](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/dsh-flowix-memory/README.md#L25-L36)

库目录/未发布声明。

<details>
<summary>查看原文（12行）</summary>

```text
2. Access to the Flowix notebook data the CLI should manage. Defaults to the  
 user config directory (`~/.flowix`); override with `FLOWIX_HOME` /  
 `FLOWIX_DATA` when the data lives elsewhere.

## Install

`dsh plugin` manages one profile at a time and requires `--profile <name>`.  
Flowix uses the `flowix` profile. In other DSH clients, `flowix` is simply a  
custom profile name and can be created by the same command. The bundle remains independent from  
Flowix's host/control bridge and ships in the  
[flowix-main](https://github.com/text2future/flowix) repository and is not yet  
published to npm, so install it from the checkout:
```

</details>

**依据 5 · 源码核查**：[dsh-flowix-memory/README.md:89-97](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/dsh-flowix-memory/README.md#L89-L97)

作者环境过滤声明须核上游。

```text
## Notes

- The MCP stdio bridge strips ambient credential-like variables and all  
`DSH_*` variables before spawning the child; other ambient variables  
(including `HOME`/`PATH`) are inherited.
- Flowix Desktop installs this same bundle into its `flowix` profile and sets  
`FLOWIX_DSH_MCP_CLI`. Other DSH clients can install it into any profile and  
use `FLOWIX_CLI_PATH` or the `flowix` executable on PATH. There is one  
canonical bundle patch and no embedded duplicate row.
```

#### 缺口

- 实际binary/Host环境过滤/模型外传与性能未验。
  **影响**：不能保证版本等价、凭证最小化或资料只在本地。
  **进一步探讨**：独立副本核binary版本、子环境名称（不打印secret）和真实模型输入/退出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 值得怎样试，额外方向如何推翻？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议独立profile/脱敏笔记副本先只读检索已知目标，再明确授权小范围edit dryRun后写；显式notebook与地址，避免默认扫全库。不以tools/list当就绪，不把写失败当未发生；内容不符/CLI反复不可用时停并回CLI和原文核对。

可探索只读就绪与版本绑定收据：明确占位/子进程可用/库可读、实际CLI版本和目标笔记hash；写操作再以caller读过版本为条件。现有占位错误、edit唯一匹配、core冲突是基线，增量是连接Host就绪和Agent旧读，不替代底层锁。无CLI/坏PATH、旧binary、show后外改四类对照，比较无效调用/过时覆盖/人工恢复与额外查询成本；若现有错误/CLI status已等效，或预检自身引入竞态和误就绪，否定。未实现。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-flowix-memory/launcher.mjs:126-148](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/dsh-flowix-memory/launcher.mjs#L126-L148)

占位就绪差异。

<details>
<summary>查看原文（23行）</summary>

```text
    if (message.method === 'tools/list') {
      writeResponse({
        jsonrpc: '2.0',
        id: message.id,
        result: {
          tools: [{
            name: TOOL_NAME,
            description: 'Search and edit Flowix memos. Requires the Flowix CLI.',
            inputSchema: TOOL_SCHEMA,
          }],
        },
      })
      return
    }
    if (message.method === 'tools/call') {
      const name = message.params?.name
      const text = name === TOOL_NAME
        ? `Flowix CLI is unavailable. Install Flowix from ${INSTALL_URL} for your platform, or set FLOWIX_CLI_PATH to the absolute path of flowix-cli. After installation, restart the DSH profile and retry this tool.`
        : `Unknown tool: ${String(name)}`
      writeResponse({
        jsonrpc: '2.0',
        id: message.id,
        result: { isError: true, content: [{ type: 'text', text }] },
```

</details>

**依据 2 · 源码核查**：[app/flowix-cli/src/path_store.rs:134-148](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-cli/src/path_store.rs#L134-L148)

内部新读非caller版本。

<details>
<summary>查看原文（15行）</summary>

```text
pub(crate) fn write(raw: &str, content: &str) -> Result<Value, CliError> {
    if content.trim().is_empty() {
        return Err(CliError::Usage("write: content is empty".into()));
    }
    let (mf, notebook, relative) = address(raw)?;
    let current = NoteService::new(&mf).get(&notebook.id, &relative)?;
    let saved =
        NoteService::new(&mf).save(&notebook.id, &relative, content, Some(&current.body))?;
    match saved {
        flowix_core::service::NoteSaveOutcome::Saved(document) => {
            Ok(json!({"ok": true, "action": "written", "note": document_json(&document)}))
        }
        flowix_core::service::NoteSaveOutcome::Conflict { .. } => Err(CliError::Conflict(
            "note changed on disk; write was not applied".into(),
        )),
```

</details>

**依据 3 · 源码核查**：[app/flowix-cli/src/path_store.rs:99-130](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-cli/src/path_store.rs#L99-L130)

已有edit/dryRun保护。

<details>
<summary>查看原文（32行）</summary>

```text
pub(crate) fn edit(
    raw: &str,
    old: &str,
    replacement: &str,
    dry_run: bool,
) -> Result<Value, CliError> {
    if old.is_empty() {
        return Err(CliError::Usage("edit: --old cannot be empty".into()));
    }
    let (mf, notebook, relative) = address(raw)?;
    let current = NoteService::new(&mf).get(&notebook.id, &relative)?;
    let matches = current.body.match_indices(old).count();
    if matches != 1 {
        return Err(CliError::Usage(format!(
            "edit: expected exactly one match, found {matches}"
        )));
    }
    let next = current.body.replacen(old, replacement, 1);
    if !dry_run {
        match NoteService::new(&mf).save(&notebook.id, &relative, &next, Some(&current.body))? {
            flowix_core::service::NoteSaveOutcome::Saved(_) => {}
            flowix_core::service::NoteSaveOutcome::Conflict { .. } => {
                return Err(CliError::Conflict(
                    "note changed on disk; edit was not applied".into(),
                ))
            }
        }
    }
    Ok(
        json!({"ok": true, "action": if dry_run {"edit_preview"} else {"edited"},
        "notebookId": notebook.id, "relativePath": relative, "address": locator(&notebook.id, &relative),
        "path": current.path, "oldBytes": old.len(), "newBytes": replacement.len(), "wrote": !dry_run}),
```

</details>

#### 缺口

- 收据/调用者版本条件未实现与对照。
  **影响**：不计为现有可靠性收益。
  **进一步探讨**：先比较显式notebook+edit dryRun的简单替代。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
