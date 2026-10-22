# dsh-wsl-workspace

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f14cb21](https://github.com/173787247/dsh-wsl-workspace/tree/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-workspace)
<!-- END META -->

> **实现功能**：列出 WSL 发行版并检查 Linux 工作区路径，提示避开 /mnt 性能与语义陷阱。

> **核心亮点**：相对手工命令，它把发行版发现与 /mnt 卫生检查包装成模型可调用、只读且结构化的单工具；核心判断是常见 WSL 路径经验，不是新的文件系统机制。窄范围与无写副作用使它比通用部署插件更易审计。 参见[Q03](#research-q03)。

> **风险与缺陷**：路径位于 /mnt 只是性能和权限风险信号，不等于所有项目都更慢；自定义挂载、WSL2 配置、网络文件系统和跨发行版路径可能让启发式误判。只验证路径存在也不能证明 Git、文件监听、权限、大小写或构建性能符合项目需要。 参见[Q04](#research-q04)。

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
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · WSL 工作区路径检查解决什么常见准备问题？](#detail-section-11)
  - [Q02 · wsl_workspace 如何列发行版、分类路径并生成建议？](#detail-section-12)
  - [Q03 · dsh-wsl-workspace 相对简单替代的独立增量是什么？](#detail-section-13)
  - [Q04 · 路径启发式、挂载差异和不存在目录会造成哪些误导？](#detail-section-14)
  - [Q05 · dsh-wsl-workspace 启动、持续使用与失败恢复依赖什么？](#detail-section-15)
  - [Q06 · 一次合格工作区检查能减少多少排障成本？](#detail-section-16)
  - [Q07 · 纯函数分类与宿主桥的职责拆分是否可复用？](#detail-section-17)
  - [Q08 · 能否加入可解释的项目工作负载基准而非只看路径？](#detail-section-18)
  - [Q09 · dsh-wsl-workspace 适合观察、试用还是安装，停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在 WSL 中启动 DSH 项目、需要选择发行版和 Linux 工作区路径的开发者。输入是 list/check 操作及路径；合格结果是识别当前/默认发行版、确认路径存在并区分 Linux home、/mnt Windows 挂载或异常位置，给出不越权迁移建议。简单替代是手工跑 wsl.exe 和检查 pwd/mount。

参见[Q01](#research-q01)。

基线是手工执行 wsl.exe、pwd、mount 和文件检查；信息完整但需要用户知道哪些信号重要。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 发行版列表 | 显示当前、默认及可用 WSL 发行版 | 依赖 wsl.exe 输出格式 |
| 路径检查 | 判断路径存在、home 或 /mnt 类型 | 启发式不替代项目基准 |
| 迁移建议 | 提示把开发工作区放到 Linux 文件系统 | 不自动复制或修改文件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows WSL 环境 | 必需 | 提供发行版与 Linux 文件系统 | 非 WSL 返回明确不适用 |
| wsl.exe/PowerShell 标准路径 | 必需 | 列发行版和桥接命令 | 找不到或超时则无法列出 |
| 目标路径可见 | 检查必需 | 判断存在性与位置 | 不存在只给提示，不创建 |
| 项目实际工作负载 | 效果条件 | 判断路径建议是否真有价值 | 静态规则不能替代 build/watch 基准 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在 WSL profile 加载插件 | wsl_workspace 可调用 |
| 列环境 | 调用 list 获取当前/默认发行版 | 解析成功或返回可读错误 |
| 检查路径 | 调用 check 提交绝对路径 | 返回分类、存在性和建议 |
| 决策 | 用户结合项目基准决定是否迁移 | 不由插件自动搬数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 无外部服务费用 | 安装并理解路径建议 | 实际迁移不属于插件自动流程 |
| 持续使用 | 每次调用 Windows 子进程资源 | 调用和阅读结果 | 延迟未实测 |
| 失败恢复 | 错误迁移可能占磁盘/复制资源 | 迁回、核 Git/权限/监听 | 恢复取决于项目规模 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 环境发现 | 结构化列当前与默认发行版 | 复杂配置准确率未测 |
| 路径卫生 | 识别 home、/mnt 与不存在路径 | 不能直接证明性能或权限 |
| 低副作用 | 只读检查不搬数据 | 采纳建议后的迁移风险仍由用户承担 |

> **思考**：路径位于 /mnt 只是性能和权限风险信号，不等于所有项目都更慢；自定义挂载、WSL2 配置、网络文件系统和跨发行版路径可能让启发式误判。只验证路径存在也不能证明 Git、文件监听、权限、大小写或构建性能符合项目需要。 参见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对手工命令，它把发行版发现与 /mnt 卫生检查包装成模型可调用、只读且结构化的单工具；核心判断是常见 WSL 路径经验，不是新的文件系统机制。窄范围与无写副作用使它比通用部署插件更易审计。 参见[Q03](#research-q03)。

相对手工命令，它把发行版发现与 /mnt 卫生检查包装成模型可调用、只读且结构化的单工具；核心判断是常见 WSL 路径经验，不是新的文件系统机制。窄范围与无写副作用使它比通用部署插件更易审计。 参见[Q03](#research-q03)。

纯函数路径分类、发行版解析与 advice 生成和宿主命令分离，适合单测和复用；工具只读，副作用小。可借鉴之处是明确返回 not-Wsl 与结构化状态，而不是让模型解析命令文本。边界是规则仍是启发式，无法替代真实项目基准。 参见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

路径位于 /mnt 只是性能和权限风险信号，不等于所有项目都更慢；自定义挂载、WSL2 配置、网络文件系统和跨发行版路径可能让启发式误判。只验证路径存在也不能证明 Git、文件监听、权限、大小写或构建性能符合项目需要。 参见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议试用。适合在 WSL 新建或排查开发工作区前做只读检查；把结果当提示，不自动迁移。若路径是自定义挂载或项目主要访问 Windows 工具，应先做实际构建/监听基准再决定。 参见[Q04](#research-q04)、[Q06](#research-q06)与[Q09](#research-q09)。

参见[Q01](#research-q01)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认 wsl_workspace 只读列举发行版并启发式分类路径；自定义挂载准确率与不同文件系统的 build/watch 性能没有实机数据，基于基准的迁移建议仍需证伪，见[Q08](#research-q08)。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/workspace.js、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、工具入口、路径分类和 WSL 宿主桥；不运行 Windows/WSL 命令。 未运行目标插件、测试、外部服务或真实 Host；源码存在不等于运行通过。
- 下一步：先对多挂载类型建立真值表，再比较实际 build/watch；任何自动写入、把存在性误写成性能保证或自定义挂载大量误报都否定扩展采用。

**分析版本**

- **仓库**：[173787247/dsh-wsl-workspace](https://github.com/173787247/dsh-wsl-workspace)
- **版本号**：0.2.0（[固定提交 f14cb21](https://github.com/173787247/dsh-wsl-workspace/tree/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac)）
- **版本日期**：2026-10-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在用户同意后运行无破坏的微基准和语义探针，例如小文件创建/删除、大小写、文件监听与 Git status，用工作负载证据补充路径标签。它可能减少把所有 /mnt 一概判坏的误报，但基准本身会写临时文件并增加等待。 参见[Q08](#research-q08)。

先对多挂载类型建立真值表，再比较实际 build/watch；任何自动写入、把存在性误写成性能保证或自定义挂载大量误报都否定扩展采用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 98 | — | — | 559 |
| .js | source | 3 | 323 | 293 | 2 | — |
| .js | test | 1 | 65 | 60 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-workspace/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-workspace/issues?q=is%3Aissue+created%3A2026-09-22T16%3A02%3A20.261Z..2026-10-22T16%3A02%3A20.261Z)

暂未获取：近30天关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac 上判断 dsh-wsl-workspace 的核心贡献、关键质疑、采用边界及可证伪的新设计假设。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · WSL 工作区路径检查解决什么常见准备问题？

**研究主题**：场景与需求

#### 完整回答

面向在 WSL 中启动 DSH 项目、需要选择发行版和 Linux 工作区路径的开发者。输入是 list/check 操作及路径；合格结果是识别当前/默认发行版、确认路径存在并区分 Linux home、/mnt Windows 挂载或异常位置，给出不越权迁移建议。简单替代是手工跑 wsl.exe 和检查 pwd/mount。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-29](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/README.md#L26-L29)

作者限定工具位于 WSL 工作区准备环节。

```text
## Where it sits

Lists distros and checks that a Linux workspace path is not a slow /mnt mistake.

```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · wsl_workspace 如何列发行版、分类路径并生成建议？

**研究主题**：功能与机制

#### 完整回答

插件注册 wsl_workspace 工具，WSL 宿主层调用 Windows `wsl.exe --list` 等命令，workspace 模块规范化输出、解析发行版并根据 home、/mnt、存在性对路径分类，返回结构化 advice。它不创建、移动或删除工作区。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-20](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/index.js#L17-L20)

入口注册 wsl_workspace 单工具。

```text
  ctx.tools.register({
    name: "wsl_workspace",
    description:
      "List WSL distros (current vs default) or validate a Linux workspace path for DSH (/mnt hygiene).",
```

**依据 2 · 源码核查**：[lib/workspace.js:53-56](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/lib/workspace.js#L53-L56)

纯函数根据 home、/mnt 和存在性分类路径。

```text
export function classifyWorkspacePath(abs, { home = "/home/user", exists = existsSync } = {}) {
  const path = String(abs || "");
  const onMnt = path === "/mnt" || path.startsWith("/mnt/");
  let kind = "linux_other";
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · dsh-wsl-workspace 相对简单替代的独立增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对手工命令，它把发行版发现与 /mnt 卫生检查包装成模型可调用、只读且结构化的单工具；核心判断是常见 WSL 路径经验，不是新的文件系统机制。窄范围与无写副作用使它比通用部署插件更易审计。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-20](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/index.js#L17-L20)

入口注册 wsl_workspace 单工具。

```text
  ctx.tools.register({
    name: "wsl_workspace",
    description:
      "List WSL distros (current vs default) or validate a Linux workspace path for DSH (/mnt hygiene).",
```

**依据 2 · 源码核查**：[lib/workspace.js:53-56](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/lib/workspace.js#L53-L56)

纯函数根据 home、/mnt 和存在性分类路径。

```text
export function classifyWorkspacePath(abs, { home = "/home/user", exists = existsSync } = {}) {
  const path = String(abs || "");
  const onMnt = path === "/mnt" || path.startsWith("/mnt/");
  let kind = "linux_other";
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 路径启发式、挂载差异和不存在目录会造成哪些误导？

**研究主题**：缺陷与关键质疑

#### 完整回答

路径位于 /mnt 只是性能和权限风险信号，不等于所有项目都更慢；自定义挂载、WSL2 配置、网络文件系统和跨发行版路径可能让启发式误判。只验证路径存在也不能证明 Git、文件监听、权限、大小写或构建性能符合项目需要。

#### 证据与依据

**依据 1 · 源码核查**：[lib/workspace.js:53-56](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/lib/workspace.js#L53-L56)

纯函数根据 home、/mnt 和存在性分类路径。

```text
export function classifyWorkspacePath(abs, { home = "/home/user", exists = existsSync } = {}) {
  const path = String(abs || "");
  const onMnt = path === "/mnt" || path.startsWith("/mnt/");
  let kind = "linux_other";
```

**依据 2 · 作者声明**：[README.md:26-29](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/README.md#L26-L29)

作者限定工具位于 WSL 工作区准备环节。

```text
## Where it sits

Lists distros and checks that a Linux workspace path is not a slow /mnt mistake.

```

#### 缺口

- 自定义挂载、网络盘和不同 WSL 版本下路径分类的误报/漏报率
  **影响**：错误建议可能触发不必要迁移或掩盖真实性能问题
  **进一步探讨**：收集 Linux home、/mnt、自定义 drvfs、网络盘样本，与 mount 信息和实际构建/监听结果对照

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-wsl-workspace 启动、持续使用与失败恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动依赖 WSL、标准 Windows 可执行路径和 PowerShell/cmd 桥；检查依赖目标路径对 DSH 进程可见。失败恢复主要是返回不适用、命令超时或无发行版，不应自动迁移数据。若用户采纳迁移建议，复制、权限和 Git 状态核验仍由用户承担。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-20](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/index.js#L17-L20)

入口注册 wsl_workspace 单工具。

```text
  ctx.tools.register({
    name: "wsl_workspace",
    description:
      "List WSL distros (current vs default) or validate a Linux workspace path for DSH (/mnt hygiene).",
```

**依据 2 · 作者声明**：[README.md:26-29](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/README.md#L26-L29)

作者限定工具位于 WSL 工作区准备环节。

```text
## Where it sits

Lists distros and checks that a Linux workspace path is not a slow /mnt mistake.

```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 一次合格工作区检查能减少多少排障成本？

**研究主题**：效果与总成本

#### 完整回答

合格任务是给出正确发行版和对项目有用的路径建议。首次几乎只有安装与理解建议，但实际迁移可能产生大量复制和验证时间；持续检查有子进程延迟；错误建议的恢复是把项目迁回并核对 Git/权限。源码没有路径建议准确率、不同工作负载基准或迁移失败率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-29](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/README.md#L26-L29)

作者限定工具位于 WSL 工作区准备环节。

```text
## Where it sits

Lists distros and checks that a Linux workspace path is not a slow /mnt mistake.

```

**依据 2 · 源码核查**：[lib/workspace.js:53-56](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/lib/workspace.js#L53-L56)

纯函数根据 home、/mnt 和存在性分类路径。

```text
export function classifyWorkspacePath(abs, { home = "/home/user", exists = existsSync } = {}) {
  const path = String(abs || "");
  const onMnt = path === "/mnt" || path.startsWith("/mnt/");
  let kind = "linux_other";
```

#### 缺口

- 工具调用延迟、建议准确率和因建议迁移产生的复制/验证时间
  **影响**：无法给出合格任务单位成本、成功率、节时或 ROI
  **进一步探讨**：对 20 个项目路径记录检查结论、真实 Git/build/watch 行为和人工排障分钟，按合格建议计算节省

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 纯函数分类与宿主桥的职责拆分是否可复用？

**研究主题**：工程质量与复用

#### 完整回答

纯函数路径分类、发行版解析与 advice 生成和宿主命令分离，适合单测和复用；工具只读，副作用小。可借鉴之处是明确返回 not-Wsl 与结构化状态，而不是让模型解析命令文本。边界是规则仍是启发式，无法替代真实项目基准。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-20](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/index.js#L17-L20)

入口注册 wsl_workspace 单工具。

```text
  ctx.tools.register({
    name: "wsl_workspace",
    description:
      "List WSL distros (current vs default) or validate a Linux workspace path for DSH (/mnt hygiene).",
```

**依据 2 · 源码核查**：[lib/workspace.js:53-56](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/lib/workspace.js#L53-L56)

纯函数根据 home、/mnt 和存在性分类路径。

```text
export function classifyWorkspacePath(abs, { home = "/home/user", exists = existsSync } = {}) {
  const path = String(abs || "");
  const onMnt = path === "/mnt" || path.startsWith("/mnt/");
  let kind = "linux_other";
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 能否加入可解释的项目工作负载基准而非只看路径？

**研究主题**：新假设与验证

#### 完整回答

可在用户同意后运行无破坏的微基准和语义探针，例如小文件创建/删除、大小写、文件监听与 Git status，用工作负载证据补充路径标签。它可能减少把所有 /mnt 一概判坏的误报，但基准本身会写临时文件并增加等待。

#### 证据与依据

**依据 1 · 源码核查**：[lib/workspace.js:53-56](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/lib/workspace.js#L53-L56)

纯函数根据 home、/mnt 和存在性分类路径。

```text
export function classifyWorkspacePath(abs, { home = "/home/user", exists = existsSync } = {}) {
  const path = String(abs || "");
  const onMnt = path === "/mnt" || path.startsWith("/mnt/");
  let kind = "linux_other";
```

**依据 2 · 作者声明**：[README.md:26-29](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/README.md#L26-L29)

作者限定工具位于 WSL 工作区准备环节。

```text
## Where it sits

Lists distros and checks that a Linux workspace path is not a slow /mnt mistake.

```

#### 缺口

- 微基准能否比静态路径规则更准确且开销可接受
  **影响**：新方向仍是推演，不能计入插件当前贡献或效果
  **进一步探讨**：在隔离临时目录比较规则与微基准对 build/watch 异常的预测，要求准确率提升且探针低于 2 秒、无残留

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · dsh-wsl-workspace 适合观察、试用还是安装，停止条件是什么？

**研究主题**：采用判断

#### 完整回答

建议试用。适合在 WSL 新建或排查开发工作区前做只读检查；把结果当提示，不自动迁移。若路径是自定义挂载或项目主要访问 Windows 工具，应先做实际构建/监听基准再决定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-29](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/README.md#L26-L29)

作者限定工具位于 WSL 工作区准备环节。

```text
## Where it sits

Lists distros and checks that a Linux workspace path is not a slow /mnt mistake.

```

**依据 2 · 源码核查**：[lib/workspace.js:53-56](https://github.com/173787247/dsh-wsl-workspace/blob/f14cb216ecbf7551fa7fe7d81df1fb6df16e13ac/lib/workspace.js#L53-L56)

纯函数根据 home、/mnt 和存在性分类路径。

```text
export function classifyWorkspacePath(abs, { home = "/home/user", exists = existsSync } = {}) {
  const path = String(abs || "");
  const onMnt = path === "/mnt" || path.startsWith("/mnt/");
  let kind = "linux_other";
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
