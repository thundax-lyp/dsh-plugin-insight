# dsh-wsl-pkg

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b5a0115](https://github.com/173787247/dsh-wsl-pkg/tree/b5a0115dced4ef97be907bf3f6180c795a67a848)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-pkg)
<!-- END META -->

> **功能**：在 DSH 中读取 npm、pip 与 Cargo 的依赖和版本摘要。

> **亮点**：[Q01](#research-q01) 在同一会话取得三类依赖线索，方便决定接下来读哪些原件。

> **主要限制**：[Q02](#research-q02) npm 错误与摘要切片可能没有清楚标记，pip 口径也不同。

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
  - [Q01 · 依赖摘要适合做什么判断？](#detail-section-11)
  - [Q02 · 命令失败和截断怎样影响依赖结论？](#detail-section-12)
  - [Q03 · 如何试用并减少把部分结果误读为完整库存？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护者快速定位项目依赖或环境异常。

直接运行原生包管理命令并查锁文件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 依赖摘要 | 定位需要复核的依赖 | 查询范围与输出上限因 CLI 而异 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| npm、pip 或 Cargo | 按查询必需 | 读取现有环境 | 二进制或环境不同则结果不同 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户建立测试项目 | 已知依赖和环境 |
| 比对 | 用户查深度、更新和重复依赖 | 核对与原命令相符 |
| 退出 | 用户回锁文件和原命令 | 摘要不充当库存 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 检查 CLI 与项目根 | 确认虚拟环境 |
| 持续 | 查询资源未知 | 复核输出和 registry | 不自动更新依赖 |
| 失败 | 排查开销未知 | 从原命令查退出与 stderr | 空结果不可盲信 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 依赖初筛 | 限深树、包列表与重复依赖 | 诊断时间及完整性 |

> **思考**：[Q02](#research-q02) npm 错误与摘要切片可能没有清楚标记，pip 口径也不同。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在同一会话取得三类依赖线索，方便决定接下来读哪些原件。

[Q02](#research-q02) npm ls 的二次树切片不在 truncated 字段中。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) npm 错误与摘要切片可能没有清楚标记，pip 口径也不同。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先在已知依赖项目验证实际包管理环境。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持接线与限量，CLI 兼容与改法未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/pkg.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码，未运行包管理工具、插件或宿主。
- 下一步：覆盖空 stdout、异常退出、不同虚拟环境、深度和截断。

**分析版本**

- **仓库**：[173787247/dsh-wsl-pkg](https://github.com/173787247/dsh-wsl-pkg)
- **版本号**：0.1.1（[固定提交 b5a0115](https://github.com/173787247/dsh-wsl-pkg/tree/b5a0115dced4ef97be907bf3f6180c795a67a848)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 独立标记失败及两种截断，测完整性误读。

覆盖空 stdout、异常退出、不同虚拟环境、深度和截断。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 118 | — | — | 488 |
| .js | source | 2 | 320 | 299 | 3 | — |
| .js | test | 1 | 6 | 6 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-pkg/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-pkg/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-pkg/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护者能否用 DSH 初筛依赖问题，并辨别摘要的范围与失败？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 依赖摘要适合做什么判断？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

接手仓库时可从会话查 npm 依赖树和可更新项、当前 pip 环境包或 Cargo 重复依赖。相较读完整命令输出，插件有 npm 深度限制与有限节点投影。四个结果的范围不同，pip 是宿主找到的 pip 环境，cargo tree -d 聚焦重复依赖，均不能当作统一的依赖物料清单。合格结果是定位需回原工具检查的一项依赖。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/173787247/dsh-wsl-pkg/blob/b5a0115dced4ef97be907bf3f6180c795a67a848/README.md#L5-L15)

作者定位。

<details>
<summary>查看原文（11行）</summary>

````text
依赖树摘要：npm ls / pip list / cargo tree。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-pkg
````

</details>

**依据 2 · 源码核查**：[lib/pkg.js:79-128](https://github.com/173787247/dsh-wsl-pkg/blob/b5a0115dced4ef97be907bf3f6180c795a67a848/lib/pkg.js#L79-L128)

两类 npm 查询。

<details>
<summary>查看原文（50行）</summary>

```text
export async function npmOutdated({ dir, allowRoots, timeoutMs, maxOut = 40_000 } = {}) {
  const cwd = resolveDir(dir, allowRoots);
  const bin = (await which("npm")) || "npm";
  const r = await run(bin, ["outdated", "--json"], { cwd, timeoutMs, maxOut });
  // npm outdated exits 1 when updates exist
  let json = {};
  try {
    json = JSON.parse(r.stdout || "{}");
  } catch {
    return { ok: true, dir: cwd, exitCode: r.code, output: r.stdout.slice(0, maxOut), truncated: r.truncated };
  }
  const names = Object.keys(json || {}).slice(0, 80);
  const packages = names.map((name) => ({
    name,
    current: json[name].current,
    wanted: json[name].wanted,
    latest: json[name].latest,
    type: json[name].type,
  }));
  return {
    ok: true,
    dir: cwd,
    count: packages.length,
    exitCode: r.code,
    truncated: r.truncated || Object.keys(json || {}).length > 80,
    packages,
  };
}

export async function npmLs({ dir, depth = 0, allowRoots, timeoutMs } = {}) {
  const cwd = resolveDir(dir, allowRoots);
  const d = Math.min(3, Math.max(0, Number(depth) || 0));
  const bin = (await which("npm")) || "npm";
  const r = await run(bin, ["ls", "--all", `--depth=${d}`, "--json"], { cwd, timeoutMs, maxOut: 40_000 });
  // npm ls exits 1 on peer issues — still parse
  let json;
  try {
    json = JSON.parse(r.stdout || "{}");
  } catch {
    return { ok: true, dir: cwd, output: r.stdout, truncated: r.truncated };
  }
  return {
    ok: true,
    dir: cwd,
    name: json.name,
    version: json.version,
    problems: json.problems || null,
    truncated: r.truncated,
    tree: summarizeNpm(json, d),
  };
```

</details>

**依据 3 · 源码核查**：[lib/pkg.js:146-165](https://github.com/173787247/dsh-wsl-pkg/blob/b5a0115dced4ef97be907bf3f6180c795a67a848/lib/pkg.js#L146-L165)

pip 和 Cargo 范围。

<details>
<summary>查看原文（20行）</summary>

```text
export async function pipList({ timeoutMs } = {}) {
  const bin = (await which("pip")) || (await which("pip3")) || "pip";
  const r = await run(bin, ["list", "--format=json"], { timeoutMs, maxOut: 40_000 });
  if (r.code !== 0) throw new Error(`pip list failed: ${r.stderr || r.code}`);
  let items;
  try {
    items = JSON.parse(r.stdout || "[]");
  } catch {
    return { ok: true, output: r.stdout };
  }
  const list = (Array.isArray(items) ? items : []).slice(0, 200).map((p) => ({ name: p.name, version: p.version }));
  return { ok: true, count: list.length, packages: list };
}

export async function cargoTree({ dir, allowRoots, timeoutMs } = {}) {
  const cwd = resolveDir(dir, allowRoots);
  const bin = (await which("cargo")) || "cargo";
  const r = await run(bin, ["tree", "-d", "1"], { cwd, timeoutMs, maxOut: 40_000 });
  if (r.code !== 0) throw new Error(`cargo tree failed: ${r.stderr || r.code}`);
  return { ok: true, dir: cwd, truncated: r.truncated, output: r.stdout };
```

</details>

#### 缺口

- 未做同项目排查对照
  **影响**：不能判断省时和漏项比例
  **进一步探讨**：对照有重复依赖和多虚拟环境的测试项目

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 命令失败和截断怎样影响依赖结论？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

npm outdated 与 npm ls 都解析 stdout，不按退出码决定失败。前者把退出码保留，后者成功结构无退出码，空 stdout 会变成空对象。npm ls 摘要每级只取 80 项，truncated 只源于命令输出长度，未表示此二次切片。pip 只返回前 200 项，count 是切片后数量。目录限制只校验 npm 和 Cargo 的工作目录，未约束继承的 registry、凭据或 pip 虚拟环境。

#### 证据与依据

**依据 1 · 源码核查**：[lib/pkg.js:16-35](https://github.com/173787247/dsh-wsl-pkg/blob/b5a0115dced4ef97be907bf3f6180c795a67a848/lib/pkg.js#L16-L35)

目录解析和进程继承。

<details>
<summary>查看原文（20行）</summary>

```text
export function resolveDir(dir, allowRoots = []) {
  const abs = resolve(String(dir || ".").trim() || ".");
  const real = existsSync(abs) ? realpathSync(abs) : abs;
  if (allowRoots.length) {
    const roots = allowRoots.map((r) => {
      const a = resolve(r);
      return existsSync(a) ? realpathSync(a) : a;
    });
    const ok = roots.some((root) => {
      const x = root.replace(/[/\\]+$/, "");
      return real === x || real.startsWith(x + "/") || real.startsWith(x + "\\");
    });
    if (!ok) throw new Error(`dir outside allowRoots: ${real}`);
  }
  return real;
}

export function run(bin, args, { cwd, timeoutMs = 60_000, maxOut = 40_000 } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
```

</details>

**依据 2 · 源码核查**：[lib/pkg.js:79-128](https://github.com/173787247/dsh-wsl-pkg/blob/b5a0115dced4ef97be907bf3f6180c795a67a848/lib/pkg.js#L79-L128)

退出和空对象分支。

<details>
<summary>查看原文（50行）</summary>

```text
export async function npmOutdated({ dir, allowRoots, timeoutMs, maxOut = 40_000 } = {}) {
  const cwd = resolveDir(dir, allowRoots);
  const bin = (await which("npm")) || "npm";
  const r = await run(bin, ["outdated", "--json"], { cwd, timeoutMs, maxOut });
  // npm outdated exits 1 when updates exist
  let json = {};
  try {
    json = JSON.parse(r.stdout || "{}");
  } catch {
    return { ok: true, dir: cwd, exitCode: r.code, output: r.stdout.slice(0, maxOut), truncated: r.truncated };
  }
  const names = Object.keys(json || {}).slice(0, 80);
  const packages = names.map((name) => ({
    name,
    current: json[name].current,
    wanted: json[name].wanted,
    latest: json[name].latest,
    type: json[name].type,
  }));
  return {
    ok: true,
    dir: cwd,
    count: packages.length,
    exitCode: r.code,
    truncated: r.truncated || Object.keys(json || {}).length > 80,
    packages,
  };
}

export async function npmLs({ dir, depth = 0, allowRoots, timeoutMs } = {}) {
  const cwd = resolveDir(dir, allowRoots);
  const d = Math.min(3, Math.max(0, Number(depth) || 0));
  const bin = (await which("npm")) || "npm";
  const r = await run(bin, ["ls", "--all", `--depth=${d}`, "--json"], { cwd, timeoutMs, maxOut: 40_000 });
  // npm ls exits 1 on peer issues — still parse
  let json;
  try {
    json = JSON.parse(r.stdout || "{}");
  } catch {
    return { ok: true, dir: cwd, output: r.stdout, truncated: r.truncated };
  }
  return {
    ok: true,
    dir: cwd,
    name: json.name,
    version: json.version,
    problems: json.problems || null,
    truncated: r.truncated,
    tree: summarizeNpm(json, d),
  };
```

</details>

**依据 3 · 源码核查**：[lib/pkg.js:131-165](https://github.com/173787247/dsh-wsl-pkg/blob/b5a0115dced4ef97be907bf3f6180c795a67a848/lib/pkg.js#L131-L165)

摘要切片与不同退出处理。

<details>
<summary>查看原文（35行）</summary>

```text
function summarizeNpm(node, depthLeft) {
  if (!node || typeof node !== "object") return null;
  const deps = node.dependencies || {};
  const keys = Object.keys(deps).slice(0, 80);
  const out = {};
  for (const k of keys) {
    const child = deps[k];
    out[k] = {
      version: child.version,
      ...(depthLeft > 0 ? { dependencies: summarizeNpm(child, depthLeft - 1) } : {}),
    };
  }
  return out;
}

export async function pipList({ timeoutMs } = {}) {
  const bin = (await which("pip")) || (await which("pip3")) || "pip";
  const r = await run(bin, ["list", "--format=json"], { timeoutMs, maxOut: 40_000 });
  if (r.code !== 0) throw new Error(`pip list failed: ${r.stderr || r.code}`);
  let items;
  try {
    items = JSON.parse(r.stdout || "[]");
  } catch {
    return { ok: true, output: r.stdout };
  }
  const list = (Array.isArray(items) ? items : []).slice(0, 200).map((p) => ({ name: p.name, version: p.version }));
  return { ok: true, count: list.length, packages: list };
}

export async function cargoTree({ dir, allowRoots, timeoutMs } = {}) {
  const cwd = resolveDir(dir, allowRoots);
  const bin = (await which("cargo")) || "cargo";
  const r = await run(bin, ["tree", "-d", "1"], { cwd, timeoutMs, maxOut: 40_000 });
  if (r.code !== 0) throw new Error(`cargo tree failed: ${r.stderr || r.code}`);
  return { ok: true, dir: cwd, truncated: r.truncated, output: r.stdout };
```

</details>

#### 缺口

- 未核对真实 CLI 对网络、工作区和异常退出的行为
  **影响**：不能推导完整性或离线保证
  **进一步探讨**：用非敏感仓库演练 npm 错误、超长输出和私有 registry 配置

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用并减少把部分结果误读为完整库存？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

在测试 profile 核对 npm、pip 和 Cargo 路径、项目根及虚拟环境。先与原命令比较少量结果，再故意超深或移除工具，检查失败语义。遇到缺节点或空摘要就退到原命令和锁文件。可同时标记查询失败、原始输出截断和摘要切片，测有已知缺项时的诊断正确率和额外字数。若误判不减或真实查询被过度拒绝，放弃该方案。

#### 证据与依据

**依据 1 · 源码核查**：[lib/pkg.js:63-76](https://github.com/173787247/dsh-wsl-pkg/blob/b5a0115dced4ef97be907bf3f6180c795a67a848/lib/pkg.js#L63-L76)

状态发现工具。

<details>
<summary>查看原文（14行）</summary>

```text
export async function pkgStatus() {
  const npm = (await which("npm")) || null;
  const pip = (await which("pip")) || (await which("pip3")) || null;
  const cargo = (await which("cargo")) || null;
  let npmVersion = null;
  if (npm) {
    try {
      const r = await run(npm, ["--version"], { timeoutMs: 8_000, maxOut: 200 });
      npmVersion = (r.stdout || "").trim() || null;
    } catch {
      /* ignore */
    }
  }
  return { ok: true, npm, npmVersion, pip, cargo };
```

</details>

**依据 2 · 源码核查**：[lib/pkg.js:108-143](https://github.com/173787247/dsh-wsl-pkg/blob/b5a0115dced4ef97be907bf3f6180c795a67a848/lib/pkg.js#L108-L143)

当前 npm 摘要。

<details>
<summary>查看原文（36行）</summary>

```text
export async function npmLs({ dir, depth = 0, allowRoots, timeoutMs } = {}) {
  const cwd = resolveDir(dir, allowRoots);
  const d = Math.min(3, Math.max(0, Number(depth) || 0));
  const bin = (await which("npm")) || "npm";
  const r = await run(bin, ["ls", "--all", `--depth=${d}`, "--json"], { cwd, timeoutMs, maxOut: 40_000 });
  // npm ls exits 1 on peer issues — still parse
  let json;
  try {
    json = JSON.parse(r.stdout || "{}");
  } catch {
    return { ok: true, dir: cwd, output: r.stdout, truncated: r.truncated };
  }
  return {
    ok: true,
    dir: cwd,
    name: json.name,
    version: json.version,
    problems: json.problems || null,
    truncated: r.truncated,
    tree: summarizeNpm(json, d),
  };
}

function summarizeNpm(node, depthLeft) {
  if (!node || typeof node !== "object") return null;
  const deps = node.dependencies || {};
  const keys = Object.keys(deps).slice(0, 80);
  const out = {};
  for (const k of keys) {
    const child = deps[k];
    out[k] = {
      version: child.version,
      ...(depthLeft > 0 ? { dependencies: summarizeNpm(child, depthLeft - 1) } : {}),
    };
  }
  return out;
```

</details>

**依据 3 · 源码核查**：[lib/pkg.js:146-165](https://github.com/173787247/dsh-wsl-pkg/blob/b5a0115dced4ef97be907bf3f6180c795a67a848/lib/pkg.js#L146-L165)

pip 和 Cargo 返回口径。

<details>
<summary>查看原文（20行）</summary>

```text
export async function pipList({ timeoutMs } = {}) {
  const bin = (await which("pip")) || (await which("pip3")) || "pip";
  const r = await run(bin, ["list", "--format=json"], { timeoutMs, maxOut: 40_000 });
  if (r.code !== 0) throw new Error(`pip list failed: ${r.stderr || r.code}`);
  let items;
  try {
    items = JSON.parse(r.stdout || "[]");
  } catch {
    return { ok: true, output: r.stdout };
  }
  const list = (Array.isArray(items) ? items : []).slice(0, 200).map((p) => ({ name: p.name, version: p.version }));
  return { ok: true, count: list.length, packages: list };
}

export async function cargoTree({ dir, allowRoots, timeoutMs } = {}) {
  const cwd = resolveDir(dir, allowRoots);
  const bin = (await which("cargo")) || "cargo";
  const r = await run(bin, ["tree", "-d", "1"], { cwd, timeoutMs, maxOut: 40_000 });
  if (r.code !== 0) throw new Error(`cargo tree failed: ${r.stderr || r.code}`);
  return { ok: true, dir: cwd, truncated: r.truncated, output: r.stdout };
```

</details>

#### 缺口

- 真实宿主与改法未运行
  **影响**：接入及读取开销未知
  **进一步探讨**：用合成多级依赖和两个 pip 环境验收

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
