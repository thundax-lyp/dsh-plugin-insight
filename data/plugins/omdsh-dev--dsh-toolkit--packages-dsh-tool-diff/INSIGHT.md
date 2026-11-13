# dsh-tool-diff

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中比较文本、JSON、CSV 和 Markdown，并生成和校验内存补丁。

> **亮点**：[Q01](#research-q01) 的路径级和键级回执让小型配置差异可在会话里复核，省去临时构造脚本。

> **主要限制**：[Q02](#research-q02) 的重复键和裁切可让返回只覆盖部分差异；截断的补丁明示不可应用。

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
  - [Q01 · 两份文本如何形成可复核的结构化差异？](#detail-section-11)
  - [Q02 · 怎样解释重复键、截断和补丁校验？](#detail-section-12)
  - [Q03 · 如何选试用范围，怎样检验避免裁切误读的回执设计？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者可在会话中复核两份小型公开配置或样例数据的差异。

系统 diff 按行比较，jq、CSV 脚本及 Git 可分别提供结构化对照、可追溯源记录和真实补丁流程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 结构化差异 | 审阅小型 JSON/CSV/Markdown | 注意重复键与裁切 |
| 文本差异 | 查看行变更 | 回执可能受预算限制 |
| 补丁模拟 | 生成并校验内存补丁 | 不可将截断结果应用到文件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Cordis、DSH tools 与固定子包 | 是 | 挂载 diff | 保留原有工具 |
| 两侧公开小型文本 | 本建议必需 | 限制预算和记录风险 | 转离线比较 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户加载隔离 profile | diff 工具出现 |
| 比较 | Agent 提交公开两侧文本 | 检查结构差异、裁切和重复键 |
| 验收 | 用户对照原文件 | 缺失或需落盘改用 Git |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主及包准备，金额未知 | 核对版本和 profile | 固定包待验 |
| 持续 | 传递两份内容及比较资源，金额未知 | 复核回执与原始数据 | 同任务耗时未知 |
| 失败恢复 | 重新比较或改用脚本，金额未知 | 核对未显示的变化 | 宿主退出待验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 格式化差异 | JSON 路径和 CSV 键分支 | 真实审阅节时 |
| 补丁预览 | 内存上下文和 after 比较 | 真实 Git 应用效果 |
| 回执范围 | 输出信封预算及多类裁切 | 用户是否误读 |

> **思考**：[Q02](#research-q02) 的重复键和裁切可让返回只覆盖部分差异；截断的补丁明示不可应用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的路径级和键级回执让小型配置差异可在会话里复核，省去临时构造脚本。

[Q02](#research-q02) 的补丁内部校验和裁切失败标志清楚，文本子载荷仍需单独检查完整性。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的重复键和裁切可让返回只覆盖部分差异；截断的补丁明示不可应用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 限公开小样本试用，按 [Q02](#research-q02) 核对裁切和重复键，实际仓库修改用原有 Git 流程。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持结构化比较、裁切和补丁模拟。真实审阅效果及宿主回执待验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-tool-diff/package.json、packages/dsh-tool-diff/cordis.patch.yml、packages/dsh-tool-diff/lib/index.js、packages/dsh-tool-diff/README.md、packages/dsh-tool-diff/lib/csv-diff.js、packages/dsh-tool-diff/lib/patch.js 及固定范围 inventory；组件：packages/dsh-tool-diff。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对固定子包、实际装载入口、JSON/CSV 输出和补丁路径；未运行工具、测试或宿主。
- 下一步：在隔离 profile 对照相同与不同配置、重复键、缺字段、预算触顶和补丁校验；回读禁用后的工具清单。

**分析版本**

- **仓库**：[omdsh-dev/dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit)
- **版本号**：0.0.1（[固定提交 c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出逐载荷公布截断和剩余变化计数，用接近预算的样本检查误读。

在隔离 profile 对照相同与不同配置、重复键、缺字段、预算触顶和补丁校验；回读禁用后的工具清单。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 1908 | 1713 | 200 | — |
| .md | source | 2 | 284 | — | — | 2853 |
| .ts | source | 8 | 1935 | 1607 | 206 | — |
| .ts | test | 8 | 1098 | 951 | 19 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在会话审阅两份小型内容时，哪些差异报告可直接复核，何时必须回到原文件与标准补丁工具？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 两份文本如何形成可复核的结构化差异？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

维护配置或 API 的开发者可传入 before、after 和 action；注册函数将工具调用交给 runAction。分发先拒绝非法 Unicode 和单侧超过 256 KiB 的输入，再按格式选择行级、JSON 路径、CSV 键／位置、Markdown 标题或补丁。对 JSON，返回变化路径及前后值；还可选择统一文本输出。相较系统行级 diff，结构化字段更容易复核；用户已有结构化比较脚本时，增量主要是直接会话回执及统一入口。正文来自参数，没有仓库读取或落盘动作。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-diff/package.json:21-38](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/package.json#L21-L38)

声明 Cordis、tools 与 invariants peer，bundle 指向补丁，默认导出指向 lib/index.js。

<details>
<summary>查看原文（18行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-invariants": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/cordis": "^4.0.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-diff/cordis.patch.yml:1-4](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/cordis.patch.yml#L1-L4)

按固定包名插入 tool-diff。

```text
# dsh bundle patch: inserts this plugin into a profile's layer stack (0806+).
- insert:
    - id: tool-diff
      name: '@deepseek-ai/dsh-tool-diff'
```

**依据 3 · 源码核查**：[packages/dsh-tool-diff/lib/index.js:314-322](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/lib/index.js#L314-L322)

注入 tools 并注册 diff。

```text
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'diff',
        description: 'Compare two text blobs and produce a diff. ' +
            'Actions: text (unified line diff), json (path-structured diff), csv (keyed/positional row diff), ' +
            'markdown (heading-path structured diff), patch (generate + validate a unified patch in memory). ' +
            'Output is a JSON envelope with a common summary (equal/truncated/beforeBytes/afterBytes/changes) ' +
            'plus action-specific fields. Pure in-memory text processing: never reads files, calls git, ' +
            'or applies patches to disk. Inputs up to 256KiB each, output capped at 64KiB.',
```

**依据 4 · 源码核查**：[packages/dsh-tool-diff/lib/index.js:374-381](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/lib/index.js#L374-L381)

注册回调进入本包实际执行逻辑并呈现回执。

```text
        output: {
            schema: { type: 'string' },
            render: (_args, value) => [{ type: 'text', text: value }],
        },
        execute: args => Promise.resolve(runAction(args)),
        timeoutMs: 2000,
    }));
}
```

**依据 5 · 源码核查**：[packages/dsh-tool-diff/lib/index.js:20-21](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/lib/index.js#L20-L21)

导出组件名并依赖 tools。

```text
export const name = '@deepseek-ai/dsh-tool-diff';
export const inject = ['tools'];
```

**依据 6 · 源码核查**：[packages/dsh-tool-diff/lib/index.js:68-100](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/lib/index.js#L68-L100)

实际分发、输入验证、选项。

<details>
<summary>查看原文（33行）</summary>

```text
function runAction(args) {
    const result = dispatch(args);
    // D-07 兜底：任何 action 的最终 JSON 信封必须 ≤64KiB（fitEnvelope/patch 二分已保证，此处为契约断言）
    assertOutputSize(result);
    return result;
}
function dispatch(args) {
    const action = args.action;
    if (typeof action !== 'string')
        throw new Error('diff: action must be a string');
    const before = str(args.before, 'before');
    const after = str(args.after, 'after');
    // D-11 修复：孤立 surrogate 拒绝（合法 Unicode 前置检查）
    assertWellFormedText(before, 'before');
    assertWellFormedText(after, 'after');
    if (utf8ByteLength(before) > MAX_INPUT_BYTES) {
        throw new Error(`diff: before input exceeds ${MAX_INPUT_BYTES / 1024}KiB limit`);
    }
    if (utf8ByteLength(after) > MAX_INPUT_BYTES) {
        throw new Error(`diff: after input exceeds ${MAX_INPUT_BYTES / 1024}KiB limit`);
    }
    const context = normalizeContext(args.context);
    const maxChanges = normalizeMaxChanges(args.maxChanges);
    const ignoreWhitespace = args.ignoreWhitespace === true;
    const ignoreCase = args.ignoreCase === true;
    const sortKeys = args.sortKeys !== false;
    const format = typeof args.format === 'string' ? args.format : undefined;
    if (format !== undefined && !['unified', 'structured', 'both'].includes(format)) {
        throw new Error(`diff: unknown format "${format}" (expected unified|structured|both)`);
    }
    const key = typeof args.key === 'string' ? args.key : undefined;
    const delimiter = typeof args.delimiter === 'string' ? args.delimiter : undefined;
    const summaryBase = (equal, truncated, changes) => ({
```

</details>

**依据 7 · 源码核查**：[packages/dsh-tool-diff/lib/index.js:129-153](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/lib/index.js#L129-L153)

JSON 路径、前后值和信封。

<details>
<summary>查看原文（25行）</summary>

```text
            const { changes, duplicateKeys } = jsonDiffText(before, after, { ignoreCase, sortKeys });
            const wantDiff = format === 'unified' || format === 'both';
            const hasDup = duplicateKeys.before.length > 0 || duplicateKeys.after.length > 0;
            const make = (n) => {
                const limited = changes.slice(0, n).map(c => ({ op: c.kind, path: c.path, ...(c.kind !== 'add' ? { before: c.before } : {}), ...(c.kind !== 'remove' ? { after: c.after } : {}) }));
                const summary = { added: 0, removed: 0, replaced: 0, moved: 0 };
                for (const c of changes.slice(0, n)) {
                    if (c.kind === 'add')
                        summary.added++;
                    else if (c.kind === 'remove')
                        summary.removed++;
                    else
                        summary.replaced++;
                }
                return {
                    kind: 'json',
                    ...summaryBase(changes.length === 0, n < changes.length, changes.length),
                    changes: limited,
                    summary,
                    // D-10 修复：重复键不静默丢弃，两侧分别报告
                    ...(hasDup ? { duplicateKeys } : {}),
                    ...(wantDiff ? { diff: truncateText(unifiedDiff(before, after, { context, ignoreWhitespace, ignoreCase }).diff, 48 * 1024).text } : {}),
                };
            };
            return fitEnvelope(make, Math.min(maxChanges, changes.length)).text;
```

</details>

**依据 8 · 作者声明**：[packages/dsh-tool-diff/README.md:9-22](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/README.md#L9-L22)

作者比较外部 shell 和只读限制。

<details>
<summary>查看原文（14行）</summary>

```text
## 动机

Agent 需要对比两份内容（配置片段、API 响应、表格、文档修订）时，现有路径是起 `bash` 进程调用系统 diff 或手写比较逻辑：

1. **每次调用都起进程**——Windows 上尤其昂贵
2. **系统 diff 不懂结构**——JSON 只能给整段文本差异，看不出 `$.user.name` 这样的路径级变更
3. **手写比较代码不可验证**——边界（引号内逗号、嵌套数组、标题重命名）极易出错

本插件提供确定性、零依赖、纯函数的差异比较：一次函数调用，毫秒级返回结构化 JSON 报告或标准 unified diff。

## 安全模型

- **零依赖**：Myers 行级 diff、RFC 4180 解析器、JSON 递归比较全部手写
- **只读**：不读文件、不写文件、不联网、不调 git；`patch` action 只在内存中生成并校验补丁，绝不落盘
```

</details>

#### 缺口

- 缺同任务的漏判率和审阅耗时样本
  **影响**：不能确认部署收益
  **进一步探讨**：以公开双份配置比较结构化回执、行 diff 和既有脚本

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 怎样解释重复键、截断和补丁校验？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

CSV 键比较索引两侧并合并重复键集合，重复键从匹配中跳过并使 equal 为 false。JSON 分支在已解析值变化数为零时仍可能报告重复键，不能仅看 equal 判断原始文本没有歧义。回执预算通过信封序列化和裁切控制，不能代表全量差异；JSON/CSV 的文本 diff 还有单独裁切路径。patch 会用 before 生成补丁并在内存中模拟位置、上下文及增删，比较结果与 after；最终信封中的补丁因预算被裁切时，valid 和 patchComplete 会分别置为 false，不能使用该前缀修改工作区。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-diff/lib/index.js:48-71](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/lib/index.js#L48-L71)

先构造信封、比较预算并尝试缩减。

<details>
<summary>查看原文（24行）</summary>

```text
function fitEnvelope(payloadFn, fullCount) {
    const full = JSON.stringify(payloadFn(fullCount));
    if (utf8ByteLength(full) <= MAX_OUTPUT_BYTES)
        return { text: full, truncated: false };
    let lo = 0;
    let hi = fullCount;
    let best = '';
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const t = JSON.stringify(payloadFn(mid));
        if (utf8ByteLength(t) <= MAX_OUTPUT_BYTES) {
            best = t;
            lo = mid + 1;
        }
        else {
            hi = mid - 1;
        }
    }
    return { text: best, truncated: true };
}
function runAction(args) {
    const result = dispatch(args);
    // D-07 兜底：任何 action 的最终 JSON 信封必须 ≤64KiB（fitEnvelope/patch 二分已保证，此处为契约断言）
    assertOutputSize(result);
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-diff/lib/index.js:129-175](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/lib/index.js#L129-L175)

JSON equal 与重复键独立，结构与文本输出各有限制。

<details>
<summary>查看原文（47行）</summary>

```text
            const { changes, duplicateKeys } = jsonDiffText(before, after, { ignoreCase, sortKeys });
            const wantDiff = format === 'unified' || format === 'both';
            const hasDup = duplicateKeys.before.length > 0 || duplicateKeys.after.length > 0;
            const make = (n) => {
                const limited = changes.slice(0, n).map(c => ({ op: c.kind, path: c.path, ...(c.kind !== 'add' ? { before: c.before } : {}), ...(c.kind !== 'remove' ? { after: c.after } : {}) }));
                const summary = { added: 0, removed: 0, replaced: 0, moved: 0 };
                for (const c of changes.slice(0, n)) {
                    if (c.kind === 'add')
                        summary.added++;
                    else if (c.kind === 'remove')
                        summary.removed++;
                    else
                        summary.replaced++;
                }
                return {
                    kind: 'json',
                    ...summaryBase(changes.length === 0, n < changes.length, changes.length),
                    changes: limited,
                    summary,
                    // D-10 修复：重复键不静默丢弃，两侧分别报告
                    ...(hasDup ? { duplicateKeys } : {}),
                    ...(wantDiff ? { diff: truncateText(unifiedDiff(before, after, { context, ignoreWhitespace, ignoreCase }).diff, 48 * 1024).text } : {}),
                };
            };
            return fitEnvelope(make, Math.min(maxChanges, changes.length)).text;
        }
        case 'csv': {
            const report = csvDiff(before, after, { key, delimiter, ignoreCase, ignoreWhitespace });
            const wantDiff = format === 'unified' || format === 'both';
            const make = (n) => {
                const r = csvReportLimited(report, n);
                return {
                    kind: 'csv',
                    ...summaryBase(report.equal, n < csvChangeCount(report), csvChangeCount(report)),
                    mode: r.mode,
                    ...(r.key !== undefined ? { key: r.key } : {}),
                    ...(r.columns ? { columns: r.columns } : {}),
                    addedRows: r.addedRows,
                    removedRows: r.removedRows,
                    changedRows: r.changedRows,
                    duplicateKeys: r.duplicateKeys,
                    addedColumns: r.addedColumns,
                    removedColumns: r.removedColumns,
                    ...(wantDiff ? { diff: truncateText(unifiedDiff(before, after, { context, ignoreWhitespace, ignoreCase }).diff, 48 * 1024).text } : {}),
                };
            };
            return fitEnvelope(make, csvChangeCount(report)).text;
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-diff/lib/csv-diff.js:191-228](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/lib/csv-diff.js#L191-L228)

重复键及缺失键区分，重复组不参与匹配。

<details>
<summary>查看原文（38行）</summary>

```text
    // D-05 修复：两侧统一索引；key 区分"缺失列"与"空字符串"（present/value 二元组）；
    // 任一侧出现重复 key → duplicateKeys 且 equal=false，重复 key 的行不参与匹配（结果确定）。
    const MISSING = '\u0001missing-key';
    const indexRows = (rows) => {
        const map = new Map();
        const counts = new Map();
        const display = new Map();
        for (const r of rows) {
            const present = keyIndex < r.cells.length;
            const value = present ? r.cells[keyIndex] : MISSING;
            const k = `${present ? 'p' : 'm'}\u0000${value}`;
            display.set(k, present ? value : '<missing-key>');
            counts.set(k, (counts.get(k) ?? 0) + 1);
            if (!map.has(k))
                map.set(k, r);
        }
        const dupKeys = [];
        for (const [k, c] of counts) {
            if (c > 1)
                dupKeys.push(k);
        }
        return { map, dupKeys, display };
    };
    const beforeIdx = indexRows(before.rows);
    const afterIdx = indexRows(after.rows);
    const dupSet = new Set([...beforeIdx.dupKeys, ...afterIdx.dupKeys]);
    report.duplicateKeys = [...dupSet].map(k => beforeIdx.display.get(k) ?? afterIdx.display.get(k) ?? k);
    const dupKeyOf = (r) => {
        const present = keyIndex < r.cells.length;
        return `${present ? 'p' : 'm'}\u0000${present ? r.cells[keyIndex] : MISSING}`;
    };
    for (const rb of before.rows) {
        const k = dupKeyOf(rb);
        if (dupSet.has(k))
            continue; // 重复 key 的行结果不确定，跳过
        const ra = afterIdx.map.get(k);
        if (!ra) {
            report.removedRows.push(toRowObject(rb.cells, header));
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-diff/lib/csv-diff.js:250-260](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/lib/csv-diff.js#L250-L260)

重复键使 equal 不成立。

<details>
<summary>查看原文（11行）</summary>

```text
        const k = dupKeyOf(r);
        if (dupSet.has(k))
            continue;
        if (!beforeIdx.map.has(k)) {
            report.addedRows.push(toRowObject(r.cells, header));
        }
    }
    report.equal = report.addedRows.length === 0 && report.removedRows.length === 0 &&
        report.changedRows.length === 0 && report.duplicateKeys.length === 0 &&
        report.addedColumns.length === 0 && report.removedColumns.length === 0;
    return report;
```

</details>

**依据 5 · 源码核查**：[packages/dsh-tool-diff/lib/index.js:194-224](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/lib/index.js#L194-L224)

补丁生成、内存核验与裁切标志。

<details>
<summary>查看原文（31行）</summary>

```text
            // D-03 契约：patch 是精确文本协议，ignore 只作用于比较类 action
            if (ignoreWhitespace || ignoreCase) {
                throw new Error('diff: patch action does not support ignoreCase/ignoreWhitespace (use text action for normalized comparison)');
            }
            const { patch, ops } = generatePatch('before', 'after', before, after, context);
            const validation = validatePatch(before, patch, after);
            // D-08 修复：stats/changes 与渲染同源（仅末尾换行差异按合成序列计）
            const effective = effectiveOps(ops, splitLines(before).trailingNewline, splitLines(after).trailingNewline);
            const stats = lineStats(effective);
            // D-01 修复：equal = before/after 在 patch 语义（精确行 + 末尾换行）下相等，与 valid 无关
            const changeCount = effective.filter(o => o.type !== 'equal').length;
            const equal = changeCount === 0;
            // D-07 修复：整个信封纳入 64KiB 预算；patch 截断 → valid:false + patchComplete:false
            const patchBytes = utf8ByteLength(patch);
            const fullPayload = (capBytes) => {
                const t = truncateText(patch, capBytes);
                const truncated = t.truncated;
                const errs = validation.errors;
                const omittedErrors = errs.length > 10 ? errs.length - 10 : 0;
                return {
                    kind: 'patch',
                    ...summaryBase(equal, truncated, changeCount),
                    valid: truncated ? false : validation.valid,
                    patch: t.text,
                    patchComplete: !truncated,
                    hunks: validation.hunks,
                    appliedLines: validation.appliedLines,
                    appliedBytes: utf8ByteLength(after),
                    targetMatchesAfter: truncated ? false : validation.targetMatchesAfter,
                    errors: truncated ? [...errs.slice(0, 10), 'patch truncated: result is not an applicable patch'] : errs.slice(0, 10),
                    ...(omittedErrors > 0 ? { omittedErrors } : {}),
```

</details>

**依据 6 · 源码核查**：[packages/dsh-tool-diff/lib/patch.js:187-234](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/lib/patch.js#L187-L234)

上下文校验、应用与结果核对。

<details>
<summary>查看原文（48行）</summary>

```text
    // ── 阶段 2：应用（位置按前序 hunk 的净偏移 shift 调整）──
    const applied = before.slice();
    let appliedLines = 0;
    let shift = 0;
    for (const h of parsed.hunks) {
        const pos = h.oldStart === 0 ? 0 : h.oldStart - 1 + shift;
        if (pos < 0 || pos > applied.length) {
            errors.push(`hunk @@ -${h.oldStart},${h.oldCount} +${h.newStart},${h.newCount} @@: position ${pos} out of bounds (file has ${applied.length} lines)`);
            break;
        }
        // 校验 ctx/del 行
        let di = pos;
        let ok = true;
        for (const pl of h.lines) {
            if (pl.kind === 'add')
                continue;
            const target = applied[di];
            if (target === undefined || target !== pl.text) {
                errors.push(`hunk @@ -${h.oldStart},... : context line ${di + 1} mismatch (expected ${JSON.stringify(pl.text)}, got ${JSON.stringify(target)})`);
                ok = false;
                break;
            }
            di++;
        }
        if (!ok)
            break;
        // 应用：删除 del，插入 add
        let di2 = pos;
        for (const pl of h.lines) {
            if (pl.kind === 'del') {
                applied.splice(di2, 1);
                appliedLines++;
            }
            else if (pl.kind === 'add') {
                applied.splice(di2, 0, pl.text);
                di2++;
                appliedLines++;
            }
            else
                di2++;
        }
        shift += (h.newCount - h.oldCount);
    }
    let targetMatchesAfter = applied.length === after.length && applied.every((l, i) => l === after[i]);
    if (!targetMatchesAfter) {
        errors.push('patched result does not match after content');
    }
    return { valid: errors.length === 0, hunks: parsed.hunks.length, appliedLines, targetMatchesAfter, errors };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何选试用范围，怎样检验避免裁切误读的回执设计？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

兼容 Cordis/tools 和固定子包是启动前提。用公开、独立可比的 before/after 检查输出的 equal、重复键、截断及 patchComplete，保留原始输入；真正修改工作区时用 Git 自己的差异、校验和应用流程。作者声明参数会入会话记录，含秘密的配置在本地对照。两份输入都要进入会话，工具还需构造差异和反复序列化，资源投入以得到一个合格审阅结果计。待验证改动是统一提供各子载荷的截断标志和剩余变化计数，比较大 JSON 和混合输出中用户是否会把预览误作全部；若阅读错误没有减少，则保留现有回执和人工规则。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-diff/package.json:2-11](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/package.json#L2-L11)

private 子包和 Node 要求。

<details>
<summary>查看原文（10行）</summary>

```text
  "name": "@deepseek-ai/dsh-tool-diff",
  "description": "DSH diff tool: structured comparison of text/JSON/CSV/Markdown plus unified diff generation and in-memory patch validation. Zero-dependency, read-only.",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "license": "MIT",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
```

</details>

**依据 2 · 作者声明**：[packages/dsh-tool-diff/README.md:19-29](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/README.md#L19-L29)

作者声明输入输出限制和会话参数记录。

<details>
<summary>查看原文（11行）</summary>

```text
## 安全模型

- **零依赖**：Myers 行级 diff、RFC 4180 解析器、JSON 递归比较全部手写
- **只读**：不读文件、不写文件、不联网、不调 git；`patch` action 只在内存中生成并校验补丁，绝不落盘
- **预算**：
  - 输入单侧 ≤ 256 KiB（超限直接报错）
  - 输出 ≤ 64 KiB（超限按 `maxChanges` 与字节预算截断并置 `truncated`）
  - Myers diagonal 预算 2000 + 蛇步总预算 2000 万 + 公共前后缀修剪 + hash 快速拒绝 + 规模上限 4000 行 → 恶意重复/全异文本有界完成
  - 行数 ≤ 50K、JSON 嵌套 ≤ 64 层、CSV ≤ 50K 行 / 512 列
  - `timeoutMs: 2000`
- 工具参数会记入会话日志，不要传入敏感数据
```

</details>

**依据 3 · 作者声明**：[packages/dsh-tool-diff/README.md:87-94](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/README.md#L87-L94)

兼容流程为作者记录。

```text
## DSH 0.1.5-rc.1 兼容（已验证）

本插件已迁移到 DSH 0.1.5-rc.1 依赖线，并在 `local harness 0.1.5-rc.1` 的隔离 consumer 中完成全链路验证：

- **类型/运行时**：`@deepseek-ai/cordis: ^4.0.1` + `@deepseek-ai/dsh-tools: >=0.0.1-rc.1 <0.2.0` + `@deepseek-ai/dsh-invariants: >=0.0.1-rc.1 <0.2.0`（peer）；不再依赖 unscoped `cordis`
- **独立构建**：`npm install`（devDependencies 自包含 typescript/vitest/@types/node）→ `npm run typecheck` → `npm test` → `npm run build` → `npm pack`
- **消费验证**：tarball 装入 0.1.5-rc.1 consumer → `dsh --profile compat --dump-config` 出现本插件 row → 工具真实注册与执行通过
- **启动方式**：`npx -p @deepseek-ai/dsh@next dsh web`（lib 生产模式；勿 `install -g` 全局安装）
```

**依据 4 · 源码核查**：[packages/dsh-tool-diff/lib/index.js:143-152](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-diff/lib/index.js#L143-L152)

JSON 文本差异另行截短。

<details>
<summary>查看原文（10行）</summary>

```text
                return {
                    kind: 'json',
                    ...summaryBase(changes.length === 0, n < changes.length, changes.length),
                    changes: limited,
                    summary,
                    // D-10 修复：重复键不静默丢弃，两侧分别报告
                    ...(hasDup ? { duplicateKeys } : {}),
                    ...(wantDiff ? { diff: truncateText(unifiedDiff(before, after, { context, ignoreWhitespace, ignoreCase }).diff, 48 * 1024).text } : {}),
                };
            };
```

</details>

#### 缺口

- 真实同版宿主中的装载、输出容量和禁用待验
  **影响**：影响能否稳定得到审阅回执
  **进一步探讨**：隔离 profile 用小差异和触顶样本核对并禁用复查

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
