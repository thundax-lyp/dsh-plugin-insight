# dsh-tool-calculator

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-calculator)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)
<!-- END META -->

> **功能**：在 DeepSeek Harness 会话中求值常用数学表达式，支持初等函数和常量。

> **亮点**：[Q01](#research-q01) 说明短公式如何留在会话工具回执中。对允许浮点近似的公式，白名单求值可以免去为一次计算构造 shell 脚本。

> **主要限制**：[Q02](#research-q02) 表明门槛只验证最终数值，无法保证中间算式有定义或整数精确。涉及金额、科学计数法和大整数时应走已有计算器。

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
  - [Q01 · 会话中的短表达式如何变为工具回执，较 shell 增加了什么？](#detail-section-11)
  - [Q02 · 有限数值检查覆盖哪些错误，哪些公式仍会产生看似有效的错误答案？](#detail-section-12)
  - [Q03 · 怎样用隔离 profile 试用，以及什么最小对照能推翻采用理由？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在会话中反复核算小公式的开发者或分析人员，可要求 Agent 给出能用独立计算器复核的数值。

直接使用会话 shell 或另开计算器都可完成算术。shell 容许进一步写脚本，独立计算器便于人工核对，二者都可作为回退。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 表达式求值 | 会话中核算短公式 | 支持白名单函数；数值使用 Number |
| 结果渲染 | 返回可读数值 | 异常展示取决于宿主工具框架 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 Cordis 与 DSH tools | 是 | 加载插件及注册 calculator | 保留原工具 |
| 同版本可装载包 | 是 | 让补丁解析到默认导出 | 在隔离 profile 停在装载验证 |
| 可接受 JavaScript Number 精度 | 适用于本建议 | 避免把舍入结果当精确数 | 改用精确计算 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对隔离 profile 与包导出 | 确认 calculator 已出现 |
| 执行 | Agent 提交可手算表达式 | 对照回执数值和错误 |
| 退出 | 用户禁用插件并检查工具清单 | 回到独立计算器 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主和包准备，费用未知 | 核对 profile 与工具清单 | 固定包装载待验 |
| 持续 | 进程内计算及模型调用，金额未知 | 对关键公式独立复算 | 单位合格任务耗时未知 |
| 失败恢复 | 可能重复模型调用，金额未知 | 处理不支持语法或换精确计算 | 宿主错误回执和退出待验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话内求值 | 工具回调直接调用解析器 | 实际节时和工具选择率 |
| 不支持语法或非有限结果 | 解析和入口可以抛错 | 真实宿主如何呈现异常 |
| 精确计算 | JavaScript Number 算术 | 超出表示精度时的用户影响 |

> **思考**：[Q02](#research-q02) 表明门槛只验证最终数值，无法保证中间算式有定义或整数精确。涉及金额、科学计数法和大整数时应走已有计算器。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 说明短公式如何留在会话工具回执中。对允许浮点近似的公式，白名单求值可以免去为一次计算构造 shell 脚本。

[Q02](#research-q02) 的 own-property 白名单、参数数目、表达式长度及最终有限数门槛便于审查。中间值未守卫，超时配置的宿主行为仍需核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 表明门槛只验证最终数值，无法保证中间算式有定义或整数精确。涉及金额、科学计数法和大整数时应走已有计算器。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 建议在隔离 profile 试几条能独立核算的短表达式，并用 [Q02](#research-q02) 的反例确认边界；遇到舍入风险直接回到精确计算。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持注册、求值及最终有限数门槛。耗时收益、同版加载和宿主错误展示待验证。前移检查是待验证设计。

- 已检查：作者 README、包清单、源码路径 packages/dsh-tool-calculator/package.json、packages/dsh-tool-calculator/cordis.patch.yml、packages/dsh-tool-calculator/lib/index.js、packages/dsh-tool-calculator/README.md、packages/dsh-tool-calculator/lib/evaluate.js 及固定范围 inventory；组件：packages/dsh-tool-calculator。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定子包的 README、包声明、补丁、默认入口和实际加载的求值器，未执行目标代码、测试、安装或宿主验收。
- 下一步：在隔离 profile 比较正常整数、科学计数法、超过安全整数范围、直接除零、嵌套倒数和未启用插件时的结果。

**分析版本**

- **仓库**：[omdsh-dev/dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit)
- **版本号**：0.0.1（[固定提交 c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出把非有限值检测前移到算术节点，并报告出错位置。用一组正常和嵌套除零公式验证是否减少静默接受，同时检查是否增加误拒。

在隔离 profile 比较正常整数、科学计数法、超过安全整数范围、直接除零、嵌套倒数和未启用插件时的结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 240 | 194 | 46 | — |
| .md | source | 2 | 396 | — | — | 2692 |
| .ts | source | 3 | 241 | 176 | 48 | — |
| .ts | test | 2 | 174 | 134 | 7 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 会话中的常规算术何时可以用 calculator 代替模型估算或临时 shell，什么结果仍需要独立核算？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 会话中的短表达式如何变为工具回执，较 shell 增加了什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

目标任务是让会话中的 Agent 对可重算的小公式给出一个数值，例如将批次数与单位耗时合成总量。profile 把该包插入后，Cordis 将 tools 服务注入入口，注册必填 expression 字符串。执行回调在宿主进程同步调用 evaluate，再包装 Promise，输出描述声明 number 并用 String 显示结果。相较让 Agent 写 shell 或人工另开计算器，短公式在工具调用中留有输入与数值，并能直接调用 sqrt 等白名单函数。局部简化来自已有宿主注册与自带解析器的组合。宿主在关闭插件后是否仍有可用 shell 取决于原 profile 权限。作者称运行开销较低，本次仅确认没有为这条链路另起进程。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-calculator/package.json:21-38](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-calculator/package.json#L21-L38)

声明 Cordis/DSH peer、bundle 补丁及默认入口。

<details>
<summary>查看原文（18行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-invariants": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc.1 <0.2.0"
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

**依据 2 · 源码核查**：[packages/dsh-tool-calculator/cordis.patch.yml:1-4](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-calculator/cordis.patch.yml#L1-L4)

插入 tool-calculator 及确切包名。

```text
# dsh bundle patch: inserts this plugin into a profile's layer stack (0806+).
- insert:
    - id: tool-calculator
      name: '@deepseek-ai/dsh-tool-calculator'
```

**依据 3 · 源码核查**：[packages/dsh-tool-calculator/lib/index.js:9-32](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-calculator/lib/index.js#L9-L32)

tools 服务注册、数值渲染及真实求值调用。

<details>
<summary>查看原文（24行）</summary>

```text
import { defineTool } from '@deepseek-ai/dsh-tools';
import { evaluate } from './evaluate.js';
export const name = '@deepseek-ai/dsh-tool-calculator';
export const inject = ['tools'];
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'calculator',
        description: 'Evaluate a mathematical expression safely. ' +
            'Supports +, -, *, /, %, **, parentheses, and functions: ' +
            'abs, ceil, floor, round, max, min, sqrt, pow, log, log2, log10, exp, sin, cos, tan, PI, E.',
        parameters: {
            expression: {
                type: 'string',
                required: true,
                description: 'Mathematical expression, e.g. "15 + 27 * sqrt(9)"',
            },
        },
        output: {
            schema: { type: 'number' },
            render: (_args, value) => [{ type: 'text', text: String(value) }],
        },
        execute: args => Promise.resolve(evaluate(args.expression)),
        timeoutMs: 1000,
    }));
```

</details>

**依据 4 · 作者声明**：[packages/dsh-tool-calculator/README.md:9-16](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-calculator/README.md#L9-L16)

作者将目标场景与 shell 进程开销作对照。

```text
## 动机

Agent 做算术不稳定是 LLM 的通病。DSH 内置的 `bash` 工具可以调用 `echo $((15 + 27 * 3))` 完成计算，但有两个问题：

1. **每次算术都起一个 bash 进程**——Windows 上尤其昂贵（创建进程、加载 shell、执行、收集输出），高频调用时累积延迟显著
2. **bash 算术语法有限**——不支持 `sqrt`、`sin`、`cos`、`log`、`pow` 等数学函数，agent 在这些场景下只能猜答案或写脚本

本插件提供零依赖、零进程、纯函数的计算器——一次函数调用，毫秒级得出结果，覆盖常用初等数学函数。
```

#### 缺口

- 缺少同条件会话与 shell 的任务回执样本
  **影响**：不能量化节时或模型调用开销
  **进一步探讨**：在同一 profile 比较正确结果、完整回执和总耗时

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 有限数值检查覆盖哪些错误，哪些公式仍会产生看似有效的错误答案？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

语法按加减、乘除模、一元正负、幂和原子分层，幂的右参数重新从一元层解析，因此右结合。标识符以 Object.hasOwn 查常量和函数，查不到直接报错，参数数目也检查。入口拒绝非字符串和超过 500 字符的表达式，分词拒绝科学计数法，最终 Number.isFinite 拒绝直接除零或无定义开方的非有限结果。这里只检查最终值，按代码推断，1/(1/0) 仍可得有限的 0。Number 运算也可能把超过安全整数范围的表达式舍入。把有限数回执当作高精度或每个中间步骤均有效会扩大使用边界。源码中的 1000 ms 是传给工具框架的配置，执行求值发生在 Promise.resolve 之前，无法由该函数自身的 Promise 中断。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-calculator/lib/evaluate.js:32-49](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-calculator/lib/evaluate.js#L32-L49)

限制长度常量与拒绝指数表示。

<details>
<summary>查看原文（18行）</summary>

```text
const MAX_EXPRESSION_LENGTH = 500;
/** 词法分析：将输入字符串拆分为 token 数组 */
function tokenize(input) {
    const tokens = [];
    for (let i = 0; i < input.length;) {
        const ch = input.charAt(i);
        if (/\s/.test(ch)) {
            i++;
            continue;
        }
        if (/[0-9]/.test(ch) || (ch === '.' && i + 1 < input.length && /[0-9]/.test(input.charAt(i + 1)))) {
            const m = /^(?:\d+(?:\.\d*)?|\.\d+)/.exec(input.slice(i));
            if (!m)
                throw new Error(`Invalid number at position ${i}`);
            // CALC-06：数字后紧跟 e/E 是科学计数法形态（含 1e、1e+、1e-5），专门报错
            if (/[eE]/.test(input.charAt(i + m[0].length))) {
                throw new Error('Scientific notation is not supported');
            }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-calculator/lib/evaluate.js:82-117](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-calculator/lib/evaluate.js#L82-L117)

中间结果以 JavaScript 运算累加；指数递归进入一元表达式。

<details>
<summary>查看原文（36行）</summary>

```text
    // 加减（最低优先级）
    const parseAdd = () => {
        let left = parseMul();
        while (peek() === '+' || peek() === '-') {
            const op = take();
            const right = parseMul();
            left = op === '+' ? left + right : left - right;
        }
        return left;
    };
    // 乘除取模
    const parseMul = () => {
        let left = parseUnary();
        while (peek() === '*' || peek() === '/' || peek() === '%') {
            const op = take();
            const right = parseUnary();
            left = op === '*' ? left * right : op === '/' ? left / right : left % right;
        }
        return left;
    };
    // 一元正负
    const parseUnary = () => {
        if (peek() === '-' || peek() === '+') {
            const op = take();
            return op === '-' ? -parseUnary() : parseUnary();
        }
        return parsePower();
    };
    // 幂（右结合）
    const parsePower = () => {
        const base = parsePrimary();
        if (peek() === '**') {
            take();
            return base ** parseUnary();
        }
        return base;
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-calculator/lib/evaluate.js:132-166](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-calculator/lib/evaluate.js#L132-L166)

数字转成 Number、白名单 own-property 和参数个数守卫。

<details>
<summary>查看原文（35行）</summary>

```text
        if (/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(t))
            return Number(t);
        if (/^[A-Za-z_]\w*$/.test(t)) {
            // CALC-01：own-property 白名单（Object.hasOwn 不落入原型链）
            if (Object.hasOwn(CONSTANTS, t)) {
                if (peek() === '(')
                    throw new Error(`"${t}" is a constant, not a function`);
                return CONSTANTS[t];
            }
            if (Object.hasOwn(FUNCTIONS, t)) {
                if (take() !== '(')
                    throw new Error(`Missing "(" after function "${t}"`);
                const args = [];
                if (peek() !== ')') {
                    args.push(parseAdd());
                    while (peek() === ',') {
                        take();
                        args.push(parseAdd());
                    }
                }
                if (take() !== ')')
                    throw new Error(`Missing ")" after arguments of "${t}"`);
                // CALC-02：参数个数契约校验
                const spec = FUNCTIONS[t];
                if (args.length < spec.minArgs || args.length > spec.maxArgs) {
                    const expected = spec.minArgs === spec.maxArgs
                        ? String(spec.minArgs)
                        : `at least ${spec.minArgs}`;
                    throw new Error(`Invalid argument count for "${t}": expected ${expected}, got ${args.length}`);
                }
                return spec.fn(...args);
            }
            throw new Error(`Unknown identifier "${t}"`);
        }
        throw new Error(`Unexpected token "${t}"`);
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-calculator/lib/evaluate.js:173-189](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-calculator/lib/evaluate.js#L173-L189)

入口只核对最终有限数。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * 公开接口：求值表达式，返回有限数字；NaN/Infinity 或其他错误均抛错。
 * CALC-05：入口独立校验类型（不依赖上游 schema 校验）。
 */
export function evaluate(expression) {
    if (typeof expression !== 'string') {
        throw new Error('calculator: expression must be a string');
    }
    if (expression.length > MAX_EXPRESSION_LENGTH) {
        throw new Error(`Expression too long (${expression.length} > ${MAX_EXPRESSION_LENGTH})`);
    }
    const result = parse(expression);
    if (typeof result !== 'number' || !Number.isFinite(result)) {
        throw new Error('Expression did not evaluate to a finite number');
    }
    return result;
}
```

</details>

**依据 5 · 源码核查**：[packages/dsh-tool-calculator/lib/index.js:26-32](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-calculator/lib/index.js#L26-L32)

输出显示和 timeoutMs 声明，求值在 Promise.resolve 取参时执行。

```text
        output: {
            schema: { type: 'number' },
            render: (_args, value) => [{ type: 'text', text: String(value) }],
        },
        execute: args => Promise.resolve(evaluate(args.expression)),
        timeoutMs: 1000,
    }));
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样用隔离 profile 试用，以及什么最小对照能推翻采用理由？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

先检查隔离 profile 的包解析与 tools 服务，再用一条独立可算的整数式确认输出。随后对比同一任务的原生 shell 或手工计算，记录从请求到可用数值的时间及重试数。私有子包且 README 提供独立仓库安装方式，固定仓库中的现成 lib 可以核对，实际获得同版 bundle 和装卸需另验。纯求值不写文件，但模型工具调用仍可能使用模型额度，首次还要配置 profile。若目标公式常出现科学计数法、金额分精度或大整数，应直接转用已有精确计算工具。一个值得验证的改进是对中间非有限值立即拒绝并注明位置；用直接除零、嵌套倒数和正常小数做回归，若合法公式被误拒或没有减少看似有效的错值，就不值得增加语义分支。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-calculator/package.json:2-11](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-calculator/package.json#L2-L11)

子包 private、入口和 Node 范围。

<details>
<summary>查看原文（10行）</summary>

```text
  "name": "@deepseek-ai/dsh-tool-calculator",
  "description": "DSH calculator tool",
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

**依据 2 · 源码核查**：[packages/dsh-tool-calculator/package.json:21-29](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-calculator/package.json#L21-L29)

Cordis、invariants 和 tools 声明。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-invariants": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc.1 <0.2.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

**依据 3 · 作者声明**：[packages/dsh-tool-calculator/README.md:97-104](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-calculator/README.md#L97-L104)

作者报告 rc.1 consumer 流程，当前研究未执行。

```text
## DSH 0.1.5-rc.1 兼容（已验证）

本插件已迁移到 DSH 0.1.5-rc.1 依赖线，并在 `local harness 0.1.5-rc.1` 的隔离 consumer 中完成全链路验证：

- **类型/运行时**：`@deepseek-ai/cordis: ^4.0.1` + `@deepseek-ai/dsh-tools: >=0.0.1-rc.1 <0.2.0` + `@deepseek-ai/dsh-invariants: >=0.0.1-rc.1 <0.2.0`（peer）；不再依赖 unscoped `cordis`
- **独立构建**：`npm install`（devDependencies 自包含 typescript/vitest/@types/node）→ `npm run typecheck` → `npm test` → `npm run build` → `npm pack`
- **消费验证**：tarball 装入 0.1.5-rc.1 consumer → `dsh --profile compat --dump-config` 出现本插件 row → 工具真实注册与执行通过
- **启动方式**：`npx -p @deepseek-ai/dsh@next dsh web`（lib 生产模式；勿 `install -g` 全局安装）
```

**依据 4 · 作者声明**：[packages/dsh-tool-calculator/README.md:114-133](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-calculator/README.md#L114-L133)

作者给出的安装路径指向独立仓库。

<details>
<summary>查看原文（20行）</summary>

````text
## 安装

### Profile Bundle（推荐）

DSH 0.1.5-rc.1（npm）起，本插件可作为独立 bundle 一键安装到任意 profile（仓库位于 https://github.com/omdsh-dev，public）：

```sh
# 交互式（web）profile
dsh plugin --profile web add github:omdsh-dev/dsh-tool-calculator
# 一次性任务（headless）profile —— dsh run 默认使用 headless
dsh plugin --profile headless add github:omdsh-dev/dsh-tool-calculator
```

也可以先用 `npm pack` 打出 tarball 再安装：

```sh
git clone https://github.com/omdsh-dev/dsh-tool-calculator
cd dsh-tool-calculator
npm install && npm pack
dsh plugin --profile web add ./deepseek-ai-dsh-tool-calculator-*.tgz
````

</details>

**依据 5 · 源码核查**：[packages/dsh-tool-calculator/lib/evaluate.js:93-99](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-calculator/lib/evaluate.js#L93-L99)

中间除法没有独立有限数检查。

```text
    const parseMul = () => {
        let left = parseUnary();
        while (peek() === '*' || peek() === '/' || peek() === '%') {
            const op = take();
            const right = parseUnary();
            left = op === '*' ? left * right : op === '/' ? left / right : left % right;
        }
```

#### 缺口

- 宿主能否消费固定 monorepo 子包以及卸载后工具是否消失
  **影响**：决定能否直接从该仓库版本小范围试用
  **进一步探讨**：在兼容环境核对 bundle 插入、工具清单、成功及错误回执，然后禁用复查

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
