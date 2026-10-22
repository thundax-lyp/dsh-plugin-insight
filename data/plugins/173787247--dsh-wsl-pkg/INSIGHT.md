# dsh-wsl-pkg

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c795535](https://github.com/173787247/dsh-wsl-pkg/tree/c79553532eda43f86f3d056ad31e35d11710ad33)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-pkg)
<!-- END META -->

> **实现功能**：将 npm、pip、cargo 查询接为 DSH 工具，给出有限长度的依赖摘要。

> **核心亮点**：把既有包管理器命令包成 DSH 工具与浅摘要，提供可选项目根限制；不增加依赖解析算法。详见[Q02](#research-q02)。

> **风险与缺陷**：allowRoots 空时不限目录，pip list 跟随 DSH 进程 PATH 而非指定项目；解析失败也可能 ok:true，须核项目、退出和截断。详见[Q03](#research-q03)。

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
  - [Q01 · 包依赖摘要服务哪种用户判断，合格结果是什么？](#detail-section-11)
  - [Q02 · 命令执行、路径限制和摘要截断如何工作？](#detail-section-12)
  - [Q03 · 只读、项目归属和结果完整性有哪些边界？](#detail-section-13)
  - [Q04 · 部署、持续扫描和错误恢复要付什么成本？](#detail-section-14)
  - [Q05 · 适合怎样采用，项目环境绑定如何验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 用户快速看多语言项目依赖和 npm 更新候选；需核环境归属与截断，不能代替全量审计。

基线为直接 npm ls/outdated、pip list、cargo tree；本包只做宿主接线与摘要。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| pkg_status | 包管理器可用性 | 不表示项目归属 |
| pkg_npm_ls/outdated | Node 依赖和更新 | 有网络/截断/解析条件 |
| pkg_pip_list | Python 列表 | 未绑定项目 venv |
| pkg_cargo_tree | Rust 摘要 | 需核实际参数语义 |

**流程与依赖**

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| Node>=18、DSH tools/systemPrompt | 工具注册 | 插件不可用 |
| npm/pip/cargo PATH | 读取依赖 | 对应工具失败 |
| 项目目录与可选 allowRoots | npm/cargo 定位 | 错目录或拒绝 |
| registry 网络 | npm outdated | 结果/延迟不确定 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 准备 | 核项目根、解释器和 allowRoots | 目标明确 |
| 查询 | 看 status，再按语言调工具 | 返回非截断且命令成功 |
| 复核 | 对比锁文件和原命令 | 重要依赖完整 |
| 恢复 | 区分 PATH、网络、解析及 peer 问题 | 不把 ok:true 当完整成功 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 初次 | 宿主、包管理器 PATH、allowRoots | 环境匹配时间 |
| 持续 | 子进程、outdated 网络请求 | 延迟/截断率 |
| 恢复 | 区分缺工具、超时、非 JSON 和依赖问题 | 人工复核时间 |

| 结果 | 源码支持 | 未知 |
| --- | --- | --- |
| 依赖概览 | npm/pip/cargo 命令摘要 | 项目与解释器归属准确率 |
| npm 更新 | outdated JSON 摘要 | registry 变动和网络成本 |
| 限量输出 | 深度/项数/长度截断 | 重要项漏出率 |

> **思考**：allowRoots 空时不限目录，pip list 跟随 DSH 进程 PATH 而非指定项目；解析失败也可能 ok:true，须核项目、退出和截断。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把既有包管理器命令包成 DSH 工具与浅摘要，提供可选项目根限制；不增加依赖解析算法。详见[Q02](#research-q02)。

把既有包管理器命令包成 DSH 工具与浅摘要，提供可选项目根限制；不增加依赖解析算法。详见[Q02](#research-q02)。

spawn argv 数组避免把项目路径拼到 shell；resolveDir 对存在路径 realpath，allowRoots 空则不限制。npm ls/outdated 解析失败仍 ok:true；pip 无项目目录；stderr 收集无显式上限。

<a id="detail-section-5"></a>

### 1.4 主要限制

allowRoots 空时不限目录，pip list 跟随 DSH 进程 PATH 而非指定项目；解析失败也可能 ok:true，须核项目、退出和截断。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

配置 allowRoots 后作为快速导航；Python 环境与锁文件/原命令另核，不能用有限摘要做全量结论。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码证实命令与摘要，但未在项目运行；pip 环境归属、网络和大项目成本待测。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/pkg.js、test/pkg.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交核 README、package、index.js、lib/pkg.js、测试源码；未运行目标插件和任何包管理器。
- 下一步：隔离两项目双 venv 对照原命令，测目录/环境错配、截断率、运行时间与人工复核成本。

**分析版本**

- **仓库**：[173787247/dsh-wsl-pkg](https://github.com/173787247/dsh-wsl-pkg)
- **版本号**：0.1.1（[固定提交 c795535](https://github.com/173787247/dsh-wsl-pkg/tree/c79553532eda43f86f3d056ad31e35d11710ad33)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

绑定项目根、解释器/包管理器路径、退出码和完整性标签，可能减少多环境错配；双 venv 对照验证，尚未实现。详见[Q05](#research-q05)。

隔离两项目双 venv 对照原命令，测目录/环境错配、截断率、运行时间与人工复核成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 118 | — | — | 488 |
| .js | source | 2 | 320 | 299 | 3 | — |
| .js | test | 1 | 6 | 6 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-pkg/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-pkg/issues?q=is%3Aissue+created%3A2026-09-22T05%3A28%3A08.886Z..2026-10-22T05%3A28%3A08.886Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-pkg/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A28%3A08.886Z..2026-10-22T05%3A28%3A08.886Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核清多语言依赖摘要的真实覆盖、环境归属与采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 包依赖摘要服务哪种用户判断，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

DSH 中查看 Node/Python/Rust 项目依赖与 npm 更新候选，省去人工切终端。合格结果须明确扫描的是哪个项目/解释器环境、命令退出码和截断状态，不能把有限浅树当全量 SBOM 或漏洞/许可证结论。README 工具表只列四项，实际入口还注册 pkg_npm_outdated；直接终端调用同样命令是基线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-35](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/README.md#L1-L35)

作者用途和浅摘要。

<details>
<summary>查看原文（35行）</summary>

````text
# dsh-wsl-pkg

> **语言：** **中文**（本页） · [English](./README.en.md)

依赖树摘要：npm ls / pip list / cargo tree。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-pkg
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-pkg
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `pkg_status` | 包管理器是否可用 |
| `pkg_npm_ls` | npm ls 浅摘要 |
| `pkg_pip_list` | pip list |
| `pkg_cargo_tree` | cargo tree -d 1 |

## 配置要点

`allowRoots / timeoutMs`

不安装/卸载。深度默认很浅，避免噪音。
````

</details>

**依据 2 · 源码核查**：[index.js:20-70](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/index.js#L20-L70)

实际还注册 npm outdated。

<details>
<summary>查看原文（51行）</summary>

```text
  ctx.tools.register({
    name: "pkg_status",
    description: "Whether npm / pip / cargo are on PATH; npm version.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 8_000,
    isConcurrencySafe: () => true,
    async execute() {
      return pkgStatus();
    },
    presentCall: () => ({ card: "generic", title: "pkg status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "pkg status", content: r.content }),
  });

  ctx.tools.register({
    name: "pkg_npm_outdated",
    description: "npm outdated --json summary for a project dir (read-only; does not upgrade).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["dir"],
      properties: { dir: { type: "string" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : (v.packages || [])
                  .map((p) => `${p.name}\tcurrent=${p.current}\twanted=${p.wanted}\tlatest=${p.latest}`)
                  .join("\n") ||
                v.output ||
                "(none outdated)",
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await npmOutdated({ dir: args.dir, allowRoots, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "npm outdated" }),
    presentResult: (_a, r) => ({ card: "generic", title: "npm outdated", content: r.content }),
  });
```

</details>

**依据 3 · 源码核查**：[index.js:72-148](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/index.js#L72-L148)

npm、pip、cargo 工具。

<details>
<summary>查看原文（77行）</summary>

```text
  ctx.tools.register({
    name: "pkg_npm_ls",
    description: "npm ls --json shallow summary for a project dir (depth 0–3).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["dir"],
      properties: { dir: { type: "string" }, depth: { type: "number" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : JSON.stringify(v.tree || v, null, 2) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await npmLs({ dir: args.dir, depth: args.depth, allowRoots, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "npm ls" }),
    presentResult: (_a, r) => ({ card: "generic", title: "npm ls", content: r.content }),
  });

  ctx.tools.register({
    name: "pkg_pip_list",
    description: "pip list --format=json (capped names).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text: v.ok === false ? v.error : (v.packages || []).map((p) => `${p.name}==${p.version}`).join("\n"),
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      try {
        return await pipList({ timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "pip list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "pip list", content: r.content }),
  });

  ctx.tools.register({
    name: "pkg_cargo_tree",
    description: "cargo tree -d 1 in a Rust project dir.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["dir"],
      properties: { dir: { type: "string" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await cargoTree({ dir: args.dir, allowRoots, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "cargo tree" }),
    presentResult: (_a, r) => ({ card: "generic", title: "cargo tree", content: r.content }),
  });
```

</details>

**依据 4 · 源码核查**：[lib/pkg.js:108-165](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/lib/pkg.js#L108-L165)

真实命令及数据截断。

<details>
<summary>查看原文（58行）</summary>

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 命令执行、路径限制和摘要截断如何工作？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

index 注册五项工具；lib 使用 spawn 参数数组执行 npm ls --all --depth=N --json、npm outdated --json、pip list --format=json、cargo tree -d 1，按命令分别解析或截断。npm 深度限制 0–3，依赖每层最多取 80 个名称，pip 仅前 200 项，stdout 最多返回 40k 字符。dir 经 resolveDir 先 realpath，再按 allowRoots 前缀校验；但是 allowRoots 默认为空，这时不限制项目目录。相对手工 CLI 的增量是 DSH 工具接线和紧凑结构化摘要，并非新的依赖解析算法。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-17](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/index.js#L1-L17)

入口与配置默认。

<details>
<summary>查看原文（17行）</summary>

```text
import { pkgStatus, npmLs, pipList, cargoTree, npmOutdated } from "./lib/pkg.js";

export const name = "dsh-wsl-pkg";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-pkg] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 60_000);
  const allowRoots = Array.isArray(config.allowRoots) ? config.allowRoots.map(String) : [];

  ctx.systemPrompt.section({
    name: "tool:pkg",
    order: 141,
    text: "dsh-wsl-pkg summarizes dependency trees (npm ls / npm outdated / pip list / cargo tree). Prefer shallow depth. Does not install/uninstall packages.",
```

</details>

**依据 2 · 源码核查**：[lib/pkg.js:16-31](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/lib/pkg.js#L16-L31)

目录 realpath 和可选 allowRoots。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/pkg.js:33-60](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/lib/pkg.js#L33-L60)

子进程与截断。

<details>
<summary>查看原文（28行）</summary>

```text
export function run(bin, args, { cwd, timeoutMs = 60_000, maxOut = 40_000 } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > maxOut * 2) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({
        code,
        stdout: stdout.slice(0, maxOut),
        stderr: stderr.slice(0, 4000),
        truncated: stdout.length > maxOut,
      });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
  });
```

</details>

**依据 4 · 源码核查**：[lib/pkg.js:79-105](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/lib/pkg.js#L79-L105)

outdated 解析。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/pkg.js:108-165](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/lib/pkg.js#L108-L165)

npm/pip/cargo 摘要。

<details>
<summary>查看原文（58行）</summary>

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读、项目归属和结果完整性有哪些边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

插件不执行安装/卸载，但 npm outdated 查询 registry，不能等同无网络或无缓存副作用。allowRoots=[] 不是默认拒绝而是允许任意可访问目录；它限制的是项目工作目录，并不约束 pip list，因为后者无 dir 参数、由 DSH 进程 PATH 中的 pip 决定，可能与目标项目虚拟环境错位。npm ls JSON 解析失败仍返回 ok:true 的原始文本，npm outdated JSON 解析失败同样 ok:true；npm ls 在 peer 问题时可以 exit 1 并继续解析，这符合容错但调用方必须看 problems/exitCode/截断。cargo tree 命令参数是 -d 1，需要另核该版本 cargo 的语义，不能从 README “深度 1”直接推断完整树。

#### 证据与依据

**依据 1 · 源码核查**：[lib/pkg.js:16-31](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/lib/pkg.js#L16-L31)

空 allowRoots 时跳过目录限制。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/pkg.js:79-105](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/lib/pkg.js#L79-L105)

outdated 命令与解析失败仍 ok。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/pkg.js:108-129](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/lib/pkg.js#L108-L129)

npm ls 的部分失败与解析。

<details>
<summary>查看原文（22行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/pkg.js:146-165](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/lib/pkg.js#L146-L165)

pip 无 dir，cargo 参数。

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

**依据 5 · 源码核查**：[index.js:98-121](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/index.js#L98-L121)

pip 工具不接受项目目录。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.tools.register({
    name: "pkg_pip_list",
    description: "pip list --format=json (capped names).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text: v.ok === false ? v.error : (v.packages || []).map((p) => `${p.name}==${p.version}`).join("\n"),
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      try {
        return await pipList({ timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "pip list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "pip list", content: r.content }),
```

</details>

**依据 6 · 作者声明**：[README.md:31-35](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/README.md#L31-L35)

作者只读与浅层说明。

```text
## 配置要点

`allowRoots / timeoutMs`

不安装/卸载。深度默认很浅，避免噪音。
```

#### 缺口

- 未在虚拟环境和受限目录做宿主验收。
  **影响**：pip 归属错位与目录访问范围未量化。
  **进一步探讨**：隔离建两 venv 和允许/禁止目录，核 pip 版本来源与 allowRoots。
- 未核固定 cargo 版本参数表现。
  **影响**：Rust 摘要是否符合作者深度描述未知。
  **进一步探讨**：在固定 cargo 工程对照原命令输出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署、持续扫描和错误恢复要付什么成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包声明 0.1.1 MIT Node>=18，README 顶部版本写 0.1.0 而兼容表写 0.1.1，应以固定 package 为准。需要宿主 tools/systemPrompt 与 PATH 上相应包管理器；npm outdated 还依赖网络和 registry 状态。每次扫描起本机子进程，默认 60 秒超时、40k 输出返回限制；大树会被截断，stderr 收集无显式大小上限。缺包、超时、非 JSON 和 peer 依赖问题需分别恢复；人工核对真实项目和解释器环境成本未测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-13](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/package.json#L1-L13)

固定包版本与 Node。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "dsh-wsl-pkg",
  "version": "0.1.1",
  "description": "DeepSeek Harness WSL plugin: npm/pip/cargo dependency tree summaries.",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-wsl-pkg.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.en.md", "README.zh.md", "LICENSE", "CHANGELOG.md"],
  "keywords": ["dsh-plugin", "wsl", "npm", "pip", "cargo"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
```

</details>

**依据 2 · 作者声明**：[README.md:5-10](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/README.md#L5-L10)

顶部版本 0.1.0。

```text
依赖树摘要：npm ls / pip list / cargo tree。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |
```

**依据 3 · 作者声明**：[README.md:37-44](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/README.md#L37-L44)

兼容表 0.1.1。

```text
## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-wsl-pkg` **0.1.1** |
| **最低 dsh** | ≥ **0.1.2**（Web UI 一次性 `?token=`，Windows 中继 `:3081`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.0-rc.2`**）— 套件唯一真源 |
| **套件档位** | 可选（默认不在 `install.sh` / `KIT_SET=daily`） |
```

**依据 4 · 源码核查**：[lib/pkg.js:33-60](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/lib/pkg.js#L33-L60)

子进程、超时及输出限制。

<details>
<summary>查看原文（28行）</summary>

```text
export function run(bin, args, { cwd, timeoutMs = 60_000, maxOut = 40_000 } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > maxOut * 2) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({
        code,
        stdout: stdout.slice(0, maxOut),
        stderr: stderr.slice(0, 4000),
        truncated: stdout.length > maxOut,
      });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
  });
```

</details>

**依据 5 · 源码核查**：[lib/pkg.js:63-76](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/lib/pkg.js#L63-L76)

PATH 检查。

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

#### 缺口

- 无大项目运行成本或节时对照。
  **影响**：不能宣称扫描无代价或摘要足够。
  **进一步探讨**：固定大小项目记耗时、截断、人工复核分钟。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 适合怎样采用，项目环境绑定如何验证？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可先把它当快速导航，在配置 allowRoots 后使用 npm/cargo 目录工具，重要结论仍看原始锁文件和官方命令；Python 目标环境必须明确指定解释器路径或先保证 DSH 进程 PATH 与项目 venv 一致，当前工具没有 project dir 参数。可提出未实现假设：每次结果携带包管理器可执行路径、项目根、环境标识、退出码和截断完整性，再以根内 venv 选 pip，可减少“别的环境包列表”误判。两套 venv 和两个项目交错查询，对照当前工具的环境错配率、复核时间和额外配置。

#### 证据与依据

**依据 1 · 源码核查**：[lib/pkg.js:16-31](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/lib/pkg.js#L16-L31)

项目 realpath 限制可作为根绑定基础。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/pkg.js:63-76](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/lib/pkg.js#L63-L76)

可执行路径发现。

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

**依据 3 · 源码核查**：[lib/pkg.js:146-157](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/lib/pkg.js#L146-L157)

pip 当前跟随全局 PATH。

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[index.js:98-121](https://github.com/173787247/dsh-wsl-pkg/blob/c79553532eda43f86f3d056ad31e35d11710ad33/index.js#L98-L121)

pip 工具不带 dir。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.tools.register({
    name: "pkg_pip_list",
    description: "pip list --format=json (capped names).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text: v.ok === false ? v.error : (v.packages || []).map((p) => `${p.name}==${p.version}`).join("\n"),
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      try {
        return await pipList({ timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "pip list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "pip list", content: r.content }),
```

</details>

#### 缺口

- 环境绑定与完整性标签未实现。
  **影响**：不能当当前收益。
  **进一步探讨**：双 venv/双项目交错查询，核错配率与复核工时。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
