# dsh-tool-json

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中按路径查询 JSON 值，支持数组通配符和方括号访问。

> **亮点**：[Q01](#research-q01) 核实查询直接消耗结构化参数，减少每次为简单取值建立 shell 命令。

> **主要限制**：[Q02](#research-q02) 的投影可能跳过元素并改变位置对应；输出上限在序列化后检查。

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
  - [Q01 · 一个 API 样本如何变成指定路径的值？](#detail-section-11)
  - [Q02 · 数组通配符会保留源位置吗，资源限制覆盖哪部分？](#detail-section-12)
  - [Q03 · 如何选对试用任务，怎样验证投影丢行的补救设计？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者可在会话里从公开 API 样本取明确的字段及保留 JSON 类型的值。

grep 适合定位原文，jq 或脚本可以结构化处理、筛选及保留源 ID。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 路径查询 | 取 API 样本字段 | 支持属性和数组索引 |
| 数组投影 | 提取对象字段 | 源位置可改变，多层结果嵌套 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Cordis 与 DSH tools | 是 | 注册 json | 改用现有工具 |
| 小型公开 JSON 与子集表达式 | 本建议必需 | 限制输入与预期 | 转用 jq |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 加载 | 用户核对隔离 profile | json 出现在工具列表 |
| 查询 | Agent 传样本和路径 | 与手工定位的值一致 |
| 退出 | 用户禁用组件 | 继续使用 jq |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 包与宿主开销未知 | 核对 profile 和样本格式 | 同版装载待验 |
| 持续 | 全输入扫描及模型传参，金额未知 | 复核数组位置与类型 | 真实耗时未知 |
| 失败恢复 | 重复调用金额未知 | 切换 jq 并保留源 ID | 卸载待验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 结构化取值 | 固定路径走自有属性与索引 | 实际耗时和重试率 |
| 通配符 | 保留匹配 null，跳过无匹配元素 | 宿主如何显示错误 |

> **思考**：[Q02](#research-q02) 的投影可能跳过元素并改变位置对应；输出上限在序列化后检查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 核实查询直接消耗结构化参数，减少每次为简单取值建立 shell 命令。

[Q02](#research-q02) 将缺字段、类型和越界分开，便于定位异常；全量校验和序列化门槛需在真实主线程压测。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的投影可能跳过元素并改变位置对应；输出上限在序列化后检查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用公开样本验证后限小型取值试用；对照 [Q02](#research-q02) 样本确认何时改用带来源 ID 的脚本。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认挂载、路径及错误边界。真实回执和资源开销待验。来源索引是待验证设计。

- 已检查：作者 README、包清单、源码路径 packages/dsh-tool-json/package.json、packages/dsh-tool-json/cordis.patch.yml、packages/dsh-tool-json/lib/index.js、packages/dsh-tool-json/README.md、packages/dsh-tool-json/lib/query.js 及固定范围 inventory；组件：packages/dsh-tool-json。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定子包 lib 注册、解析、校验与投影；未运行目标插件、测试或宿主。
- 下一步：以含缺字段、null、混合类型及多级数组的公开样本比较路径结果、出错回执与 jq 输出，并核对禁用后工具。

**分析版本**

- **仓库**：[omdsh-dev/dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit)
- **版本号**：0.0.1（[固定提交 c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出可选的来源索引包装，以缺字段的对账样本检查可追溯性及输出代价。

以含缺字段、null、混合类型及多级数组的公开样本比较路径结果、出错回执与 jq 输出，并核对禁用后工具。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 369 | 310 | 78 | — |
| .md | source | 2 | 360 | — | — | 2643 |
| .ts | source | 3 | 398 | 295 | 83 | — |
| .ts | test | 2 | 368 | 277 | 20 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：对小型 JSON 响应取字段时，插件的投影怎样改变原始形状，哪些任务仍需要 jq 或脚本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 一个 API 样本如何变成指定路径的值？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

读取公开 API 样本的维护者可传入 JSON 值或一段 JSON 字符串，再以点号、方括号属性或索引指定字段。入口把两个参数直接交给 query，先解析路径，再把字符串 JSON.parse 并作全量兼容校验。点号与引号键用 Object.hasOwn 定位值；数字索引只访问数组并检查范围。结果回执按 JSON 序列化，能保留数字、布尔等类型。与 grep 对原文找同名字符串相比，这条链可确定结构位置；jq 也能实现精确查询并有更完整语法，插件主要减少重复启 shell 与双重转义。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-json/package.json:21-38](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json/package.json#L21-L38)

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

**依据 2 · 源码核查**：[packages/dsh-tool-json/cordis.patch.yml:1-4](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json/cordis.patch.yml#L1-L4)

按固定包名插入 tool-json。

```text
# dsh bundle patch: inserts this plugin into a profile's layer stack (0806+).
- insert:
    - id: tool-json
      name: '@deepseek-ai/dsh-tool-json'
```

**依据 3 · 源码核查**：[packages/dsh-tool-json/lib/index.js:9-20](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json/lib/index.js#L9-L20)

注入 tools 并注册 json。

<details>
<summary>查看原文（12行）</summary>

```text
import { defineTool } from '@deepseek-ai/dsh-tools';
import { query } from './query.js';
export const name = '@deepseek-ai/dsh-tool-json';
export const inject = ['tools'];
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'json',
        description: 'Query JSON with a JMESPath-inspired path expression. ' +
            'Supports dot-notation (foo.bar), bracket-indexing (items[0]), ' +
            "bracket-property (items['key'] or items[\"key\"]), and array " +
            'wildcard projection (items[*].name, arrays only; multi-level ' +
            'wildcards return nested arrays). Returns the matched value as JSON.',
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-json/lib/index.js:33-43](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json/lib/index.js#L33-L43)

注册回调进入本包实际执行逻辑并呈现回执。

<details>
<summary>查看原文（11行）</summary>

```text
        output: {
            schema: { type: 'json' },
            render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
        },
        execute: (args) => {
            const { input, query: queryStr } = args;
            // query() 内置 normalizeInput：字符串/对象双形态 + 友好错误包装
            return Promise.resolve(query(input, queryStr));
        },
        timeoutMs: 1000,
    }));
```

</details>

**依据 5 · 作者声明**：[packages/dsh-tool-json/README.md:9-16](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json/README.md#L9-L16)

作者比较文本 grep 与结构化路径。

```text
## 为什么需要

Agent 处理 JSON 是高频操作——API 返回值、配置文件、工具输出到处都是 JSON。当前做法是起 bash 进程跑 `node -e` 或 `jq`，每次都有进程开销和字符串序列化成本。

DSH 内置 `grep` 可以做正则匹配，但无法理解 JSON 结构。对于 `{"items":[{"id":1}]}`：

- `grep` 只能做字符串级搜索，容易误匹配值、key、或嵌套子对象中的同名 key
- `json` 走结构化路径，只匹配指定路径，不混淆 key 和 value
```

**依据 6 · 源码核查**：[packages/dsh-tool-json/lib/query.js:118-143](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json/lib/query.js#L118-L143)

自有属性与数组索引分路。

<details>
<summary>查看原文（26行）</summary>

```text
function executeQuery(steps, value) {
    let current = value;
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (current === null || current === undefined) {
            throw new JsonQueryError('TYPE_MISMATCH', 'json: cannot access property on null/undefined');
        }
        if (typeof current !== 'object') {
            throw new JsonQueryError('TYPE_MISMATCH', `json: cannot access property on ${typeof current}`);
        }
        if (step.kind === 'dot' || step.kind === 'bracket') {
            if (!Object.hasOwn(current, step.key)) {
                throw new JsonQueryError('MISSING_PROPERTY', `json: property "${step.key}" not found`);
            }
            current = current[step.key];
            continue;
        }
        if (step.kind === 'index') {
            if (!Array.isArray(current)) {
                throw new JsonQueryError('TYPE_MISMATCH', 'json: index access on non-array');
            }
            if (step.index >= current.length) {
                throw new JsonQueryError('INDEX_OUT_OF_BOUNDS', `json: index ${step.index} out of bounds (length ${current.length})`);
            }
            current = current[step.index];
            continue;
```

</details>

**依据 7 · 源码核查**：[packages/dsh-tool-json/lib/query.js:273-306](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json/lib/query.js#L273-L306)

输入归一化与输出门槛。

<details>
<summary>查看原文（34行）</summary>

```text
export function normalizeInput(input) {
    if (typeof input === 'string') {
        // JSON-03：字符串输入字节上限（UTF-8 字节数）
        if (Buffer.byteLength(input, 'utf8') > MAX_INPUT_BYTES) {
            throw new JsonQueryError('INVALID_QUERY', `json: input exceeds ${MAX_INPUT_BYTES} bytes`);
        }
        try {
            const parsed = JSON.parse(input);
            assertJsonCompatible(parsed, 0, new WeakSet(), { bytes: 0 });
            return parsed;
        }
        catch (error) {
            if (error instanceof JsonQueryError)
                throw error; // 深度/类型错误如实透传
            throw new JsonQueryError('INVALID_QUERY', 'json: invalid JSON input');
        }
    }
    assertJsonCompatible(input, 0, new WeakSet(), { bytes: 0 });
    return input;
}
// ── 公开接口 ──
const MAX_OUTPUT_BYTES = 4_000_000; // 4 MB 输出保险丝（AUDIT-JSON-02）
export function query(jsonInput, queryStr) {
    if (typeof queryStr !== 'string') {
        throw new JsonQueryError('INVALID_QUERY', 'json: query must be a string');
    }
    const steps = parseQuery(queryStr);
    const result = executeQuery(steps, normalizeInput(jsonInput));
    // AUDIT-JSON-02：输入限制不等于输出限制（空查询返回整个输入、选中字段可接近输入上限）
    const text = JSON.stringify(result);
    if (Buffer.byteLength(text, 'utf8') > MAX_OUTPUT_BYTES) {
        throw new JsonQueryError('INVALID_QUERY', `json: output exceeds ${MAX_OUTPUT_BYTES} bytes`);
    }
    return result;
```

</details>

#### 缺口

- 常用 profile 中 JSON 参数对象/字符串的传递形态
  **影响**：影响作者宣称双形态是否对用户可见
  **进一步探讨**：分别发送相同的小样本字符串与对象并核对工具回执

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 数组通配符会保留源位置吗，资源限制覆盖哪部分？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

带后续路径的投影逐个访问元素，跳过非对象以及 MISSING_PROPERTY，合法匹配出的 null 会被 push。比如 items 中依次放有 name 的对象、空对象、name 为 null 的对象，items[*].name 只产生两个值，不能按新下标回填源数组。类型不匹配和索引越界会向上抛错，因而在多层数据中不是所有不合格行都被过滤。多级通配符由递归调用生成嵌套数组。每次数组投影检查长度 100000，整个输入按字节和深度校验，输出在 JSON.stringify 之后才检查字节上限，不能把该值当成序列化峰值内存上界。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-json/lib/query.js:145-176](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json/lib/query.js#L145-L176)

投影跳过条件、嵌套调用与无尾路径行为。

<details>
<summary>查看原文（32行）</summary>

```text
        // 前三个分支均 continue，此处必为 wildcard
        if (!Array.isArray(current)) {
            throw new JsonQueryError('TYPE_MISMATCH', 'json: wildcard projection on non-array');
        }
        const arr = current;
        // RECHECK2-JSON-02：上限覆盖无尾路径（items[*] 直接返回数组同样受限）
        if (arr.length > MAX_PROJECTION_ITEMS) {
            throw new JsonQueryError('INVALID_QUERY', `json: wildcard projection exceeds ${MAX_PROJECTION_ITEMS} items`);
        }
        const remaining = steps.slice(i + 1);
        if (remaining.length === 0) {
            current = arr; // 无后续路径：返回全体元素（含标量）
        }
        else {
            // JSON-01：循环 push 保留合法的 null 结果（不用 null 作失败哨兵）
            // JSON-02：只跳过 MISSING_PROPERTY，类型/索引/内部错误重新抛出
            const projected = [];
            for (const item of arr) {
                if (item === null || item === undefined || typeof item !== 'object')
                    continue; // 非对象元素跳过
                try {
                    projected.push(executeQuery(remaining, item));
                }
                catch (error) {
                    if (error instanceof JsonQueryError && error.code === 'MISSING_PROPERTY')
                        continue;
                    throw error;
                }
            }
            current = projected;
        }
        return current; // 通配符是终态
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-json/lib/query.js:184-205](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json/lib/query.js#L184-L205)

输入字节累计与深度门槛。

<details>
<summary>查看原文（22行）</summary>

```text
function addBytes(state, amount) {
    state.bytes += amount;
    if (state.bytes > MAX_INPUT_BYTES) {
        throw new JsonQueryError('INVALID_QUERY', `json: input exceeds ${MAX_INPUT_BYTES} bytes`);
    }
}
/**
 * JSON-08 + RECHECK2-JSON-01/03.1 + AUDIT-JSON-04：只接受 JSON-compatible 值
 * （null/boolean/number/string/array/plain object），遍历时累计 UTF-8 字节数
 * （key + string value + 结构开销 + 按实际表示的 number 长度），用递归路径
 * WeakSet 检测循环引用，并拒绝不可枚举属性与 accessor（own-property 全量检查）。
 */
function assertJsonCompatible(value, depth, ancestors, state) {
    if (depth > 100)
        throw new JsonQueryError('INVALID_QUERY', 'json: input nesting too deep');
    if (value === null) {
        addBytes(state, 4);
        return;
    }
    if (typeof value === 'string') {
        addBytes(state, Buffer.byteLength(value, 'utf8') + 2); // 引号开销
        return;
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-json/lib/query.js:293-306](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json/lib/query.js#L293-L306)

输出先序列化再按字节判断。

<details>
<summary>查看原文（14行）</summary>

```text
// ── 公开接口 ──
const MAX_OUTPUT_BYTES = 4_000_000; // 4 MB 输出保险丝（AUDIT-JSON-02）
export function query(jsonInput, queryStr) {
    if (typeof queryStr !== 'string') {
        throw new JsonQueryError('INVALID_QUERY', 'json: query must be a string');
    }
    const steps = parseQuery(queryStr);
    const result = executeQuery(steps, normalizeInput(jsonInput));
    // AUDIT-JSON-02：输入限制不等于输出限制（空查询返回整个输入、选中字段可接近输入上限）
    const text = JSON.stringify(result);
    if (Buffer.byteLength(text, 'utf8') > MAX_OUTPUT_BYTES) {
        throw new JsonQueryError('INVALID_QUERY', `json: output exceeds ${MAX_OUTPUT_BYTES} bytes`);
    }
    return result;
```

</details>

**依据 4 · 作者声明**：[packages/dsh-tool-json/README.md:63-80](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json/README.md#L63-L80)

声明子集、嵌套投影与不支持过滤器。

<details>
<summary>查看原文（18行）</summary>

```text
## 查询语法（JMESPath-inspired 子集）

| 表达式 | 示例 | 说明 |
|--------|------|------|
| 点号访问 | `foo.bar` | 嵌套对象属性（标识符字符集 `[A-Za-z0-9_$` + BMP 非 ASCII]） |
| 方括号索引 | `items[0]` | 数组索引（安全整数） |
| 方括号属性 | `items['key']` / `items["key"]` | 含特殊字符的属性名 |
| 通配符投影 | `items[*].name` | **仅数组**；提取元素属性 |
| 组合嵌套 | `a.b[0].c.d` | 以上全部自由组合 |

**语义边界**（有意不兼容标准 JMESPath，已锁定）：

- 多级通配符 `items[*].tags[*]` 返回**嵌套数组**（`[['a','b'],['c']]`），不做标准投影扁平化
- 通配符仅作用于数组，不支持对象字段枚举；非对象元素按投影语义跳过；合法 `null` 结果**保留**
- 引号属性支持 `\\` `\'` `\"` 三种转义（任意引号包围形式下均可用）；非法转义报错
- 投影内只跳过 `MISSING_PROPERTY`；类型/索引/内部错误如实抛出

**不支持**（低频场景，bash + node 兜底）：过滤器 `[?downloads > 1000]`、管道 `|`、函数调用。
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何选对试用任务，怎样验证投影丢行的补救设计？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

适合把小 JSON 的已知字段提交给会话工具，业务关键的审计或批量对账仍应使用 jq 或保留源 ID 的脚本。安装需目标 profile 能解析子包与 Cordis/tools peers；作者所述 rc.1 验证和独立仓库渠道未在本轮复现。即使只选小字段，插件也扫描完整输入，因而应计入传递样本、模型额度、核对及失败改用脚本的投入。可验证的改进是提供保留索引的可选投影，比较能否由结果稳定找回源记录，同时核对嵌套通配符增加的输出大小。若任务只是取单一字段，索引包装的额外字节可能没有价值。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-json/package.json:2-11](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json/package.json#L2-L11)

private 子包及 Node 范围。

<details>
<summary>查看原文（10行）</summary>

```text
  "name": "@deepseek-ai/dsh-tool-json",
  "description": "DSH JSON query tool",
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

**依据 2 · 作者声明**：[packages/dsh-tool-json/README.md:18-29](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json/README.md#L18-L29)

作者明确提示全量校验成本。

<details>
<summary>查看原文（12行）</summary>

```text
## 安全模型

手写递归下降解析器，无 `eval`/`new Function`；`Object.hasOwn` 防原型链污染（`constructor`/`__proto__` 读取不触发原型链）。资源上限（**对象与字符串两条输入路径统一执行**）：

- 查询表达式长度 ≤ 200 字符、解析深度 ≤ 20 层、数组索引必须是安全整数
- 字符串输入 ≤ 1,000,000 bytes（UTF-8）；输入嵌套深度 ≤ 100
- 单次 wildcard 投影 ≤ 100,000 元素
- 只接受 JSON-compatible 值（null/boolean/有限 number/string/array/plain object；拒绝 undefined/BigInt/函数/Date/非有限数）

错误分类（`JsonQueryError`）：`MISSING_PROPERTY`（投影内跳过）、`TYPE_MISMATCH`/`INDEX_OUT_OF_BOUNDS`/`INVALID_QUERY`（如实抛错），统一 `json:` 前缀。

> 成本模型（AUDIT-JSON-03）：输入在每次查询前执行**全量校验**（类型/深度/字节/循环/枚举性）——这是有意的安全成本，查询小字段也会完整扫描输入；`timeoutMs` 无法中断同步校验。
```

</details>

**依据 3 · 作者声明**：[packages/dsh-tool-json/README.md:82-101](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json/README.md#L82-L101)

作者兼容声称及独立仓库渠道。

<details>
<summary>查看原文（20行）</summary>

```text
## DSH 0.1.5-rc.1 兼容（已验证）

本插件已迁移到 DSH 0.1.5-rc.1 依赖线，并在 `local harness 0.1.5-rc.1` 的隔离 consumer 中完成全链路验证：

- **类型/运行时**：`@deepseek-ai/cordis@^4.0.1` + `@deepseek-ai/dsh-tools@>=0.0.1-rc.1 <0.2.0` + `@deepseek-ai/dsh-invariants@>=0.0.1-rc.1 <0.2.0`（peer）；不再依赖 unscoped `cordis`
- **独立构建**：`npm install`（devDependencies 自包含 typescript/vitest/@types/node）→ `npm run typecheck` → `npm test` → `npm run build` → `npm pack`
- **消费验证**：tarball 装入 0.1.5-rc.1 consumer → `dsh --profile compat --dump-config` 出现本插件 row → 工具真实注册与执行通过
- **启动方式**：`npx -p @deepseek-ai/dsh@next dsh web`（lib 生产模式；勿 `install -g` 全局安装）


## 版本适配

- **适配 DSH 版本**: DSH 0.1.5-rc.1（npm）
- **bundle 声明**: `package.json` 的 `dsh.bundle`（patch 指向 `cordis.patch.yml`）+ `exports` 导出
- **patch 格式**: `cordis.patch.yml` 使用 `- insert:` 列表（patch 是 id-targeted 语义，裸 `- id:` 条目会报 `entry not found`）
- **files**: 发布 tarball 含 `lib/`、`src/`、`cordis.patch.yml`

## 安装

插件源码仓库：`https://github.com/omdsh-dev/dsh-tool-json`（public）。
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-json/lib/query.js:159-171](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-json/lib/query.js#L159-L171)

结果只 push 值，原始位置缺失。

<details>
<summary>查看原文（13行）</summary>

```text
            // JSON-01：循环 push 保留合法的 null 结果（不用 null 作失败哨兵）
            // JSON-02：只跳过 MISSING_PROPERTY，类型/索引/内部错误重新抛出
            const projected = [];
            for (const item of arr) {
                if (item === null || item === undefined || typeof item !== 'object')
                    continue; // 非对象元素跳过
                try {
                    projected.push(executeQuery(remaining, item));
                }
                catch (error) {
                    if (error instanceof JsonQueryError && error.code === 'MISSING_PROPERTY')
                        continue;
                    throw error;
```

</details>

#### 缺口

- 未复现固定子包加载及错误展示
  **影响**：限制试用范围和退出确认
  **进一步探讨**：在隔离 profile 确认注册、错误分类回执、禁用后的工具列表

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
