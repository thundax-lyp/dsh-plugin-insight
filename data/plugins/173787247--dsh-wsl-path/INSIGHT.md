# dsh-wsl-path

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2593d36](https://github.com/173787247/dsh-wsl-path/tree/2593d36d6730be46a55d798ef84eed16fce29358)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-path)
<!-- END META -->

> **功能**：在 WSL 中转换 Linux 与 Windows 路径文本并给出文件系统提示。

> **亮点**：[Q02](#research-q02) 将常见驱动器及 WSL UNC 文本转换与说明接入 DSH 工具。

> **主要限制**：[Q03](#research-q03) 工具保留原 UNC 的 input，但未单列解析出的发行版，也不验证 output 是否与当前发行版中的文件相同。

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
  - [Q01 · 路径转换相对手工或系统工具增加什么？](#detail-section-11)
  - [Q02 · 工具从入口到返回如何映射？](#detail-section-12)
  - [Q03 · 跨发行版与非标准挂载有哪些反例？](#detail-section-13)
  - [Q04 · 何时适用，遇到未知路径如何处理？](#detail-section-14)
  - [Q05 · 能否帮助用户决定转换结果可否用于打开或写入？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 WSL 与 Windows 之间交接路径的 DSH 用户。

手工换写或使用系统路径工具，并实际核对目标文件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 路径转换 | 常见 WSL/Windows 文本映射 | 保留原 input；不检查真实挂载与文件 |
| 方向识别 | 选择转换分支 | 盘符相对输入可能不同 |
| 文件系统提示 | 提醒常见使用问题 | 不等同检测报告 |
| 错误返回 | 提示非 WSL 或未识别格式 | 已识别格式也可能指错目标 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH tools 与 systemPrompt | 必需 | 注册工具和提示 | 无法正常接入 |
| WSL 环境 | 执行必需 | 识别并转换 | 非 WSL 返回错误 |
| 当前发行版与挂载一致 | 正确映射所需 | 解释目标路径 | 需系统工具和文件身份复核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对 WSL、发行版及挂载 | 条件不明时先检查系统 |
| 调用 | Agent 提交路径及方向 | 返回错误时停止使用 |
| 核对 | 用户比对发行版与真实目标 | 特别检查 UNC 和盘符 |
| 使用 | 用户确认后交给目标应用 | 写入前验证文件身份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 软件及环境费用未知 | 宿主配置与检查时间未知 | 需 WSL |
| 持续使用 | 计算费用未知 | 发行版及文件身份复核时间未知 | 路径格式不等于文件访问 |
| 失败恢复 | 恢复资源费用未知 | 排查和重新转换时间未知 | 自定义挂载未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 常见转换 | 源码按规则构造文本 | 各系统实际访问与正确率 |
| 说明 | 返回 kind、tags 与 advice | 是否降低用户错误 |
| 错误处理 | 非 WSL 或未知格式返回错误 | 特殊路径和挂载覆盖 |

> **思考**：[Q03](#research-q03) 工具保留原 UNC 的 input，但未单列解析出的发行版，也不验证 output 是否与当前发行版中的文件相同。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将常见驱动器及 WSL UNC 文本转换与说明接入 DSH 工具。

[Q03](#research-q03) 工具保留含发行版的原 UNC input，却未单列底层 r.distro；映射不读取挂载表，也不验证结果的文件身份。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 工具保留原 UNC 的 input，但未单列解析出的发行版，也不验证 output 是否与当前发行版中的文件相同。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 对涉及写入或跨发行版的路径先独立核对文件身份。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根组件静态核查；未运行 DSH、WSL 或访问目标文件，未来提示仅为假设。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/path.js、lib/wsl-host.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码静态核查；未运行 WSL、系统路径工具或宿主。
- 下一步：隔离 WSL 核对不同发行版、定制挂载、盘符相对路径和实际文件。

**分析版本**

- **仓库**：[173787247/dsh-wsl-path](https://github.com/173787247/dsh-wsl-path)
- **版本号**：0.2.0（[固定提交 2593d36](https://github.com/173787247/dsh-wsl-path/tree/2593d36d6730be46a55d798ef84eed16fce29358)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照已有原 UNC input、标签和 advice，验证单列发行版及差异提示能否减少错误目标。

隔离 WSL 核对不同发行版、定制挂载、盘符相对路径和实际文件。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 164 | — | — | 835 |
| .js | source | 3 | 255 | 228 | 10 | — |
| .js | test | 1 | 27 | 24 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-path/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-path/issues?q=is%3Aissue+created%3A2026-10-02T12%3A37%3A53.293Z..2026-11-01T12%3A37%3A53.293Z)

暂未获取：近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查固定版本的路径转换、上下文假设和使用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 路径转换相对手工或系统工具增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 WSL 内运行 DSH 的用户可把 Linux 路径转为 Windows 文本，或把驱动器和 WSL UNC 文本转回 Linux。手工换写和系统工具也是替代，本插件把结果、标签与建议作为模型工具统一返回；合格结果需目标发行版、挂载和实际可访问路径一致，不能仅以字符串生成成功判定。重复频率和节时未测。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:35-46](https://github.com/173787247/dsh-wsl-path/blob/2593d36d6730be46a55d798ef84eed16fce29358/README.md#L35-L46)

作者给出路径混用场景。

<details>
<summary>查看原文（12行）</summary>

```text
Suite floor versions: kit [`check-plugin-versions.sh`](https://github.com/173787247/dsh-wsl-kit/blob/master/scripts/check-plugin-versions.sh). Fault tree: [TROUBLESHOOTING.md](https://github.com/173787247/dsh-wsl-kit/blob/master/docs/TROUBLESHOOTING.md).

## Why

Agents and humans constantly mix `/mnt/c/Users/...` and `C:\Users\...`, or need `\\wsl$\Ubuntu\home\...` for Windows apps. This tool does the conversion and explains **drvfs vs Linux FS** trade-offs (CRLF, chmod, git).

## Tool

| Arg | Default | Meaning |
|-----|---------|---------|
| `path` | (required) | Absolute Linux or Windows path |
| `direction` | `auto` | `auto` / `toWindows` / `toLinux` |
```

</details>

**依据 2 · 源码核查**：[index.js:27-39](https://github.com/173787247/dsh-wsl-path/blob/2593d36d6730be46a55d798ef84eed16fce29358/index.js#L27-L39)

工具注册与输入参数。

<details>
<summary>查看原文（13行）</summary>

```text
  ctx.tools.register({
    name: "path_convert",
    description: "Convert paths between WSL Linux and Windows forms and explain /mnt/c vs \\\\wsl$ caveats.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["path"],
      properties: {
        path: { type: "string", description: "Absolute Linux or Windows path." },
        direction: {
          type: "string",
          enum: ["auto", "toWindows", "toLinux"],
          description: "Default auto: detect by looking for drive letter or UNC vs leading /.",
```

</details>

#### 缺口

- 无用户对照或目标系统试用
  **影响**：不能证明节时与转换正确率
  **进一步探讨**：固定跨平台任务比较系统工具、手工和插件并核对文件。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具从入口到返回如何映射？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 时检测 WSL 和发行版；执行若非 WSL 返回错误。自动方向将盘符绝对路径或 UNC 送 toLinux，其余送 toWindows；/mnt/字母映射盘符，其他绝对 Linux 路径拼入当前发行版的 wsl$ UNC。Windows 盘符与两种 WSL UNC 用正则构造 Linux 字符串，结果再附标签和 advice；路径不存在也不会被该逻辑检测。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:14-16](https://github.com/173787247/dsh-wsl-path/blob/2593d36d6730be46a55d798ef84eed16fce29358/index.js#L14-L16)

加载时读取运行环境。

```text
export function apply(ctx) {
  const wsl = detectWsl();
  const distro = distroName();
```

**依据 2 · 源码核查**：[index.js:62-93](https://github.com/173787247/dsh-wsl-path/blob/2593d36d6730be46a55d798ef84eed16fce29358/index.js#L62-L93)

WSL 门禁、方向及返回。

<details>
<summary>查看原文（32行）</summary>

```text
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      const input = String(args?.path ?? "").trim();
      let direction = args?.direction === "toWindows" || args?.direction === "toLinux"
        ? args.direction
        : "auto";
      if (direction === "auto") {
        direction = /^[a-zA-Z]:[\\/]/.test(input) || /^\\\\/.test(input) ? "toLinux" : "toWindows";
      }
      if (direction === "toWindows") {
        const r = toWindowsPath(input, { distro });
        if (!r.ok) return r;
        return {
          ok: true,
          direction,
          kind: r.kind,
          input,
          output: r.windows,
          tags: pathTags(input),
          advice: adviceFor(r.kind, direction, { input, output: r.windows }),
        };
      }
      const r = toLinuxPath(input, { distro });
      if (!r.ok) return r;
      return {
        ok: true,
        direction,
        kind: r.kind,
        input,
        output: r.linux,
        tags: pathTags(r.linux),
        advice: adviceFor(r.kind, direction, { input, output: r.linux }),
```

</details>

**依据 3 · 源码核查**：[lib/path.js:8-22](https://github.com/173787247/dsh-wsl-path/blob/2593d36d6730be46a55d798ef84eed16fce29358/lib/path.js#L8-L22)

Linux 到 Windows 的字符串规则。

<details>
<summary>查看原文（15行）</summary>

```text
export function toWindowsPath(linuxPath, { distro = distroName() } = {}) {
  const normalized = String(linuxPath || "").trim().replace(/\\/g, "/");
  if (!normalized.startsWith("/")) return { ok: false, error: "linux path must be absolute" };

  const mnt = normalized.match(/^\/mnt\/([a-zA-Z])\/(.*)$/);
  if (mnt) {
    const rest = mnt[2].replace(/\//g, "\\");
    return { ok: true, windows: `${mnt[1].toUpperCase()}:\\${rest}`, kind: "drvfs" };
  }
  const mntRoot = normalized.match(/^\/mnt\/([a-zA-Z])\/?$/);
  if (mntRoot) {
    return { ok: true, windows: `${mntRoot[1].toUpperCase()}:\\`, kind: "drvfs" };
  }
  const trimmed = normalized.replace(/^\//, "").replace(/\//g, "\\");
  return { ok: true, windows: `\\\\wsl$\\${distro}\\${trimmed}`, kind: "wsl$" };
```

</details>

**依据 4 · 源码核查**：[lib/path.js:25-48](https://github.com/173787247/dsh-wsl-path/blob/2593d36d6730be46a55d798ef84eed16fce29358/lib/path.js#L25-L48)

盘符及 UNC 到 Linux 的规则。

<details>
<summary>查看原文（24行）</summary>

```text
export function toLinuxPath(windowsPath, { distro = distroName() } = {}) {
  const raw = String(windowsPath || "").trim();
  if (!raw) return { ok: false, error: "empty windows path" };

  const drive = raw.match(/^([a-zA-Z]):[\\/]?(.*)$/);
  if (drive) {
    const rest = drive[2].replace(/\\/g, "/").replace(/^\/+/, "");
    return {
      ok: true,
      linux: rest ? `/mnt/${drive[1].toLowerCase()}/${rest}` : `/mnt/${drive[1].toLowerCase()}`,
      kind: "drvfs",
    };
  }

  // \\wsl$\Distro\... or \\wsl.localhost\Distro\...
  const unc = raw.match(/^\\\\wsl(?:\$|\.localhost)\\([^\\/]+)[\\/]?(.*)$/i);
  if (unc) {
    const name = unc[1];
    const rest = unc[2].replace(/\\/g, "/").replace(/^\/+/, "");
    return { ok: true, linux: rest ? `/${rest}` : "/", kind: "wsl$", distro: name };
  }

  return { ok: false, error: "unrecognized windows path" };
}
```

</details>

#### 缺口

- 未运行 WSL 文件访问或不同发行版
  **影响**：不能证明映射目标存在或可读写
  **进一步探讨**：隔离 WSL 对照系统路径和实际文件身份。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 跨发行版与非标准挂载有哪些反例？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

UNC 解析提取输入发行版名并原样产生 /后缀，但工具保留的 input 仍含原 UNC 及发行版名称，output 取 r.linux 且未单列底层解析出的 r.distro；若输入指向另一个发行版，这个 /路径在当前发行版不一定是同一文件。盘符固定映射 /mnt/小写盘符，不读取实际 mount 配置；Windows drive-relative 如 C:foo 被 toLinux 正则接受，但 auto 只识别盘符后斜杠，可能走相反分支。转换是字符串规则，不验证文件、权限、符号链接或特殊名。

#### 证据与依据

**依据 1 · 源码核查**：[lib/path.js:25-48](https://github.com/173787247/dsh-wsl-path/blob/2593d36d6730be46a55d798ef84eed16fce29358/lib/path.js#L25-L48)

驱动器和 UNC 解析及输入发行版名。

<details>
<summary>查看原文（24行）</summary>

```text
export function toLinuxPath(windowsPath, { distro = distroName() } = {}) {
  const raw = String(windowsPath || "").trim();
  if (!raw) return { ok: false, error: "empty windows path" };

  const drive = raw.match(/^([a-zA-Z]):[\\/]?(.*)$/);
  if (drive) {
    const rest = drive[2].replace(/\\/g, "/").replace(/^\/+/, "");
    return {
      ok: true,
      linux: rest ? `/mnt/${drive[1].toLowerCase()}/${rest}` : `/mnt/${drive[1].toLowerCase()}`,
      kind: "drvfs",
    };
  }

  // \\wsl$\Distro\... or \\wsl.localhost\Distro\...
  const unc = raw.match(/^\\\\wsl(?:\$|\.localhost)\\([^\\/]+)[\\/]?(.*)$/i);
  if (unc) {
    const name = unc[1];
    const rest = unc[2].replace(/\\/g, "/").replace(/^\/+/, "");
    return { ok: true, linux: rest ? `/${rest}` : "/", kind: "wsl$", distro: name };
  }

  return { ok: false, error: "unrecognized windows path" };
}
```

</details>

**依据 2 · 源码核查**：[index.js:64-70](https://github.com/173787247/dsh-wsl-path/blob/2593d36d6730be46a55d798ef84eed16fce29358/index.js#L64-L70)

auto 的盘符识别条件。

```text
      const input = String(args?.path ?? "").trim();
      let direction = args?.direction === "toWindows" || args?.direction === "toLinux"
        ? args.direction
        : "auto";
      if (direction === "auto") {
        direction = /^[a-zA-Z]:[\\/]/.test(input) || /^\\\\/.test(input) ? "toLinux" : "toWindows";
      }
```

**依据 3 · 源码核查**：[index.js:84-93](https://github.com/173787247/dsh-wsl-path/blob/2593d36d6730be46a55d798ef84eed16fce29358/index.js#L84-L93)

对外保留原 input 并返回 Linux 字符串与标签，但未单列底层 r.distro。

<details>
<summary>查看原文（10行）</summary>

```text
      const r = toLinuxPath(input, { distro });
      if (!r.ok) return r;
      return {
        ok: true,
        direction,
        kind: r.kind,
        input,
        output: r.linux,
        tags: pathTags(r.linux),
        advice: adviceFor(r.kind, direction, { input, output: r.linux }),
```

</details>

#### 缺口

- 未在跨发行版和定制挂载中执行
  **影响**：不能断定真实映射或可访问性
  **进一步探讨**：以独立文件标识对比不同发行版、挂载前缀及相对盘符输入。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时适用，遇到未知路径如何处理？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH tools/systemPrompt 和实际 WSL；检测采用环境变量或内核 release，发行版名缺失时回退 WSL。用户应确认发行版与挂载方式，并用系统工具和文件身份复查；未知 UNC 或不符合规则时不要直接执行写操作。初始化和人工核对时间、资源成本及兼容性未测，禁用后可回系统工具或手工核对。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:11-16](https://github.com/173787247/dsh-wsl-path/blob/2593d36d6730be46a55d798ef84eed16fce29358/index.js#L11-L16)

注入及运行环境初始化。

```text
export const name = "dsh-wsl-path";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx) {
  const wsl = detectWsl();
  const distro = distroName();
```

**依据 2 · 源码核查**：[lib/wsl-host.js:21-31](https://github.com/173787247/dsh-wsl-path/blob/2593d36d6730be46a55d798ef84eed16fce29358/lib/wsl-host.js#L21-L31)

环境检测和默认发行版名。

<details>
<summary>查看原文（11行）</summary>

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
}

export function distroName({ env = process.env } = {}) {
  return env.WSL_DISTRO_NAME || "WSL";
```

</details>

**依据 3 · 源码核查**：[lib/path.js:39-48](https://github.com/173787247/dsh-wsl-path/blob/2593d36d6730be46a55d798ef84eed16fce29358/lib/path.js#L39-L48)

UNC 处理及无法识别的边界。

<details>
<summary>查看原文（10行）</summary>

```text
  // \\wsl$\Distro\... or \\wsl.localhost\Distro\...
  const unc = raw.match(/^\\\\wsl(?:\$|\.localhost)\\([^\\/]+)[\\/]?(.*)$/i);
  if (unc) {
    const name = unc[1];
    const rest = unc[2].replace(/\\/g, "/").replace(/^\/+/, "");
    return { ok: true, linux: rest ? `/${rest}` : "/", kind: "wsl$", distro: name };
  }

  return { ok: false, error: "unrecognized windows path" };
}
```

</details>

#### 缺口

- 无 WSL 或宿主运行证据
  **影响**：无法估计错误率与实际运维负担
  **进一步探讨**：受控目录验证默认和自定义挂载并记录人工处理时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否帮助用户决定转换结果可否用于打开或写入？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有原 UNC input、kind、tags 和 advice 是直接反证，不能说没有解释信息。未验证假设是在保留原 UNC input 的基础上单列输入发行版身份，若与当前发行版不同则标记“需跨发行版核查”，帮助用户决定先核对而非直接写入；不把标记解释为系统访问验证。对照现有输出，在同发行版、跨发行版、定制挂载和 drive-relative 场景测错误目标选择、误阻、核对时间与提示负担；错误未降、误导或成本抵消收益则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/path.js:39-48](https://github.com/173787247/dsh-wsl-path/blob/2593d36d6730be46a55d798ef84eed16fce29358/lib/path.js#L39-L48)

底层提取 UNC 发行版。

<details>
<summary>查看原文（10行）</summary>

```text
  // \\wsl$\Distro\... or \\wsl.localhost\Distro\...
  const unc = raw.match(/^\\\\wsl(?:\$|\.localhost)\\([^\\/]+)[\\/]?(.*)$/i);
  if (unc) {
    const name = unc[1];
    const rest = unc[2].replace(/\\/g, "/").replace(/^\/+/, "");
    return { ok: true, linux: rest ? `/${rest}` : "/", kind: "wsl$", distro: name };
  }

  return { ok: false, error: "unrecognized windows path" };
}
```

</details>

**依据 2 · 源码核查**：[index.js:84-93](https://github.com/173787247/dsh-wsl-path/blob/2593d36d6730be46a55d798ef84eed16fce29358/index.js#L84-L93)

对外保留原 UNC input，但不单列底层 r.distro。

<details>
<summary>查看原文（10行）</summary>

```text
      const r = toLinuxPath(input, { distro });
      if (!r.ok) return r;
      return {
        ok: true,
        direction,
        kind: r.kind,
        input,
        output: r.linux,
        tags: pathTags(r.linux),
        advice: adviceFor(r.kind, direction, { input, output: r.linux }),
```

</details>

**依据 3 · 源码核查**：[lib/path.js:56-81](https://github.com/173787247/dsh-wsl-path/blob/2593d36d6730be46a55d798ef84eed16fce29358/lib/path.js#L56-L81)

已有标签与建议。

<details>
<summary>查看原文（26行）</summary>

```text
  if (/^\/home\//.test(s) || /\\\\wsl/i.test(String(linuxOrWinPath || ""))) tags.push("linux_fs");
  return tags;
}

export function adviceFor(kind, direction, { input = "", output = "" } = {}) {
  const tips = [];
  const tags = pathTags(direction === "toWindows" ? input : output || input);

  if (kind === "drvfs") {
    tips.push("Path is on /mnt/<drive> (Windows NTFS). Prefer not to chmod/chown or run heavy git metadata ops here.");
    tips.push("Line endings may be CRLF; set git core.autocrlf carefully. Use encoding_doctor path=… on .sh files.");
    tips.push("For workspace hygiene run mnt_doctor on this path — prefer cloning under /home.");
  }
  if (kind === "wsl$") {
    tips.push("Path lives on the Linux filesystem (\\\\wsl$\\…). Best place for git, npm, and chmod.");
    if (direction === "toWindows") {
      tips.push("Windows apps open this via \\\\wsl$\\<distro>\\… — Explorer and some editors support it. Chat click-open: dsh-wsl-open.");
    }
  }
  if (tags.includes("windows_user_folder")) {
    tips.push("Desktop/Downloads/Documents: fine to open files with dsh-wsl-open; avoid as the agent git/npm root.");
  }
  if (direction === "toLinux" && kind === "drvfs") {
    tips.push(`Linux form: ${output || "(see output)"} — use this in WSL shells, not C:\\…`);
  }
  return tips;
```

</details>

#### 缺口

- 未实测提示对用户判断或系统映射的影响
  **影响**：不能视为已实现或已证安全改进
  **进一步探讨**：在隔离文件集合上对照现有返回和提示原型。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
