# dsh-wsl-download

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f7ba6e6](https://github.com/173787247/dsh-wsl-download/tree/f7ba6e63b5cf16a0ebb530fdbd128493431ef78a)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-download)
<!-- END META -->

> **功能**：在 WSL 中列出、复制 Windows 下载目录文件，并提供模型注册表与 GGUF 分片复用提示。

> **亮点**：将已有 Windows 文件的查找与搬运变成代理可调用的动作，并将分片复用提示放在同一入口。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：目标路径由调用方给出，同名复制未拒绝覆盖，结果也没有验证目标摘要。[Q03](#research-q03)

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
  - [Q01 · 什么场景能从本地复用受益？](#detail-section-11)
  - [Q02 · 工具如何实际找到文件并报告结果？](#detail-section-12)
  - [Q03 · 复制是否具备安全的重试与失败边界？](#detail-section-13)
  - [Q04 · 怎样试用并改善文件交接？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已在 Windows 下载模型、再从 WSL 用现成分片的 DSH 用户。

直接使用 ls、cp -n 与摘要校验也能完成交接。插件让代理可直接调用并附带提示。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| win_download | 在 WSL 中复用下载目录文件 | 使用空目标；无网络下载或摘要校验 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
|---|---|---|
| WSL 挂载与 Windows 用户目录 | 找到源文件 | 重定向与非标准挂载需另核 |
| DSH tools/systemPrompt | 注册工具和提示 | 当前宿主兼容未执行 |

| 动作 | 操作 | 验收 |
|---|---|---|
| 列表 | 检查预期文件 | 文件名与大小正确 |
| 复制 | 选择空目标目录 | 核对目标摘要 |

**效果与成本**

| 阶段 | 资源 | 失败与退路 |
|---|---|---|
| 复制 | 目标空间与磁盘 I/O | 大文件时人工复核；同名走无覆盖方式 |

| 结果 | 支持 | 未验证 |
|---|---|---|
| 找到已有文件 | 最新项列表及路径 | 节时与漏选率 |

> **思考**：目标路径由调用方给出，同名复制未拒绝覆盖，结果也没有验证目标摘要。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将已有 Windows 文件的查找与搬运变成代理可调用的动作，并将分片复用提示放在同一入口。[Q01](#research-q01) [Q02](#research-q02)

可替换的文件系统依赖有助于定位核心边界。同步复制缺少目标隔离与原子交接，需要调用者控制目标和并发。

<a id="detail-section-5"></a>

### 1.4 主要限制

目标路径由调用方给出，同名复制未拒绝覆盖，结果也没有验证目标摘要。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

用空目录和非敏感小文件先验证。已有同名或需保证完整性时，改用外部无覆盖和摘要校验。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持本地列举、复制与提示；真实 WSL 兼容、超时行为和完整性未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/download.js、cordis.patch.yml、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本的清单、patch、入口、文件复制与提示源码。未访问注册表或运行真实 WSL。
- 下一步：先测目录缺失、同名、符号链接及中断，再记录原件和目标摘要与 Host 响应。

**分析版本**

- **仓库**：[173787247/dsh-wsl-download](https://github.com/173787247/dsh-wsl-download)
- **版本号**：0.2.0（[固定提交 f7ba6e6](https://github.com/173787247/dsh-wsl-download/tree/f7ba6e63b5cf16a0ebb530fdbd128493431ef78a)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将预览、拒绝覆盖和临时落盘后的摘要交付加入一次验证，比较误覆盖与处理时间；假设未验证。[Q04](#research-q04)

先测目录缺失、同名、符号链接及中断，再记录原件和目标摘要与 Host 响应。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 93 | — | — | 553 |
| .js | source | 3 | 238 | 213 | 2 | — |
| .js | test | 1 | 26 | 23 | 0 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-download/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-download/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 Windows 下载已完成的前提下，WSL 中的 DSH 能否用可验证的方式复用模型文件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么场景能从本地复用受益？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已在 Windows 浏览器或其他工具完成下载、接下来要在 WSL 使用同一模型分片的人，可让 DSH 找到现有文件并搬到指定目录。合格结果是选中正确的完整文件，目标路径清楚，已有文件未被破坏。相比直接用 ls 与 cp，实际新增的是代理可调用的统一接口和按注册表／模型格式分主题的提示，复制仍使用文件系统。提示只返回固定文本，不探测仓库、不实际判断分片齐备。若用户知道路径和目标，手工 cp -n 的可控性更高；若下载尚未完成，本工具不能替代下载器。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-10](https://github.com/173787247/dsh-wsl-download/blob/f7ba6e63b5cf16a0ebb530fdbd128493431ef78a/README.md#L1-L10)

作者将工具限定为列表、复制和下载实践提示。

<details>
<summary>查看原文（10行）</summary>

```text
# dsh-wsl-download
> **Install set:** part of [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit).

Tool **`win_download`**: `list`/`copy` Windows Downloads into WSL, or `hint` for ModelScope/HF/GGUF/Flash-Next playbooks (no network; skip re-downloading existing shards).

[中文说明 → README.zh.md](./README.zh.md)

## Where it sits

Lists or copies Windows Downloads, and hints ModelScope / Hugging Face / GGUF paths. It does not start a download by itself.
```

</details>

**依据 2 · 源码核查**：[lib/download.js:65-79](https://github.com/173787247/dsh-wsl-download/blob/f7ba6e63b5cf16a0ebb530fdbd128493431ef78a/lib/download.js#L65-L79)

分片建议是固定文案，明确不拉取 URL。

<details>
<summary>查看原文（15行）</summary>

```text
  if (want("gguf") || want("flash-next")) {
    tips.push(
      "GGUF: keep shards together (*-00001-of-00003.gguf …). Do not import multi-shard Flash-Next into stock Ollama — use Unsloth Desktop / patched llama.cpp.",
    );
  }
  if (want("flash-next")) {
    tips.push(
      "Flash-Next IQ1_S: if the three shards already exist locally, skip another ~67GB pull. Point Unsloth Desktop at the existing folder.",
    );
  }
  tips.push(
    "win_download list/copy only moves files already in Windows Downloads into WSL — it does not fetch URLs. Use Windows browser or existing downloaders for the pull.",
  );
  tips.push("After copy into WSL home (not /mnt/c), verify size; then host_reach / gpu_doctor before loading.");
  return tips;
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具如何实际找到文件并报告结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Profile patch 插入包并设置超时，Host apply 注册系统提示和 win_download 工具。非 WSL 的调用返回错误，分支在 core 之前，连 hint 也受入口限制。核心从 WINDOWS_USER 或 PATH 中的 Windows 用户路径构造 Downloads，按修改时间取最新三十个普通文件；它先遍历全部非点号项再截断。copy 重新检查指定 basename，因此指定的较旧文件仍可复制。返回值给出目标路径和源文件大小，调用者可据此定位结果，大小来自源文件而非目标校验。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-5](https://github.com/173787247/dsh-wsl-download/blob/f7ba6e63b5cf16a0ebb530fdbd128493431ef78a/cordis.patch.yml#L1-L5)

Profile patch 传入 30 秒。

```text
- insert:
    - id: dsh-wsl-download
      name: dsh-wsl-download
      config:
        timeoutMs: 30000
```

**依据 2 · 源码核查**：[index.js:7-29](https://github.com/173787247/dsh-wsl-download/blob/f7ba6e63b5cf16a0ebb530fdbd128493431ef78a/index.js#L7-L29)

工具注册与 WSL 分支实际接通。

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_download",
    order: 124,
    text: "Use win_download to list/copy Windows Downloads into WSL, or action=hint for ModelScope/HF/GGUF/Flash-Next playbook (do not re-download existing shards).",
  });

  ctx.tools.register({
    name: "win_download",
    description: "List/copy files from Windows Downloads into WSL, or hint ModelScope/HF/GGUF download practices.",
    parameters: core.parameters(config),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

</details>

**依据 3 · 源码核查**：[lib/download.js:82-105](https://github.com/173787247/dsh-wsl-download/blob/f7ba6e63b5cf16a0ebb530fdbd128493431ef78a/lib/download.js#L82-L105)

下载目录通过环境变量或 PATH 推断。

<details>
<summary>查看原文（24行）</summary>

```text
function downloadsDir(env = process.env) {
  const m = (env.PATH || "").match(/\/mnt\/c\/Users\/([^/]+)/);
  const user = env.WINDOWS_USER || (m ? m[1] : "");
  if (!user) return "";
  return `/mnt/c/Users/${user}/Downloads`;
}

export async function execute(args, _config = {}, deps = {}) {
  const action = ["list", "copy", "hint"].includes(args?.action) ? args.action : "list";
  if (action === "hint") {
    const topic = typeof args?.topic === "string" ? args.topic : "all";
    return { ok: true, action, topic, advice: buildDownloadHints(topic) };
  }

  const exists = deps.exists || existsSync;
  const readdir = deps.readdir || readdirSync;
  const stat = deps.stat || statSync;
  const copyFile = deps.copyFile || copyFileSync;
  const mkdir = deps.mkdir || mkdirSync;
  const env = deps.env || process.env;
  const downloads = downloadsDir(env);
  if (!downloads || !exists(downloads)) {
    return { ok: false, action, error: "Windows Downloads folder not found under /mnt/c/Users/…" };
  }
```

</details>

**依据 4 · 源码核查**：[lib/download.js:106-137](https://github.com/173787247/dsh-wsl-download/blob/f7ba6e63b5cf16a0ebb530fdbd128493431ef78a/lib/download.js#L106-L137)

列表截断与复制执行路径。

<details>
<summary>查看原文（32行）</summary>

```text
  const names = readdir(downloads).filter((n) => !n.startsWith("."));
  const files = names
    .map((name) => {
      const p = join(downloads, name);
      try {
        const st = stat(p);
        if (!st.isFile()) return null;
        return { name, size: st.size, mtimeMs: st.mtimeMs };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
    .slice(0, 30);
  if (action === "list") return { ok: true, action, downloads, files };

  const name = typeof args?.name === "string" ? basename(args.name.trim()) : "";
  if (!name || name !== args.name?.trim() || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return { ok: false, action, downloads, error: "name must be a plain basename" };
  }
  const src = join(downloads, name);
  if (!exists(src) || !stat(src).isFile()) {
    return { ok: false, action, downloads, error: "file not found in Downloads" };
  }
  const destDir = typeof args?.destDir === "string" && args.destDir.trim()
    ? resolve(args.destDir.trim())
    : process.cwd();
  mkdir(destDir, { recursive: true });
  const dest = join(destDir, name);
  copyFile(src, dest);
  return { ok: true, action, downloads, dest, files: [{ name, size: stat(src).size }] };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 复制是否具备安全的重试与失败边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

非标准挂载、重定向 Downloads 或 PATH 缺少用户名会使默认目录推断失败。basename 检查阻止直接把源文件名写成路径，但 stat 会跟随链接，源码未展示对源 realpath 的目录内校验。destDir 是模型可传的路径，resolve 后直接创建，源码未展示目标工作区约束；实际可写范围仍取决于进程和宿主。copyFileSync 不带禁止覆盖选项，目的同名文件可被覆盖，且没有显示进度、摘要或显式恢复记录。工具宣告可并发，目标文件名冲突时没有应用层协调。大文件需要等量目标空间和复制时间，同步调用还可能阻塞宿主事件循环；入口超时声明不足以证明中途能取消。仅列名也会向调用工具的模型暴露最近文件名。

#### 证据与依据

**依据 1 · 源码核查**：[lib/download.js:82-104](https://github.com/173787247/dsh-wsl-download/blob/f7ba6e63b5cf16a0ebb530fdbd128493431ef78a/lib/download.js#L82-L104)

路径是固定结构上的推断。

<details>
<summary>查看原文（23行）</summary>

```text
function downloadsDir(env = process.env) {
  const m = (env.PATH || "").match(/\/mnt\/c\/Users\/([^/]+)/);
  const user = env.WINDOWS_USER || (m ? m[1] : "");
  if (!user) return "";
  return `/mnt/c/Users/${user}/Downloads`;
}

export async function execute(args, _config = {}, deps = {}) {
  const action = ["list", "copy", "hint"].includes(args?.action) ? args.action : "list";
  if (action === "hint") {
    const topic = typeof args?.topic === "string" ? args.topic : "all";
    return { ok: true, action, topic, advice: buildDownloadHints(topic) };
  }

  const exists = deps.exists || existsSync;
  const readdir = deps.readdir || readdirSync;
  const stat = deps.stat || statSync;
  const copyFile = deps.copyFile || copyFileSync;
  const mkdir = deps.mkdir || mkdirSync;
  const env = deps.env || process.env;
  const downloads = downloadsDir(env);
  if (!downloads || !exists(downloads)) {
    return { ok: false, action, error: "Windows Downloads folder not found under /mnt/c/Users/…" };
```

</details>

**依据 2 · 源码核查**：[lib/download.js:123-137](https://github.com/173787247/dsh-wsl-download/blob/f7ba6e63b5cf16a0ebb530fdbd128493431ef78a/lib/download.js#L123-L137)

basename、跟随 stat、目标创建和直接复制。

<details>
<summary>查看原文（15行）</summary>

```text
  const name = typeof args?.name === "string" ? basename(args.name.trim()) : "";
  if (!name || name !== args.name?.trim() || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return { ok: false, action, downloads, error: "name must be a plain basename" };
  }
  const src = join(downloads, name);
  if (!exists(src) || !stat(src).isFile()) {
    return { ok: false, action, downloads, error: "file not found in Downloads" };
  }
  const destDir = typeof args?.destDir === "string" && args.destDir.trim()
    ? resolve(args.destDir.trim())
    : process.cwd();
  mkdir(destDir, { recursive: true });
  const dest = join(destDir, name);
  copyFile(src, dest);
  return { ok: true, action, downloads, dest, files: [{ name, size: stat(src).size }] };
```

</details>

**依据 3 · 源码核查**：[index.js:19-29](https://github.com/173787247/dsh-wsl-download/blob/f7ba6e63b5cf16a0ebb530fdbd128493431ef78a/index.js#L19-L29)

工具声明超时和并发，执行路径未传取消信号。

<details>
<summary>查看原文（11行）</summary>

```text
    description: "List/copy files from Windows Downloads into WSL, or hint ModelScope/HF/GGUF download practices.",
    parameters: core.parameters(config),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

</details>

#### 缺口

- 未实测 WSL 链接、同名和中断。
  **影响**：无法确认实际宿主防护或失败后残留。
  **进一步探讨**：在独立目录制造同名、无权限和大文件中断，检查原文件、目的文件与 Host 可响应性。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用并改善文件交接？

**研究主题**：采用判断、新假设与验证

#### 完整回答

只在隔离 WSL 目录先列出一份非敏感小文件，显式给空目标，复制后用外部摘要与源比对。目标已有同名、宿主会阻塞，或列表含敏感名时退出，改用自己掌控的 cp -n 和校验。后续可试验先展示源与目标并拒绝覆盖，再临时落盘及校验后交付的流程。对照当前直接复制与增强流程，在同名、截断、链接和两个调用竞争时比较原文件保留、目标摘要及用户处理时间。若不能减少误覆盖，或增加的校验读写超过预定时延预算，假设不成立。此流程尚未实现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/download.js:121-137](https://github.com/173787247/dsh-wsl-download/blob/f7ba6e63b5cf16a0ebb530fdbd128493431ef78a/lib/download.js#L121-L137)

当前交接返回路径和源大小，提供对照基线。

<details>
<summary>查看原文（17行）</summary>

```text
  if (action === "list") return { ok: true, action, downloads, files };

  const name = typeof args?.name === "string" ? basename(args.name.trim()) : "";
  if (!name || name !== args.name?.trim() || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return { ok: false, action, downloads, error: "name must be a plain basename" };
  }
  const src = join(downloads, name);
  if (!exists(src) || !stat(src).isFile()) {
    return { ok: false, action, downloads, error: "file not found in Downloads" };
  }
  const destDir = typeof args?.destDir === "string" && args.destDir.trim()
    ? resolve(args.destDir.trim())
    : process.cwd();
  mkdir(destDir, { recursive: true });
  const dest = join(destDir, name);
  copyFile(src, dest);
  return { ok: true, action, downloads, dest, files: [{ name, size: stat(src).size }] };
```

</details>

#### 缺口

- 无上述故障注入结果。
  **影响**：只能建议受控试用，不能当作完整的模型搬运流程。
  **进一步探讨**：先用小样本验证后再扩大到模型分片。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
