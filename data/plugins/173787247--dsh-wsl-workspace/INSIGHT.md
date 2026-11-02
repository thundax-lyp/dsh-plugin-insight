# dsh-wsl-workspace

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[fb3b646](https://github.com/173787247/dsh-wsl-workspace/tree/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-workspace)
<!-- END META -->

> **功能**：只读列出WSL发行版并检查工作区路径，以位置和目录状态给建议，不搬迁文件或实测性能。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将发行版和路径常识整理成窄只读模型工具，分离纯规则与命令，减少手工拼结果，不继承套件其他诊断能力。

> **主要限制**：[Q03](#research-q03) 分类先于realpath可使path与kind/onMnt/ok不一致；/mnt标签不证性能，list吞错仍ok、宿主cwd和.git存在性也有限。

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
  - [Q01 · 工作区检查比手工pwd和wsl.exe增加什么？](#detail-section-11)
  - [Q02 · list/check、cwd和路径状态实际如何计算？](#detail-section-12)
  - [Q03 · 路径标签能否认证性能和真实挂载？](#detail-section-13)
  - [Q04 · 怎样限定试用，并验证路径建议的净价值？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在WSL开始或排查DSH项目的用户需辨发行版和路径位置，最终项目构建/权限另核。

手工wsl.exe、pwd/mount及.git检查；结构化解释是增量，不是新的文件系统诊断或迁移机制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| list | 当前/默认发行版线索 | wsl.exe失败仍可回当前 |
| check | 目录/路径标签与建议 | 宿主cwd、分类先realpath，非实测 |
| 迁移建议 | 提示~/src等 | 不创建/迁移，需备份与真实项目核验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/prompt、Node>=18 | 必需 | 工具注册 | 宿主兼容未验 |
| WSL检测/interop/wsl.exe | list必需 | 发行版命令 | 吞错回当前，不当全列表 |
| 明确绝对路径/可stat目录 | check必需 | 存在/目录与标签 | 宿主cwd非会话目标 |
| 原生实际路径/项目验证 | 采用前提 | 挂载、权限与性能 | 标签不作为迁移依据 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 输入 | 明确目标绝对路径或list | 不依默认cwd猜项目 |
| 复核 | 比path/kind/onMnt并查实际挂载 | 符号链接/未知先人工 |
| 决策 | 副本实际构建/监听/权限 | 不按/mnt单标签迁移 |
| 退出 | 停工具回原生命令 | 迁移另备份保原项目 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主/WSL环境 | 安装、理解标签 | 时间未知 |
| 持续 | stat或两Windows进程/模型token | 阅读与实际路径复核 | 无独立API不等总成本0 |
| 失败恢复 | 若采迁移另占磁盘 | 核Git/权限/监听与回迁 | 插件不搬文件，后续代价另计 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 发行版线索 | 当前/默认和列表解析 | 吞错/复杂名称真实覆盖 |
| 位置标签 | 原输入字符串分类 | symlink真实FS/性能权限 |
| 低写副作用 | 本工具只读不迁移 | 采纳迁移后的净收益 |

> **思考**：[Q03](#research-q03) 分类先于realpath可使path与kind/onMnt/ok不一致；/mnt标签不证性能，list吞错仍ok、宿主cwd和.git存在性也有限。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将发行版和路径常识整理成窄只读模型工具，分离纯规则与命令，减少手工拼结果，不继承套件其他诊断能力。

[Q02](#research-q02) 命令与分类/advice拆分可复用；[Q03](#research-q03) 先规范真实路径后分类、错误不折叠成功，ok应解释范围而非性能通行证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 分类先于realpath可使path与kind/onMnt/ok不一致；/mnt标签不证性能，list吞错仍ok、宿主cwd和.git存在性也有限。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 只读线索小试但显式给路径、核实际挂载；符号链接/自定义挂载或输出不一致停并回原生命令，迁移前保原件测真实项目。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

重核固定完整入口/222行workspace和正式findings；无目标命令/测试/迁移执行，真实性能/权限未知，符号链接矛盾为源码推导。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/workspace.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定44行入口、222行workspace、README/package与WSL检测依赖；不运行Windows命令或探针、不审实际挂载实现。
- 下一步：[Q04](#research-q04) 显式路径对照symlink两方向、命令失败/自定义挂载和真实构建，测误建议与成本，未执行。

**分析版本**

- **仓库**：[173787247/dsh-wsl-workspace](https://github.com/173787247/dsh-wsl-workspace)
- **版本号**：0.2.0（[固定提交 fb3b646](https://github.com/173787247/dsh-wsl-workspace/tree/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证是按真实路径/明确错误再选授权工作负载探针，比较符号链接/自定义挂载误建议；不把临时写探针伪装只读。

[Q04](#research-q04) 显式路径对照symlink两方向、命令失败/自定义挂载和真实构建，测误建议与成本，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 98 | — | — | 559 |
| .js | source | 3 | 323 | 293 | 2 | — |
| .js | test | 1 | 65 | 60 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-workspace/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：发行版/工作区路径线索能支持什么建议，怎样避免误作性能认证？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 工作区检查比手工pwd和wsl.exe增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用于WSL启动DSH项目前列发行版，或给一个Linux路径判断是否适合作工作根。相对手工wsl.exe列表、pwd和查看.git，它将list/check、当前/默认发行版差异与常见/mnt经验整理成模型可读结果。不会创建目录、迁移代码、切换发行版或修挂载；给mkdir/move建议不等实际执行。

适合不熟悉WSL路径或排项目位置错误的用户；已明确项目环境且有自定义挂载者未必需这一提示。合格结果是路径/发行版线索真实、建议不冒充性能和权限验收，最终能否构建/监听需真实项目验证。工具名包名是dsh-wsl-workspace-check，仓库名dsh-wsl-workspace，保持同一固定根身份。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-28](https://github.com/173787247/dsh-wsl-workspace/blob/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587/README.md#L17-L28)

作者路径卫生定位。

<details>
<summary>查看原文（12行）</summary>

````text
**`wsl_workspace`**: list distros; check Linux workspace paths (/mnt hygiene, suggest ~/src).

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-workspace
npm test
```

MIT

## Where it sits

Lists distros and checks that a Linux workspace path is not a slow /mnt mistake.
````

</details>

**依据 2 · 源码核查**：[index.js:4-30](https://github.com/173787247/dsh-wsl-workspace/blob/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587/index.js#L4-L30)

工具名与注册/执行。

<details>
<summary>查看原文（27行）</summary>

```text
export const name = "dsh-wsl-workspace-check";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:wsl_workspace",
    order: 110,
    text: "Use wsl_workspace to list distros or check a Linux workspace path (flag /mnt Desktop, .git, suggest ~/src). Pair with mnt_doctor / distro_info / path_convert.",
  });

  ctx.tools.register({
    name: "wsl_workspace",
    description:
      "List WSL distros (current vs default) or validate a Linux workspace path for DSH (/mnt hygiene).",
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

**依据 3 · 源码核查**：[lib/workspace.js:93-105](https://github.com/173787247/dsh-wsl-workspace/blob/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587/lib/workspace.js#L93-L105)

发行版差异和搭配建议，不实现其他工具。

<details>
<summary>查看原文（13行）</summary>

```text
export function buildWorkspaceListAdvice({ currentDistro, defaultDistro, distros } = {}) {
  const tips = [
    "Create a DSH workspace pointing at a Linux path under this distro (prefer /home/… over /mnt/c).",
    "Install companion dsh-wsl-picker to browse /mnt drives from the agent.",
    "Use distro_info for wsl -l -v details and \\\\wsl$\\ path safety.",
  ];
  if (currentDistro && defaultDistro && currentDistro !== defaultDistro) {
    tips.push(
      `Current session distro "${currentDistro}" differs from default "${defaultDistro}" — /home paths are not interchangeable.`,
    );
  }
  if (distros?.length) tips.push(`Installed: ${distros.join(", ")}`);
  return tips;
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · list/check、cwd和路径状态实际如何计算？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

入口WSL检测，不在WSL返回失败。list依次wsl.exe -l -q和-l -v，UTF16LE去NUL、默认发行版用星号行首个非空白段；失败前者退当前distroName，后者空串，最终仍ok:true，不公开错误种类。发行版空白命名/本地化及PATH缺wsl.exe不应被当完整发现成功。

check输入省略时用process.cwd而不是exec.cwd，~扩home，其余resolve，故相对路径也基于宿主cwd变绝对。exists/stat检查目录，classify按字符串/mnt、Desktop/Downloads/Documents及home前缀、.git存在给标签和suggestedHome；最后才realpath返回path，错误退原abs。ok为存在目录且原分类不在/mnt，不测可写/真实文件系统。

纯分类/advice与进程分开可借鉴；只读路径检查副作用小，但每次同步stat和两次Windows调用成本不同，入口15秒工具timeout与两个10秒子调用不共享deadline/取消。

#### 证据与依据

**依据 1 · 源码核查**：[lib/workspace.js:108-164](https://github.com/173787247/dsh-wsl-workspace/blob/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587/lib/workspace.js#L108-L164)

命令、编码、吞错回退和list ok。

<details>
<summary>查看原文（57行）</summary>

```text
export function parseWslListQuiet(stdout) {
  return String(stdout || "")
    .replace(/\0/g, "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function listDistros({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("wsl.exe", ["-l", "-q"], {
      timeout: 10_000,
      encoding: "utf16le",
      windowsHide: true,
    });
    return parseWslListQuiet(stdout);
  } catch {
    return [distroName()].filter(Boolean);
  }
}

async function defaultDistroName({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("wsl.exe", ["-l", "-v"], {
      timeout: 10_000,
      encoding: "utf16le",
      windowsHide: true,
    });
    const text = String(stdout || "").replace(/\0/g, "");
    const m = text.match(/^\s*\*\s*(\S+)/m);
    return m ? m[1] : "";
  } catch {
    return "";
  }
}

export async function execute(args, _config = {}, deps = {}) {
  const action = args?.action === "check" ? "check" : "list";
  const currentDistro = distroName();
  const home = deps.home || homedir();
  const exists = deps.exists || existsSync;

  if (action === "list") {
    const distros = deps.listDistros
      ? await deps.listDistros()
      : await listDistros({ execFileFn: deps.execFileFn || execFileAsync });
    const defaultDistro = deps.defaultDistroName
      ? await deps.defaultDistroName()
      : await defaultDistroName({ execFileFn: deps.execFileFn || execFileAsync });
    return {
      ok: true,
      action: "list",
      currentDistro,
      defaultDistro: defaultDistro || "",
      distros,
      advice: buildWorkspaceListAdvice({ currentDistro, defaultDistro, distros }),
    };
```

</details>

**依据 2 · 源码核查**：[lib/workspace.js:167-221](https://github.com/173787247/dsh-wsl-workspace/blob/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587/lib/workspace.js#L167-L221)

cwd/路径/realpath与ok顺序。

<details>
<summary>查看原文（55行）</summary>

```text
  const raw =
    typeof args?.path === "string" && args.path.trim()
      ? args.path.trim()
      : process.cwd() || home;
  const abs = raw.startsWith("~/")
    ? `${home}${raw.slice(1)}`
    : raw === "~"
      ? home
      : resolve(raw);
  if (!abs.startsWith("/")) {
    return {
      ok: false,
      action: "check",
      path: abs,
      error: "path must be absolute Linux",
      advice: [],
    };
  }

  const pathExists = exists(abs);
  let isDirectory = false;
  if (pathExists) {
    try {
      isDirectory = (deps.stat || statSync)(abs).isDirectory();
    } catch {
      isDirectory = false;
    }
  }
  const classified = classifyWorkspacePath(abs, { home, exists });
  const advice = buildWorkspaceCheckAdvice({
    ...classified,
    exists: pathExists,
    isDirectory,
  });
  let resolved = abs;
  if (pathExists) {
    try {
      resolved = (deps.realpath || realpathSync)(abs);
    } catch {
      resolved = abs;
    }
  }
  return {
    ok: pathExists && isDirectory && !classified.onMnt,
    action: "check",
    currentDistro,
    path: resolved,
    exists: pathExists,
    isDirectory,
    onMnt: classified.onMnt,
    kind: classified.kind,
    hasGit: classified.hasGit,
    suggestedHome: classified.suggestedHome || "",
    advice,
  };
```

</details>

**依据 3 · 源码核查**：[lib/workspace.js:52-90](https://github.com/173787247/dsh-wsl-workspace/blob/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587/lib/workspace.js#L52-L90)

字符串分类、.git和advice。

<details>
<summary>查看原文（39行）</summary>

```text
/** Classify workspace path (aligned with mnt_doctor tags). */
export function classifyWorkspacePath(abs, { home = "/home/user", exists = existsSync } = {}) {
  const path = String(abs || "");
  const onMnt = path === "/mnt" || path.startsWith("/mnt/");
  let kind = "linux_other";
  if (onMnt) {
    if (/\/(Desktop|Downloads|Documents)(\/|$)/i.test(path)) kind = "windows_user_folder";
    else if (path.includes("/Users/")) kind = "windows_users";
    else kind = "mnt_other";
  } else if (path === home || path.startsWith(`${home}/`)) {
    kind = "linux_home";
  }
  const gitPath = path.endsWith("/") ? `${path}.git` : `${path}/.git`;
  const hasGit = exists(gitPath);
  let suggestedHome = "";
  if (onMnt) {
    const leaf = basename(path) || "project";
    suggestedHome = `${home.replace(/\/+$/, "")}/src/${leaf}`;
  }
  return { path, onMnt, kind, hasGit, suggestedHome };
}

export function buildWorkspaceCheckAdvice(info) {
  const tips = [];
  if (!info.exists) tips.push("Path does not exist; create it with mkdir -p before opening a workspace.");
  else if (!info.isDirectory) tips.push("Path is not a directory.");
  if (info.onMnt) {
    tips.push("Workspace on /mnt is slow under WSL; prefer a path under /home — run mnt_doctor for details.");
    if (info.kind === "windows_user_folder") {
      tips.push("Desktop/Downloads/Documents: fine for opening files (dsh-wsl-open), bad as git/npm root.");
    }
    if (info.hasGit) tips.push("Detected .git on /mnt — expect slow status; move clone to Linux home.");
    if (info.suggestedHome) tips.push(`Suggested Linux path: ${info.suggestedHome}`);
    tips.push("Scripts on /mnt/c may be CRLF — encoding_doctor path=… ; convert paths with path_convert.");
  } else if (info.exists && info.isDirectory) {
    tips.push("Looks like a good Linux-side workspace root for DSH.");
    if (info.hasGit) tips.push("Git repo on Linux filesystem — good default.");
  }
  return tips;
```

</details>

**依据 4 · 源码核查**：[index.js:7-30](https://github.com/173787247/dsh-wsl-workspace/blob/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587/index.js#L7-L30)

timeout与非WSL门控。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:wsl_workspace",
    order: 110,
    text: "Use wsl_workspace to list distros or check a Linux workspace path (flag /mnt Desktop, .git, suggest ~/src). Pair with mnt_doctor / distro_info / path_convert.",
  });

  ctx.tools.register({
    name: "wsl_workspace",
    description:
      "List WSL distros (current vs default) or validate a Linux workspace path for DSH (/mnt hygiene).",
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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 路径标签能否认证性能和真实挂载？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能。分类发生在realpath之前，home下符号链接指/mnt时kind/onMnt按home给，返回path却是/mnt，ok仍可能true；反方向也可将真实Linux路径按输入/mnt误警。非/mnt的网络/自定义挂载同样可被“good Linux-side”建议掩盖；不是只补文档说“自定义可能误判”，而是实际判断先后与输出能不一致。

/mnt一律ok:false且advice断言slow，是位置启发式，不量构建/小文件/监听/大小写/权限，不能据此迁移所有项目。hasGit仅.git存在（可为文件），非git rev-parse/仓库有效性；stat失败归不是目录、realpath失败退原path，未知原因缺失。list出错仍ok/回当前也不证真实全列表。返回完整路径/发行版可能含本机身份信息，工具无输出隐私选择，但不读取文件内容。

#### 证据与依据

**依据 1 · 源码核查**：[lib/workspace.js:186-221](https://github.com/173787247/dsh-wsl-workspace/blob/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587/lib/workspace.js#L186-L221)

分类先于realpath与ok依赖原分类。

<details>
<summary>查看原文（36行）</summary>

```text
  const pathExists = exists(abs);
  let isDirectory = false;
  if (pathExists) {
    try {
      isDirectory = (deps.stat || statSync)(abs).isDirectory();
    } catch {
      isDirectory = false;
    }
  }
  const classified = classifyWorkspacePath(abs, { home, exists });
  const advice = buildWorkspaceCheckAdvice({
    ...classified,
    exists: pathExists,
    isDirectory,
  });
  let resolved = abs;
  if (pathExists) {
    try {
      resolved = (deps.realpath || realpathSync)(abs);
    } catch {
      resolved = abs;
    }
  }
  return {
    ok: pathExists && isDirectory && !classified.onMnt,
    action: "check",
    currentDistro,
    path: resolved,
    exists: pathExists,
    isDirectory,
    onMnt: classified.onMnt,
    kind: classified.kind,
    hasGit: classified.hasGit,
    suggestedHome: classified.suggestedHome || "",
    advice,
  };
```

</details>

**依据 2 · 源码核查**：[lib/workspace.js:74-88](https://github.com/173787247/dsh-wsl-workspace/blob/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587/lib/workspace.js#L74-L88)

硬coded性能/可用建议。

<details>
<summary>查看原文（15行）</summary>

```text
export function buildWorkspaceCheckAdvice(info) {
  const tips = [];
  if (!info.exists) tips.push("Path does not exist; create it with mkdir -p before opening a workspace.");
  else if (!info.isDirectory) tips.push("Path is not a directory.");
  if (info.onMnt) {
    tips.push("Workspace on /mnt is slow under WSL; prefer a path under /home — run mnt_doctor for details.");
    if (info.kind === "windows_user_folder") {
      tips.push("Desktop/Downloads/Documents: fine for opening files (dsh-wsl-open), bad as git/npm root.");
    }
    if (info.hasGit) tips.push("Detected .git on /mnt — expect slow status; move clone to Linux home.");
    if (info.suggestedHome) tips.push(`Suggested Linux path: ${info.suggestedHome}`);
    tips.push("Scripts on /mnt/c may be CRLF — encoding_doctor path=… ; convert paths with path_convert.");
  } else if (info.exists && info.isDirectory) {
    tips.push("Looks like a good Linux-side workspace root for DSH.");
    if (info.hasGit) tips.push("Git repo on Linux filesystem — good default.");
```

</details>

**依据 3 · 源码核查**：[lib/workspace.js:64-71](https://github.com/173787247/dsh-wsl-workspace/blob/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587/lib/workspace.js#L64-L71)

.git存在性和建议路径。

```text
  const gitPath = path.endsWith("/") ? `${path}.git` : `${path}/.git`;
  const hasGit = exists(gitPath);
  let suggestedHome = "";
  if (onMnt) {
    const leaf = basename(path) || "project";
    suggestedHome = `${home.replace(/\/+$/, "")}/src/${leaf}`;
  }
  return { path, onMnt, kind, hasGit, suggestedHome };
```

**依据 4 · 源码核查**：[lib/workspace.js:116-140](https://github.com/173787247/dsh-wsl-workspace/blob/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587/lib/workspace.js#L116-L140)

list失败折叠。

<details>
<summary>查看原文（25行）</summary>

```text
async function listDistros({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("wsl.exe", ["-l", "-q"], {
      timeout: 10_000,
      encoding: "utf16le",
      windowsHide: true,
    });
    return parseWslListQuiet(stdout);
  } catch {
    return [distroName()].filter(Boolean);
  }
}

async function defaultDistroName({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("wsl.exe", ["-l", "-v"], {
      timeout: 10_000,
      encoding: "utf16le",
      windowsHide: true,
    });
    const text = String(stdout || "").replace(/\0/g, "");
    const m = text.match(/^\s*\*\s*(\S+)/m);
    return m ? m[1] : "";
  } catch {
    return "";
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样限定试用，并验证路径建议的净价值？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

可作为只读线索小试，明确传预期绝对路径，比较返回path/kind/onMnt是否一致，再以原生pwd -P/mount和项目构建/监听核实际。不要把ok当性能/权限认证或自动采纳move；符号链接、自定义挂载和Windows工具依赖先回本地核查。安装/宿主需Node>=18与tools/prompt；list还依赖WSL interop及wsl.exe。

首次有安装和理解标签，持续本地路径stat/模型报告或两Windows进程，具体费用/延迟未知；没有独立API不等总成本0。采纳迁移建议将有复制磁盘、Git/权限/监听复核和恢复代价，属于用户后续操作非插件只读成本。输出不符或迁移前提不明即停，回手工命令，保留原项目备份。

未验证假设首先按realpath分类并明确查询错误，再经用户选择在项目副本做小文件/监听/大小写和真实构建对照，取代一概/mnt=坏。现有exists/realpath和启发标签已在，不将加一个路径解析当新功能；探针有临时写和等待成本，不自动运行。对照符号链接两方向、自定义挂载、命令失败和Windows依赖项目，测误建议及总负担；若现有结果已够或探针成本更高则不采。

#### 证据与依据

**依据 1 · 源码核查**：[lib/workspace.js:167-221](https://github.com/173787247/dsh-wsl-workspace/blob/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587/lib/workspace.js#L167-L221)

明确输入/结果核对与假设来源。

<details>
<summary>查看原文（55行）</summary>

```text
  const raw =
    typeof args?.path === "string" && args.path.trim()
      ? args.path.trim()
      : process.cwd() || home;
  const abs = raw.startsWith("~/")
    ? `${home}${raw.slice(1)}`
    : raw === "~"
      ? home
      : resolve(raw);
  if (!abs.startsWith("/")) {
    return {
      ok: false,
      action: "check",
      path: abs,
      error: "path must be absolute Linux",
      advice: [],
    };
  }

  const pathExists = exists(abs);
  let isDirectory = false;
  if (pathExists) {
    try {
      isDirectory = (deps.stat || statSync)(abs).isDirectory();
    } catch {
      isDirectory = false;
    }
  }
  const classified = classifyWorkspacePath(abs, { home, exists });
  const advice = buildWorkspaceCheckAdvice({
    ...classified,
    exists: pathExists,
    isDirectory,
  });
  let resolved = abs;
  if (pathExists) {
    try {
      resolved = (deps.realpath || realpathSync)(abs);
    } catch {
      resolved = abs;
    }
  }
  return {
    ok: pathExists && isDirectory && !classified.onMnt,
    action: "check",
    currentDistro,
    path: resolved,
    exists: pathExists,
    isDirectory,
    onMnt: classified.onMnt,
    kind: classified.kind,
    hasGit: classified.hasGit,
    suggestedHome: classified.suggestedHome || "",
    advice,
  };
```

</details>

**依据 2 · 源码核查**：[package.json:1-18](https://github.com/173787247/dsh-wsl-workspace/blob/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587/package.json#L1-L18)

包/版本/Node。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "dsh-wsl-workspace-check",
  "version": "0.2.0",
  "description": "wsl_workspace: list distros and validate Linux workspace paths with /mnt hygiene.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/173787247/dsh-wsl-workspace.git"
  },
  "bugs": {
    "url": "https://github.com/173787247/dsh-wsl-workspace/issues"
  },
  "homepage": "https://github.com/173787247/dsh-wsl-workspace#readme",
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
```

</details>

**依据 3 · 源码核查**：[lib/workspace.js:78-85](https://github.com/173787247/dsh-wsl-workspace/blob/fb3b64681ce67b1bfc8d49aac8cd72b76cbcd587/lib/workspace.js#L78-L85)

迁移建议不是已执行。

```text
  if (info.onMnt) {
    tips.push("Workspace on /mnt is slow under WSL; prefer a path under /home — run mnt_doctor for details.");
    if (info.kind === "windows_user_folder") {
      tips.push("Desktop/Downloads/Documents: fine for opening files (dsh-wsl-open), bad as git/npm root.");
    }
    if (info.hasGit) tips.push("Detected .git on /mnt — expect slow status; move clone to Linux home.");
    if (info.suggestedHome) tips.push(`Suggested Linux path: ${info.suggestedHome}`);
    tips.push("Scripts on /mnt/c may be CRLF — encoding_doctor path=… ; convert paths with path_convert.");
```

#### 缺口

- 未执行WSL列表、符号链接案例或实际项目性能/权限
  **影响**：不能认定标签性能结论或迁移收益
  **进一步探讨**：固定副本和原生真实路径/挂载对照，再按授权测工作负载与恢复成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
