# DSH Qwen Studio

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[607f21a](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/tree/607f21a238c9c04a73f8981a6699a13e93f25df9)

<!-- BEGIN META -->
[![GitHub ★ 57](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=57&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kingcharleslzy-ai/dsh-qwen-studio)
<!-- END META -->

> **功能**：把本地 MLX 或自托管图像服务接入 DSH 对话，记录生成任务并按 ID 取回状态与附件。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，会话生成、任务记录和成图附件可用同一 ID 回查，减少在工具之间搬运文件。

> **主要限制**：[Q03](#research-q03) 对话取消、提交回执丢失、本地终态和远端终态不同。能查本地 ID 的机制不足以证实上游没有继续执行。

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
  - [Q01 · 本地生图工作台相对手工启动与上传增加什么？](#detail-section-11)
  - [Q02 · DSH 工具怎样进入 worker 并产生最终附件？](#detail-section-12)
  - [Q03 · 取消、失败和重试对后端与文件意味着什么？](#detail-section-13)
  - [Q04 · 何种环境适合试用，失败时如何恢复？](#detail-section-14)
  - [Q05 · 能否用故障注入区分完成与未知？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已部署可用本地或自托管生图服务的 DSH 创作者，希望在对话中发起一张测试图，等候或切页后按任务取回结果。

在自托管服务的原界面或 API 手动启动、提交、轮询并下载图片，再上传到对话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：qwen_generate_image、qwen_image_status 和 qwen_image_cancel
- **界面**：DSH Web 客户端声明
- **Skill**：有 Host 技能服务时注册内置图像 Skill

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| manifest 声明的 DSH 与 Node | 启动必需 | 装载工具和附件 | 对应宿主不一定加载 |
| 本地 Python、MFLUX、完整模型与适配硬件 | 本地推理必需 | 启动本地队列 | 不能执行本地推理 |
| 可达的自托管服务、地址、凭据 | 远程推理必需 | 运行和回查任务 | 远端请求失败或能力受限 |
| 隔离图库及可读写空间 | 试用与交付必需 | 保存任务和 PNG | 无法回读或附图 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选已知硬件和后端，配置隔离图库 | 可核对服务和模型 |
| 加载 | Host 挂载插件，用户确认工具 | 生成和状态工具可用 |
| 执行 | 用户提交一张无敏感图 | 取得任务 ID，后端或图库出现该 ID |
| 验收 | 用户按原 ID 取回并打开附件 | PNG、状态和会话三者一致，异常时先核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH、适配硬件、权重、图库和网络 | 准备推理环境及验明连接 | 固定版本的费用、峰值及配置人时未测 |
| 持续使用 | 模型占用、算力、电力与传图 | 评审图质并核对队列 | 依任务参数及硬件变化，无统一耗时 |
| 失败恢复 | 原任务记录、后端和替代入口 | 比对两端同 ID、恢复或决定补图 | 远端结果未知时无法直接核算资源 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 对话交付 | 固定源码串联任务、PNG 与附件 | 实际图片质量及人时 |
| 结果取回 | 状态工具读取本地记录，无新增提交 | 网关回执异常后的远端状态 |
| 进度与取消 | 有状态轮询与取消请求 | 固定版本的设备适配和取消实际效果 |

> **思考**：[Q03](#research-q03) 对话取消、提交回执丢失、本地终态和远端终态不同。能查本地 ID 的机制不足以证实上游没有继续执行。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，会话生成、任务记录和成图附件可用同一 ID 回查，减少在工具之间搬运文件。

任务 ID 在提交前记录，本地准入、远端接收、本地保存以及会话附图分别有判断点。远端轮询中断与首次提交回执丢失不能使用同一恢复判断。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 对话取消、提交回执丢失、本地终态和远端终态不同。能查本地 ID 的机制不足以证实上游没有继续执行。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q01](#research-q01) 已有推理设备并能隔离图库的创作者，可先提交一张无敏感输入的配图再按 ID 取回。[Q03](#research-q03) 出现提交未确认、图库和远端不一致或 PNG 不可读时停止重投，按同 ID 查两端，再回原后端恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码核实根 DSH 插件、worker 与任务状态接线。历史验收来自作者且版本不同。本轮没有实际运行宿主、网关或模型。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/tools.ts、src/worker.ts、backend/server.py、src/status-tool.ts、src/gallery-tool.ts、src/remote-protocol.ts、src/remote.ts、docs/VERIFICATION.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根 DSH 插件的对话生成、本地与远程 worker、状态和取消。高级编辑、模型质量、更新器、SSH 细节及市场状态未完整审计。
- 下一步：固定源码。下一步以同一小输入分别丢提交回执、状态轮询回包及拒绝取消，按任务 ID 对照网关、本地 job、PNG 和会话结果，观察重复请求与恢复耗时。

**分析版本**

- **仓库**：[kingcharleslzy-ai/dsh-qwen-studio](https://github.com/kingcharleslzy-ai/dsh-qwen-studio)
- **版本号**：2.19.2（[固定提交 607f21a](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/tree/607f21a238c9c04a73f8981a6699a13e93f25df9)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 通过提交、轮询和取消三个故障点比较同 ID 两端状态，可验证何时安全恢复和避免重复出图。

固定源码。下一步以同一小输入分别丢提交回执、状态轮询回包及拒绝取消，按任务 ID 对照网关、本地 job、PNG 和会话结果，观察重复请求与恢复耗时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 1373 | — | — | 31295 |
| .mjs | source | 12 | 206 | 197 | 17 | — |
| .ts | source | 38 | 4665 | 4561 | 68 | — |
| .tsx | source | 13 | 3521 | 3514 | 5 | — |
| .ts | test | 22 | 2175 | 2117 | 31 | — |
| .tsx | test | 2 | 224 | 223 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-09），可前往 [GitHub Issues](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断已具本地或自托管生图设备的 DSH 用户，能否从会话得到可回查的任务、预览和最终图片，并在断连或失败时区分插件侧和后端状态。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 本地生图工作台相对手工启动与上传增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有本机 MLX 或自托管 GPU 的 DSH 创作者，可以把配图任务和结果带进会话。作者描述持久任务、图库与查询，固定根包及代码接线显示 DSH 实际加载 worker 和工具。对比外部工作流提交、查图和传回会话，插件给任务稳定 ID，并可查询记录与可打开的附件。合格结果仍包括指定构图或编辑要求及无重复提交。只偶尔出图且外部流程顺手的人可能无需再维护一个入口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:46-57](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/README.md#L46-L57)

作者描述的场景与任务工作流

<details>
<summary>查看原文（12行）</summary>

```text
**让 Agent 创作**：在会话里说「找一张参考图，把它改成水彩」。内置技能指导模型搜索、导入，再使用插件工具；对话和创作页显示同一任务的进度与图片。

![DSH 创作页：原位预览、参考对比与参数编辑](docs/media/creation.png)

- **按图改画风** — 本机 MLX 与配套远程网关均支持原生参考编辑。参考图片和指令共同参与生成，按完整步数采样。
- **把高级功能点出来** — LoRA、ControlNet、蒙版、负向词、CFG、调度器均在高级设置中配置；本机文件选择器和资源清单可反复选用。
- **调好一次，保存一套** — 命名预设、默认项、参数复用、JSON 导入导出；Agent 与面板使用同一个预设库。
- **切页继续，进度跟随** — 持久任务队列，真实采样步数；完成图在对话、创作页和图库同步。查询已有结果不会重新生图。
- **用时启动，空闲释放** — 本机模型按需加载；远程按需 SSH、资源自动同步，模型卸载后断开。统一空闲时间可由界面或 Agent 调整。
- **试稿收好，作品精选** — 默认存入隐私图库，收藏后进入普通图库；支持搜索、批量归档与回收站。隐私分类不隐藏对话图片，也不是加密或密码锁。

这是 **DeepSeek Harness 插件**，不是独立生图 App。应用里叫「图像」，安装包为 `dsh-qwen-studio`，当前 **2.19.2**。独立维护、独立发布，无需安装旧 `dsh-image-gen`。
```

</details>

**依据 2 · 源码核查**：[package.json:56-71](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/package.json#L56-L71)

DSH bundle 与 Web 注入

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-settings-plugins",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/cordis.patch.yml#L1-L4)

根插件组合

```text
- insert:
    - id: qwen-studio
      name: dsh-qwen-studio
      config: {}
```

**依据 4 · 源码核查**：[src/index.ts:57-73](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/src/index.ts#L57-L73)

实际构造 worker 并注册工具

<details>
<summary>查看原文（17行）</summary>

```text
  const worker = new Worker(current);
  const gallerySnapshots = new GallerySnapshots();
  ctx.effect(() => () => { void worker.dispose().catch(() => {}); }, "qwen-studio SSH lifecycle");
  let updater: UpdateController | undefined;
  let updateError = "";
  const updateReady = (async () => {
    try {
      const installer = new PackageInstaller();
      const version = JSON.parse(await readFile(join(installer.paths.packageRoot, "package.json"), "utf8")).version as string;
      updater = new UpdateController(installer.paths.state, version, fn => worker.withMaintenance(fn), installer);
      await updater.init();
    } catch(e) { updateError = e instanceof Error ? e.message : String(e); }
  })();
  ctx.effect(() => () => { updater?.stop(); closeGalleryIndexes(); }, "qwen-studio updates and gallery index");
  registerTools(ctx, worker);
  (ctx.inject as unknown as (services: string[], callback: (owner: Context) => void) => void)(["settings"], (owner) => {
    registerConnectionTool(owner, worker, owner.get("settings") as ConnectionSettings);
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:104-125](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/src/tools.ts#L104-L125)

回查任务和会话附件的实现

<details>
<summary>查看原文（22行）</summary>

```text
        const started = Date.now();
        while (Date.now() - started < 20 * 60 * 1000) {
          if (exec.signal.aborted)
            throw Error(`等待已取消，任务 ${id} 仍保留；用 qwen_image_status 查询或在图像中取消。`);
          const job = await readJob(dir, id);
          if (job && !active(job)) {
            if (job.status !== "complete")
              throw Error(`任务 ${id}：${job.error ?? job.status}。可用 qwen_image_status 查看，勿自动换脚本或重复提交。`);
            const data = await readFile(await imagePath(dir, id));
            const attachment = await ctx.attachments.saveImage({
              data,
              mediaType: "image/png",
              name: `qwen-${id.slice(0, 8)}.png`,
            });
            return { id, attachment };
          }
          try { await wait(1000, undefined, { signal: exec.signal }); }
          catch { throw Error(`等待已取消，任务 ${id} 仍保留；用 qwen_image_status 查询或在图像中取消。`); }
        }
        throw Error(
          `等待超时，任务 ${id} 仍保留；用 qwen_image_status 查询，不要重复提交或改跑脚本。`,
        );
```

</details>

#### 缺口

- 没有与自托管原界面的同任务人工对照。
  **影响**：不能量化时间、失败处理或图片质量优势。
  **进一步探讨**：用固定模型生成一张能回读 ID 的测试图，比较首次和再次取回步骤。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 工具怎样进入 worker 并产生最终附件？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

生成工具先验证参数和登记调用与任务 ID，再提交本地或远程任务。Windows 等远程通过配置服务，普通接口与扩展网关的能力有区别。默认本地分支按需启动 Python worker；本地队列同 ID 同参数可返回已有任务，参数冲突拒绝，准入先写任务记录再交付 202。工具轮询本地记录，只有 complete 后才读 PNG、存 Host 附件。只读状态工具可从本地记录再读出图像和创建附件，没有再发生成请求。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:79-118](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/src/tools.ts#L79-L118)

任务 ID、调用记录、提交、轮询和附件

<details>
<summary>查看原文（40行）</summary>

```text
      async execute(args, exec) {
        validateGeneration(args);
        const id = newJobId(),
          dir = worker.directory();
        await recordInvocation(
          dir,
          exec.callId,
          args.prompt,
          id,
          undefined,
          exec.agent?.id ?? "",
        );
        try {
          await worker.post("/v1/jobs", generationPayload(args, id), true);
        } catch (error) {
          await recordInvocation(
            dir,
            exec.callId,
            args.prompt,
            id,
            error instanceof Error ? error.message : String(error),
            exec.agent?.id ?? "",
          );
          throw Error(`提交任务 ${id} 未确认：${error instanceof Error ? error.message : String(error)}。先用 qwen_image_status 查询该 ID，勿自动重试或运行脚本。`);
        }
        const started = Date.now();
        while (Date.now() - started < 20 * 60 * 1000) {
          if (exec.signal.aborted)
            throw Error(`等待已取消，任务 ${id} 仍保留；用 qwen_image_status 查询或在图像中取消。`);
          const job = await readJob(dir, id);
          if (job && !active(job)) {
            if (job.status !== "complete")
              throw Error(`任务 ${id}：${job.error ?? job.status}。可用 qwen_image_status 查看，勿自动换脚本或重复提交。`);
            const data = await readFile(await imagePath(dir, id));
            const attachment = await ctx.attachments.saveImage({
              data,
              mediaType: "image/png",
              name: `qwen-${id.slice(0, 8)}.png`,
            });
            return { id, attachment };
```

</details>

**依据 2 · 源码核查**：[src/worker.ts:164-187](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/src/worker.ts#L164-L187)

本地 Python worker 启动

<details>
<summary>查看原文（24行）</summary>

```text
    const dir = this.directory(),
      python = resolveConfig(this.config()).pythonPath;
    const model = resolveConfig(this.config()).modelPath;
    await access(model);
    const bundled = resolve(
      dirname(fileURLToPath(import.meta.url)),
      "../backend/server.py",
    );
    await copyFile(bundled, join(dir, "server.py"));
    await access(python);
    const fd = openSync(join(dir, "state/service.log"), "a", 0o600);
    const child = spawn(python, ["-u", join(dir, "server.py")], {
      cwd: dir,
      stdio: ["ignore", fd, fd],
      env: {
        ...process.env,
        HF_HUB_OFFLINE: "1",
        QWEN_DATA_DIR: dir,
        QWEN_MODEL_PATH: model,
        HF_HOME: resolveConfig(this.config()).hfHome,
      },
    });
    closeSync(fd);
    child.unref();
```

</details>

**依据 3 · 源码核查**：[src/worker.ts:290-325](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/src/worker.ts#L290-L325)

扩展远端和本地 HTTP 请求分流

<details>
<summary>查看原文（36行）</summary>

```text
    if (start && this.mode() === "remote") {
      const config = this.transportConfig();
      let release: (() => void) | undefined;
      try {
        if (this.managedSSH()) release = await this.lifecycle.acquire(config);
        else if (await this.capabilities()) await this.configureRemote(config, Math.round((config.localMfluxIdleMinutes ?? 10) * 60));
        return await this.remote.submit(this.directory(), config, data as Record<string, unknown>, release, this.managedSSH() ? () => this.lifecycle.reconnect(config) : undefined);
      } catch (e) { release?.(); throw e; }
    }
    if (path === "/v1/unload" && this.mode() === "remote") {
      if (this.managedSSH()) { await this.lifecycle.unload(); return { unloaded: true, disconnected: true }; }
      if (!await this.remote.capabilities(this.transportConfig())) throw Error("普通远程接口不支持释放模型");
      const r = await fetch(remoteURL(this.transportConfig()) + "/qwen/unload", { method: "POST", headers: headers(this.transportConfig()), body: "{}", signal: AbortSignal.timeout(45000), redirect: "error" });
      if (!r.ok) throw Error("远程仍有任务或释放失败，请查询当前任务状态");
      return r.json();
    }
    if (path === "/v1/cancel") {
      const id = (data as { id: string }).id;
      const job = (await readJobs(this.directory())).find((j) => j.id === id);
      if (job?.source === "remote") return this.remote.cancel(id);
    }
    if (start) await this.ensure();
    const token = (
      await readFile(join(this.directory(), "state/api-key"), "utf8")
    ).trim();
    const response = await fetch(BASE + path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(10000),
    });
    const value = (await response.json()) as { error?: string };
    if (!response.ok) throw Error(value.error ?? "本地任务请求失败");
```

</details>

**依据 4 · 源码核查**：[backend/server.py:175-185](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/backend/server.py#L175-L185)

本地同 ID 复用与参数冲突

<details>
<summary>查看原文（11行）</summary>

```text
    def submit(self, data):
        params = validate(data)
        job_id = data.get('id', uuid.uuid4().hex)
        if not isinstance(job_id, str) or not re.fullmatch('[a-f0-9]{32}', job_id): raise ValueError('任务ID无效')
        with self.lock:
            if job_id in self.jobs:
                job = self.jobs[job_id]
                request = job.get('request', {k: job.get(k) for k in params})
                if request != params: raise ValueError('任务ID已被其他参数使用')
                return dict(job)
            if self.closing or self.pending >= 4: raise RuntimeError('队列已满或服务正在退出，请稍后重试')
```

</details>

**依据 5 · 源码核查**：[backend/server.py:220-230](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/backend/server.py#L220-L230)

准入记录先于生成

<details>
<summary>查看原文（11行）</summary>

```text
            job = dict(id=job_id, status='queued', model=MODEL_ID, started_at=time.time(), **params)
            job['sampling_steps'] = params['steps'] - max(1, int(params['steps'] * (1-params['change_strength']))) if 'change_strength' in params else params['steps']
            job['request'] = dict(params)
            job['seed'] = params['seed'] if params['seed'] is not None else secrets.randbelow(2**32)
            job.update(step=0, phase='queued', worker_pid=os.getpid())
            self.write(job)  # Admission receipt is durable before HTTP 202.
            self.jobs[job_id] = job
            self.events[job_id] = threading.Event()
            self.pending += 1
            self.futures[job_id] = self.pool.submit(self.run, job_id)
            return dict(job)
```

</details>

**依据 6 · 源码核查**：[src/status-tool.ts:48-58](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/src/status-tool.ts#L48-L58)

状态回查读取本地文件并可附图

<details>
<summary>查看原文（11行）</summary>

```text
    async execute({ id }) {
      const dir = worker.directory(), job = await readJob(dir, id);
      if (!job) throw Error(`任务 ${id} 不存在，请确认原始 ID；未提交新任务。`);
      const attachment = job.status === "complete" && !job.deleted
        ? await ctx.attachments.saveImage({ data: await readFile(await imagePath(dir, id)), mediaType: "image/png", name: `qwen-${id.slice(0, 8)}.png` })
        : undefined;
      return { id, status: job.deleted ? "trashed" : job.status, prompt: job.prompt,
        steps: job.sampling_steps ?? job.steps,
        ...(job.step !== undefined ? { step: job.step } : {}),
        ...(job.error ? { error: job.error } : {}), ...(attachment ? { attachment } : {}),
      };
```

</details>

#### 缺口

- 未验证真实宿主、模型和 PNG 返回。
  **影响**：任务被接收并不表示推理或附件已可用。
  **进一步探讨**：分别检查准入记录、完整 PNG 和会话打开结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 取消、失败和重试对后端与文件意味着什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

对话停止等待不调用取消。显式取消仍需稍后查终态，本地 worker 先置 cancelling，若结果已提交则完成可以优先。配套远端将待处理控制器保存在当前进程。扩展请求只有在已通过 POST 返回后，GET 轮询断线才按同 ID 重连查询，不重发；POST 回执丢失会跳到外层 catch，记录可为 failed，而远端可能已接受。普通远端取消只是停止请求等待；扩展取消请求也没有核对响应 HTTP 成功，连接异常仍可记本地 cancelled。状态工具查本地记录，不能以本地失败、取消或没有附件断言远端未生成。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:104-125](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/src/tools.ts#L104-L125)

停止等待与任务本身分开

<details>
<summary>查看原文（22行）</summary>

```text
        const started = Date.now();
        while (Date.now() - started < 20 * 60 * 1000) {
          if (exec.signal.aborted)
            throw Error(`等待已取消，任务 ${id} 仍保留；用 qwen_image_status 查询或在图像中取消。`);
          const job = await readJob(dir, id);
          if (job && !active(job)) {
            if (job.status !== "complete")
              throw Error(`任务 ${id}：${job.error ?? job.status}。可用 qwen_image_status 查看，勿自动换脚本或重复提交。`);
            const data = await readFile(await imagePath(dir, id));
            const attachment = await ctx.attachments.saveImage({
              data,
              mediaType: "image/png",
              name: `qwen-${id.slice(0, 8)}.png`,
            });
            return { id, attachment };
          }
          try { await wait(1000, undefined, { signal: exec.signal }); }
          catch { throw Error(`等待已取消，任务 ${id} 仍保留；用 qwen_image_status 查询或在图像中取消。`); }
        }
        throw Error(
          `等待超时，任务 ${id} 仍保留；用 qwen_image_status 查询，不要重复提交或改跑脚本。`,
        );
```

</details>

**依据 2 · 源码核查**：[src/gallery-tool.ts:146-162](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/src/gallery-tool.ts#L146-L162)

显式取消返回请求状态并提示复核

<details>
<summary>查看原文（17行）</summary>

```text
    async execute({ ids }) {
      if (!Array.isArray(ids) || !ids.length || ids.length > 50 || ids.some((id) => !validId(id))) throw Error("ids 需要 1–50 个 32 位十六进制任务 ID");
      const dir = worker.directory(), results: Array<Record<string, unknown>> = [];
      for (const id of ids) {
        const job = await readJob(dir, id);
        if (!job) { results.push({ id, ok: false, error: "任务不存在" }); continue; }
        if (!active(job)) { results.push({ id, ok: false, error: `任务已结束（${job.deleted ? "trashed" : job.status}）` }); continue; }
        try {
          await worker.post("/v1/cancel", { id });
          await wait(150);
          const next = await readJob(dir, id);
          results.push({ id, ok: true, status: next?.deleted ? "trashed" : next?.status ?? "cancelling" });
        } catch (error) {
          results.push({ id, ok: false, error: error instanceof Error ? error.message : String(error) });
        }
      }
      return { result: JSON.stringify({ results, requested: ids.length, note: "取消只影响任务，不删除图片；稍后用 qwen_image_jobs 复核最终状态。" }) };
```

</details>

**依据 3 · 源码核查**：[backend/server.py:239-273](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/backend/server.py#L239-L273)

本地取消与提交结果竞争

<details>
<summary>查看原文（35行）</summary>

```text
    def run(self, job_id):
        start = time.monotonic()
        with self.lock:
            self.current = job_id
            job = self.jobs[job_id]
            event = self.events[job_id]
        try:
            if event.is_set(): raise Cancelled()
            output = self.root / 'images' / job_id / 'image.png'
            result = self.runner(job, output, lambda phase, step=0: self.progress(job_id, phase, step), event)
            with self.lock:
                # Once the output is committed, completion wins over a late cancellation.
                job.update(status='complete', phase='complete', step=job.get('sampling_steps',job['steps']), output=str(output), elapsed_seconds=round(time.monotonic()-start, 2), **(result or {}))
        except Cancelled:
            with self.lock: job.update(status='cancelled', phase='cancelled')
        except Exception as exc:
            with self.lock: job.update(status='failed', phase='failed', error=str(exc))
        finally:
            with self.lock:
                self.write(job)
                self.pending -= 1
                self.current = None
                self.last_finished = time.monotonic()
                self.events.pop(job_id, None)
                self.futures.pop(job_id, None)

    def cancel(self, job_id):
        with self.lock:
            if job_id not in self.jobs: raise ValueError('任务不存在')
            job = self.jobs[job_id]
            if job['status'] in ACTIVE:
                self.events[job_id].set()
                job.update(status='cancelling', phase='cancelling')
                self.write(job)
            return dict(job)
```

</details>

**依据 4 · 源码核查**：[src/remote-protocol.ts:114-141](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/src/remote-protocol.ts#L114-L141)

提交 ACK 与轮询恢复边界

<details>
<summary>查看原文（28行）</summary>

```text
  signal.throwIfAborted();
  accepted(); // Submission may be accepted even if its response is lost.
  await responseJSON(await fetch(base + "/qwen/jobs", { method: "POST", headers, body: JSON.stringify(body), signal, redirect: "error" }));
  const started = Date.now();
  while (true) {
    signal.throwIfAborted();
    let response: Response;
    try {
      response = await fetch(base + "/qwen/jobs/" + job.id, { headers, signal, redirect: "error" });
      if ([502, 503, 504].includes(response.status)) throw Error("Remote temporarily unavailable");
    } catch (error) {
      signal.throwIfAborted();
      await patch({ phase: "连接中断，正在重连；不会重新提交" });
      if (reconnect) await reconnect().catch(() => {});
      await wait(1500, undefined, { signal });
      continue;
    }
    const remote = await responseJSON(response);
    const status = ["queued", "loading", "running", "saving", "cancelling", "complete", "cancelled", "failed"].includes(remote.status) ? remote.status : "running";
    // Publish completion only after the PNG has been saved locally.
    await patch({ status: status === "complete" ? "saving" : status, phase: String(remote.phase || ""), step: Number(remote.step) || 0, sampling_steps: Number(remote.sampling_steps) || job.steps, progress_supported: true, elapsed_seconds: (Date.now() - started) / 1000 });
    if (status === "failed") throw Error(remote.error || "远程生成失败");
    if (status === "cancelled") throw Error("远程任务已取消");
    if (status === "complete") {
      const response = await fetch(base + "/qwen/jobs/" + job.id + "/image", { headers, signal, redirect: "error" });
      if (!response.ok) throw Error("远程结果暂不可用，请查询原任务，勿重复提交");
      if (Number(response.headers.get("content-length")) > 64 * 1024 ** 2) throw Error("远程图片超过64MB");
      return Buffer.from(await response.arrayBuffer());
```

</details>

**依据 5 · 源码核查**：[src/remote.ts:223-262](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/src/remote.ts#L223-L262)

本地最终文件、取消请求及控制器的进程边界

<details>
<summary>查看原文（40行）</summary>

```text
      controller.signal.throwIfAborted();
      await patch({ status: "saving" });
      await writeFile(join(folder, "image.pending.png"), bytes);
      await rename(
        join(folder, "image.pending.png"),
        join(folder, "image.png"),
      );
      await patch({
        status: "complete",
        width: bytes.readUInt32BE(16),
        height: bytes.readUInt32BE(20),
        step: extended ? JSON.parse(await readFile(file, "utf8")).sampling_steps ?? job.steps : job.steps,
        elapsed_seconds: Math.round((Date.now() - start) / 10) / 100,
      });
    } catch (e) {
      if (controller.signal.aborted && extended && extendedAccepted) {
        try {
          await fetch(remoteURL(config) + "/qwen/jobs/" + job.id + "/cancel", { method: "POST", headers: headers(config), redirect: "error", signal: AbortSignal.timeout(5000) });
        } catch { /* The local cancellation still records that remote acknowledgement was lost. */ }
      }
      await patch({
        status: controller.signal.aborted ? "cancelled" : "failed",
        error: controller.signal.aborted
          ? extended ? "已停止等待并请求取消远程任务；连接中断时请检查远程状态" : "已停止等待；远程服务可能仍在计算"
          : e instanceof Error
            ? e.message
            : String(e),
      });
    } finally {
      clearTimeout(timer);
      this.pending.delete(job.id);
      this.configs.delete(job.id);
      settled?.();
    }
  }
  cancel(id: string) {
    const controller = this.pending.get(id);
    if (!controller) throw Error("远程任务已结束或当前DSH进程不持有该任务");
    controller.abort();
    return { ok: true };
```

</details>

**依据 6 · 源码核查**：[src/status-tool.ts:48-58](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/src/status-tool.ts#L48-L58)

状态工具只查询本地记录

<details>
<summary>查看原文（11行）</summary>

```text
    async execute({ id }) {
      const dir = worker.directory(), job = await readJob(dir, id);
      if (!job) throw Error(`任务 ${id} 不存在，请确认原始 ID；未提交新任务。`);
      const attachment = job.status === "complete" && !job.deleted
        ? await ctx.attachments.saveImage({ data: await readFile(await imagePath(dir, id)), mediaType: "image/png", name: `qwen-${id.slice(0, 8)}.png` })
        : undefined;
      return { id, status: job.deleted ? "trashed" : job.status, prompt: job.prompt,
        steps: job.sampling_steps ?? job.steps,
        ...(job.step !== undefined ? { step: job.step } : {}),
        ...(job.error ? { error: job.error } : {}), ...(attachment ? { attachment } : {}),
      };
```

</details>

#### 缺口

- 缺 2.19.2 的 POST 丢回执和取消响应失败实测。
  **影响**：无法从用户界面确认远程最终算力消耗和结果可取回性。
  **进一步探讨**：在隔离网关分别丢提交回执、丢轮询回包及拒绝取消，按同 ID 比对两端。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何种环境适合试用，失败时如何恢复？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需 manifest 指定的 Node 和 DSH。已有硬件用户可选本机 MLX 和完整权重，或配置自托管服务、地址和凭据。插件包不包含模型权重。作者有 2.19.0 在具体设备和 DSH 版本的功能记录，不能外推 2.19.2 或其他设备。小试先用已知硬件、低副作用输入及隔离图库。若同一任务 ID 远端和本地不一致、PNG 读不到或取消仍未终止，应停止提交，核对 worker 和远端状态后在已知后端恢复。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:83-86](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/package.json#L83-L86)

Node 与 DSH 声明版本

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.1-rc.1 <0.2.2-0 || 0.2.2-rc.1"
  },
```

**依据 2 · 作者声明**：[README.md:59-70](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/README.md#L59-L70)

作者的硬件及磁盘说明

<details>
<summary>查看原文（12行）</summary>

```text
## 先看这台机器跑不跑得动

Qwen Image 2.1 有量化版本，**门槛比想象中低**。按显存/内存挑档位，别一上来就下 bf16 全家桶：

| 环境 | 最低（量化） | 舒适 | 能做多少 |
| --- | --- | --- | --- |
| Apple Silicon Mac | MFLUX + 对应 MLX 权重 | 本次实机为 128 GB Apple Silicon | 16/24/32 GB 设备未做本版实测，不承诺低内存原生编辑；按模型实际峰值预留系统内存 |
| Windows + NVIDIA | 本包仅验证 24 GB RTX 4090 D 的指定 int8 safetensors | 24 GB | 不支持直接替换 GGUF；10–12 GB 尚未真机验证 |
| bf16 全量 | 另行核算权重、编码器和推理峰值 | 本版未验收 | 不能仅凭权重精度承诺最高画质或固定内存门槛 |
| Intel Mac / 无独显 | — | — | 只装插件看界面，推理走局域网里带 GPU 的机器 |

磁盘：量化权重约 **40 GB** 起，bf16 全家桶 80 GB 起。显存/内存要给系统留 2–4 GB 余量，刚好卡满会 OOM 或被迫走 swap。
```

</details>

**依据 3 · 作者声明**：[README.md:87-99](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/README.md#L87-L99)

作者的后端和权重准备条件

<details>
<summary>查看原文（13行）</summary>

```text
**2. 选择推理位置。** 正常退出并重新打开 DSH，在插件设置中配置「图像」：

| 本机 Apple Silicon Mac | 自己的 NVIDIA GPU（Windows / Linux） |
| --- | --- |
| Python 3.12 + MFLUX 0.22.0 | 配套 CUDA / ComfyUI Qwen 网关 |
| 准备完整 Qwen Image 2.1 权重 | 准备服务器模型与访问地址 |
| 选择 Python 环境、模型和图库目录 | 填写 `/v1` 地址、模型名、配套网关必需的密钥及可选 SSH 别名 |
| [本机安装步骤 →](docs/SETUP.md) | [远程部署步骤 →](docs/REMOTE.md) |
| Python 3.12 + MFLUX 0.22.0 | 网关默认 `127.0.0.1:19488`，模型 `qwen-image-2.1-int8` |

Windows 没有 MLX：本机只装插件看界面，真正的推理要么走局域网里的 NVIDIA 机器，要么用同一台机器的 GPU 跑网关。Windows 上 `dsh` 是 `.cmd`，必须用 `dsh.cmd` 或 `cmd /c dsh.cmd`，直接 `dsh` 会 EINVAL。

模型权重独立准备，不随插件分发，也不会在首次打开时自动下载几十 GB 文件。原生编辑需要含视觉编码器与 `processor` 的完整模型；纯文本导出不通用。已有用户原位升级，沿用当前数据目录与预设。
```

</details>

**依据 4 · 作者声明**：[docs/VERIFICATION.md:1-17](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/docs/VERIFICATION.md#L1-L17)

作者旧版、受约束的验收记录

<details>
<summary>查看原文（17行）</summary>

```text
# 2.19.0 Windows 修复验收（2026-10-21）

本节区分原生系统测试、真实 GPU 和历史验收。旧版记录不能替代本版结果。

- Windows 11 Pro Build 26300.9550、PowerShell 5.1、Node 22.23.2、RTX 4090 D 24 GB、驱动 616.92；源码位于含中文和空格的目录，干净安装 npm 依赖。
- Windows：98 项 TypeScript 测试、34 项 Python 测试、类型检查、构建与安装包清单检查通过。Mac：97 项通过，1 项 Windows 专属批处理测试不运行，34 项 Python 测试通过。
- 原生 Windows 批处理测试覆盖中文、空格、`&`、`%PATH%`、`!`、括号，实际调用带这些字符的 `.cmd` 路径并核对完整 argv。
- Mac 与 Windows 均在隔离 DSH_HOME 中调用原生 DSH 0.2.1-rc.2 CLI：安装 2.18.3、升级 2.19.0、回滚 2.18.3、模拟安装回执丢失后的自动恢复、卸载。profile patch 与用户数据哨兵未变，备份保留。Windows DSH_HOME 本身含中文、空格和 `&`。
- 两端从新建 venv 运行客户端依赖安装脚本，安装 Pillow/numpy。发现并修复 pip 用户级安装设置干扰 venv 的问题；只在安装子进程设 PIP_USER=false，保留原源和证书设置。
- 真实 Windows Worker → 配套网关 → ComfyUI：512×512、4 步文生图、单图/双图原生编辑、参考变体、蒙版与 ControlNet、零增量匹配 LoRA 均完成；不匹配 LoRA 明确失败。零增量 LoRA 验证实际加载路径，不证明任意第三方适配器效果。
- 蒙版黑色半区 131072 像素逐像素保持；正在采样任务取消后可以继续生成；空闲后 loaded=false。上述低步数案例是功能验收，不是质量基准。
- Mac 经原生 SSH 按需连接真实 Windows 网关：离线检查不建隧道；1024×1024、40 步运行中主动断开本次隧道，恢复查询同一 ID 并完成；空闲卸载后断开。
- 没有 10–12 GB / 多 GPU / Linux GPU 实机证据；删除原先 GGUF 与低显存保证，不能将静态分支或模拟测试写成硬件实测。

- Windows 原生 DSH 图像创作页：默认 1024×1024、40 步完成蓝杯，显示进度、预览与图库；同一图片通过 Windows 原生文件选择器导入并显示缩略图。发现并修复 Windows 按钮误显示 macOS 快捷键。
- Windows 原生 DSH 会话调用 qwen_generate_image：512×512、4 步红杯完成，工具图片卡片可见。模型回答额外拼接的 Windows 附件路径不能渲染，因此技能增加不要手写本机附件 Markdown 链接的指导；该指导不能保证任意模型完全遵从。
- Mac 原生 DSH 会话自动读取技能并调用连接/生成/状态工具：512×512、4 步蓝杯与红杯原生编辑完成，两个图片附件可见；结束恢复原 remote 模式和 30 分钟空闲设置。MFLUX 0.22.0，低步数不作为画质保证。
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:91-103](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/src/tools.ts#L91-L103)

提交不确定时保留 ID 而不重试

<details>
<summary>查看原文（13行）</summary>

```text
        try {
          await worker.post("/v1/jobs", generationPayload(args, id), true);
        } catch (error) {
          await recordInvocation(
            dir,
            exec.callId,
            args.prompt,
            id,
            error instanceof Error ? error.message : String(error),
            exec.agent?.id ?? "",
          );
          throw Error(`提交任务 ${id} 未确认：${error instanceof Error ? error.message : String(error)}。先用 qwen_image_status 查询该 ID，勿自动重试或运行脚本。`);
        }
```

</details>

#### 缺口

- 没有固定版本的资源峰值、跨设备时延或恢复成本。
  **影响**：实际部署可能受权重大小、显存与网络影响。
  **进一步探讨**：记录首次准备时间、单张推理及故障后按 ID 恢复的人时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否用故障注入区分完成与未知？

**研究主题**：新假设与验证

#### 完整回答

固定同一小输入和专用网关。先在提交接收后丢 POST 回执，再在已知成功提交后丢一次状态 GET，最后让取消请求返回错误。对每个 ID 记录请求次数、网关实际任务、图库状态、PNG 和会话附件。若正常轮询恢复重发任务，或本地失败和网关完成总无法定位到原 ID，对照将推翻可可靠追踪的假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/remote-protocol.ts:114-141](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/src/remote-protocol.ts#L114-L141)

提交与状态请求的两个注入点

<details>
<summary>查看原文（28行）</summary>

```text
  signal.throwIfAborted();
  accepted(); // Submission may be accepted even if its response is lost.
  await responseJSON(await fetch(base + "/qwen/jobs", { method: "POST", headers, body: JSON.stringify(body), signal, redirect: "error" }));
  const started = Date.now();
  while (true) {
    signal.throwIfAborted();
    let response: Response;
    try {
      response = await fetch(base + "/qwen/jobs/" + job.id, { headers, signal, redirect: "error" });
      if ([502, 503, 504].includes(response.status)) throw Error("Remote temporarily unavailable");
    } catch (error) {
      signal.throwIfAborted();
      await patch({ phase: "连接中断，正在重连；不会重新提交" });
      if (reconnect) await reconnect().catch(() => {});
      await wait(1500, undefined, { signal });
      continue;
    }
    const remote = await responseJSON(response);
    const status = ["queued", "loading", "running", "saving", "cancelling", "complete", "cancelled", "failed"].includes(remote.status) ? remote.status : "running";
    // Publish completion only after the PNG has been saved locally.
    await patch({ status: status === "complete" ? "saving" : status, phase: String(remote.phase || ""), step: Number(remote.step) || 0, sampling_steps: Number(remote.sampling_steps) || job.steps, progress_supported: true, elapsed_seconds: (Date.now() - started) / 1000 });
    if (status === "failed") throw Error(remote.error || "远程生成失败");
    if (status === "cancelled") throw Error("远程任务已取消");
    if (status === "complete") {
      const response = await fetch(base + "/qwen/jobs/" + job.id + "/image", { headers, signal, redirect: "error" });
      if (!response.ok) throw Error("远程结果暂不可用，请查询原任务，勿重复提交");
      if (Number(response.headers.get("content-length")) > 64 * 1024 ** 2) throw Error("远程图片超过64MB");
      return Buffer.from(await response.arrayBuffer());
```

</details>

**依据 2 · 源码核查**：[src/remote.ts:237-250](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/src/remote.ts#L237-L250)

远程取消失败与本地状态的观测点

<details>
<summary>查看原文（14行）</summary>

```text
    } catch (e) {
      if (controller.signal.aborted && extended && extendedAccepted) {
        try {
          await fetch(remoteURL(config) + "/qwen/jobs/" + job.id + "/cancel", { method: "POST", headers: headers(config), redirect: "error", signal: AbortSignal.timeout(5000) });
        } catch { /* The local cancellation still records that remote acknowledgement was lost. */ }
      }
      await patch({
        status: controller.signal.aborted ? "cancelled" : "failed",
        error: controller.signal.aborted
          ? extended ? "已停止等待并请求取消远程任务；连接中断时请检查远程状态" : "已停止等待；远程服务可能仍在计算"
          : e instanceof Error
            ? e.message
            : String(e),
      });
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:79-103](https://github.com/kingcharleslzy-ai/dsh-qwen-studio/blob/607f21a238c9c04a73f8981a6699a13e93f25df9/src/tools.ts#L79-L103)

记录调用 ID 和不确定提交

<details>
<summary>查看原文（25行）</summary>

```text
      async execute(args, exec) {
        validateGeneration(args);
        const id = newJobId(),
          dir = worker.directory();
        await recordInvocation(
          dir,
          exec.callId,
          args.prompt,
          id,
          undefined,
          exec.agent?.id ?? "",
        );
        try {
          await worker.post("/v1/jobs", generationPayload(args, id), true);
        } catch (error) {
          await recordInvocation(
            dir,
            exec.callId,
            args.prompt,
            id,
            error instanceof Error ? error.message : String(error),
            exec.agent?.id ?? "",
          );
          throw Error(`提交任务 ${id} 未确认：${error instanceof Error ? error.message : String(error)}。先用 qwen_image_status 查询该 ID，勿自动重试或运行脚本。`);
        }
```

</details>

#### 缺口

- 故障对照未执行。
  **影响**：只能指出状态差异在实现上可能发生。
  **进一步探讨**：先用能够记录 ID 的假网关，并在固定时间比对两边同一任务。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
