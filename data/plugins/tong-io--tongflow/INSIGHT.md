# TongFlow

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[0087122](https://github.com/tong-io/tongflow/tree/0087122f5900073dfbdb0e7a1e2ff497245e1f21)

<!-- BEGIN META -->
[![GitHub ★ 1,046](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C046&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tong-io/tongflow)
<!-- END META -->

> **功能**：以模态和能力组织多媒体节点，提供可视化工作流及多种模型插件的执行入口。

> **亮点**：将材料、能力与供应商分开，使周围工作流有机会在替换插件后继续使用，并统一资产落位；属于多模态工作流集成贡献，未证首创。[Q01](#research-q01) [Q04](#research-q04)

> **主要限制**：合法图不代表外部任务可成功或可撤销；本地取消未证明远端终止，重复重跑可能增加费用。[Q02](#research-q02)

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
  - [Q01 · 模态优先如何改善多阶段媒体制作，何时不值得使用？](#detail-section-11)
  - [Q02 · 图的ABI合法能保证供应商任务成功吗？](#detail-section-12)
  - [Q03 · 自托管和云端使用分别有什么接入与恢复负担？](#detail-section-13)
  - [Q04 · 统一ABI执行有哪些值得借鉴的设计及维护代价？](#detail-section-14)
  - [Q05 · 可否在执行前为相同slot提供任务级报价与失败补偿说明？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合把图像、音频和视频分阶段组合的创作者，交付可编辑工作流及媒体资产。

简单替代是供应商网页加人工文件传递或一个固定Python脚本；跨模态多轮修改才更可能体现图结构价值。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模态画布与图导出 | 组织多阶段媒体处理 | 节点存在不表示已安装实现 |
| 插件执行 | 按ABI slot调用Python入口 | 依赖插件环境和外部服务 |
| 资产文件引用 | 统一保存媒体结果 | 不保证外部任务幂等 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Docker或源码运行环境 | 自托管必需 | Web服务与本地存储 | 云端界面是另一使用路线 |
| GitHub、PyPI网络 | 安装插件必需 | 插件与Python依赖 | 首次运行可被网络阻塞 |
| 供应商密钥或Modal账户 | 相应能力必需 | 外部模型及GPU执行 | ABI合法仍无法生成 |
| 持久卷和凭据备份 | 持续使用必需 | SQLite、上传和设置 | 容器重建可能丢失未挂载状态 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户固定镜像或源码部署并挂载数据 | 本机登录链接可用；不暴露未核查服务 |
| 2 | 用户安装最少插件并配置密钥 | registry可找到所选slot |
| 3 | 用户从单节点到多节点验证 | 保存产物并核对远端状态后重跑 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 镜像、依赖和插件下载 | 部署、凭据和卷配置 | 安装耗时未知 |
| 持续使用 | 供应商API、GPU和存储 | 选模型及人工审核媒体 | 云端费用和同任务用量未核实 |
| 失败恢复 | 远端任务可能继续计费 | 对账、恢复文件与选择性重跑 | 取消不保证远端撤销 |
| 退出迁移 | 备份及传输文件 | 导出图和凭据清理 | 跨工具完整迁移未测 |

作者在README给出示例服务额度，本文不将该声明作为当前可得价格或预算估值。建议已有多阶段制作任务者先在本地副本限制插件范围，若只是单次生成、不能维护持久卷或无法核清取消后的费用，继续用现有供应商界面。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 替换实现 | ABI与pluginId分离 | 各模型语义和质量等价 |
| 统一产物 | 执行后转换文件引用 | 跨工具完整迁移 |
| 工作效率 | 可减少手工串联的机制 | 合格任务节时与费用 |

> **思考**：合法图不代表外部任务可成功或可撤销；本地取消未证明远端终止，重复重跑可能增加费用。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将材料、能力与供应商分开，使周围工作流有机会在替换插件后继续使用，并统一资产落位；属于多模态工作流集成贡献，未证首创。[Q01](#research-q01) [Q04](#research-q04)

执行器将能力契约、供应商入口、资产存储分离。输出统一转换为file_key引用，避免每个插件自行实现应用层文件管理；runner把stderr进度和诊断分开，stdout保留给单个JSON响应，有助于定位长任务卡在哪一步。

复用需要同时维护ABI、SDK生成类型、插件methodsByNodeSlot和画布节点的一致性。通用Python执行仍继承宿主权限与配置凭据，不是沙箱。其可迁移价值在接口和诊断协议，而非把任意Python插件当成可靠能力。

<a id="detail-section-5"></a>

### 1.4 主要限制

合法图不代表外部任务可成功或可撤销；本地取消未证明远端终止，重复重跑可能增加费用。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

已有多阶段媒体任务者可在本地副本先试一个slot和最少插件，限制账户额度并记录远端任务状态；若单次生成已足够，或不能承担持久卷和失败对账，继续现有供应商界面。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查ABI导出和通用插件执行；媒体质量、效率与远端取消未验证；任务报价预检为新假设。

- 已检查：作者 README、包清单、源码路径 README.md、src/lib/plugin-executor/execute.ts、src/lib/plugin-executor/runners/generic.ts、packages/tongflow/src/core/workflow/exporter.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查根项目定位、ABI导出及Web通用runner，不代表完整审计云端部署、每个插件或供应商。
- 下一步：以同一图像slot和输入对照两实现，记录配置失败、取消后的远端状态及合格产物总成本。

**分析版本**

- **仓库**：[tong-io/tongflow](https://github.com/tong-io/tongflow)
- **版本号**：0.3.6（[固定提交 0087122](https://github.com/tong-io/tongflow/tree/0087122f5900073dfbdb0e7a1e2ff497245e1f21)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在slot选择中加入同输入的凭据、报价与恢复能力预检，检验是否降低配置失败和重复账单；尚未实现或验证。[Q05](#research-q05)

以同一图像slot和输入对照两实现，记录配置失败、取消后的远端状态及合格产物总成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 32 | 4907 | — | — | 49766 |
| .ts | source | 222 | 37570 | 30559 | 4475 | — |
| .tsx | source | 178 | 28079 | 24805 | 1234 | — |
| .ts | test | 32 | 4277 | 3714 | 258 | — |
| .mjs | source | 4 | 245 | 193 | 31 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/tong-io/tongflow/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：模态优先画布是否能降低多供应商媒体制作的组织负担，其执行与恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模态优先如何改善多阶段媒体制作，何时不值得使用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是需要将文本、图像、音频和视频反复串接的创作者。合格结果是能重开和修改的工作流以及各阶段媒体文件。相较在多个供应商网页间复制结果，TongFlow先选材料和操作，再选实现；共同ABI让周围图结构不必随供应商全部重写。

这是对成熟节点式工作流的具体多模态组织与集成贡献，材料不足以称首创。单一供应商一次出图或简单脚本就能办结的任务，不一定值得承担画布与插件配置。作者列出的能力矩阵还区分可用官方插件与仅有节点的计划项，不能把全部节点当作当前可交付能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:83-103](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/README.md#L83-L103)

模态、能力、实现分开，输出可再使用。

<details>
<summary>查看原文（21行）</summary>

```text
Sign in with Google or WeChat and start creating — the cloud studio manages plugins and execution for you.

> **Prefer a fully local, account-free TongFlow?** That's what self-hosting is for — see [Run from source](#run-from-source) or [Run with Docker](#run-with-docker), then follow [Self-host setup](#self-host-setup-plugins--credentials). (The desktop app up to v0.1.13 bundled this local runtime; those installers remain on the [Releases](https://github.com/tong-io/tongflow/releases) page.)

## Modality-First

A modality is a form of information: text, image, audio, video, 3D, document, URL. TongFlow makes these the building blocks of a workflow. Decide what you want to do with them, then choose the model for the job. Every step is three separate decisions:

| | Question | Examples |
| :-- | :-- | :-- |
| **Material** | What do you have? | A document, a photo, a recording, an idea. |
| **Capability** | What could it become? | Understand, generate, transform, combine or split. |
| **Implementation** | What should run it? | A compatible plugin and the model it provides. |

- **Every result is a new beginning.** Materials have their own nodes. An uploaded image and a generated image can both feed the next compatible operation. Branch out from a result instead of starting over.
- **Choose a capability, then a model.** A workflow records what a step does separately from the plugin that runs it. Switch compatible implementations while keeping the surrounding structure.
- **Four operations.** Add, transform, combine, split & batch. Understanding, generating and processing fit into the same system; generation is one kind of operation.
- **A shared structure for people and agents.** The canvas, exporter and agent tools use the same node registry. Build visually or through the `tongflow` package; inside Claude Code, an MCP client or dsh, an agent creates workflows you can open, edit and run again.
- **Open ecosystem.** The ABI defines each capability's input/output contract independent of who implements it. Any platform can publish plugins the same way, and the official plugins below cover nearly every node in the matrix.

Read more: [Why TongFlow starts with modalities](https://www.tongflow.com/en/blog/tongflow-why-modality-first).
```

</details>

**依据 2 · 作者声明**：[README.md:105-109](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/README.md#L105-L109)

节点存在与官方插件可用被作者明确区分。

```text
## Capabilities

Every node below is a capability from the ABI, grouped by the four operations. Materials (text, image, audio, video, 3D, document, URL) are the nodes that connect them.

> ✅ = available out of the box with an official plugin · ⬜ = node exists in the canvas but has no official plugin yet (planned).
```

**依据 3 · 作者声明**：[README.md:369-373](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/README.md#L369-L373)

ABI与实现的职责分离。

```text
## Custom plugins

Every runnable node is a **capability** backed by a contract — the ABI ([`packages/tongflow/abi/tongflow.abi.json`](packages/tongflow/abi/tongflow.abi.json)) — that defines *what capabilities exist* and *what each one's input/output looks like*, independent of *who* implements it. A plugin is the **implementation**: a small Python package that picks one or more ABI slots and supplies the **how**, annotated against the ABI-generated types via the tongflow Python SDK. Swapping the plugin behind a node leaves the workflow around it unchanged.

The full development flow — the ABI, the `@node_slot` decorator, the SDK, directory layout, and how to publish — lives in **[docs/plugins.md](docs/plugins.md)**.
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 图的ABI合法能保证供应商任务成功吗？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

不能。导出层从静态节点类型取得ABI spec，使用边与handle把画布转换为可执行结构；服务器按pluginId确认配置，再交给统一Python runner。runner会确认插件实现该slot、准备环境、向entry.py发送包含taskId和输入的JSON，二进制输出再统一转为文件引用。

ABI减少结构错接，却不验证供应商当前授权、输出质量或账单。取消只向本地child发kill，并拒绝当前Promise；外部API或Modal任务是否同步取消没有在这段代码中得到证明。故取消后应核对供应商状态，不能直接重复提交同一付费任务。

#### 证据与依据

**依据 1 · 源码核查**：[packages/tongflow/src/core/workflow/exporter.ts:27-38](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/tongflow/src/core/workflow/exporter.ts#L27-L38)

导出从节点静态registry解析ABI。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * Resolve a node's ABI spec from the static node-type registry. Returns the
 * feature/sourceSpec + resolved spec, or undefined if the node type isn't
 * ABI-driven.
 */
function getNodeSpec(
    node: Pick<Node, "type">,
): { abi: AbiNodeSpec; spec: ResolvedSpec } | undefined {
    const abi = abiSpecForNodeType(node.type);
    if (!abi) return undefined;
    return { abi, spec: resolveSpec(abi.feature, abi.sourceSpec) };
}
```

</details>

**依据 2 · 源码核查**：[src/lib/plugin-executor/execute.ts:8-28](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/src/lib/plugin-executor/execute.ts#L8-L28)

统一执行与文件引用转换。

<details>
<summary>查看原文（21行）</summary>

```text
export async function executePlugin<S extends NodeSlot = NodeSlot>(
    req: PluginExecRequest<S>,
): Promise<PluginExecResult<S>> {
    const cfg = getPluginConfig(req.pluginId);
    if (!cfg) throw new Error(`Unknown plugin: ${req.pluginId}`);

    // One generic runner for every plugin: spawn the plugin's local entry and
    // exchange ABI JSON. Where the work actually runs (local, Modal, another
    // cloud) is the plugin's own concern.
    const { execPlugin } = await import("./runners/generic");
    const raw = await execPlugin(req);

    // Persist any binary `Asset` outputs into `{file_key}` refs, uniformly for
    // every plugin. ABI-driven (walks the slot's output schema for
    // `$ref:FileRef`); a no-op for slots with no FileRef fields.
    const converted = await convertAssetOutputsToFileRefs(
        req.nodeSlot,
        raw,
        req.taskId,
    );
    return converted as PluginExecResult<S>;
```

</details>

**依据 3 · 源码核查**：[src/lib/plugin-executor/runners/generic.ts:34-60](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/src/lib/plugin-executor/runners/generic.ts#L34-L60)

slot检查、入口和Python环境准备。

<details>
<summary>查看原文（27行）</summary>

```text
    const cfg = getPluginConfig(req.pluginId);
    if (!cfg) throw new Error(`Unknown plugin: ${req.pluginId}`);

    const method = cfg.methodsByNodeSlot[req.nodeSlot];
    if (!method) {
        throw new Error(
            `Plugin ${req.pluginId} does not implement nodeSlot=${req.nodeSlot}`,
        );
    }

    const business = req.input as unknown as Record<string, unknown>;
    // Advanced params ride inside the prompt under a reserved key (like the
    // cloud `_tongflow` callback): every entry.py forwards the prompt verbatim
    // and `@node_slot` pops `_params` out before building the typed input.
    const prompt =
        req.params && Object.keys(req.params).length > 0
            ? { ...business, _params: req.params }
            : business;

    const pluginDir = join(pluginsDir(), cfg.localSubdir);
    // Every plugin ships its own local entry.py (`python entry.py`). For a
    // deploy-first plugin (needsDeploy) that entry.py is a thin bridge that
    // deploys once and invokes the remote backend.
    const entryArgs = [cfg.entryFile || "entry.py"];
    // Provision the shared plugin venv (SDK + this plugin's requirements.txt)
    // and run the entry with it. Falls back to a bare interpreter on failure.
    const python = await ensurePluginPython(req.pluginId, pluginDir);
```

</details>

**依据 4 · 源码核查**：[src/lib/plugin-executor/runners/generic.ts:82-98](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/src/lib/plugin-executor/runners/generic.ts#L82-L98)

请求封装并启动Python进程。

<details>
<summary>查看原文（17行）</summary>

```text
    const payload = {
        pluginId: req.pluginId,
        nodeSlot: req.nodeSlot,
        taskId: req.taskId,
        // Optional per-node model choice for router-style plugins; omitted
        // when unset so the envelope stays stable for existing plugins.
        ...(req.model ? { model: req.model } : {}),
        prompt,
    };

    return await new Promise<PluginExecResult<S>>((resolve, reject) => {
        const child = spawn(python, entryArgs, {
            cwd: pluginDir,
            env: pythonEnv,
            windowsHide: true,
            stdio: ["pipe", "pipe", "pipe"],
        });
```

</details>

**依据 5 · 源码核查**：[src/lib/plugin-executor/runners/generic.ts:126-145](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/src/lib/plugin-executor/runners/generic.ts#L126-L145)

取消针对本地进程，未显示远端补偿。

<details>
<summary>查看原文（20行）</summary>

```text
        const fail = (err: unknown) => {
            try {
                child.kill();
            } catch {
                // ignore
            }
            reject(err);
        };

        req.signal.addEventListener(
            "abort",
            () => {
                try {
                    child.kill();
                } catch {
                    // ignore
                }
                reject(new Error("Task cancelled"));
            },
            { once: true },
```

</details>

#### 缺口

- 未跟踪每个插件的远端取消、幂等与计费语义。
  **影响**：无法将图取消解释为供应商任务撤销。
  **进一步探讨**：以有任务ID的低预算工作流比较取消后远端状态和账单，并检查再次提交是否去重。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自托管和云端使用分别有什么接入与恢复负担？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Docker或源码运行环境 | 自托管必需 | Web服务与本地存储 | 云端界面是另一使用路线 |
| GitHub、PyPI网络 | 安装插件必需 | 插件与Python依赖 | 首次运行可被网络阻塞 |
| 供应商密钥或Modal账户 | 相应能力必需 | 外部模型及GPU执行 | ABI合法仍无法生成 |
| 持久卷和凭据备份 | 持续使用必需 | SQLite、上传和设置 | 容器重建可能丢失未挂载状态 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户固定镜像或源码部署并挂载数据 | 本机登录链接可用；不暴露未核查服务 |
| 2 | 用户安装最少插件并配置密钥 | registry可找到所选slot |
| 3 | 用户从单节点到多节点验证 | 保存产物并核对远端状态后重跑 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 镜像、依赖和插件下载 | 部署、凭据和卷配置 | 安装耗时未知 |
| 持续使用 | 供应商API、GPU和存储 | 选模型及人工审核媒体 | 云端费用和同任务用量未核实 |
| 失败恢复 | 远端任务可能继续计费 | 对账、恢复文件与选择性重跑 | 取消不保证远端撤销 |
| 退出迁移 | 备份及传输文件 | 导出图和凭据清理 | 跨工具完整迁移未测 |

作者在README给出示例服务额度，本文不将该声明作为当前可得价格或预算估值。建议已有多阶段制作任务者先在本地副本限制插件范围，若只是单次生成、不能维护持久卷或无法核清取消后的费用，继续用现有供应商界面。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:285-305](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/README.md#L285-L305)

Docker路线、持久卷、插件首次联网准备。

<details>
<summary>查看原文（21行）</summary>

````text
## Run with Docker

A self-host image is published to GHCR — no Node/Python/pnpm setup required:

```bash
docker run -d -p 127.0.0.1:3000:3000 \
  -v tongflow-data:/data -v tongflow-plugins:/plugins \
  ghcr.io/tong-io/tongflow:latest
```

The container prints a login link (`http://localhost:3000/?token=…`) to its logs — open it once (`docker logs <container>`); the token is generated into the data volume, or set your own with `-e TONGFLOW_AUTH_TOKEN=…`. Or with Compose (clones this repo's [`docker-compose.yml`](docker-compose.yml)):

```bash
docker compose up -d
```

To build the image yourself instead of pulling: `docker build -t tongflow .`

**Data & credentials.** Everything writable lives in the `/data` volume (SQLite db, uploads, settings). API keys are optional — set them in the in-app **Settings** dialog, or pass them at launch (`-e OPENROUTER_API_KEY=…`); supported keys: `OPENROUTER_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `MODAL_TOKEN_ID` / `MODAL_TOKEN_SECRET`.

**Plugins.** The image ships no plugins — install them from the in-app plugin manager (first install needs network access to GitHub). On first run, a plugin provisions a shared Python venv under `/data/.tongflow/plugin-venv` (installs the SDK + the plugin's `requirements.txt` from PyPI), so the first run is slower and needs network. Modal-backed plugins additionally need a Modal token.
````

</details>

**依据 2 · 作者声明**：[README.md:307-333](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/README.md#L307-L333)

用户自行安装插件和配置环境变量。

<details>
<summary>查看原文（27行）</summary>

```text
## Self-host setup (plugins & credentials)

A self-hosted TongFlow ships with no plugins pre-installed, and the canvas is preloaded with an example workflow. Three steps get it running:

### 1 — Install plugins

Open the **plugin manager** (the blocks icon, top-right) and install what you need. Newly installed plugins are usable immediately, no restart.

To run the preloaded **example workflow** (text → image → fusion → video), install these three plugins:

- [tongflow-modal-z-image](https://github.com/tong-io/tongflow-modal-z-image) — text-to-image
- [tongflow-modal-qwen-image-edit](https://github.com/tong-io/tongflow-modal-qwen-image-edit) — image fusion / blending
- [tongflow-modal-minimax-h3](https://github.com/tong-io/tongflow-modal-minimax-h3) — image-to-video

These run on [Modal](https://modal.com) (up to **$30/month** of free GPU compute). Add `MODAL_TOKEN_ID` / `MODAL_TOKEN_SECRET` in **Settings**; create a token at [modal.com/settings/tokens](https://modal.com/settings/tokens). Any other platform can publish its own plugins the same way.

Browse the full catalog — the official API plugins (OpenAI / Gemini / OpenRouter) and other GPU/CPU plugins — in the plugin manager.

### 2 — Configure credentials

Open **Settings** (the gear icon, top-right) and add the environment variables your plugins need — e.g. `OPENAI_API_KEY` for the API plugins, or the credentials your GPU/CPU plugins require.

> **Plugin credentials live in Settings.** TongFlow is platform-agnostic and hardcodes no provider: the Settings dialog is a generic key/value editor for environment variables passed to plugins. Each plugin's README documents the keys it needs. Values are stored locally and take effect without a restart.

### 3 — Run the example workflow

Run the preloaded example node by node, or switch to Execute Mode and hit the run button to run the whole thing in one click.
```

</details>

**依据 3 · 源码核查**：[src/lib/plugin-executor/runners/generic.ts:126-145](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/src/lib/plugin-executor/runners/generic.ts#L126-L145)

本地取消边界影响恢复成本。

<details>
<summary>查看原文（20行）</summary>

```text
        const fail = (err: unknown) => {
            try {
                child.kill();
            } catch {
                // ignore
            }
            reject(err);
        };

        req.signal.addEventListener(
            "abort",
            () => {
                try {
                    child.kill();
                } catch {
                    // ignore
                }
                reject(new Error("Task cancelled"));
            },
            { once: true },
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 统一ABI执行有哪些值得借鉴的设计及维护代价？

**研究主题**：工程质量与复用

#### 完整回答

执行器将能力契约、供应商入口、资产存储分离。输出统一转换为file_key引用，避免每个插件自行实现应用层文件管理；runner把stderr进度和诊断分开，stdout保留给单个JSON响应，有助于定位长任务卡在哪一步。

复用需要同时维护ABI、SDK生成类型、插件methodsByNodeSlot和画布节点的一致性。通用Python执行仍继承宿主权限与配置凭据，不是沙箱。其可迁移价值在接口和诊断协议，而非把任意Python插件当成可靠能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/plugin-executor/execute.ts:14-27](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/src/lib/plugin-executor/execute.ts#L14-L27)

执行与资产落位职责分离。

<details>
<summary>查看原文（14行）</summary>

```text
    // One generic runner for every plugin: spawn the plugin's local entry and
    // exchange ABI JSON. Where the work actually runs (local, Modal, another
    // cloud) is the plugin's own concern.
    const { execPlugin } = await import("./runners/generic");
    const raw = await execPlugin(req);

    // Persist any binary `Asset` outputs into `{file_key}` refs, uniformly for
    // every plugin. ABI-driven (walks the slot's output schema for
    // `$ref:FileRef`); a no-op for slots with no FileRef fields.
    const converted = await convertAssetOutputsToFileRefs(
        req.nodeSlot,
        raw,
        req.taskId,
    );
```

</details>

**依据 2 · 源码核查**：[src/lib/plugin-executor/runners/generic.ts:106-123](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/src/lib/plugin-executor/runners/generic.ts#L106-L123)

stderr区分进度与普通日志。

<details>
<summary>查看原文（18行）</summary>

```text
        const handleStderrLine = (line: string) => {
            const progress = parseProgressLine(line);
            if (progress) {
                notifyTask(req.taskId, TaskStatus.RUNNING, {
                    message: progress.message,
                    ...(progress.percent != null
                        ? { percent: progress.percent }
                        : {}),
                    ...(progress.thinking ? { thinking: true } : {}),
                });
                return;
            }
            // Ordinary log line: keep for crash diagnostics and forward to the
            // server terminal in real time.
            stderrText += `${line}\n`;
            process.stderr.write(
                `[plugin:${req.pluginId}/${req.nodeSlot}] ${line}\n`,
            );
```

</details>

**依据 3 · 源码核查**：[src/lib/plugin-executor/runners/generic.ts:148-165](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/src/lib/plugin-executor/runners/generic.ts#L148-L165)

stdout和stderr流分离。

<details>
<summary>查看原文（18行）</summary>

```text
        child.stdout?.on("data", (b: Buffer) => {
            stdoutBuf += String(b);
        });

        // Stderr carries two interleaved streams: sentinel-framed progress
        // lines (-> notifyTask) and ordinary logs (forwarded to the terminal +
        // kept for crash diagnostics). Buffer by line to split them. Stdout
        // stays reserved for the single ABI-JSON response.
        child.stderr?.on("data", (b: Buffer) => {
            stderrLineBuf += String(b);
            let nl = stderrLineBuf.indexOf("\n");
            while (nl !== -1) {
                const line = stderrLineBuf.slice(0, nl);
                stderrLineBuf = stderrLineBuf.slice(nl + 1);
                handleStderrLine(line);
                nl = stderrLineBuf.indexOf("\n");
            }
        });
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可否在执行前为相同slot提供任务级报价与失败补偿说明？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是在现有slot匹配之上增加一次执行前预检，按当前输入列出供应商必需凭据、可用模型、价格来源日期、远端取消能力和幂等键支持。用户选择实现时比较同一任务的预计费用与恢复责任，而不只看节点能否连线。

推导来自Q02中结构可匹配却不能保证外部任务可撤销，以及Q03中首次配置与恢复成本。最小实验只取一个图像slot和两种实现，对照现有选择器与预检版的配置失败率、重复账单和人工处理时间。若报价经常失真或预检开销超过减少的失败，应只保留可证实的凭据与恢复信息。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/plugin-executor/runners/generic.ts:34-60](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/src/lib/plugin-executor/runners/generic.ts#L34-L60)

当前执行前有slot和环境准备检查。

<details>
<summary>查看原文（27行）</summary>

```text
    const cfg = getPluginConfig(req.pluginId);
    if (!cfg) throw new Error(`Unknown plugin: ${req.pluginId}`);

    const method = cfg.methodsByNodeSlot[req.nodeSlot];
    if (!method) {
        throw new Error(
            `Plugin ${req.pluginId} does not implement nodeSlot=${req.nodeSlot}`,
        );
    }

    const business = req.input as unknown as Record<string, unknown>;
    // Advanced params ride inside the prompt under a reserved key (like the
    // cloud `_tongflow` callback): every entry.py forwards the prompt verbatim
    // and `@node_slot` pops `_params` out before building the typed input.
    const prompt =
        req.params && Object.keys(req.params).length > 0
            ? { ...business, _params: req.params }
            : business;

    const pluginDir = join(pluginsDir(), cfg.localSubdir);
    // Every plugin ships its own local entry.py (`python entry.py`). For a
    // deploy-first plugin (needsDeploy) that entry.py is a thin bridge that
    // deploys once and invokes the remote backend.
    const entryArgs = [cfg.entryFile || "entry.py"];
    // Provision the shared plugin venv (SDK + this plugin's requirements.txt)
    // and run the entry with it. Falls back to a bare interpreter on failure.
    const python = await ensurePluginPython(req.pluginId, pluginDir);
```

</details>

**依据 2 · 源码核查**：[src/lib/plugin-executor/runners/generic.ts:126-145](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/src/lib/plugin-executor/runners/generic.ts#L126-L145)

取消边界是预检应披露的恢复条件。

<details>
<summary>查看原文（20行）</summary>

```text
        const fail = (err: unknown) => {
            try {
                child.kill();
            } catch {
                // ignore
            }
            reject(err);
        };

        req.signal.addEventListener(
            "abort",
            () => {
                try {
                    child.kill();
                } catch {
                    // ignore
                }
                reject(new Error("Task cancelled"));
            },
            { once: true },
```

</details>

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
