# Cue Omni Reader

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[0e6b629](https://github.com/sensedeal/cue-skills/tree/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sensedeal/cue-skills) [![npm 30d 1,204](https://img.shields.io/static/v1?label=npm+30d&message=1%2C204&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cueai/dsh-omni-reader) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cueai/dsh-omni-reader)
<!-- END META -->

> **功能**：将 Cue Omni Reader 的文档与网页解析 MCP 接入 DeepSeek Harness。

> **亮点**：[Q01](#research-q01) 交付固定版本和环境配置的 profile 接线，复用既有 DSH 客户端与外部桥。

> **主要限制**：[Q02](#research-q02) 默认本地根使用进程 cwd，外部进程与任意 URL 解析有独立执行和数据边界。

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
  - [Q01 · 接线包给 DSH 用户带来什么？](#detail-section-11)
  - [Q02 · 固定进程版本能控制哪些执行与数据边界？](#detail-section-12)
  - [Q03 · 怎样验证解析链和退出成本？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 中需要持续提取网页或已授权文档的用户。

手配同一 MCP bridge，或直接浏览和本地提取文档。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| MCP 接线 | 注册 Omni 服务工具 | 依赖外部进程 |
| 环境注入 | 传递 key 和可读根 | 执行边界由外部实现 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 20.12+、npx 与 registry | 必需 | 启动固定桥 | 检查缓存或停止 |
| 宿主 MCP 客户端与 Cue key | 必需 | 工具连接与解析 | 无法使用 |
| 受限允许根 | 本地解析需 | 限定声明文件范围 | 不解析本地文件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对 bridge 版本及可读根 | 仅隔离环境 |
| 观察 | 用户检查工具清单和合成样例 | 内容、费用或范围不明则停 |
| 退出 | 用户移除 bundle 或补丁 | 新会话检查工具与旧任务 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 解析试用额度未知 | 核包、密钥和权限 | 需外部进程 |
| 持续 | 请求与模型费用未知 | 核对任务和内容 | 额度随账户 |
| 失败 | 重试及存储未知 | 复核未取消任务与保存结果 | 无独立清理证据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 解析接入 | 固定 stdio 行 | 实际格式与质量 |
| 运行配置 | 版本和可读根显式 | 真实出站与收费 |

> **思考**：[Q02](#research-q02) 默认本地根使用进程 cwd，外部进程与任意 URL 解析有独立执行和数据边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 交付固定版本和环境配置的 profile 接线，复用既有 DSH 客户端与外部桥。

[Q02](#research-q02) 明确版本与环境变量；需要独立确认默认 cwd 及实际可读边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 默认本地根使用进程 cwd，外部进程与任意 URL 解析有独立执行和数据边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 只有具备隔离 key、已核外部包和非敏感样本，才进一步验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核子包接线，解析与数据边界仍需验外部包和服务。

- 已检查：作者 README、包清单、源码路径 dsh/cue-omni-reader/README.zh-CN.md、dsh/cue-omni-reader/package.json、dsh/cue-omni-reader/cordis.patch.yml 及固定范围 inventory；组件：dsh/cue-omni-reader。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读子包四个跟踪文件，未运行 npx 或解析服务。
- 下一步：核实际进程、工具发现、最小目录、远端落点、任务取消、额度与卸载。

**分析版本**

- **仓库**：[sensedeal/cue-skills](https://github.com/sensedeal/cue-skills)
- **版本号**：0.1.17（[固定提交 0e6b629](https://github.com/sensedeal/cue-skills/tree/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照相同版本的手配 MCP，测接线复用是否缩短失败恢复时间。

核实际进程、工具发现、最小目录、远端落点、任务取消、额度与卸载。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 195 | — | — | 1293 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/sensedeal/cue-skills/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定 stdio 接线如何接入外部解析器，试用有哪些数据和费用边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 接线包给 DSH 用户带来什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

反复提取网页、文档或音视频内容的 DSH 用户可将 Cue 解析工具挂入一个 profile。这个子包只有 manifest、补丁和说明，实际逻辑是 DSH MCP 客户端通过 stdio 连接外部进程。作者列出提交解析、查询状态、取消、读结果、读目录、丢弃与保存；这些是外部 MCP 服务能力，补丁不定义其工具 schema，也没有仓内解析算法。相对手配 stdio MCP 命令，增量是可版本化的 profile 安装入口和默认参数，而不是新增格式支持。另行发布的 Skill 引导也不由本包加载。

#### 证据与依据

**依据 1 · 作者声明**：[dsh/cue-omni-reader/README.zh-CN.md:5-15](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader/README.zh-CN.md#L5-L15)

作者声明工具、另行 Skill 与运行依赖。

<details>
<summary>查看原文（11行）</summary>

```text
一个 [DeepSeek Harness](https://github.com/deepseek-harness) **bundle**,把审校版的 **Cue Omni Reader** MCP server 接进 Harness,让它的工具以原生 `mcp__omni__*` 形式暴露给任何 harness profile。它是薄组成层——DSH 通过 `@deepseek-ai/dsh-mcp-client` 桥接 MCP;本包只负责声明 server 行及其配置,不含自定义解析器或 MCP driver。

工具能力:`parse` / `get_parse_status` / `cancel_parse` / `read_result` / `read_outline` / `discard_result` / `save_result` —— 把一个 HTTP(S) URL 或已授权的本地文档、音频、视频源转成内容。

> 面向 skill 的引导(同一能力,可被 agent 加载的指令包)在本仓库单独以 [`cue-omni-reader/`](../../cue-omni-reader) 发布。两者都装,才能既拿到工具**又**有引导流程。

## 前置条件

- **Node.js ≥ 20.12**(Bridge 运行时)。
- **Cue API key**:<https://cuecue.cn/hub/api-key>。新账号有赠送额度(当前额度见 skill 的 setup 参考)。
- Bridge 通过 `npx -y @cueai/omni-reader-mcp@1.9.0` 拉起,所以 npm registry 需可达,或安装一个二进制在 `PATH` 上的版本。
```

</details>

**依据 2 · 源码核查**：[dsh/cue-omni-reader/package.json:2-17](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader/package.json#L2-L17)

bundle 指向补丁，宿主 client 作为 peer。

<details>
<summary>查看原文（16行）</summary>

```text
  "name": "@cueai/dsh-omni-reader",
  "version": "0.1.17",
  "description": "DSH bundle: registers the audited Cue Omni Reader MCP server so its tools surface as mcp__omni__* in any DeepSeek Harness profile.",
  "license": "MIT",
  "type": "module",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {},
  "peerDependencies": {
    "@deepseek-ai/dsh-mcp-client": "^0.1.1-rc.2"
  },
  "engines": {
    "node": ">=20.12"
```

</details>

**依据 3 · 源码核查**：[dsh/cue-omni-reader/cordis.patch.yml:12-24](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader/cordis.patch.yml#L12-L24)

实际只插入一个 stdio server。

<details>
<summary>查看原文（13行）</summary>

```text
- insert:
    - id: mcp-omni
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: omni
        transport: stdio
        command: npx
        args: ['-y', '@cueai/omni-reader-mcp@1.9.0']
        cwd: !!js process.cwd()
        env:
          CUE_API_KEY: !!js process.env.CUE_API_KEY
          # Configurable, never hardcoded: explicit root wins, else the dsh cwd.
          OMNI_ALLOWED_ROOTS: !!js 'process.env.OMNI_ALLOWED_ROOTS || process.cwd()'
```

</details>

#### 缺口

- 未列出实机 MCP 工具或执行解析
  **影响**：不能确认可用格式、返回字段及取消语义
  **进一步探讨**：以隔离会话发现工具，再比较一份测试文档的输入和输出

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 固定进程版本能控制哪些执行与数据边界？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

补丁写明 command npx，args 使用 -y 和 @cueai/omni-reader-mcp@1.9.0。固定包版本使入口可复核，仍需本地 npx、registry 或缓存；-y 表示可在没有交互提示时运行该外部包。CUE_API_KEY 由环境传入，OMNI_ALLOWED_ROOTS 未显式设置时用 DSH 进程 cwd，若进程从过宽目录启动，接线默认值就扩大桥可见的声明范围。作者说明可能解析任意 URL，接线未包含出站策略和工具前置许可。读取限制、子进程环境清理、远端数据传输均发生在外部包或服务，本固定子包不能证明它们实际生效。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/cue-omni-reader/cordis.patch.yml:8-24](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader/cordis.patch.yml#L8-L24)

固定启动参数、进程 cwd、凭据和本地根。

<details>
<summary>查看原文（17行）</summary>

```text
# The Bridge version is pinned (never an implicit `latest`). Runtime needs
# Node >= 20.12 and a CUE_API_KEY configured via the environment (set it in
# $DSH_HOME/.env or export it before launching dsh). Secrets never go in this
# file; local reads are bounded by OMNI_ALLOWED_ROOTS.
- insert:
    - id: mcp-omni
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: omni
        transport: stdio
        command: npx
        args: ['-y', '@cueai/omni-reader-mcp@1.9.0']
        cwd: !!js process.cwd()
        env:
          CUE_API_KEY: !!js process.env.CUE_API_KEY
          # Configurable, never hardcoded: explicit root wins, else the dsh cwd.
          OMNI_ALLOWED_ROOTS: !!js 'process.env.OMNI_ALLOWED_ROOTS || process.cwd()'
```

</details>

**依据 2 · 作者声明**：[dsh/cue-omni-reader/README.zh-CN.md:35-48](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader/README.zh-CN.md#L35-L48)

作者说明环境变量。

<details>
<summary>查看原文（14行）</summary>

````text
server 行的 env 由环境变量驱动(文件里不含密钥或绝对路径):

| Env | 含义 | 默认 |
|---|---|---|
| `CUE_API_KEY` | Cue Omni 凭据 | 必填——在 `$DSH_HOME/.env` 里设置,或在启动 dsh 前 export |
| `OMNI_ALLOWED_ROOTS` | Bridge 可读的 `:` 分隔绝对目录 | `process.cwd()`(dsh 工作目录) |

配置好 key(和可选根)后重启 dsh,让分层的 `.env`/config 生效:

```sh
# ~/.dsh/.env
CUE_API_KEY=sk-...
OMNI_ALLOWED_ROOTS=/home/you/workspace
```
````

</details>

**依据 3 · 作者声明**：[dsh/cue-omni-reader/README.zh-CN.md:69-78](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader/README.zh-CN.md#L69-L78)

作者声明任意 URL 与外部隔离行为。

<details>
<summary>查看原文（10行）</summary>

```text
## 安全与范围

- Omni 可解析**任意 URL** —— 这是任意网络/出网面。把 `OMNI_ALLOWED_ROOTS` 收到 agent 真正需要的最小目录,并在把 URL 解析交给无人值守 agent 前征得同意。
- 本地文件读取受 `OMNI_ALLOWED_ROOTS` 约束;Bridge 在拉起子进程前会 scrubbing(清除)环境里像凭据的变量。
- 不要把 API key 放进聊天、命令参数、本文件、日志或生成的 JSON;一旦明文出现过就轮换它。

## 版本

- Bridge 固定:**`@cueai/omni-reader-mcp@1.9.0`**(审校版;永远不用隐式 `latest`)。
- `@deepseek-ai/dsh-mcp-client` 是 **peer** 依赖(声明为 `^0.1.1-rc.2`),由 Harness profile 提供;如需要,对齐到你所跑的 Harness 版本。
```

</details>

#### 缺口

- 没有外部桥发行物与服务协议的独立核查
  **影响**：无法判断网络请求、符号链接或敏感数据处理
  **进一步探讨**：只在独立环境用公开 URL 与合成文件测试允许、拒绝和网络落点

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样验证解析链和退出成本？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

先用最小本地根和隔离 key 检查 npx 来源、运行时和 profile 展开。若授权进行测试，提交一个公开 URL 或合成文件，检查任务状态、内容读取、取消及保存，再根据作者说明移除包或手动补丁，复核新会话没有工具并检查未完成任务。持续成本是远端额度、模型、存储和运行诊断，未从本包测得。可对照直接启动外部 MCP 与固定 bundle，比较同版本发现成功率与恢复时间。若复用没有缩短接入，或隐藏了根目录和凭据错误，就放弃接线层。

#### 证据与依据

**依据 1 · 作者声明**：[dsh/cue-omni-reader/README.zh-CN.md:50-67](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader/README.zh-CN.md#L50-L67)

作者描述异步解析和验证入口。

<details>
<summary>查看原文（18行）</summary>

````text
## 使用

重启后模型可见:

```
mcp__omni__parse mcp__omni__get_parse_status mcp__omni__cancel_parse
mcp__omni__read_result mcp__omni__read_outline mcp__omni__discard_result
mcp__omni__save_result
```

用 `source`(URL 或在允许根内的路径)调 `mcp__omni__parse`,轮询 `mcp__omni__get_parse_status`,再消费结果。

## 验证

```sh
dsh --profile web --dump-config      # 应包含一个 `mcp-omni` 行
# 然后在会话里确认工具出现、一次小解析成功。
```
````

</details>

**依据 2 · 作者声明**：[dsh/cue-omni-reader/README.zh-CN.md:80-85](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader/README.zh-CN.md#L80-L85)

作者说明回滚。

````text
## 回滚

```sh
dsh plugin --profile web remove @cueai/dsh-omni-reader
# 或删除你 profile cordis.patch.yml 里的 `mcp-omni` insert。
```
````

**依据 3 · 源码核查**：[dsh/cue-omni-reader/cordis.patch.yml:18-24](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader/cordis.patch.yml#L18-L24)

本地进程与默认根实际设置。

```text
        command: npx
        args: ['-y', '@cueai/omni-reader-mcp@1.9.0']
        cwd: !!js process.cwd()
        env:
          CUE_API_KEY: !!js process.env.CUE_API_KEY
          # Configurable, never hardcoded: explicit root wins, else the dsh cwd.
          OMNI_ALLOWED_ROOTS: !!js 'process.env.OMNI_ALLOWED_ROOTS || process.cwd()'
```

#### 缺口

- 未实际启动或注销任务
  **影响**：额度、结果保留与卸载后远端状态未知
  **进一步探讨**：只用非敏感样本核账单、任务终态和工具清单

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
