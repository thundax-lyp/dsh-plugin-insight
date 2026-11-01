# TongFlow

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[07037ea](https://github.com/tong-io/tongflow/tree/07037ea1a65cd1546114b86c8dbf43b4703688be)

<!-- BEGIN META -->
[![GitHub ★ 1,049](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C049&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tong-io/tongflow)
<!-- END META -->

> **功能**：提供跨文本、图像、音频和视频的生成式工作流平台。

> **亮点**：组织多模态素材与统一执行接口；DSH 接入属于独立子组件。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：slot 可映射不保证外部供应商成功、费用或幂等；未知结果需对账。[Q03](#research-q03)

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
  - [Q01 · 模态优先为谁解决什么，与手工媒体制作相比如何？](#detail-section-11)
  - [Q02 · 统一执行如何映射节点与供应商？](#detail-section-12)
  - [Q03 · 节点可映射是否保证完成和费用可控？](#detail-section-13)
  - [Q04 · 云与自托管各有什么成本和退路？](#detail-section-14)
  - [Q05 · 如何检验任务级报价与失败补偿提示？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：制作多阶段媒体的创作者；基线是分别调用供应商并手工传递素材。[Q01](#research-q01)

分别使用媒体工具并手工交接文件。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工作流 | 串联多模态素材 | 依赖各节点 |
| 执行 | 按 slot 路由插件 | 不保证供应商成功 |
| 输出 | 转换文件引用 | 成本和质量需核对 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| TongFlow 云或自托管 | 必需 | 画布和执行 | 回原工具 |
| 插件与供应商权限 | 节点必需 | 实际生成 | 节点失败 |
| 预算和内容许可 | 试用必需 | 控制费用与数据 | 不提交 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 选择短样例及预算 | 确认供应商 |
| 运行 | 逐节点核对输出 | 失败停止 |
| 恢复 | 查询任务回执 | 未知不重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 部署或云资源 | 配置凭据 | 费用未测 |
| 持续 | 生成及存储费用未知 | 核对各步素材 | 质量未测 |
| 恢复 | 可能已计费 | 供应商对账 | 不保证退款 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 节点执行 | slot 路由与输出转换 | 实际供应商成功 |
| 素材交接 | 作者描述画布 | 真实质量与节时 |

> **思考**：slot 可映射不保证外部供应商成功、费用或幂等；未知结果需对账。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：组织多模态素材与统一执行接口；DSH 接入属于独立子组件。[Q01](#research-q01) [Q02](#research-q02)

根执行器按配置和 slot 分发，二进制输出转引用；供应商故障与费用仍需单独处理。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

slot 可映射不保证外部供应商成功、费用或幂等；未知结果需对账。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

明确预算并以短样例逐节点验证；未知结果先查询供应商。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根源码支持插件分发与输出转换；未运行供应商或 DSH。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/lib/plugin-executor/execute.ts、src/lib/plugin-executor/runners/generic.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根 inventory 468 个指定扩展名文件、无排除或错误；静态核查根执行器，不运行供应商。
- 下一步：固定平台、插件及供应商，以隔离样例核验各阶段回执和账单。

**分析版本**

- **仓库**：[tong-io/tongflow](https://github.com/tong-io/tongflow)
- **版本号**：0.3.6（[固定提交 07037ea](https://github.com/tong-io/tongflow/tree/07037ea1a65cd1546114b86c8dbf43b4703688be)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：展示节点供应商、估价和失败补偿边界可减少费用误判；需对照现有元数据。[Q05](#research-q05)

固定平台、插件及供应商，以隔离样例核验各阶段回执和账单。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 32 | 4917 | — | — | 49916 |
| .ts | source | 222 | 37570 | 30559 | 4475 | — |
| .tsx | source | 178 | 28079 | 24805 | 1234 | — |
| .ts | test | 32 | 4277 | 3714 | 258 | — |
| .mjs | source | 4 | 245 | 193 | 31 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/tong-io/tongflow/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/tong-io/tongflow/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/tong-io/tongflow/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多模态工作流如何路由供应商，统一 ABI 和实际执行的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模态优先为谁解决什么，与手工媒体制作相比如何？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需组合文字、图像、语音和视频的创作者可在工作流画布组织多阶段素材；基线是分开使用各供应商并手动传文件。作者描述输出可继续作为下一节点输入，降低交接，但不证明生成质量或节省费用；单次简单任务可能直接用供应商更简单。DSH 是独立子组件，本项研究根应用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:48-60](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/README.md#L48-L60)

作者描述媒体流程与三种使用方式。

<details>
<summary>查看原文（13行）</summary>

```text
## Demo Examples

| Workflow | Result |
| :--: | :--: |
| **Basic** — Type text (Add), generate images (Transform), then blend them into one (Combine).<br/><img src="https://file.tongflow.com/public/demos/basic.png" width="620" alt="workflow" /> | <img src="https://file.tongflow.com/public/demos/basic_result.png" width="200" alt="result" /> |
| **Intermediate** — (Add topic → write script → generate speech) + (character description → generate image) → lip-synced video = talking-head avatar.<br/><img src="https://file.tongflow.com/public/demos/digitalhuman.png" width="620" alt="workflow" /> | <video src="https://github.com/user-attachments/assets/a803394d-0ccf-4023-9b06-5c1581345758" width="200"></video> |
| **Advanced** — Generate lyrics + song + characters + scenes + storyboard → produce a music video.<br/><img src="https://file.tongflow.com/public/demos/mv.png" width="620" alt="workflow" /> | <video src="https://github.com/user-attachments/assets/2bc71e3c-3ed6-48b2-81e7-82ad5976d801" width="200"></video> |

Every output stays on the canvas as a material: branch from a generated image, feed a transcript into the next step, or swap the model behind one node and keep the rest of the workflow.

## How To Start

There are three ways to use TongFlow, all sharing the same open-source core: **TongFlow Cloud** (the desktop app or [app.tongflow.com](https://app.tongflow.com) in a browser), **self-host** ([from source](#run-from-source) or [with Docker](#run-with-docker)), or **build with an agent** (the [`tongflow` npm package](packages/tongflow/README.md) or TongFlow [inside Claude Code, any MCP client or dsh](#use-it-inside-an-agent)).
```

</details>

**依据 2 · 源码核查**：[package.json:1-5](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/package.json#L1-L5)

应用身份和用途。

```text
{
    "name": "tongflow-app",
    "version": "0.3.6",
    "description": "TongFlow — the open-source Modality-First GenAI Platform: AI workflows across text, image, audio, video and 3D",
    "author": "tong-io",
```

#### 缺口

- 未运行 TongFlow、供应商或 DSH
  **影响**：不能证明图执行、模型输出和成本
  **进一步探讨**：固定平台与供应商，在隔离样例验证提交、输出和失败

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 统一执行如何映射节点与供应商？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根执行器先按 pluginId 取得配置，再调用通用 runner，输出中按节点 schema 将二进制 Asset 转 FileRef；runner 依据 nodeSlot 找对应方法，缺失即报错，构造参数后启动插件自己的 Python 入口。统一接口简化路由，但本地或远端实际工作由插件决定，格式可映射不等于提供商任务成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/plugin-executor/execute.ts:8-28](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/src/lib/plugin-executor/execute.ts#L8-L28)

配置检查、通用执行与输出转换。

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

**依据 2 · 源码核查**：[src/lib/plugin-executor/runners/generic.ts:31-60](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/src/lib/plugin-executor/runners/generic.ts#L31-L60)

slot 查找、参数及 Python 入口。

<details>
<summary>查看原文（30行）</summary>

```text
export async function execPlugin<S extends NodeSlot>(
    req: PluginExecRequest<S>,
): Promise<PluginExecResult<S>> {
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

#### 缺口

- 未运行 TongFlow、供应商或 DSH
  **影响**：不能证明图执行、模型输出和成本
  **进一步探讨**：固定平台与供应商，在隔离样例验证提交、输出和失败

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 节点可映射是否保证完成和费用可控？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

否。缺插件或 slot 会直接报错，而执行还依赖各插件进程、凭据、供应商和网络；生成任务可能异步失败或产生费用。代码的通用分发只说明调用形状，不提供所有供应商结果一致、幂等或退款保证；遇到未知结果应先查提供商回执，不能盲目重新提交。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/plugin-executor/execute.ts:8-18](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/src/lib/plugin-executor/execute.ts#L8-L18)

未知插件拒绝及委托执行。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/lib/plugin-executor/runners/generic.ts:31-60](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/src/lib/plugin-executor/runners/generic.ts#L31-L60)

缺 slot 拒绝及本地/远端入口。

<details>
<summary>查看原文（30行）</summary>

```text
export async function execPlugin<S extends NodeSlot>(
    req: PluginExecRequest<S>,
): Promise<PluginExecResult<S>> {
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

**依据 3 · 作者声明**：[README.md:58-62](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/README.md#L58-L62)

作者区分云与自托管。

```text
## How To Start

There are three ways to use TongFlow, all sharing the same open-source core: **TongFlow Cloud** (the desktop app or [app.tongflow.com](https://app.tongflow.com) in a browser), **self-host** ([from source](#run-from-source) or [with Docker](#run-with-docker)), or **build with an agent** (the [`tongflow` npm package](packages/tongflow/README.md) or TongFlow [inside Claude Code, any MCP client or dsh](#use-it-inside-an-agent)).

The TongFlow **desktop app** is a lightweight (~10 MB) shell around the cloud studio at **[app.tongflow.com](https://app.tongflow.com)** — install it, sign in, and start creating. The cloud studio also runs in any modern browser.
```

#### 缺口

- 未运行 TongFlow、供应商或 DSH
  **影响**：不能证明图执行、模型输出和成本
  **进一步探讨**：固定平台与供应商，在隔离样例验证提交、输出和失败

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 云与自托管各有什么成本和退路？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

云端需账号及服务可用，自托管需环境、插件和供应商凭据；文本、图像和视频调用可能有不同资源及费用。先用非敏感短样例核对节点来源、预算与每步输出，失败或费用异常时停止并回到既有工具。作者展示示例和价格并非本轮报价或成功证据，模型、存储和人工核验成本未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:48-62](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/README.md#L48-L62)

作者描述示例、云及自托管。

<details>
<summary>查看原文（15行）</summary>

```text
## Demo Examples

| Workflow | Result |
| :--: | :--: |
| **Basic** — Type text (Add), generate images (Transform), then blend them into one (Combine).<br/><img src="https://file.tongflow.com/public/demos/basic.png" width="620" alt="workflow" /> | <img src="https://file.tongflow.com/public/demos/basic_result.png" width="200" alt="result" /> |
| **Intermediate** — (Add topic → write script → generate speech) + (character description → generate image) → lip-synced video = talking-head avatar.<br/><img src="https://file.tongflow.com/public/demos/digitalhuman.png" width="620" alt="workflow" /> | <video src="https://github.com/user-attachments/assets/a803394d-0ccf-4023-9b06-5c1581345758" width="200"></video> |
| **Advanced** — Generate lyrics + song + characters + scenes + storyboard → produce a music video.<br/><img src="https://file.tongflow.com/public/demos/mv.png" width="620" alt="workflow" /> | <video src="https://github.com/user-attachments/assets/2bc71e3c-3ed6-48b2-81e7-82ad5976d801" width="200"></video> |

Every output stays on the canvas as a material: branch from a generated image, feed a transcript into the next step, or swap the model behind one node and keep the rest of the workflow.

## How To Start

There are three ways to use TongFlow, all sharing the same open-source core: **TongFlow Cloud** (the desktop app or [app.tongflow.com](https://app.tongflow.com) in a browser), **self-host** ([from source](#run-from-source) or [with Docker](#run-with-docker)), or **build with an agent** (the [`tongflow` npm package](packages/tongflow/README.md) or TongFlow [inside Claude Code, any MCP client or dsh](#use-it-inside-an-agent)).

The TongFlow **desktop app** is a lightweight (~10 MB) shell around the cloud studio at **[app.tongflow.com](https://app.tongflow.com)** — install it, sign in, and start creating. The cloud studio also runs in any modern browser.
```

</details>

**依据 2 · 源码核查**：[src/lib/plugin-executor/runners/generic.ts:53-60](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/src/lib/plugin-executor/runners/generic.ts#L53-L60)

插件运行环境。

```text
    const pluginDir = join(pluginsDir(), cfg.localSubdir);
    // Every plugin ships its own local entry.py (`python entry.py`). For a
    // deploy-first plugin (needsDeploy) that entry.py is a thin bridge that
    // deploys once and invokes the remote backend.
    const entryArgs = [cfg.entryFile || "entry.py"];
    // Provision the shared plugin venv (SDK + this plugin's requirements.txt)
    // and run the entry with it. Falls back to a bare interpreter on failure.
    const python = await ensurePluginPython(req.pluginId, pluginDir);
```

#### 缺口

- 未运行 TongFlow、供应商或 DSH
  **影响**：不能证明图执行、模型输出和成本
  **进一步探讨**：固定平台与供应商，在隔离样例验证提交、输出和失败

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验任务级报价与失败补偿提示？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：执行前对每个节点显示实际供应商、估算费用和失败/退款未知项，可能减少多阶段任务的费用误判。现有 pluginId、slot 和输出转换是反证，说明已有执行元数据但不是准确账单；报价会变化且不能保证退款。对照现有工作流，用成功、超时和部分完成样本测账单偏差、重复提交、任务时间及展示误导；无改善则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/plugin-executor/execute.ts:8-28](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/src/lib/plugin-executor/execute.ts#L8-L28)

已有 pluginId 与输出转换。

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

**依据 2 · 源码核查**：[src/lib/plugin-executor/runners/generic.ts:31-60](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/src/lib/plugin-executor/runners/generic.ts#L31-L60)

已有 slot 与执行入口。

<details>
<summary>查看原文（30行）</summary>

```text
export async function execPlugin<S extends NodeSlot>(
    req: PluginExecRequest<S>,
): Promise<PluginExecResult<S>> {
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

#### 缺口

- 未运行 TongFlow、供应商或 DSH
  **影响**：不能证明图执行、模型输出和成本
  **进一步探讨**：固定平台与供应商，在隔离样例验证提交、输出和失败

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
