# DSH 正则工具

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-regex)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)
<!-- END META -->

> **功能**：在 DSH 中测试 JavaScript 正则、提取捕获组、替换文本和静态解释模式。

> **亮点**：把对短文本的匹配与捕获组检查带入 DSH，给执行动作单设可终止 worker，保留静态模式解释。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：达到匹配上限时 find 仍返回一般数组。单次 worker 预算也不能作为多个并发请求的总资源上限。[Q02](#research-q02)

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
  - [Q01 · Agent 从短日志提取字段时，哪些输出来自实际运算？](#detail-section-11)
  - [Q02 · 遇到高回溯输入或大量匹配，工具何时停止，能否把返回当成完整清单？](#detail-section-12)
  - [Q03 · 如何低成本确认短文本任务合格，什么变化值得另验？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DSH 的开发者可以检查一段短日志中的重复匹配或字段提取规则。

grep 适合现有文件，Node 或 Python 脚本适合整批处理和完整计数；模型直接推断无法给出实际匹配过程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 匹配与提取 | 核对索引和捕获组 | 找全时不能只用有限结果 |
| 替换 | 生成替换后的文本 | 执行时间、输入和最终输出有界 |
| 静态解释 | 理解模式结构 | 不能代替执行验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools 与 Cordis peers | 是 | 挂载工具 | 宿主加载未知 |
| Node worker | 执行动作需要 | 隔离匹配计算 | 启动或执行失败会报错 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 接入 | 用户在隔离 profile 安装固定包 | 列表出现 regex |
| 核验 | 使用已知短日志提取捕获组 | 索引和组与人工预期相符 |
| 回退 | 结果触及上限或超时时用脚本 | 检查完整清单 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 未量化 | 确认 peer 与 profile | 历史消费路径为作者声明 |
| 持续 | 每个执行动作启动 worker | 核对返回匹配范围 | 并发与耗时未验证 |
| 恢复 | 未量化 | 切回受控脚本并分片检查 | 仍需保留原文本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 正则执行 | 返回匹配与组，限制输入与 worker 预算 | 实际模型是否准确传参 |
| 解释 | 静态扫描，不执行匹配 | 与独立解释工具对照覆盖 |

> **思考**：达到匹配上限时 find 仍返回一般数组。单次 worker 预算也不能作为多个并发请求的总资源上限。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把对短文本的匹配与捕获组检查带入 DSH，给执行动作单设可终止 worker，保留静态模式解释。[Q01](#research-q01) [Q02](#research-q02)

执行和解释分开，worker 的 message、error、exit 和预算都有处理。匹配数组没有完整性指示。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

达到匹配上限时 find 仍返回一般数组。单次 worker 预算也不能作为多个并发请求的总资源上限。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用匿名正常与超上限的短文本核对实际结果；有全量计数需求时使用现成脚本。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定产物的注册、执行与失败分支，未测试宿主兼容、并发负担或任务收益。

- 已检查：作者 README、包清单、源码路径 packages/dsh-tool-regex/package.json、packages/dsh-tool-regex/cordis.patch.yml、packages/dsh-tool-regex/lib/index.js、packages/dsh-tool-regex/lib/engine.js、packages/dsh-tool-regex/README.md 及固定范围 inventory；组件：packages/dsh-tool-regex。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子包产物和交接路径。未运行 Node worker、目标宿主、模型任务或测试。
- 下一步：同一隔离 profile 对照普通匹配、空匹配、超过 cap 的输入和高回溯输入。比较与固定脚本输出及实际诊断成本。

**分析版本**

- **仓库**：[omdsh-dev/dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit)
- **版本号**：0.0.1（[固定提交 c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

为 find 增加剩余匹配提示，在刚好达到上限和超过上限的样例上比较能否减少模型的完整性误判。[Q03](#research-q03)

同一隔离 profile 对照普通匹配、空匹配、超过 cap 的输入和高回溯输入。比较与固定脚本输出及实际诊断成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 5 | 620 | 515 | 106 | — |
| .md | source | 2 | 286 | — | — | 2771 |
| .ts | source | 5 | 676 | 511 | 114 | — |
| .ts | test | 3 | 467 | 386 | 13 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 正则工具怎样给短日志提取字段并限制高回溯输入？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Agent 从短日志提取字段时，哪些输出来自实际运算？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

根工具不覆盖整个仓库，只在该子包的 profile 补丁激活后以 tools 注册 regex。test、find、replace 走 worker 和 JavaScript RegExp；find 返回索引、完整匹配和捕获组，可核对模型是否找错。find 会自动添加 g，空匹配时显式推进游标，Unicode 模式处理代理对。explain 走静态解释，不执行模式或替代匹配正确性检验。grep 适合搜索文件，Node 脚本也能给等价计算；这里的增量是把测试、短文本提取和替换纳入 DSH 一次可重放的调用，并可直接核对输入和结果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-regex/package.json:21-37](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-regex/package.json#L21-L37)

宿主 peer 和子包补丁、模块出口。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-regex/cordis.patch.yml:1-4](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-regex/cordis.patch.yml#L1-L4)

挂载子包模块。

```text
# dsh bundle patch: inserts this plugin into a profile's layer stack (0806+).
- insert:
    - id: tool-regex
      name: '@deepseek-ai/dsh-tool-regex'
```

**依据 3 · 源码核查**：[packages/dsh-tool-regex/lib/index.js:66-102](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-regex/lib/index.js#L66-L102)

注册动作和输入契约。

<details>
<summary>查看原文（37行）</summary>

```text
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'regex',
        description: 'Regular expression utilities over text (JavaScript syntax; pattern without surrounding slashes). ' +
            'Actions: test (does input match), find (all matches with index, numbered captures, and named groups; ' +
            'the g flag is added automatically), replace (global safe replacement with $1/$<name>/$$ references), ' +
            'explain (static human-readable breakdown of the pattern; never executes it). ' +
            'test/find/replace run in an isolated worker with a hard 1000ms budget (timeout returns an error); ' +
            'inputs over 64KB, patterns over 16KB, replacements over 16KB, or outputs over 1MB are rejected. ' +
            'Do not use unanchored nested quantifiers (e.g. (a+)+) on large untrusted input: ReDoS risk.',
        parameters: {
            action: {
                type: 'string',
                required: true,
                enum: ['test', 'find', 'replace', 'explain'],
                description: 'Operation to perform.',
            },
            pattern: {
                type: 'string',
                required: true,
                description: 'Regular expression pattern (JavaScript syntax; do not include surrounding slashes).',
            },
            input: {
                type: 'string',
                description: 'Text to match against (required for test/find/replace).',
            },
            flags: {
                type: 'string',
                description: 'Flag characters, e.g. "gi". Supported: g i m s u y d v. Must be unique and valid; unknown flags error out.',
            },
            replacement: {
                type: 'string',
                description: 'Replacement text for replace; supports $1, $2, $<name> references and $$ for a literal dollar sign.',
            },
            limit: {
                type: 'integer',
                description: 'Maximum matches to report (find), default 50, capped at 1000. Prevents unbounded output.',
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-regex/lib/index.js:105-117](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-regex/lib/index.js#L105-L117)

执行链区分 explain 与 worker。

<details>
<summary>查看原文（13行）</summary>

```text
        output: {
            schema: { type: 'string' },
            render: (_args, value) => [{ type: 'text', text: value }],
        },
        execute: (args) => {
            const action = args.action;
            // explain 是线性静态扫描（pattern ≤16KB），无需 worker；其余动作进 worker 硬预算
            if (action === 'explain') {
                return Promise.resolve(executeAction(args));
            }
            return executeInWorker(args);
        },
        timeoutMs: 1000,
```

</details>

**依据 5 · 源码核查**：[packages/dsh-tool-regex/lib/engine.js:92-118](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-regex/lib/engine.js#L92-L118)

find 捕获组与空匹配推进。

<details>
<summary>查看原文（27行）</summary>

```text
export function testMatch(re, input) {
    re.lastIndex = 0;
    return { matched: re.test(input) };
}
/** find：收集所有匹配 + 捕获组，受 limit 约束（钳制到 MAX_MATCHES）。 */
export function findAll(re, input, limit) {
    const cap = normalizeLimit(limit);
    const unicode = re.unicode || re.unicodeSets;
    const out = [];
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(input)) !== null) {
        out.push({
            index: m.index,
            match: m[0],
            captures: m.slice(1),
            groups: m.groups ? { ...m.groups } : null,
        });
        if (out.length >= cap)
            break;
        if (m[0].length === 0) {
            // 空匹配推进：u/v 下按 code point 边界推进，避免重复命中/死循环
            re.lastIndex = advanceStringIndex(input, re.lastIndex, unicode);
        }
    }
    return out;
}
```

</details>

#### 缺口

- 未验证某个宿主版本的实际注册
  **影响**：不能把可调用结构写成该版本已装好
  **进一步探讨**：在隔离 profile 核对工具列表和已知捕获组

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 遇到高回溯输入或大量匹配，工具何时停止，能否把返回当成完整清单？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑、功能与机制

#### 完整回答

执行链在 worker 建立后启动计时器，1 秒设为硬预算；计时器触发终止请求并拒绝，message/error/exit 也分别收口。它避免把匹配放到宿主主线程，但每次调用仍创建 worker，链路未给同一时刻的 worker 总数设配额。输入按字节设限，模式和替换内容也有限制。find 最多返回调用 limit 内的匹配，默认 50、至多 1000，直接返回匹配数组，达到上限时没有单独的截断标志。replace 先完整遍历计数，再用字符串替换，并在得到结果后检查输出字节。已提交产物的 replace 路径不按 1000 次中止，因此不能把 find 条数上限套到替换。替换后的字符串需要先在 worker 形成，输出上限并非预先内存上限。因此仅凭 find 返回了 50 条不能判断没有更多结果；需要完整清单时先分片或用独立脚本计数。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-regex/lib/index.js:20-64](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-regex/lib/index.js#L20-L64)

每次创建 worker，计时终止并处理消息与退出。

<details>
<summary>查看原文（45行）</summary>

```text
export const name = '@deepseek-ai/dsh-tool-regex';
export const inject = ['tools'];
/** worker 内正则执行的硬预算（毫秒）；到期 terminate 并报错。 */
const WORKER_BUDGET_MS = 1000;
/** 在可终止的 worker 内执行 test/find/replace；超预算硬中断。 */
function executeInWorker(args) {
    return new Promise((resolve, reject) => {
        // 源码态（vitest）引用 ./worker.ts（Node 原生 type-stripping 加载）；
        // 构建态（lib）引用 ./worker.js
        const workerUrl = new URL(import.meta.url.endsWith('.ts') ? './worker.ts' : './worker.js', import.meta.url);
        const worker = new Worker(workerUrl);
        let settled = false;
        const timer = setTimeout(() => {
            if (settled)
                return;
            settled = true;
            void worker.terminate();
            reject(new Error(`regex: execution timed out (${WORKER_BUDGET_MS}ms)`));
        }, WORKER_BUDGET_MS);
        const settle = (fn) => {
            if (settled)
                return;
            settled = true;
            clearTimeout(timer);
            void worker.terminate();
            fn();
        };
        worker.once('message', (msg) => {
            settle(() => {
                if (msg.ok)
                    resolve(msg.value ?? '');
                else
                    reject(new Error(msg.error ?? 'regex: worker failed'));
            });
        });
        worker.once('error', (err) => {
            const message = err instanceof Error ? err.message : String(err);
            settle(() => reject(new Error(`regex: worker error: ${message}`)));
        });
        worker.once('exit', (code) => {
            // 仅在未收到响应时可达（正常路径已由 message 处理 settle）；视为失败
            settle(() => reject(new Error(`regex: worker exited with code ${code} before responding`)));
        });
        worker.postMessage({ id: 1, args });
    });
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-regex/lib/engine.js:20-38](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-regex/lib/engine.js#L20-L38)

明确字节和匹配数限制。

<details>
<summary>查看原文（19行）</summary>

```text
export const MAX_INPUT_BYTES = 64_000;
export const MAX_PATTERN_BYTES = 16_384;
export const MAX_REPLACEMENT_BYTES = 16_384;
export const MAX_OUTPUT_BYTES = 1_000_000;
export const MAX_MATCHES = 1_000;
export const MAX_EXPLAIN_NODES = 4_096;
const VALID_FLAGS = 'dgimsuyv';
const DEFAULT_LIMIT = 50;
/** 规范化 limit：非法值回退默认 50；超过 MAX_MATCHES 钳制到 MAX_MATCHES。 */
export function normalizeLimit(limit) {
    if (typeof limit !== 'number' || !Number.isFinite(limit) || limit < 1) {
        return DEFAULT_LIMIT;
    }
    return Math.min(Math.floor(limit), MAX_MATCHES);
}
/** 字节守卫：超上限报错（不截断）。 */
function assertBytes(value, max, label) {
    if (Buffer.byteLength(value, 'utf8') > max) {
        throw new Error(`regex: ${label} exceeds ${max} bytes`);
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-regex/lib/engine.js:97-140](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-regex/lib/engine.js#L97-L140)

find 的数组上限，以及 replace 完整遍历后检查输出。

<details>
<summary>查看原文（44行）</summary>

```text
export function findAll(re, input, limit) {
    const cap = normalizeLimit(limit);
    const unicode = re.unicode || re.unicodeSets;
    const out = [];
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(input)) !== null) {
        out.push({
            index: m.index,
            match: m[0],
            captures: m.slice(1),
            groups: m.groups ? { ...m.groups } : null,
        });
        if (out.length >= cap)
            break;
        if (m[0].length === 0) {
            // 空匹配推进：u/v 下按 code point 边界推进，避免重复命中/死循环
            re.lastIndex = advanceStringIndex(input, re.lastIndex, unicode);
        }
    }
    return out;
}
/** replace：全局替换（编译时已强制 'g'），返回结果文本与替换次数。 */
export function replaceAll(re, input, replacement) {
    if (typeof replacement !== 'string') {
        throw new Error('regex: replacement must be a string');
    }
    assertBytes(replacement, MAX_REPLACEMENT_BYTES, 'replacement');
    const unicode = re.unicode || re.unicodeSets;
    // 计数 pass：与 replace 相同的遍历语义（含空匹配推进规则）
    let replaced = 0;
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(input)) !== null) {
        replaced++;
        if (m[0].length === 0) {
            re.lastIndex = advanceStringIndex(input, re.lastIndex, unicode);
        }
    }
    // 执行 pass：字符串替换路径（JS 原生 $-语义，回调路径不会二次展开）
    re.lastIndex = 0;
    const result = input.replace(re, replacement);
    assertBytes(result, MAX_OUTPUT_BYTES, 'result');
    return { result, replaced };
```

</details>

#### 缺口

- 大量并发请求的宿主负担及计时误差未运行验证
  **影响**：不能把单次预算等同全局 CPU 或内存限额
  **进一步探讨**：在隔离宿主测同时调用、计时失败和后续请求是否仍可处理

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何低成本确认短文本任务合格，什么变化值得另验？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

已有 DSH 且常从短测试日志抽取字段的人，可先用有已知捕获组的匿名文本，确认结果、部分匹配和无匹配均符合预期，再检查接近上限的返回。首次需查 peer、选择 profile 与工具冲突，后续有工具调用、worker 启动与人工核对边界的负担，时间和现金未量化。超时或需要完整计数时可退回带批处理限制的脚本。可探索返回 hasMore 与匹配预算原因，先在 cap 和 cap+1 两个输入验证是否能减少模型将局部列表写成全量结果；若分页脚本更快或标记导致额外扫描显著拖慢，则无优势。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-regex/lib/engine.js:28-33](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-regex/lib/engine.js#L28-L33)

当前限额默认和钳制。

```text
/** 规范化 limit：非法值回退默认 50；超过 MAX_MATCHES 钳制到 MAX_MATCHES。 */
export function normalizeLimit(limit) {
    if (typeof limit !== 'number' || !Number.isFinite(limit) || limit < 1) {
        return DEFAULT_LIMIT;
    }
    return Math.min(Math.floor(limit), MAX_MATCHES);
```

**依据 2 · 源码核查**：[packages/dsh-tool-regex/lib/engine.js:97-118](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-regex/lib/engine.js#L97-L118)

返回值没有单独完整性标志。

<details>
<summary>查看原文（22行）</summary>

```text
export function findAll(re, input, limit) {
    const cap = normalizeLimit(limit);
    const unicode = re.unicode || re.unicodeSets;
    const out = [];
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(input)) !== null) {
        out.push({
            index: m.index,
            match: m[0],
            captures: m.slice(1),
            groups: m.groups ? { ...m.groups } : null,
        });
        if (out.length >= cap)
            break;
        if (m[0].length === 0) {
            // 空匹配推进：u/v 下按 code point 边界推进，避免重复命中/死循环
            re.lastIndex = advanceStringIndex(input, re.lastIndex, unicode);
        }
    }
    return out;
}
```

</details>

**依据 3 · 作者声明**：[packages/dsh-tool-regex/README.md:79-86](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-regex/README.md#L79-L86)

作者历史兼容与 tarball 陈述。

```text
## DSH 0.1.5-rc.1 兼容（已验证）

本插件已迁移到 DSH 0.1.5-rc.1 依赖线，并在 `local harness 0.1.5-rc.1`（npm 私有包）的隔离 consumer 中完成全链路验证：

- **类型/运行时**：peer 为 `@deepseek-ai/cordis: ^4.0.1` + `@deepseek-ai/dsh-tools: >=0.0.1-rc.1 <0.2.0` + `@deepseek-ai/dsh-invariants: >=0.0.1-rc.1 <0.2.0`；不再依赖 unscoped `cordis`
- **独立构建**：`npm install`（devDependencies 自包含 typescript/vitest/@types/node）→ `npm run typecheck` → `npm test` → `npm run build` → `npm pack`
- **消费验证**：tarball 装入 DSH 0.1.5-rc.1（npm）consumer → `dsh --profile compat --dump-config` 出现本插件 row → 工具真实注册与执行通过
- **启动方式**：`npx -p @deepseek-ai/dsh@next dsh web`（lib 生产模式；勿 `install -g` 全局安装）
```

#### 缺口

- 同样短日志的人工操作时间和端到端正确性未知
  **影响**：不能推算较 shell 工具节时
  **进一步探讨**：比较同一输入的工具路径与固定脚本，记录漏报、错误和人工耗时

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
