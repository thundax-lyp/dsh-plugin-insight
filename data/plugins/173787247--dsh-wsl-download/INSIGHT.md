# dsh-wsl-download

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[8b1db94](https://github.com/173787247/dsh-wsl-download/tree/8b1db94ca8658004ebc304e9678bbdd54a491133)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download)
<!-- END META -->

> **实现功能**：在 WSL 中列举或复制 Windows Downloads 单文件，并给出模型下载静态提示。

> **核心亮点**：提供 Windows Downloads 到 WSL 的简单模型工具入口，详见[Q01](#research-q01)。

> **风险与缺陷**：destDir 任意、默认覆盖同名文件，源 stat 跟随符号链接；详见[Q02](#research-q02)。 copy前先stat整目录且同步不接signal，30/15秒不等总IO或取消保证。

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
  - [Q01 · win_download 实际下载还是只列举/复制？](#detail-section-11)
  - [Q02 · 复制路径与现有文件保护充分吗？](#detail-section-12)
  - [Q03 · 大模型分片迁移需要什么额外保障？](#detail-section-13)
  - [Q04 · 三阶段资源、人时与效果如何衡量？](#detail-section-14)
  - [Q05 · 建议与来源/完整性约束的复制设计如何推导？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：把 Windows 已下载文件搬入 WSL，或查询模型文件获取建议。

WSL shell 中 ls/cp Windows Downloads。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 实际行为 | 边界 |
| --- | --- | --- |
| list | 最近 30 个文件 | 非完整库存 |
| copy | 单文件同步复制 | 可覆盖目标 |
| hint | 静态文本 | 不下载/不查重 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
| --- | --- | --- | --- |
| DSH tools/systemPrompt与Node文件接口 | 必需 | 注册与本机读写 | 工具加载/执行失败 |
| apply时检测为WSL | 执行入口必需 | list/copy/hint的统一gate | not running in WSL，即便hint本身无网络/文件 |
| WINDOWS_USER或PATH推断/mnt/c用户Downloads | list/copy必需 | Windows已下载文件来源 | 不支持所有重定向/盘符布局 |
| 明确受权源和空目标/足够空间 | copy必需 | 避免覆盖/错根 | 原生fs不提供Agent沙箱和校验事务 |

#### 启动步骤

| 步骤 | 动作 | 成功判据与边界 |
| --- | --- | --- |
| 定位 | 明确当前Windows用户/Downloads和目标绝对路径 | 非隐式多用户搜索 |
| 盘点 | list仅看最近30摘要，必要时人工查完整目录 | 不当完整库存/可复制白名单 |
| 确认 | 人工核源realpath、目标空目录和空间 | 默认copy可覆盖，同名不代表同内容 |
| 复制 | 受权后单文件copy | ok只调用返回，仍需核目标大小/hash |
| 恢复 | 有误先核目标状态/备份，再决定重做 | 不把超时当确定未复制，不盲重试覆盖 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 现有WSL/Windows存储与DSH包 | 确认用户路径、目标权限/备份和覆盖政策 | 安装工时/应用环境费用未知，不需新云下载服务 |
| 持续使用 | 全目录stat/排序、单文件同步磁盘IO与目标额外空间 | 核源/目标、手工验证hash/分片组 | 30为返回上限，吞吐/总阻塞时间未知 |
| 失败恢复 | 重复制/校验、目标备份及磁盘空间资源 | 核部分目标/覆盖损失，恢复原件和完整分片清单 | 无断点/事务/自动撤销，金额工时未知 |

#### 效果

| 目标 | 当前增量 | 边界 |
| --- | --- | --- |
| 少手写路径 | 推断Downloads/list摘要与copy入口 | 用户推断不覆盖所有布局 |
| 单文件转运 | copyFileSync与dest返回 | 同手工cp产物，不验证hash/分片组 |
| 获取建议 | 固定提示字符串 | 不联网/查重/下载，不认证当前平台能力 |

> **思考**：destDir 任意、默认覆盖同名文件，源 stat 跟随符号链接；详见[Q02](#research-q02)。 copy前先stat整目录且同步不接signal，30/15秒不等总IO或取消保证。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：提供 Windows Downloads 到 WSL 的简单模型工具入口，详见[Q01](#research-q01)。

提供 Windows Downloads 到 WSL 的简单模型工具入口，详见[Q01](#research-q01)。

原生同步readdir/stat/copy不经宿主管理的fs/sandbox，dest默认process.cwd；完整目录访问后才取30展示，默认覆盖/跟随源链接，无目标hash/组清单/总期限。固定提示与formatter测试不证明复制可靠性。

<a id="detail-section-5"></a>

### 1.4 主要限制

destDir 任意、默认覆盖同名文件，源 stat 跟随符号链接；详见[Q02](#research-q02)。 copy前先stat整目录且同步不接signal，30/15秒不等总IO或取消保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

先 list、核源路径与目标目录，在空目录试单文件；大分片用有校验和断点机制的工具；详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持 list/copy/hint；无网络下载和自动分片去重，覆盖/链接边界待注意。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/download.js、lib/wsl-host.js、test/download.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交；未复制真实 Windows 文件或运行目标测试。
- 下一步：测试用户名推断、symlink、已存在目标、磁盘不足、大分片中断。

**分析版本**

- **仓库**：[173787247/dsh-wsl-download](https://github.com/173787247/dsh-wsl-download)
- **版本号**：0.2.0（[固定提交 8b1db94](https://github.com/173787247/dsh-wsl-download/tree/8b1db94ca8658004ebc304e9678bbdd54a491133)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索授权realpath、默认no-clobber与分片清单/hash、有限可取消临时复制和明确组状态；有IO/空间/维护代价，尚未实现。详见[Q05](#research-q05)。

测试用户名推断、symlink、已存在目标、磁盘不足、大分片中断。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 93 | — | — | 553 |
| .js | source | 3 | 238 | 213 | 2 | — |
| .js | test | 1 | 26 | 23 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download/issues?q=is%3Aissue+created%3A2026-09-22T07%3A31%3A06.616Z..2026-10-22T07%3A31%3A06.616Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A31%3A06.616Z..2026-10-22T07%3A31%3A06.616Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**区分 Windows Downloads 列表/复制实现与下载、分片保障的声明。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · win_download 实际下载还是只列举/复制？

**研究主题：**场景与需求、贡献与相对优势、功能与机制

#### 完整回答

工具注册 list/copy/hint；hint 仅返回静态 ModelScope/HF/GGUF/Flash-Next 建议，无网络调用，也不扫描已有模型缓存。list 从推断的 /mnt/c/Users/<user>/Downloads 取非隐藏的普通文件、按 mtime 排序并截取 30 个；copy 按提供的纯 basename 复制单个文件到目标目录。README 所谓“跳过重新下载已有 shards”是提示文字，不是自动查重或下载管理。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:11-30](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/index.js#L11-L30)

工具注册与 WSL gate。

<details>
<summary>查看原文（20行）</summary>

```text
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
    },
```

</details>

**依据 2 · 源码核查**：[lib/download.js:44-80](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/lib/download.js#L44-L80)

纯提示文本。

<details>
<summary>查看原文（37行）</summary>

```text
/** Pure download/registry playbook — no network I/O. */
export function buildDownloadHints(topic = "all") {
  const t = ["all", "modelscope", "huggingface", "gguf", "flash-next"].includes(topic)
    ? topic
    : "all";
  const tips = [];
  const want = (x) => t === "all" || t === x;

  if (want("modelscope")) {
    tips.push(
      "ModelScope (魔搭): prefer direct CN path; do not force international VPN. Check net_doctor target=registry if HTTPS fails.",
    );
    tips.push(
      "Before re-download: search local snapshots (e.g. unsloth-local/models_gguf or HuggingFace cache) and any models_gguf_local.json inventory.",
    );
  }
  if (want("huggingface")) {
    tips.push(
      "Hugging Face: often needs HTTP(S)_PROXY + NODE_USE_ENV_PROXY=1 from WSL; pair with net_doctor. Prefer huggingface-cli / modelscope already configured on Windows when files land in Downloads.",
    );
  }
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
}
```

</details>

**依据 3 · 源码核查**：[lib/download.js:89-137](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/lib/download.js#L89-L137)

list/copy 实现。

<details>
<summary>查看原文（49行）</summary>

```text
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

**依据 4 · 作者声明**：[README.md:4-10](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/README.md#L4-L10)

用途声明。

```text
Tool **`win_download`**: `list`/`copy` Windows Downloads into WSL, or `hint` for ModelScope/HF/GGUF/Flash-Next playbooks (no network; skip re-downloading existing shards).

[中文说明 → README.zh.md](./README.zh.md)

## Where it sits

Lists or copies Windows Downloads, and hints ModelScope / Hugging Face / GGUF paths. It does not start a download by itself.
```

#### 缺口

- WINDOWS_USER或PATH推断用户名能否对应目标用户的真实Downloads重定向位置未核。
  **影响：**目录不存在不等用户没有下载文件，也不支持所有盘符/重定向目录。
  **进一步探讨：**可先核明确目标用户路径/系统重定向配置，不能自动扩大到其他用户目录。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 复制路径与现有文件保护充分吗？

**研究主题：**工程质量与复用、缺陷与关键质疑

#### 完整回答

源文件名以 basename 且拒绝分隔符/..，可挡常规路径穿越。但 statSync 默认跟随符号链接，Downloads 中若有 symlink，isFile 可把其指向的别处文件视为来源。destDir 用 resolve 接受任意可写目录、递归 mkdir，copyFileSync 默认覆盖目标同名文件，未检查目标是否存在、是否为 symlink，也未执行哈希/容量校验。工具标记 isConcurrencySafe true，同名目标并发复制可能竞争。应先在隔离目录人工审阅源/目标与覆盖行为。

所有实际文件操作用原生同步fs，不经宿主受管fs/sandboxPolicy或exec.signal，destDir缺省是宿主process.cwd而非明确绑定当前Agent会话cwd。copy动作也先读取目录并stat全部非隐藏项、排序后取30，30只是返回展示限额，不是访问量或copy源限制；可复制不在最近30里的指定basename。同步copy没有本层进度、取消或总字节预算，15秒工具注册不保证复制已停止，失败后目标/原进程状态需要另核。

#### 证据与依据

**依据 1 · 源码核查**：[lib/download.js:96-113](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/lib/download.js#L96-L113)

stat 跟随链接并筛选文件。

<details>
<summary>查看原文（18行）</summary>

```text
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
  const names = readdir(downloads).filter((n) => !n.startsWith("."));
  const files = names
    .map((name) => {
      const p = join(downloads, name);
      try {
        const st = stat(p);
        if (!st.isFile()) return null;
        return { name, size: st.size, mtimeMs: st.mtimeMs };
```

</details>

**依据 2 · 源码核查**：[lib/download.js:123-137](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/lib/download.js#L123-L137)

basename、防穿越、任意 destDir、copyFile。

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

**依据 3 · 源码核查**：[index.js:25-30](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/index.js#L25-L30)

并发安全声明。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
    },
```

**依据 4 · 源码核查**：[lib/download.js:89-137](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/lib/download.js#L89-L137)

copy前仍完整目录stat/排序，原生同步操作及process.cwd目标。

<details>
<summary>查看原文（49行）</summary>

```text
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

**依据 5 · 源码核查**：[index.js:25-30](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/index.js#L25-L30)

注册timeout与execute未传signal，非同步copy强停保证。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
    },
```

#### 缺口

- 未实测 Windows 盘符下 symlink/权限
  **影响：**跨系统文件元数据和覆盖失败表现未知
  **进一步探讨：**隔离测试 symlink 与已存在目标文件

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 大模型分片迁移需要什么额外保障？

**研究主题：**依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

提示要求分片保同目录、复制后核尺寸；但 copy 每次只处理一个文件，未提供整组清单、总大小、剩余空间、哈希或原子落地，也未防止覆盖完整 shard。由此适合作为小文件人工转运和路径提示；数十 GB 模型分片应先用专门工具核完整性、磁盘空间和目标覆盖策略，手动校验。WSL gate 与 /mnt/c/Users 推断使其仅适用于对应环境。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
| --- | --- | --- | --- |
| DSH tools/systemPrompt与Node文件接口 | 必需 | 注册与本机读写 | 工具加载/执行失败 |
| apply时检测为WSL | 执行入口必需 | list/copy/hint的统一gate | not running in WSL，即便hint本身无网络/文件 |
| WINDOWS_USER或PATH推断/mnt/c用户Downloads | list/copy必需 | Windows已下载文件来源 | 不支持所有重定向/盘符布局 |
| 明确受权源和空目标/足够空间 | copy必需 | 避免覆盖/错根 | 原生fs不提供Agent沙箱和校验事务 |

#### 启动步骤

| 步骤 | 动作 | 成功判据与边界 |
| --- | --- | --- |
| 定位 | 明确当前Windows用户/Downloads和目标绝对路径 | 非隐式多用户搜索 |
| 盘点 | list仅看最近30摘要，必要时人工查完整目录 | 不当完整库存/可复制白名单 |
| 确认 | 人工核源realpath、目标空目录和空间 | 默认copy可覆盖，同名不代表同内容 |
| 复制 | 受权后单文件copy | ok只调用返回，仍需核目标大小/hash |
| 恢复 | 有误先核目标状态/备份，再决定重做 | 不把超时当确定未复制，不盲重试覆盖 |

模型平台/引擎兼容与特定67GB数字只保留为固定版本内的静态提示，不代表本轮核实当前下载服务、引擎版本或实际已节省下载。

#### 证据与依据

**依据 1 · 源码核查**：[lib/download.js:65-79](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/lib/download.js#L65-L79)

分片与尺寸仅建议。

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

**依据 2 · 源码核查**：[lib/download.js:82-87](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/lib/download.js#L82-L87)

用户目录推断。

```text
function downloadsDir(env = process.env) {
  const m = (env.PATH || "").match(/\/mnt\/c\/Users\/([^/]+)/);
  const user = env.WINDOWS_USER || (m ? m[1] : "");
  if (!user) return "";
  return `/mnt/c/Users/${user}/Downloads`;
}
```

**依据 3 · 源码核查**：[lib/download.js:123-137](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/lib/download.js#L123-L137)

单文件 copy 无校验。

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

**依据 4 · 作者声明**：[README.md:20-30](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/README.md#L20-L30)

Kit 和版本边界。

<details>
<summary>查看原文（11行）</summary>

```text
## Compatibility

| Field | Value |
|-------|-------|
| **Plugin** | `dsh-wsl-download` **0.2.0** |
| **Minimum dsh** | ≥ **0.1.2** (web UI one-shot `?token=` on Windows relay `:3081`) |
| **Latest verified** | See [dsh-wsl-kit Compatibility](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) (currently **`0.2.0-rc.2`**) — single source of truth for the suite |
| **Kit set** | `full` or install alone |
| **Cloud Flash** | Use model id **`deepseek-flash`** (V4.1 Flash) in `~/.dsh/settings.yaml` / `llm-deepseek` — not configured by this plugin |
| **Agent Teams** | Upstream experimental; not required here |

```

</details>

#### 缺口

- 未复制大分片
  **影响：**吞吐、磁盘不足及断电后的文件状态未知
  **进一步探讨：**隔离大文件与失败注入测试

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 三阶段资源、人时与效果如何衡量？

**研究主题：**效果与总成本

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 现有WSL/Windows存储与DSH包 | 确认用户路径、目标权限/备份和覆盖政策 | 安装工时/应用环境费用未知，不需新云下载服务 |
| 持续使用 | 全目录stat/排序、单文件同步磁盘IO与目标额外空间 | 核源/目标、手工验证hash/分片组 | 30为返回上限，吞吐/总阻塞时间未知 |
| 失败恢复 | 重复制/校验、目标备份及磁盘空间资源 | 核部分目标/覆盖损失，恢复原件和完整分片清单 | 无断点/事务/自动撤销，金额工时未知 |

#### 效果

| 目标 | 当前增量 | 边界 |
| --- | --- | --- |
| 少手写路径 | 推断Downloads/list摘要与copy入口 | 用户推断不覆盖所有布局 |
| 单文件转运 | copyFileSync与dest返回 | 同手工cp产物，不验证hash/分片组 |
| 获取建议 | 固定提示字符串 | 不联网/查重/下载，不认证当前平台能力 |

基线是ls/cp加独立校验。复制会占源/目标磁盘带宽和目标空间，不能以工具无网络就说无成本。提示“已有分片不重下载”没有自动库存核对或下载控制，不能据此算节省。合格比较要包含正确文件完整落地、覆盖恢复和人工核验成本，金额/时长/可靠性未知。

#### 证据与依据

**依据 1 · 源码核查**：[lib/download.js:89-137](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/lib/download.js#L89-L137)

完整目录元数据与同步copy，无完整性/空间事务。

<details>
<summary>查看原文（49行）</summary>

```text
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

**依据 2 · 源码核查**：[test/download.test.js:1-26](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/test/download.test.js#L1-L26)

作者测试只覆盖静态提示与format，不是copy可靠性对照。

<details>
<summary>查看原文（26行）</summary>

```text
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildDownloadHints, format } from "../lib/download.js";

describe("buildDownloadHints", () => {
  it("covers modelscope and flash-next", () => {
    const all = buildDownloadHints("all");
    assert.ok(all.some((t) => /ModelScope/i.test(t)));
    assert.ok(all.some((t) => /Flash-Next/i.test(t)));
    assert.ok(all.some((t) => /does not fetch URLs/i.test(t)));
  });

  it("scopes topic=gguf", () => {
    const tips = buildDownloadHints("gguf");
    assert.ok(tips.some((t) => /GGUF/i.test(t)));
    assert.ok(!tips.some((t) => /ModelScope/i.test(t)));
  });
});

describe("format", () => {
  it("formats hint advice", () => {
    const text = format({ ok: true, action: "hint", advice: ["a tip"] });
    assert.match(text, /action=hint/);
    assert.match(text, /a tip/);
  });
});
```

</details>

#### 缺口

- 目录规模、磁盘吞吐与失败后恢复工时无对照。
  **影响：**不承诺转运效率或收益。
  **进一步探讨：**可先用合成文件/目录比较正确复制、取消/错误状态和人工核验总成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 建议与来源/完整性约束的复制设计如何推导？

**研究主题：**采用判断、新假设与验证

#### 完整回答

建议观察。hint/list可辅助了解固定提示和最近文件，但copy默认覆盖、原生权限/任意目标与同步阻塞影响可靠搬运。继续可从受信用户、已核小普通文件、空隔离目标及外部校验入手，不能承担唯一原件备份或大分片完整性保证。

相对当前按basename直接copy，可探讨“授权来源与完整性清单复制”。核源/目标realpath和明确权限，默认no-clobber，先声明整组分片名/字节/hash与可用空间；临时文件有限/可取消流式拷贝，逐件核hash后改名，整组清单仅在全部成功后标complete。需定义并发目标所有权与失败残留；不能用单次rename承诺整组原子事务。额外代价是hash双读IO、临时空间/清单维护，源变化须重授权。未实现，不计现有贡献。

最小反例是symlink换代/同名覆盖、源拷贝中变化、少分片/错误hash、空间不足、取消和并发同目标。若仍未经授权覆盖或部分组记complete，则否定可靠性；若校验代价使小文件任务更慢而不降低错配/恢复负担，则不支持默认启用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/download.js:123-137](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/lib/download.js#L123-L137)

单件源/目标与默认覆盖是方案基线。

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

**依据 2 · 源码核查**：[lib/download.js:65-79](https://github.com/173787247/dsh-wsl-download/blob/8b1db94ca8658004ebc304e9678bbdd54a491133/lib/download.js#L65-L79)

分片/尺寸建议仅文字，不是组完整性实现。

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

#### 缺口

- 授权清单和有界复制方案未实现。
  **影响：**不当当前完整性或可取消保证。
  **进一步探讨：**可用无私人数据的合成反例分别核权限、文件完整性、组状态与恢复成本。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
